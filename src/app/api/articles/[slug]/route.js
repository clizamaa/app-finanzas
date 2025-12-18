import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const runtime = 'nodejs'

// GET - Obtener artículo por slug
export async function GET(request, { params }) {
  try {
    const { slug } = params
    
    const article = await prisma.article.findFirst({
      where: { slug },
      include: { 
        category: true, 
        // tags: true,  // Uncomment when Tag relation is enabled
        author: true 
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Mostrar artículo aunque no esté publicado (admin deshabilitado)

    // Incrementar vistas solo para artículos publicados
    if (!!article.published) {
      const currentViews = typeof article.views === 'number' ? article.views : (parseInt(article.views) || 0)
      await prisma.article.update({
        where: { id: article.id },
        data: { views: currentViews + 1 }
      })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
