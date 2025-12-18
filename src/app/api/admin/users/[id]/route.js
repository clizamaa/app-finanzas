import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const prismaClient = prisma
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
    const user = await prismaClient.user.findUnique({
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

// GET - Obtener un usuario específico (solo admin)
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = params
    
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: {
        role: true,
        _count: {
          select: {
            articles: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Remover contraseña de la respuesta
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      articlesCount: user._count.articles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return NextResponse.json({ user: safeUser })

  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Actualizar usuario (solo admin)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = params
    const { email, name, password, roleId } = await request.json()

    // Validaciones básicas
    if (!email || !name || !roleId) {
      return NextResponse.json(
        { message: 'Email, nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const existingUser = await prismaClient.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el email no esté en uso por otro usuario
    const emailInUse = await prismaClient.user.findFirst({
      where: {
        email,
        id: { not: id }
      }
    })

    if (emailInUse) {
      return NextResponse.json(
        { message: 'El email ya está en uso por otro usuario' },
        { status: 400 }
      )
    }

    // Verificar que el rol existe
    const role = await prismaClient.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      return NextResponse.json(
        { message: 'Rol no válido' },
        { status: 400 }
      )
    }

    // Preparar datos de actualización
    const updateData = {
      email,
      name,
      roleId
    }

    // Solo actualizar contraseña si se proporcionó una nueva
    if (password && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json(
          { message: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        )
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Actualizar usuario
    const updatedUser = await prismaClient.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
        _count: {
          select: {
            articles: true
          }
        }
      }
    })

    // Remover contraseña de la respuesta
    const safeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      articlesCount: updatedUser._count.articles,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: safeUser
    })

  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Eliminar usuario (solo admin)
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = params
    
    // Verificar que el usuario existe
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Prevenir que el admin se elimine a sí mismo
    if (user.id === authResult.user.id) {
      return NextResponse.json(
        { message: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      )
    }

    // Verificar si el usuario tiene artículos asociados
    const articlesCount = await prisma.article.count({
      where: { authorId: id }
    })

    if (articlesCount > 0) {
      return NextResponse.json(
        { message: `No se puede eliminar el usuario porque tiene ${articlesCount} artículo(s) asociado(s). Primero elimina o reasigna los artículos.` },
        { status: 400 }
      )
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prismaClient.$disconnect()
  }
}
