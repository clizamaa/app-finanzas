export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  let ip = '127.0.0.1' // Fallback para desarrollo local
  
  if (forwarded) {
    ip = forwarded.split(',')[0].trim()
  } else if (realIP) {
    ip = realIP
  } else if (cfConnectingIP) {
    ip = cfConnectingIP
  }
  
  // Eliminar el prefijo ::ffff: de las direcciones IPv4 mapeadas en IPv6
  return ip.replace(/^::ffff:/, '')
}

// POST - Registrar un nuevo log de acceso
export async function POST(request) {
  try {
    await prisma.$connect()
    const body = await request.json()
    const { path, action, articleId, userId } = body

    if (!path || !action) {
      return NextResponse.json(
        { error: 'Path y action son requeridos' },
        { status: 400 }
      )
    }

    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || null
    const method = request.method

    // Crear el log de acceso (con reintento si el engine no está conectado)
    let accessLog
    try {
      accessLog = await prisma.accessLog.create({
        data: {
          id: randomUUID(),
          ip,
          userAgent,
          method,
          path,
          action,
          referrer,
          articleId: articleId || null,
          userId: userId || null,
          createdAt: new Date().toISOString()
        }
      })
    } catch (err) {
      if (String(err?.message || '').includes('Engine is not yet connected')) {
        await prisma.$connect()
        accessLog = await prisma.accessLog.create({
          data: {
            id: randomUUID(),
            ip,
            userAgent,
            method,
            path,
            action,
            referrer,
            articleId: articleId || null,
            userId: userId || null,
            createdAt: new Date().toISOString()
          }
        })
      } else {
        throw err
      }
    }

    return NextResponse.json({
      message: 'Log registrado exitosamente',
      logId: accessLog.id
    })

  } catch (error) {
    console.error('Error registrando log de acceso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener logs de acceso (solo para administradores)
export async function GET(request) {
  try {
    await prisma.$connect()
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    console.log('GET /api/logs - Auth Header present:', !!authHeader)
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    let token = authHeader.substring(7).trim()
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    try {
      console.log('GET /api/logs - Verifying token...')
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      console.log('GET /api/logs - Token invalid:', error?.message)
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 50
    const action = searchParams.get('action')
    const ip = searchParams.get('ip')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Construir filtros
    const where = {}
    
    if (action && action !== 'all') {
      where.action = action
    }
    
    if (ip) {
      where.ip = {
        contains: ip
      }
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Obtener logs con paginación
    const [logs, totalCount] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.accessLog.count({ where })
    ])

    // Obtener estadísticas
    const stats = await prisma.accessLog.groupBy({
      by: ['action'],
      _count: {
        action: true
      },
      where: startDate || endDate ? {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined
        }
      } : undefined
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      logs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.action] = stat._count.action
        return acc
      }, {})
    })

  } catch (error) {
    console.error('Error obteniendo logs de acceso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Limpiar logs antiguos (solo para administradores)
export async function DELETE(request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    let token = authHeader.substring(7).trim()
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days')
    const deleteAll = searchParams.get('all') === 'true'

    let deletedCount
    let message

    if (deleteAll) {
      // Eliminar TODOS los logs
      deletedCount = await prisma.accessLog.deleteMany({})
      message = `Se eliminaron TODOS los logs del sistema (${deletedCount.count} registros)`
    } else {
      // Eliminar logs antiguos (comportamiento original)
      const daysToDelete = parseInt(days) || 30
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToDelete)

      deletedCount = await prisma.accessLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })
      message = `Se eliminaron ${deletedCount.count} logs anteriores a ${daysToDelete} días`
    }

    return NextResponse.json({
      message,
      deletedCount: deletedCount.count
    })

  } catch (error) {
    console.error('Error eliminando logs:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
