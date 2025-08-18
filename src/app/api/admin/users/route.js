import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'

// Middleware para verificar autenticación y permisos de admin
const verifyAdminAuth = async (request) => {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token no proporcionado', status: 401 }
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Verificar que el usuario existe y es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })

    if (!user || user.role.name !== 'admin') {
      return { error: 'Permisos insuficientes', status: 403 }
    }

    return { user }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

// GET - Obtener todos los usuarios (solo admin)
export async function GET(request) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
        _count: {
          select: {
            Article: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Remover contraseñas de la respuesta
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      articlesCount: user._count.Article,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    return NextResponse.json({
      users: safeUsers
    })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Crear nuevo usuario (solo admin)
export async function POST(request) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { email, name, password, roleId } = await request.json()

    // Validaciones
    if (!email || !name || !password || !roleId) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está en uso' },
        { status: 400 }
      )
    }

    // Verificar que el rol existe
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      return NextResponse.json(
        { message: 'Rol no válido' },
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        name,
        password: hashedPassword,
        roleId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        role: true
      }
    })

    // Respuesta sin contraseña
    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    }

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: safeUser
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}