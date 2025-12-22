import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria (compartida con route.js principal)
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

// GET - Obtener reseña por ID
export async function GET(request, { params }) {
  try {
    const paramsData = await params
    const id = parseInt(paramsData.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de reseña no válido' },
        { status: 400 }
      )
    }

    const review = reviews.find(r => r.id === id)
    
    if (!review) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      )
    }

    // Incrementar vistas si la reseña está publicada
    if (review.status === 'published') {
      review.views += 1
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error al obtener reseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar reseña por ID
export async function PUT(request, { params }) {
  try {
    const paramsData = await params
    const id = parseInt(paramsData.id)
    const body = await request.json()
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de reseña no válido' },
        { status: 400 }
      )
    }

    const reviewIndex = reviews.findIndex(r => r.id === id)
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
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

    if (body.appName !== undefined && !body.appName.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la aplicación no puede estar vacío' },
        { status: 400 }
      )
    }

    // Validar rating si se proporciona
    if (body.rating !== undefined) {
      const rating = parseFloat(body.rating)
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return NextResponse.json(
          { error: 'La calificación debe ser un número entre 0 y 5' },
          { status: 400 }
        )
      }
      body.rating = rating
    }

    // Verificar que el slug sea único (si se está actualizando)
    if (body.slug && body.slug !== reviews[reviewIndex].slug) {
      const existingReview = reviews.find(review => review.slug === body.slug && review.id !== id)
      if (existingReview) {
        return NextResponse.json(
          { error: 'Ya existe una reseña con ese slug' },
          { status: 400 }
        )
      }
    }

    const currentReview = reviews[reviewIndex]
    const wasPublished = currentReview.status === 'published'
    const willBePublished = body.status === 'published'

    // Actualizar reseña
    const updatedReview = {
      ...currentReview,
      ...body,
      id: currentReview.id, // Mantener ID original
      createdAt: currentReview.createdAt, // Mantener fecha de creación
      updatedAt: new Date().toISOString(),
      // Actualizar publishedAt solo si se está publicando por primera vez
      publishedAt: willBePublished && !wasPublished ? new Date().toISOString() : 
                   willBePublished ? currentReview.publishedAt : null
    }

    reviews[reviewIndex] = updatedReview

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error al actualizar reseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar reseña por ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de reseña no válido' },
        { status: 400 }
      )
    }

    const reviewIndex = reviews.findIndex(r => r.id === id)
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      )
    }

    const deletedReview = reviews[reviewIndex]
    reviews.splice(reviewIndex, 1)

    return NextResponse.json({
      message: 'Reseña eliminada correctamente',
      deletedReview
    })
  } catch (error) {
    console.error('Error al eliminar reseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}