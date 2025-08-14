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
        include: { category: true, tags: true, author: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      })
    ])

    return NextResponse.json({
      articles,
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
    let category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) {
      const nameFromSlug = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      category = await prisma.category.create({
        data: { name: nameFromSlug, slug: categorySlug }
      })
    }

    // Verificar slug único
    const existingArticle = await prisma.article.findUnique({ where: { slug } })
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con este slug' },
        { status: 400 }
      )
    }

    // Nota sobre tags: por ahora ignoramos el array recibido desde el cliente, ya que no corresponde con IDs reales de la BD
    // En una mejora posterior, podemos soportar creación/búsqueda por slug/nombre

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || '',
        content: data.content,
        image: typeof data.image === 'string' && data.image.trim() !== '' ? data.image.trim() : undefined,
        published: data.status === 'published' || !!data.published,
        featured: !!data.featured,
        views: 0,
        author: { connect: { id: decoded.userId } }, // Conectar con el usuario autenticado
        category: { connect: { id: category.id } }
        // Nota: omitimos 'tags' en el create para evitar errores; se podrá manejar luego con 'connect' o creación de tags reales
      },
      include: { category: true, tags: true, author: true }
    })

    return NextResponse.json({
      message: 'Artículo creado exitosamente',
      article: newArticle
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}