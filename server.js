const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { PrismaClient } = require('./src/generated/prisma-client')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '216.246.47.124'
const port = process.env.PORT || 3000

// Prisma en entorno Node (server)
const prisma = new PrismaClient()

// Helpers
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim()
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return String(xff[0]).split(',')[0].trim()
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown'
}

function isPathExcluded(pathname) {
  // Excluir rutas administrativas de gestión de bloqueos y assets
  const exclusions = [
    /^\/api\/admin\/blocked-ips(\/check)?$/,
    /^\/_next\/static\//,
    /^\/_next\/image/,
    /^\/favicon\.ico$/
  ]
  return exclusions.some((re) => re.test(pathname))
}

// Configuración para cPanel
const app = next({ 
  dev, 
  hostname, 
  port,
  // Configuración adicional para producción
  conf: {
    // Optimizaciones para cPanel
    compress: true,
    poweredByHeader: false,
    generateEtags: true
  }
})

const handle = app.getRequestHandler()

console.log(`Starting server in ${dev ? 'development' : 'production'} mode...`)
console.log(`Port: ${port}`)
console.log(`Hostname: ${hostname}`)

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Log de requests en desarrollo
      if (dev) {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
      }

      const parsedUrl = parse(req.url, true)

      // Verificación de IP bloqueada antes de entregar a Next.js
      try {
        const pathname = parsedUrl.pathname || '/'
        if (!isPathExcluded(pathname)) {
          const ip = getClientIp(req)
          if (ip && ip !== 'unknown') {
            const blockedIP = await prisma.blockedIP.findUnique({
              where: { ip },
              select: { ip: true, reason: true, blockedAt: true, blockedBy: true }
            })
            if (blockedIP) {
              res.statusCode = 403
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  error: 'Acceso denegado',
                  message: 'Su dirección IP ha sido bloqueada',
                  reason: blockedIP.reason || 'Violación de términos de servicio'
                })
              )
              return
            }
          }
        }
      } catch (blockErr) {
        // En caso de error en el chequeo, continuamos para no romper el sitio
        if (dev) console.error('Error en verificación de IP bloqueada:', blockErr)
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Server ready on http://${hostname}:${port}`)
    console.log(`> Environment: ${process.env.NODE_ENV}`)
    console.log(`> Site URL: ${process.env.SITE_URL || 'Not configured'}`)
  })
})

// Manejo de señales para cierre limpio
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  try { await prisma.$disconnect() } catch {}
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  try { await prisma.$disconnect() } catch {}
  process.exit(0)
})