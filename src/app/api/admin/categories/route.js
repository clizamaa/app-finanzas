import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// Función para verificar el token JWT
function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const secret = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Obtener todas las categorías (admin)
export async function GET(request) {
  try {
    // Verificar autenticación
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido o faltante' },
        { status: 401 }
      )
    }

    // Verificar que el usuario existe y es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })

    if (!user || user.role.name !== 'admin') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Construir filtros para Prisma
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    // Ordenación
    const orderBy = (() => {
      const map = {
        name: 'name',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
      const key = map[sortBy] || 'name'
      return { [key]: sortOrder === 'desc' ? 'desc' : 'asc' }
    })()

    const categories = await prisma.category.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })

    // Formatear respuesta para compatibilidad con frontend
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      articleCount: category._count.articles,
      createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
      updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : category.updatedAt
    }))

    return NextResponse.json({
      categories: formattedCategories,
      total: formattedCategories.length
    })
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva categoría (admin)
export async function POST(request) {
  try {
    // Verificar autenticación
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido o faltante' },
        { status: 401 }
      )
    }

    // Verificar que el usuario existe y es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })

    if (!user || user.role.name !== 'admin') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validaciones básicas
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el nombre sea único
    const existingByName = await prisma.category.findFirst({
      where: { 
        name: data.name.trim()
      }
    })
    if (existingByName) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const existingBySlug = await prisma.category.findFirst({
      where: { slug: data.slug.toLowerCase().trim() }
    })
    if (existingBySlug) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      )
    }

    const newCategory = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: data.name.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description?.trim() || '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })

    const formattedCategory = {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description || '',
      articleCount: newCategory._count.articles,
      createdAt: newCategory.createdAt instanceof Date ? newCategory.createdAt.toISOString() : newCategory.createdAt,
      updatedAt: newCategory.updatedAt instanceof Date ? newCategory.updatedAt.toISOString() : newCategory.updatedAt
    }

    return NextResponse.json({
      message: 'Categoría creada exitosamente',
      category: formattedCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
