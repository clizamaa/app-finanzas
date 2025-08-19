import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured')
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros para Prisma
    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        category ? { category: { slug: category } } : {},
        status ? { published: status === 'published' ? '1' : '0' } : {},
        featured !== null && featured !== undefined ? { featured: featured === 'true' ? '1' : '0' } : {}
      ]
    }

    // Ordenación
    const orderBy = (() => {
      const map = {
        publishedAt: 'publishedAt',
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        views: 'views',
        title: 'title'
      }
      const key = map[sortBy] || 'updatedAt'
      return { [key]: sortOrder === 'desc' ? 'desc' : 'asc' }
    })()

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        include: { category: true, author: true }, // ajustar a nombres de relación reales
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      })
    ])

    // Normalizar campos a tipos esperados por el frontend
    const normalized = articles.map(a => ({
      ...a,
      published: a.published === '1',
      featured: a.featured === '1',
      views: a.views ? Number(a.views) : 0
    }))

    return NextResponse.json({
      articles: normalized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: { search, category, status, featured, sortBy, sortOrder }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

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

    const data = await request.json()

    // Validación básica
    if (!data.title || !data.content || !data.category || !data.image) {
      return NextResponse.json(
        { error: 'Título, contenido, categoría e imagen son requeridos' },
        { status: 400 }
      )
    }

    // Generar slug si no se proporciona
    const slug = (data.slug && data.slug.trim()) || data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Buscar categoría por slug, o crearla si no existe
    const categorySlug = String(data.category).toLowerCase().trim()
    let category = await prisma.category.findFirst({ where: { slug: categorySlug } })
    if (!category) {
      const nameFromSlug = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      category = await prisma.category.create({
        data: { 
          id: randomUUID(), 
          name: nameFromSlug, 
          slug: categorySlug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
    }

    // Verificar slug único
    const existingArticle = await prisma.article.findFirst({ where: { slug } })
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con este slug' },
        { status: 400 }
      )
    }

    const articleId = randomUUID()
    const now = new Date().toISOString()

    const articleData = {
      id: articleId,
      title: data.title,
      slug: slug,
      excerpt: data.excerpt || '',
      content: data.content,
      image: typeof data.image === 'string' && data.image.trim() !== '' ? data.image.trim() : undefined,
      // Convertir a valores string "1"/"0" según el esquema actual
      published: (data.status === 'published' || !!data.published) ? '1' : '0',
      featured: !!data.featured ? '1' : '0',
      views: '0',
      createdAt: now,
      updatedAt: now,
      authorId: decoded.userId,
      categoryId: category.id
    }

    console.log('Creating article with data:', {
      id: articleData.id,
      title: articleData.title,
      slug: articleData.slug,
      authorId: articleData.authorId,
      categoryId: articleData.categoryId
    })

    const newArticle = await prisma.article.create({
      data: articleData,
      include: { category: true, author: true }
    })

    // Normalizar respuesta
    const normalizedNew = {
      ...newArticle,
      published: newArticle.published === '1',
      featured: newArticle.featured === '1',
      views: newArticle.views ? Number(newArticle.views) : 0
    }

    return NextResponse.json({
      message: 'Artículo creado exitosamente',
      article: normalizedNew
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}