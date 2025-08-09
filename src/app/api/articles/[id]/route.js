import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria (compartida con route.js principal)
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

// GET - Obtener artículo por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de artículo no válido' },
        { status: 400 }
      )
    }

    const article = articles.find(a => a.id === id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar vistas si el artículo está publicado
    if (article.status === 'published') {
      article.views += 1
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error al obtener artículo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar artículo por ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de artículo no válido' },
        { status: 400 }
      )
    }

    const articleIndex = articles.findIndex(a => a.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Validaciones básicas
    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json(
        { error: 'El título no puede estar vacío' },
        { status: 400 }
      )
    }

    if (body.content !== undefined && !body.content.trim()) {
      return NextResponse.json(
        { error: 'El contenido no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único (si se está actualizando)
    if (body.slug && body.slug !== articles[articleIndex].slug) {
      const existingArticle = articles.find(article => article.slug === body.slug && article.id !== id)
      if (existingArticle) {
        return NextResponse.json(
          { error: 'Ya existe un artículo con ese slug' },
          { status: 400 }
        )
      }
    }

    const currentArticle = articles[articleIndex]
    const wasPublished = currentArticle.status === 'published'
    const willBePublished = body.status === 'published'

    // Actualizar artículo
    const updatedArticle = {
      ...currentArticle,
      ...body,
      id: currentArticle.id, // Mantener ID original
      createdAt: currentArticle.createdAt, // Mantener fecha de creación
      updatedAt: new Date().toISOString(),
      // Actualizar publishedAt solo si se está publicando por primera vez
      publishedAt: willBePublished && !wasPublished ? new Date().toISOString() : 
                   willBePublished ? currentArticle.publishedAt : null
    }

    articles[articleIndex] = updatedArticle

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('Error al actualizar artículo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar artículo por ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de artículo no válido' },
        { status: 400 }
      )
    }

    const articleIndex = articles.findIndex(a => a.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    const deletedArticle = articles[articleIndex]
    articles.splice(articleIndex, 1)

    return NextResponse.json({
      message: 'Artículo eliminado correctamente',
      deletedArticle
    })
  } catch (error) {
    console.error('Error al eliminar artículo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}