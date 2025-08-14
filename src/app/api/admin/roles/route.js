import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'

// Middleware para verificar autenticación
const verifyAuth = async (request) => {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token no proporcionado', status: 401 }
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })

    if (!user) {
      return { error: 'Usuario no encontrado', status: 401 }
    }

    return { user }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

// GET - Obtener todos los roles disponibles
export async function GET(request) {
  try {
    const authResult = await verifyAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    // Solo admins pueden ver todos los roles
    if (authResult.user.role.name !== 'admin') {
      return NextResponse.json(
        { message: 'Permisos insuficientes' },
        { status: 403 }
      )
    }

    const roles = await prisma.role.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      roles
    })

  } catch (error) {
    console.error('Error obteniendo roles:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}