import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

// Función para verificar el token JWT
function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const secret = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura'
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Obtener una categoría por ID (admin)
export async function GET(_request, { params }) {
  try {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { articles: true } }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    const formatted = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      articleCount: category._count.articles,
      createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
    updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : category.updatedAt
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Actualizar una categoría (admin)
export async function PUT(request, { params }) {
  try {
    // Verificar autenticación
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido o faltante' },
        { status: 401 }
      )
    }

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    const data = await request.json()

    // Validaciones básicas
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el nombre sea único (excluyendo la propia categoría)
    const existingByName = await prisma.category.findFirst({
      where: { 
        id: { not: id },
        name: data.name.trim()
      }
    })
    if (existingByName) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único (excluyendo la propia categoría)
    const existingBySlug = await prisma.category.findFirst({
      where: { 
        id: { not: id },
        slug: data.slug.toLowerCase().trim() 
      }
    })
    if (existingBySlug) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      )
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description?.trim() ?? ''
      },
      include: { _count: { select: { articles: true } } }
    })

    const formatted = {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description || '',
      articleCount: updated._count.articles,
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
    updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : updated.updatedAt
    }

    return NextResponse.json({ message: 'Categoría actualizada', category: formatted })
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar una categoría (admin)
export async function DELETE(request, { params }) {
  try {
    // Verificar autenticación
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido o faltante' },
        { status: 401 }
      )
    }

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
    }

    // Evitar borrar si tiene artículos asociados
    const related = await prisma.article.count({ where: { categoryId: id } })
    if (related > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la categoría porque tiene artículos asociados' },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ message: 'Categoría eliminada' })
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}