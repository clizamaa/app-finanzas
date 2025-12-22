export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los artículos públicos (solo los publicados)
export async function GET(request) {
  console.log('API /api/articles hit')
  try {
    await prisma.$connect()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0

    // Construir filtro de búsqueda
    const where = {
      published: true
    }

    // Filtrar por categoría (slug)
    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    // Filtrar por destacados
    if (featured === 'true') {
      where.featured = true
    }

    // Filtrar por búsqueda
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
    ])

    return NextResponse.json({
      articles,
      total,
      limit,
      offset,
    })
  } catch (error) {
    try {
      const params = new URL(request.url).searchParams
      const category = params.get('category')
      const featured = params.get('featured')
      const search = params.get('search')
      const limit = parseInt(params.get('limit')) || 10
      const offset = parseInt(params.get('offset')) || 0

      let whereClauses = ['a.published = 1']
      let values = []

      if (category && category !== 'all') {
        whereClauses.push('c.slug = ?')
        values.push(category)
      }
      if (featured === 'true') {
        whereClauses.push('a.featured = 1')
      }
      if (search) {
        whereClauses.push('(a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)')
        values.push(`%${search}%`, `%${search}%`, `%${search}%`)
      }

      const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

      const totalRows = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) AS count
         FROM article a
         LEFT JOIN category c ON a.categoryId = c.id
         ${whereSQL}`,
        ...values
      )
      const total = Array.isArray(totalRows) && totalRows[0] ? Number(totalRows[0].count) : 0

      const rows = await prisma.$queryRawUnsafe(
        `SELECT 
           a.id, a.title, a.slug, a.excerpt, a.content, a.image, a.featured, a.views, a.createdAt, a.updatedAt,
           c.id AS categoryId, c.name AS categoryName, c.slug AS categorySlug
         FROM article a
         LEFT JOIN category c ON a.categoryId = c.id
         ${whereSQL}
         ORDER BY a.createdAt DESC
         LIMIT ? OFFSET ?`,
        ...values,
        limit,
        offset
      )

      const articles = rows.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        image: r.image,
        featured: r.featured === 1 || r.featured === true || r.featured === '1',
        views: typeof r.views === 'number' ? r.views : (parseInt(r.views) || 0),
        createdAt: typeof r.createdAt === 'string' ? r.createdAt : (r.createdAt?.toISOString?.() || r.createdAt),
        updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : (r.updatedAt?.toISOString?.() || r.updatedAt),
        category: r.categoryId ? { id: r.categoryId, name: r.categoryName, slug: r.categorySlug } : null,
        author: null
      }))

      return NextResponse.json({
        articles,
        total,
        limit,
        offset
      })
    } catch (fallbackErr) {
      console.error('Error al obtener artículos (fallback):', fallbackErr)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
}

// POST - Crear nuevo artículo
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validaciones básicas
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Título, contenido y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const existingArticle = articles.find(article => article.slug === body.slug)
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con ese slug' },
        { status: 400 }
      )
    }

    const newArticle = {
      id: nextId++,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || '',
      category: body.category,
      tags: body.tags || [],
      author: body.author || 'Admin',
      slug: body.slug,
      featured: body.featured || false,
      status: body.status || 'draft',
      views: 0,
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    articles.push(newArticle)

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error('Error al crear artículo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar múltiples artículos (para operaciones en lote)
export async function PUT(request) {
  try {
    const body = await request.json()
    const { action, articleIds } = body

    if (!action || !articleIds || !Array.isArray(articleIds)) {
      return NextResponse.json(
        { error: 'Acción y IDs de artículos son requeridos' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    switch (action) {
      case 'publish':
        articles = articles.map(article => {
          if (articleIds.includes(article.id)) {
            updatedCount++
            return {
              ...article,
              status: 'published',
              publishedAt: article.publishedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
          return article
        })
        break

      case 'unpublish':
        articles = articles.map(article => {
          if (articleIds.includes(article.id)) {
            updatedCount++
            return {
              ...article,
              status: 'draft',
              updatedAt: new Date().toISOString()
            }
          }
          return article
        })
        break

      case 'feature':
        articles = articles.map(article => {
          if (articleIds.includes(article.id)) {
            updatedCount++
            return {
              ...article,
              featured: true,
              updatedAt: new Date().toISOString()
            }
          }
          return article
        })
        break

      case 'unfeature':
        articles = articles.map(article => {
          if (articleIds.includes(article.id)) {
            updatedCount++
            return {
              ...article,
              featured: false,
              updatedAt: new Date().toISOString()
            }
          }
          return article
        })
        break

      case 'delete':
        const initialLength = articles.length
        articles = articles.filter(article => !articleIds.includes(article.id))
        updatedCount = initialLength - articles.length
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `${updatedCount} artículo(s) ${action === 'delete' ? 'eliminado(s)' : 'actualizado(s)'} correctamente`,
      updatedCount
    })
  } catch (error) {
    console.error('Error en operación en lote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
