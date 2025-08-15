import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Función para obtener la IP real del cliente
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

    // Crear el log de acceso
    const accessLog = await prisma.accessLog.create({
      data: {
        ip,
        userAgent,
        method,
        path,
        action,
        referrer,
        articleId: articleId || null,
        userId: userId || null
      }
    })

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
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days')) || 30

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const deletedCount = await prisma.accessLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    return NextResponse.json({
      message: `Se eliminaron ${deletedCount.count} logs anteriores a ${days} días`,
      deletedCount: deletedCount.count
    })

  } catch (error) {
    console.error('Error eliminando logs antiguos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}