import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria
let articles = [
  {
    id: 1,
    title: 'Cómo crear un presupuesto familiar efectivo',
    content: 'Un presupuesto familiar es la base de una buena salud financiera...',
    excerpt: 'Aprende a crear un presupuesto que realmente funcione para tu familia.',
    category: 'Presupuesto',
    tags: ['presupuesto', 'familia', 'finanzas'],
    author: 'Admin',
    slug: 'como-crear-presupuesto-familiar-efectivo',
    featured: true,
    status: 'published',
    views: 1250,
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Inversiones para principiantes: Guía completa',
    content: 'Invertir puede parecer intimidante al principio, pero con la información correcta...',
    excerpt: 'Todo lo que necesitas saber para comenzar a invertir de manera inteligente.',
    category: 'Inversiones',
    tags: ['inversiones', 'principiantes', 'bolsa'],
    author: 'Admin',
    slug: 'inversiones-principiantes-guia-completa',
    featured: false,
    status: 'published',
    views: 890,
    publishedAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: 3,
    title: 'Estrategias de ahorro para millennials',
    content: 'Los millennials enfrentan desafíos únicos cuando se trata de ahorrar...',
    excerpt: 'Técnicas de ahorro adaptadas a la realidad de los millennials.',
    category: 'Ahorro',
    tags: ['ahorro', 'millennials', 'estrategias'],
    author: 'Admin',
    slug: 'estrategias-ahorro-millennials',
    featured: true,
    status: 'draft',
    views: 0,
    publishedAt: null,
    updatedAt: '2024-01-10T16:45:00Z',
    createdAt: '2024-01-10T16:45:00Z'
  }
]

let nextId = 4

// GET - Obtener todos los artículos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0

    let filteredArticles = [...articles]

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.category === category)
    }

    // Filtrar por estado
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.status === status)
    }

    // Filtrar por destacados
    if (featured === 'true') {
      filteredArticles = filteredArticles.filter(article => article.featured)
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar por fecha de actualización (más recientes primero)
    filteredArticles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    // Paginación
    const paginatedArticles = filteredArticles.slice(offset, offset + limit)

    return NextResponse.json({
      articles: paginatedArticles,
      total: filteredArticles.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error al obtener artículos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
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