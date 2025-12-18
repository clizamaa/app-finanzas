import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const prismaClient = prisma

// GET - Verificar si una IP está bloqueada
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')
    const isMiddlewareCheck = request.headers.get('x-middleware-check')
    
    if (!ip) {
      return NextResponse.json(
        { message: 'IP es requerida' },
        { status: 400 }
      )
    }

    // Verificar si la IP está bloqueada
    const blockedIP = await prismaClient.blockedIP.findUnique({
      where: { ip }
    })

    if (blockedIP) {
      // IP bloqueada - devolver 403 para el middleware
      return NextResponse.json(
        {
          blocked: true,
          reason: blockedIP.reason,
          blockedAt: blockedIP.blockedAt,
          blockedBy: blockedIP.blockedBy
        },
        { status: 403 }
      )
    }

    // IP no bloqueada
    return NextResponse.json(
      {
        blocked: false
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error verificando IP bloqueada:', error)
    
    // Para el middleware, en caso de error permitir el acceso
    return NextResponse.json(
      {
        blocked: false,
        error: 'Error interno verificando IP'
      },
      { status: 200 }
    )
  } finally {
    await prismaClient.$disconnect()
  }
}
