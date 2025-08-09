import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria
let reviews = [
  {
    id: 1,
    title: 'YNAB (You Need A Budget)',
    appName: 'YNAB',
    category: 'Presupuesto',
    rating: 4.5,
    price: '$14.99/mes',
    platform: ['iOS', 'Android', 'Web'],
    description: 'Una de las mejores aplicaciones para gestión de presupuestos personales.',
    content: 'YNAB es una aplicación revolucionaria que cambia la forma en que piensas sobre el dinero...',
    pros: [
      'Metodología probada de presupuesto',
      'Sincronización en tiempo real',
      'Excelente soporte al cliente',
      'Comunidad activa'
    ],
    cons: [
      'Precio relativamente alto',
      'Curva de aprendizaje inicial',
      'No disponible en español'
    ],
    features: [
      'Presupuesto basado en cero',
      'Sincronización bancaria',
      'Reportes detallados',
      'Aplicación móvil'
    ],
    technicalDetails: {
      developer: 'You Need A Budget LLC',
      version: '22.12.1',
      size: '45 MB',
      requirements: 'iOS 14.0+ / Android 8.0+'
    },
    externalLinks: {
      website: 'https://www.youneedabudget.com',
      appStore: 'https://apps.apple.com/app/ynab',
      playStore: 'https://play.google.com/store/apps/details?id=com.youneedabudget.evergreen.app'
    },
    slug: 'ynab-you-need-budget',
    featured: true,
    status: 'published',
    views: 2150,
    author: 'Admin',
    publishedAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Mint - Gestión Financiera Personal',
    appName: 'Mint',
    category: 'Finanzas Generales',
    rating: 4.2,
    price: 'Gratis',
    platform: ['iOS', 'Android', 'Web'],
    description: 'Aplicación gratuita para seguimiento de gastos y presupuestos.',
    content: 'Mint es una aplicación gratuita que te ayuda a mantener el control de tus finanzas...',
    pros: [
      'Completamente gratuita',
      'Sincronización automática con bancos',
      'Alertas personalizables',
      'Seguimiento de puntaje crediticio'
    ],
    cons: [
      'Solo disponible en algunos países',
      'Publicidad dentro de la app',
      'Funciones limitadas comparado con opciones de pago'
    ],
    features: [
      'Seguimiento automático de gastos',
      'Presupuestos personalizables',
      'Alertas de facturas',
      'Monitoreo de crédito'
    ],
    technicalDetails: {
      developer: 'Intuit Inc.',
      version: '8.15.0',
      size: '78 MB',
      requirements: 'iOS 13.0+ / Android 7.0+'
    },
    externalLinks: {
      website: 'https://www.mint.com',
      appStore: 'https://apps.apple.com/app/mint',
      playStore: 'https://play.google.com/store/apps/details?id=com.mint'
    },
    slug: 'mint-gestion-financiera-personal',
    featured: false,
    status: 'published',
    views: 1890,
    author: 'Admin',
    publishedAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 3,
    title: 'PocketGuard - Control de Gastos',
    appName: 'PocketGuard',
    category: 'Control de Gastos',
    rating: 4.0,
    price: 'Freemium',
    platform: ['iOS', 'Android'],
    description: 'Aplicación simple para evitar gastos excesivos.',
    content: 'PocketGuard te ayuda a mantener tus gastos bajo control mostrándote cuánto puedes gastar...',
    pros: [
      'Interfaz muy simple',
      'Cálculo automático de dinero disponible',
      'Categorización automática'
    ],
    cons: [
      'Funciones limitadas en versión gratuita',
      'No disponible en web',
      'Menos opciones de personalización'
    ],
    features: [
      'Seguimiento de gastos en tiempo real',
      'Cálculo de dinero disponible',
      'Alertas de sobregasto',
      'Análisis de tendencias'
    ],
    technicalDetails: {
      developer: 'PocketGuard Inc.',
      version: '5.8.2',
      size: '32 MB',
      requirements: 'iOS 12.0+ / Android 6.0+'
    },
    externalLinks: {
      website: 'https://pocketguard.com',
      appStore: 'https://apps.apple.com/app/pocketguard',
      playStore: 'https://play.google.com/store/apps/details?id=com.pocketguard'
    },
    slug: 'pocketguard-control-gastos',
    featured: true,
    status: 'draft',
    views: 0,
    author: 'Admin',
    publishedAt: null,
    updatedAt: '2024-01-16T16:45:00Z',
    createdAt: '2024-01-16T16:45:00Z'
  }
]

