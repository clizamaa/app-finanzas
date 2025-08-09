import { NextResponse } from 'next/server'

// Importar los artículos desde el archivo principal
// En una aplicación real, esto vendría de una base de datos
let articles = [
  {
    id: 1,
    title: 'Las 10 Mejores Apps de Presupuesto Personal para 2024',
    excerpt: 'Descubre cuáles son las aplicaciones más efectivas para controlar tus gastos...',
    content: 'Contenido completo del artículo...',
    category: { id: 1, name: 'Reviews', slug: 'reviews' },
    tags: ['apps', 'presupuesto', 'finanzas'],
    status: 'published',
    featured: true,
    views: 1250,
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    slug: 'mejores-apps-presupuesto-2024',
    author: 'Admin',
    metaDescription: 'Las mejores aplicaciones de presupuesto personal para 2024',
    metaKeywords: 'apps, presupuesto, finanzas personales'
  },
  {
    id: 2,
    title: 'Cómo Configurar YNAB: Guía Completa para Principiantes',
    excerpt: 'Tutorial paso a paso para configurar You Need A Budget...',
    content: 'Contenido completo del tutorial...',
    category: { id: 2, name: 'Tutoriales', slug: 'tutoriales' },
    tags: ['ynab', 'tutorial', 'configuración'],
    status: 'published',
    featured: false,
    views: 890,
    publishedAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
    createdAt: '2024-01-12T10:00:00Z',
    slug: 'como-configurar-ynab-guia-completa',
    author: 'Admin',
    metaDescription: 'Guía completa para configurar YNAB paso a paso',
    metaKeywords: 'ynab, tutorial, presupuesto'
  },
  {
    id: 3,
    title: 'Mint vs PocketGuard: Comparativa Detallada',
    excerpt: 'Análisis completo de dos de las apps de finanzas más populares...',
    content: 'Contenido completo de la comparativa...',
    category: { id: 1, name: 'Reviews', slug: 'reviews' },
    tags: ['mint', 'pocketguard', 'comparativa'],
    status: 'draft',
    featured: false,
    views: 0,
    publishedAt: null,
    updatedAt: '2024-01-10T10:00:00Z',
    createdAt: '2024-01-10T10:00:00Z',
    slug: 'mint-vs-pocketguard-comparativa',
    author: 'Admin',
    metaDescription: 'Comparativa detallada entre Mint y PocketGuard',
    metaKeywords: 'mint, pocketguard, apps finanzas'
  },
  {
    id: 4,
    title: 'Cómo Crear un Fondo de Emergencia en 6 Meses',
    excerpt: 'Aprende la estrategia paso a paso para construir tu colchón financiero...',
    content: 'Contenido completo del artículo...',
    category: { id: 2, name: 'Tutoriales', slug: 'tutoriales' },
    tags: ['fondo emergencia', 'ahorro', 'finanzas'],
    status: 'published',
    featured: true,
    views: 2341,
    publishedAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
    createdAt: '2024-01-08T10:00:00Z',
    slug: 'como-crear-fondo-emergencia-6-meses',
    author: 'Admin',
    metaDescription: 'Estrategia para crear un fondo de emergencia en 6 meses',
    metaKeywords: 'fondo emergencia, ahorro, finanzas personales'
  }
]

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    const article = articles.find(a => a.id === id)

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar vistas si está publicado
    if (article.status === 'published') {
      const articleIndex = articles.findIndex(a => a.id === id)
      if (articleIndex !== -1) {
        articles[articleIndex].views += 1
      }
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const articleIndex = articles.findIndex(a => a.id === id)
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    const currentArticle = articles[articleIndex]

    // Validación básica
    if (data.title && data.title.trim() === '') {
      return NextResponse.json(
        { error: 'El título no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar slug único si se está actualizando
    if (data.slug && data.slug !== currentArticle.slug) {
      const existingArticle = articles.find(article => 
        article.slug === data.slug && article.id !== id
      )
      if (existingArticle) {
        return NextResponse.json(
          { error: 'Ya existe un artículo con este slug' },
          { status: 400 }
        )
      }
    }

    // Actualizar artículo
    const updatedArticle = {
      ...currentArticle,
      ...data,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString(),
      // Si se está publicando por primera vez, establecer publishedAt
      publishedAt: data.status === 'published' && !currentArticle.publishedAt 
        ? new Date().toISOString() 
        : currentArticle.publishedAt
    }

    articles[articleIndex] = updatedArticle

    return NextResponse.json({
      message: 'Artículo actualizado exitosamente',
      article: updatedArticle
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const articleIndex = articles.findIndex(a => a.id === id)
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    // Actualización parcial
    articles[articleIndex] = {
      ...articles[articleIndex],
      ...data,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Artículo actualizado exitosamente',
      article: articles[articleIndex]
    })
  } catch (error) {
    console.error('Error patching article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
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
      message: 'Artículo eliminado exitosamente',
      article: deletedArticle
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}