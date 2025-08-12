import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener categoría por ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Formatear respuesta para compatibilidad
    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      articleCount: category._count.articles,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }

    return NextResponse.json(formattedCategory)
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar categoría por ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

    const categoryIndex = categories.findIndex(c => c.id === id)
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Validaciones básicas
    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json(
        { error: 'El nombre no puede estar vacío' },
        { status: 400 }
      )
    }

    if (body.slug !== undefined && !body.slug.trim()) {
      return NextResponse.json(
        { error: 'El slug no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar que el nombre sea único (si se está actualizando)
    if (body.name && body.name.toLowerCase() !== categories[categoryIndex].name.toLowerCase()) {
      const existingByName = categories.find(category => 
        category.name.toLowerCase() === body.name.toLowerCase() && category.id !== id
      )
      if (existingByName) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese nombre' },
          { status: 400 }
        )
      }
    }

    // Verificar que el slug sea único (si se está actualizando)
    if (body.slug && body.slug !== categories[categoryIndex].slug) {
      const existingBySlug = categories.find(category => 
        category.slug === body.slug && category.id !== id
      )
      if (existingBySlug) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese slug' },
          { status: 400 }
        )
      }
    }

    // Validar color (formato hexadecimal)
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      return NextResponse.json(
        { error: 'El color debe estar en formato hexadecimal (#RRGGBB)' },
        { status: 400 }
      )
    }

    const currentCategory = categories[categoryIndex]

    // Actualizar categoría
    const updatedCategory = {
      ...currentCategory,
      ...body,
      id: currentCategory.id, // Mantener ID original
      createdAt: currentCategory.createdAt, // Mantener fecha de creación
      articleCount: currentCategory.articleCount, // Mantener conteo de artículos
      updatedAt: new Date().toISOString(),
      // Limpiar y formatear campos si se proporcionan
      name: body.name ? body.name.trim() : currentCategory.name,
      slug: body.slug ? body.slug.toLowerCase().trim() : currentCategory.slug,
      description: body.description !== undefined ? body.description.trim() : currentCategory.description
    }

    categories[categoryIndex] = updatedCategory

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar categoría por ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de categoría no válido' },
        { status: 400 }
      )
    }

    const categoryIndex = categories.findIndex(c => c.id === id)
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    const categoryToDelete = categories[categoryIndex]

    // Verificar si la categoría tiene artículos asociados
    if (categoryToDelete.articleCount > 0) {
      return NextResponse.json(
        { 
          error: `No se puede eliminar la categoría porque tiene ${categoryToDelete.articleCount} artículo(s) asociado(s). Primero mueve o elimina los artículos.` 
        },
        { status: 400 }
      )
    }

    const deletedCategory = categories[categoryIndex]
    categories.splice(categoryIndex, 1)

    return NextResponse.json({
      message: 'Categoría eliminada correctamente',
      deletedCategory
    })
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}