import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true, tags: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar vistas si está publicado
    if (article.published) {
      await prisma.article.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const currentArticle = await prisma.article.findUnique({ where: { id } })
    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Validación básica
    if (data.title && data.title.trim() === '') {
      return NextResponse.json(
        { error: 'El título no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar slug único si se está actualizando
    if (data.slug && data.slug !== currentArticle.slug) {
      const existingArticle = await prisma.article.findFirst({ where: { slug: data.slug } })
      if (existingArticle && existingArticle.id !== id) {
        return NextResponse.json(
          { error: 'Ya existe un artículo con este slug' },
          { status: 400 }
        )
      }
    }

    // Preparar datos de actualización
    const updateData = { ...data }
    delete updateData.id // No permitir cambiar ID
    delete updateData.createdAt // No permitir cambiar fecha de creación
    
    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } }
      delete updateData.categoryId
    }
    
    if (data.status === 'published' || data.published) {
      updateData.published = '1'
    } else if (data.status === 'draft' || data.published === false) {
      updateData.published = '0'
    }
    
    if (data.featured !== undefined) {
      updateData.featured = data.featured ? '1' : '0'
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
      include: { category: true, tags: true }
    })

    return NextResponse.json({
      message: 'Artículo actualizado exitosamente',
      article: updatedArticle
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const currentArticle = await prisma.article.findUnique({ where: { id } })
    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización parcial
    const updateData = { ...data }
    delete updateData.id
    delete updateData.createdAt
    
    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } }
      delete updateData.categoryId
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
      include: { category: true, tags: true }
    })

    return NextResponse.json({
      message: 'Artículo actualizado exitosamente',
      article: updatedArticle
    })
  } catch (error) {
    console.error('Error patching article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const article = await prisma.article.findUnique({ where: { id } })
    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    await prisma.article.delete({ where: { id } })

    return NextResponse.json({
      message: 'Artículo eliminado exitosamente',
      article
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}