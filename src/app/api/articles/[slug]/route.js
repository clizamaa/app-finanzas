import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Verificar token JWT opcionalmente (permite preview de borradores a administradores)
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

// GET - Obtener artículo por slug
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const decoded = verifyToken(request)
    
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

    // Si no está publicado, solo permitir acceso si está autenticado (admin)
    if (!article.published && !decoded) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

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
