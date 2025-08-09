import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Base de datos en memoria para artículos
let articles = []

let nextId = 1

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

    // Filtrar artículos
    let filteredArticles = articles

    if (search) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filteredArticles = filteredArticles.filter(article =>
        article.category.slug === category
      )
    }

    if (status) {
      filteredArticles = filteredArticles.filter(article =>
        article.status === status
      )
    }

    if (featured !== null && featured !== undefined) {
      filteredArticles = filteredArticles.filter(article =>
        article.featured === (featured === 'true')
      )
    }

    // Ordenar artículos
    filteredArticles.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'publishedAt' || sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / limit),
        hasNext: endIndex < filteredArticles.length,
        hasPrev: page > 1
      },
      filters: {
        search,
        category,
        status,
        featured,
        sortBy,
        sortOrder
      }
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
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: 'Título, contenido y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Generar slug si no se proporciona
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Verificar que el slug sea único
    const existingArticle = articles.find(article => article.slug === slug)
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con este slug' },
        { status: 400 }
      )
    }

    const newArticle = {
      id: nextId++,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      status: data.status || 'draft',
      featured: data.featured || false,
      views: 0,
      publishedAt: data.status === 'published' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      slug,
      author: data.author || 'Admin',
      metaDescription: data.metaDescription || '',
      metaKeywords: data.metaKeywords || ''
    }

    articles.push(newArticle)

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

export async function PUT(request) {
  try {
    const data = await request.json()
    const { action, ids } = data

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Acción e IDs son requeridos' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    switch (action) {
      case 'publish':
        articles = articles.map(article => {
          if (ids.includes(article.id)) {
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
          if (ids.includes(article.id)) {
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
          if (ids.includes(article.id)) {
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
          if (ids.includes(article.id)) {
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
        articles = articles.filter(article => !ids.includes(article.id))
        updatedCount = initialLength - articles.length
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `${updatedCount} artículo(s) ${action === 'delete' ? 'eliminado(s)' : 'actualizado(s)'} exitosamente`,
      updatedCount
    })
  } catch (error) {
    console.error('Error updating articles:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}