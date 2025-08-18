import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las categorías
export async function GET(request) {
  try {
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

// POST - Crear nueva categoría (solo para compatibilidad - usar admin API)
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validaciones básicas
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el nombre sea único
    const existingByName = await prisma.category.findFirst({
      where: { name: body.name.trim() }
    })
    if (existingByName) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const existingBySlug = await prisma.category.findUnique({
      where: { slug: body.slug.toLowerCase().trim() }
    })
    if (existingBySlug) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      )
    }

    const newCategory = await prisma.category.create({
      data: {
        name: body.name.trim(),
        slug: body.slug.toLowerCase().trim(),
        description: body.description?.trim() || ''
      },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })

    // Formatear respuesta para compatibilidad
    const formattedCategory = {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description || '',
      articleCount: newCategory._count.articles,
      createdAt: newCategory.createdAt instanceof Date ? newCategory.createdAt.toISOString() : newCategory.createdAt,
      updatedAt: newCategory.updatedAt instanceof Date ? newCategory.updatedAt.toISOString() : newCategory.updatedAt
    }

    return NextResponse.json(formattedCategory, { status: 201 })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - No permitido en API pública (use endpoints de admin)
export async function PUT() {
  return NextResponse.json(
    { error: 'Método no permitido en API pública. Use /api/admin/categories' },
    { status: 405 }
  )
}