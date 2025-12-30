import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const runtime = 'nodejs'

// GET - Obtener artículo por slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params
    
    // Conectar a la base de datos
    await prisma.$connect()

    const article = await prisma.article.findFirst({
      where: { 
        slug,
        published: true
      },
      include: { 
        category: true, 
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

    // Intentar obtener el banner vía SQL crudo (aunque Prisma no lo tenga en el modelo)
    try {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT banner FROM article WHERE id = ? LIMIT 1`,
        article.id
      )
      const banner = Array.isArray(rows) && rows[0] ? rows[0].banner : null
      return NextResponse.json({ article: { ...article, banner } })
    } catch {
      return NextResponse.json({ article })
    }
  } catch (error) {
    console.error('Error fetching article by slug (Prisma), trying RAW:', error)
    
    try {
      const { slug } = await params
      // Fallback a SQL crudo si Prisma falla (por inconsistencia de esquema)
      const articles = await prisma.$queryRawUnsafe(
        `SELECT 
           a.id, a.title, a.slug, a.excerpt, a.content, a.image, a.banner, a.featured, a.views, a.createdAt, a.updatedAt, a.published,
           c.id AS categoryId, c.name AS categoryName, c.slug AS categorySlug
         FROM article a
         LEFT JOIN category c ON a.categoryId = c.id
         WHERE a.slug = ? AND a.published = 1
         LIMIT 1`,
        slug
      )

      if (Array.isArray(articles) && articles.length > 0) {
        const rawArticle = articles[0]
        
        // Formatear respuesta para que coincida con Prisma
        const article = {
          ...rawArticle,
          category: rawArticle.categoryId ? {
            id: rawArticle.categoryId,
            name: rawArticle.categoryName,
            slug: rawArticle.categorySlug
          } : null,
          // Convertir BigInt a number si es necesario (views suele ser int, pero count es bigint)
          views: typeof rawArticle.views === 'bigint' ? Number(rawArticle.views) : rawArticle.views
        }

        // Incrementar vistas
        if (!!article.published) {
           await prisma.$executeRawUnsafe(
             `UPDATE article SET views = views + 1 WHERE id = ?`,
             article.id
           )
        }

        return NextResponse.json({ article })
      } else {
         return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
        )
      }

    } catch (rawError) {
      console.error('Error fetching article by slug (RAW):', rawError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
}
