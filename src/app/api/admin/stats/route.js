import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Obtener actividad reciente real de la base de datos
const getRecentActivity = async () => {
  const activities = []
  
  try {
    // Obtener artículos recientes (últimos 10)
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        category: true
      }
    })
    
    // Agregar artículos a la actividad
    recentArticles.forEach(article => {
      activities.push({
        id: `article-${article.id}`,
        type: 'article',
        action: article.published ? 'published' : 'created',
        title: article.title,
        timestamp: article.createdAt instanceof Date ? article.createdAt.toISOString() : article.createdAt,
        author: article.author?.name || 'Usuario'
      })
      
      // Si el artículo está destacado, agregar actividad adicional
      if (article.featured) {
        activities.push({
          id: `featured-${article.id}`,
          type: 'article',
          action: 'featured',
          title: article.title,
          timestamp: article.updatedAt instanceof Date ? article.updatedAt.toISOString() : article.updatedAt,
          author: article.author?.name || 'Usuario'
        })
      }
    })
    
    // Obtener categorías recientes (últimas 3)
    const recentCategories = await prisma.category.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    })
    
    // Agregar categorías a la actividad
    recentCategories.forEach(category => {
      activities.push({
        id: `category-${category.id}`,
        type: 'category',
        action: 'created',
        title: category.name,
        timestamp: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
        author: 'Admin'
      })
    })
    
    // Obtener usuarios recientes (últimos 3)
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        role: true
      }
    })
    
    // Agregar usuarios a la actividad
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user',
        action: 'created',
        title: `${user.name} (${user.role?.name || 'Sin rol'})`,
        timestamp: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        author: 'Admin'
      })
    })
    
    // Ordenar todas las actividades por fecha (más recientes primero) y tomar las primeras 8
     return activities
       .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
       .slice(0, 8)
      
  } catch (error) {
    console.error('Error obteniendo actividad reciente:', error)
    return []
  }
}

// Obtener estadísticas reales de la base de datos
const getStats = async () => {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  
  // Contar artículos reales
  const totalArticles = await prisma.article.count()
  const publishedArticles = await prisma.article.count({ where: { published: true } })
  const draftArticles = await prisma.article.count({ where: { published: false } })
  
  // Contar categorías reales
  const totalCategories = await prisma.category.count()
  
  // Contar usuarios reales
  const totalUsers = await prisma.user.count()
  
  // Calcular vistas totales
  const viewsResult = await prisma.article.aggregate({
    _sum: {
      views: true
    }
  })
  const totalViews = viewsResult._sum.views || 0
  
  return {
    overview: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalReviews: 8, // Mantenemos simulado por ahora
      publishedReviews: 6,
      draftReviews: 2,
      totalTutorials: 10, // Mantenemos simulado por ahora
      publishedTutorials: 7,
      draftTutorials: 3,
      totalCategories,
      totalUsers,
      totalViews,
      monthlyViews: Math.floor(totalViews * 0.3) // Estimación del 30% del total
    },
    recentActivity: await getRecentActivity(),
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

    const stats = await getStats()

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