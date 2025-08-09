import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria
let categories = [
  {
    id: 1,
    name: 'Presupuesto',
    slug: 'presupuesto',
    description: 'Artículos sobre planificación y gestión de presupuestos personales y familiares',
    color: '#3B82F6',
    icon: 'Calculator',
    articleCount: 5,
    featured: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Inversiones',
    slug: 'inversiones',
    description: 'Guías y consejos sobre diferentes tipos de inversiones y estrategias',
    color: '#10B981',
    icon: 'TrendingUp',
    articleCount: 8,
    featured: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 3,
    name: 'Ahorro',
    slug: 'ahorro',
    description: 'Técnicas y estrategias para ahorrar dinero de manera efectiva',
    color: '#F59E0B',
    icon: 'PiggyBank',
    articleCount: 6,
    featured: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 4,
    name: 'Criptomonedas',
    slug: 'criptomonedas',
    description: 'Todo sobre el mundo de las criptomonedas y blockchain',
    color: '#8B5CF6',
    icon: 'Bitcoin',
    articleCount: 3,
    featured: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 5,
    name: 'Educación Financiera',
    slug: 'educacion-financiera',
    description: 'Conceptos básicos y avanzados de educación financiera',
    color: '#EF4444',
    icon: 'GraduationCap',
    articleCount: 4,
    featured: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  }
]

let nextId = 6

// GET - Obtener todas las categorías
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let filteredCategories = [...categories]

    // Filtrar por destacadas
    if (featured === 'true') {
      filteredCategories = filteredCategories.filter(category => category.featured)
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCategories = filteredCategories.filter(category => 
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar
    filteredCategories.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })

    return NextResponse.json({
      categories: filteredCategories,
      total: filteredCategories.length
    })
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva categoría
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validaciones básicas
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el nombre sea único
    const existingByName = categories.find(category => 
      category.name.toLowerCase() === body.name.toLowerCase()
    )
    if (existingByName) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const existingBySlug = categories.find(category => category.slug === body.slug)
    if (existingBySlug) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      )
    }

    // Validar color (formato hexadecimal)
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      return NextResponse.json(
        { error: 'El color debe estar en formato hexadecimal (#RRGGBB)' },
        { status: 400 }
      )
    }

    const newCategory = {
      id: nextId++,
      name: body.name.trim(),
      slug: body.slug.toLowerCase().trim(),
      description: body.description?.trim() || '',
      color: body.color || '#6B7280',
      icon: body.icon || 'Folder',
      articleCount: 0,
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    categories.push(newCategory)

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar múltiples categorías (para operaciones en lote)
export async function PUT(request) {
  try {
    const body = await request.json()
    const { action, categoryIds } = body

    if (!action || !categoryIds || !Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: 'Acción y IDs de categorías son requeridos' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    switch (action) {
      case 'feature':
        categories = categories.map(category => {
          if (categoryIds.includes(category.id)) {
            updatedCount++
            return {
              ...category,
              featured: true,
              updatedAt: new Date().toISOString()
            }
          }
          return category
        })
        break

      case 'unfeature':
        categories = categories.map(category => {
          if (categoryIds.includes(category.id)) {
            updatedCount++
            return {
              ...category,
              featured: false,
              updatedAt: new Date().toISOString()
            }
          }
          return category
        })
        break

      case 'delete':
        const initialLength = categories.length
        categories = categories.filter(category => !categoryIds.includes(category.id))
        updatedCount = initialLength - categories.length
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `${updatedCount} categoría(s) ${action === 'delete' ? 'eliminada(s)' : 'actualizada(s)'} correctamente`,
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