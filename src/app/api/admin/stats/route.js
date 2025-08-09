import { NextResponse } from 'next/server'

// Simulación de datos estadísticos
const getStats = () => {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  
  return {
    overview: {
      totalArticles: 15,
      publishedArticles: 12,
      draftArticles: 3,
      totalReviews: 8,
      publishedReviews: 6,
      draftReviews: 2,
      totalTutorials: 10,
      publishedTutorials: 7,
      draftTutorials: 3,
      totalCategories: 5,
      totalViews: 45280,
      monthlyViews: 12450
    },
    recentActivity: [
      {
        id: 1,
        type: 'article',
        action: 'published',
        title: 'Cómo crear un presupuesto familiar efectivo',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        author: 'Admin'
      },
      {
        id: 2,
        type: 'review',
        action: 'created',
        title: 'YNAB (You Need A Budget)',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
        author: 'Admin'
      },
      {
        id: 3,
        type: 'tutorial',
        action: 'updated',
        title: 'Guía completa para invertir en ETFs',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
        author: 'Admin'
      },
      {
        id: 4,
        type: 'category',
        action: 'created',
        title: 'Criptomonedas',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
        author: 'Admin'
      },
      {
        id: 5,
        type: 'article',
        action: 'featured',
        title: 'Estrategias de ahorro para millennials',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
        author: 'Admin'
      }
    ],
    popularContent: {
      articles: [
        {
          id: 1,
          title: 'Cómo crear un presupuesto familiar efectivo',
          views: 3250,
          category: 'Presupuesto',
          publishedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Inversiones para principiantes: Guía completa',
          views: 2890,
          category: 'Inversiones',
          publishedAt: '2024-01-12T14:30:00Z'
        },
        {
          id: 3,
          title: 'Mejores apps de finanzas personales 2024',
          views: 2150,
          category: 'Tecnología',
          publishedAt: '2024-01-10T16:45:00Z'
        }
      ],
      reviews: [
        {
          id: 1,
          title: 'YNAB (You Need A Budget)',
          views: 2150,
          rating: 4.5,
          publishedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          title: 'Mint - Gestión Financiera Personal',
          views: 1890,
          rating: 4.2,
          publishedAt: '2024-01-18T14:30:00Z'
        }
      ],
      tutorials: [
        {
          id: 1,
          title: 'Cómo configurar tu primer presupuesto en Excel',
          views: 3250,
          difficulty: 'Principiante',
          publishedAt: '2024-01-22T10:00:00Z'
        },
        {
          id: 2,
          title: 'Guía completa para invertir en ETFs',
          views: 2890,
          difficulty: 'Intermedio',
          publishedAt: '2024-01-20T14:30:00Z'
        }
      ]
    },
    viewsAnalytics: {
      daily: [
        { date: '2024-01-15', views: 450 },
        { date: '2024-01-16', views: 520 },
        { date: '2024-01-17', views: 380 },
        { date: '2024-01-18', views: 610 },
        { date: '2024-01-19', views: 490 },
        { date: '2024-01-20', views: 720 },
        { date: '2024-01-21', views: 580 },
        { date: '2024-01-22', views: 650 }
      ],
      monthly: [
        { month: '2023-10', views: 8500 },
        { month: '2023-11', views: 9200 },
        { month: '2023-12', views: 11800 },
        { month: '2024-01', views: 12450 }
      ]
    },
    categoryStats: [
      {
        name: 'Presupuesto',
        articleCount: 5,
        totalViews: 15200,
        avgViews: 3040
      },
      {
        name: 'Inversiones',
        articleCount: 4,
        totalViews: 12800,
        avgViews: 3200
      },
      {
        name: 'Ahorro',
        articleCount: 3,
        totalViews: 8900,
        avgViews: 2967
      },
      {
        name: 'Criptomonedas',
        articleCount: 2,
        totalViews: 4200,
        avgViews: 2100
      },
      {
        name: 'Educación Financiera',
        articleCount: 1,
        totalViews: 4180,
        avgViews: 4180
      }
    ],
    contentStatus: {
      articles: {
        published: 12,
        draft: 3,
        featured: 4
      },
      reviews: {
        published: 6,
        draft: 2,
        featured: 2
      },
      tutorials: {
        published: 7,
        draft: 3,
        featured: 3
      }
    },
    generatedAt: now.toISOString()
  }
}

// GET - Obtener estadísticas del dashboard
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, month, week, day
    const type = searchParams.get('type') // overview, activity, popular, analytics, categories

    const stats = getStats()

    // Si se solicita un tipo específico de estadísticas
    if (type) {
      switch (type) {
        case 'overview':
          return NextResponse.json({ overview: stats.overview })
        case 'activity':
          return NextResponse.json({ recentActivity: stats.recentActivity })
        case 'popular':
          return NextResponse.json({ popularContent: stats.popularContent })
        case 'analytics':
          return NextResponse.json({ viewsAnalytics: stats.viewsAnalytics })
        case 'categories':
          return NextResponse.json({ categoryStats: stats.categoryStats })
        case 'status':
          return NextResponse.json({ contentStatus: stats.contentStatus })
        default:
          return NextResponse.json(
            { error: 'Tipo de estadística no válido' },
            { status: 400 }
          )
      }
    }

    // Filtrar por período si se especifica
    if (period !== 'all') {
      const now = new Date()
      let cutoffDate

      switch (period) {
        case 'day':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoffDate = new Date(0) // Todos los datos
      }

      // Filtrar actividad reciente por período
      stats.recentActivity = stats.recentActivity.filter(activity => 
        new Date(activity.timestamp) >= cutoffDate
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Actualizar estadísticas (para cuando se realizan acciones)
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, type, itemId, title, author } = body

    if (!action || !type) {
      return NextResponse.json(
        { error: 'Acción y tipo son requeridos' },
        { status: 400 }
      )
    }

    // Simular actualización de estadísticas
    // En una implementación real, esto actualizaría la base de datos
    const newActivity = {
      id: Date.now(), // ID temporal
      type,
      action,
      title: title || `${type} ${itemId}`,
      timestamp: new Date().toISOString(),
      author: author || 'Admin'
    }

    return NextResponse.json({
      message: 'Estadísticas actualizadas correctamente',
      newActivity
    })
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}