const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '216.246.47.124'
const port = process.env.PORT || 3000

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
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})