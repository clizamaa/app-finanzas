import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email incluyendo el rol
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role.name,
        permissions: user.role.permissions
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Preparar datos del usuario (sin contraseña)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        name: user.role.name,
        description: user.role.description,
        permissions: user.role.permissions
      }
    }

    return NextResponse.json({
      message: 'Login exitoso',
      token,
      user: userData
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Endpoint para verificar token (GET)
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remover 'Bearer '

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      
      // Buscar usuario actualizado
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          role: true
        }
      })

      if (!user) {
        return NextResponse.json(
          { message: 'Usuario no encontrado' },
          { status: 401 }
        )
      }

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: {
          name: user.role.name,
          description: user.role.description,
          permissions: user.role.permissions
        }
      }

      return NextResponse.json({
        message: 'Token válido',
        user: userData
      })

    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}