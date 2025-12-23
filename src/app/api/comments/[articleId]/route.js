import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

// GET - Obtener comentarios de un artículo
export async function GET(request, { params }) {
  try {
    const { articleId } = await params
    await prisma.$connect()
    
    const comments = await prisma.comment.findMany({
      where: { 
        articleId,
        approved: '1' // Solo comentarios aprobados
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          where: { approved: '1' },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json({ comments }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo comentario
export async function POST(request, { params }) {
  try {
    const { articleId } = await params
    const { name, email, content, parentId } = await request.json()
    await prisma.$connect()

    // Validaciones básicas
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Nombre y contenido son requeridos' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'El comentario no puede exceder 1000 caracteres' },
        { status: 400 }
      )
    }

    // Verificar que el artículo existe
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Comentario padre no encontrado' },
          { status: 404 }
        )
      }
    }

    const commentData = {
      id: randomUUID(),
      name: name.trim(),
      email: email?.trim() || null,
      content: content.trim(),
      articleId,
      parentId: parentId || null,
      approved: '0',
      createdAt: new Date().toISOString()
    }

    const newComment = await prisma.comment.create({
      data: commentData,
      include: {
        replies: {
          where: { approved: '1' },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json({
      message: 'Comentario creado exitosamente',
      comment: newComment
    }, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
