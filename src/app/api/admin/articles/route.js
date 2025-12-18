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
        status ? { published: status === 'published' } : {},
        featured !== null && featured !== undefined ? { featured: featured === 'true' } : {}
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
      published: !!a.published,
      featured: !!a.featured,
      views: typeof a.views === 'number' ? a.views : (a.views ? Number(a.views) : 0)
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

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    })
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validación básica (imagen opcional)
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: 'Título, contenido y categoría son requeridos' },
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
          createdAt: new Date(),
          updatedAt: new Date()
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
    const now = new Date()

    const articleData = {
      id: articleId,
      title: data.title,
      slug: slug,
      excerpt: data.excerpt || '',
      content: data.content,
      image: typeof data.image === 'string' && data.image.trim() !== '' ? data.image.trim() : undefined,
      // Tipos reales según DB
      published: (data.status === 'published' || !!data.published),
      featured: !!data.featured,
      views: 0,
      createdAt: now,
      updatedAt: now,
      authorId: user.id,
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
      published: !!newArticle.published,
      featured: !!newArticle.featured,
      views: typeof newArticle.views === 'number' ? newArticle.views : (newArticle.views ? Number(newArticle.views) : 0)
    }

    return NextResponse.json({
      message: 'Artículo creado exitosamente',
      article: normalizedNew
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', detail: error?.message },
      { status: 500 }
    )
  }
}