let nextId = 4

// GET - Obtener todas las reseñas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const platform = searchParams.get('platform')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let filteredReviews = [...reviews]

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredReviews = filteredReviews.filter(review => review.category === category)
    }

    // Filtrar por estado
    if (status && status !== 'all') {
      filteredReviews = filteredReviews.filter(review => review.status === status)
    }

    // Filtrar por destacados
    if (featured === 'true') {
      filteredReviews = filteredReviews.filter(review => review.featured)
    }

    // Filtrar por plataforma
    if (platform && platform !== 'all') {
      filteredReviews = filteredReviews.filter(review => 
        review.platform.includes(platform)
      )
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase()
      filteredReviews = filteredReviews.filter(review => 
        review.title.toLowerCase().includes(searchLower) ||
        review.appName.toLowerCase().includes(searchLower) ||
        review.description.toLowerCase().includes(searchLower) ||
        review.content.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar
    filteredReviews.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'rating') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })

    // Paginación
    const paginatedReviews = filteredReviews.slice(offset, offset + limit)

    return NextResponse.json({
      reviews: paginatedReviews,
      total: filteredReviews.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error al obtener reseñas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva reseña
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validaciones básicas
    if (!body.title || !body.appName || !body.category || !body.rating) {
      return NextResponse.json(
        { error: 'Título, nombre de app, categoría y calificación son requeridos' },
        { status: 400 }
      )
    }

    // Validar rating
    const rating = parseFloat(body.rating)
    if (isNaN(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe ser un número entre 0 y 5' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    if (body.slug) {
      const existingReview = reviews.find(review => review.slug === body.slug)
      if (existingReview) {
        return NextResponse.json(
          { error: 'Ya existe una reseña con ese slug' },
          { status: 400 }
        )
      }
    }

    const newReview = {
      id: nextId++,
      title: body.title,
      appName: body.appName,
      category: body.category,
      rating: rating,
      price: body.price || 'No especificado',
      platform: body.platform || [],
      description: body.description || '',
      content: body.content || '',
      pros: body.pros || [],
      cons: body.cons || [],
      features: body.features || [],
      technicalDetails: body.technicalDetails || {},
      externalLinks: body.externalLinks || {},
      slug: body.slug,
      featured: body.featured || false,
      status: body.status || 'draft',
      views: 0,
      author: body.author || 'Admin',
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    reviews.push(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error('Error al crear reseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar múltiples reseñas (para operaciones en lote)
export async function PUT(request) {
  try {
    const body = await request.json()
    const { action, reviewIds } = body

    if (!action || !reviewIds || !Array.isArray(reviewIds)) {
      return NextResponse.json(
        { error: 'Acción y IDs de reseñas son requeridos' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    switch (action) {
      case 'publish':
        reviews = reviews.map(review => {
          if (reviewIds.includes(review.id)) {
            updatedCount++
            return {
              ...review,
              status: 'published',
              publishedAt: review.publishedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
          return review
        })
        break

      case 'unpublish':
        reviews = reviews.map(review => {
          if (reviewIds.includes(review.id)) {
            updatedCount++
            return {
              ...review,
              status: 'draft',
              updatedAt: new Date().toISOString()
            }
          }
          return review
        })
        break

      case 'feature':
        reviews = reviews.map(review => {
          if (reviewIds.includes(review.id)) {
            updatedCount++
            return {
              ...review,
              featured: true,
              updatedAt: new Date().toISOString()
            }
          }
          return review
        })
        break

      case 'unfeature':
        reviews = reviews.map(review => {
          if (reviewIds.includes(review.id)) {
            updatedCount++
            return {
              ...review,
              featured: false,
              updatedAt: new Date().toISOString()
            }
          }
          return review
        })
        break

      case 'delete':
        const initialLength = reviews.length
        reviews = reviews.filter(review => !reviewIds.includes(review.id))
        updatedCount = initialLength - reviews.length
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `${updatedCount} reseña(s) ${action === 'delete' ? 'eliminada(s)' : 'actualizada(s)'} correctamente`,
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