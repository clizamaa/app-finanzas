import { NextResponse } from 'next/server'

// Simulación de base de datos en memoria (compartida con route.js principal)
let tutorials = [
  {
    id: 1,
    title: 'Cómo configurar tu primer presupuesto en Excel',
    category: 'Presupuesto',
    difficulty: 'Principiante',
    duration: '30 minutos',
    description: 'Aprende a crear un presupuesto personal efectivo usando Microsoft Excel.',
    objectives: [
      'Crear una plantilla de presupuesto básica',
      'Configurar fórmulas automáticas',
      'Establecer categorías de gastos',
      'Crear gráficos de seguimiento'
    ],
    tools: [
      'Microsoft Excel',
      'Calculadora',
      'Estados de cuenta bancarios'
    ],
    introduction: 'Un presupuesto bien estructurado es la base de una buena salud financiera. En este tutorial aprenderás a crear tu propio sistema de presupuesto usando Excel.',
    steps: [
      {
        title: 'Configuración inicial',
        content: 'Abre Excel y crea un nuevo libro de trabajo. Nombra la primera hoja como "Presupuesto Mensual".',
        tips: ['Guarda el archivo con un nombre descriptivo', 'Usa una carpeta específica para tus finanzas']
      },
      {
        title: 'Crear las categorías de ingresos',
        content: 'En la columna A, lista todas tus fuentes de ingresos: salario, freelance, inversiones, etc.',
        tips: ['Sé específico con cada fuente de ingreso', 'Incluye ingresos variables estimados']
      },
      {
        title: 'Configurar categorías de gastos',
        content: 'Crea secciones para gastos fijos, variables y ahorros. Incluye subcategorías detalladas.',
        tips: ['Revisa tus estados de cuenta para no olvidar gastos', 'Agrupa gastos similares']
      },
      {
        title: 'Añadir fórmulas automáticas',
        content: 'Usa funciones SUMA para calcular totales automáticamente. Crea una fórmula para el balance final.',
        tips: ['Usa referencias absolutas cuando sea necesario', 'Verifica que las fórmulas funcionen correctamente']
      },
      {
        title: 'Crear gráficos de seguimiento',
        content: 'Inserta gráficos circulares para visualizar la distribución de gastos y gráficos de barras para comparar meses.',
        tips: ['Mantén los gráficos simples y claros', 'Actualiza los gráficos mensualmente']
      }
    ],
    conclusion: 'Con este presupuesto en Excel tendrás una herramienta poderosa para controlar tus finanzas. Recuerda actualizarlo regularmente y revisar tus metas financieras.',
    tags: ['excel', 'presupuesto', 'finanzas-personales', 'principiantes'],
    slug: 'configurar-primer-presupuesto-excel',
    featured: true,
    status: 'published',
    views: 3250,
    author: 'Admin',
    publishedAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    createdAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 2,
    title: 'Guía completa para invertir en ETFs',
    category: 'Inversiones',
    difficulty: 'Intermedio',
    duration: '45 minutos',
    description: 'Tutorial paso a paso para comenzar a invertir en ETFs de manera inteligente.',
    objectives: [
      'Entender qué son los ETFs',
      'Aprender a evaluar ETFs',
      'Configurar una cuenta de inversión',
      'Realizar tu primera compra de ETF'
    ],
    tools: [
      'Broker online',
      'Calculadora de inversiones',
      'Plataforma de análisis financiero'
    ],
    introduction: 'Los ETFs (Exchange Traded Funds) son una excelente manera de diversificar tu portafolio de inversiones. Este tutorial te guiará desde los conceptos básicos hasta realizar tu primera inversión.',
    steps: [
      {
        title: 'Conceptos básicos de ETFs',
        content: 'Un ETF es un fondo que cotiza en bolsa y replica el comportamiento de un índice, sector o commodity.',
        tips: ['Los ETFs ofrecen diversificación instantánea', 'Tienen comisiones más bajas que los fondos mutuos']
      },
      {
        title: 'Tipos de ETFs disponibles',
        content: 'Existen ETFs de índices, sectoriales, de commodities, de bonos y temáticos. Cada uno tiene características específicas.',
        tips: ['Comienza con ETFs de índices amplios', 'Evita ETFs muy especializados al principio']
      },
      {
        title: 'Cómo evaluar un ETF',
        content: 'Revisa el expense ratio, el volumen de trading, el tracking error y los activos bajo gestión.',
        tips: ['Busca expense ratios menores al 0.5%', 'Prefiere ETFs con alto volumen de trading']
      },
      {
        title: 'Abrir cuenta de inversión',
        content: 'Elige un broker confiable, completa el proceso de registro y verifica tu identidad.',
        tips: ['Compara comisiones entre brokers', 'Verifica que esté regulado por autoridades financieras']
      },
      {
        title: 'Realizar tu primera compra',
        content: 'Deposita fondos, busca el ETF deseado, revisa el precio y ejecuta la orden de compra.',
        tips: ['Comienza con montos pequeños', 'Usa órdenes limit para controlar el precio']
      }
    ],
    conclusion: 'Invertir en ETFs es una estrategia sólida para construir riqueza a largo plazo. Mantén una estrategia disciplinada y revisa tu portafolio periódicamente.',
    tags: ['etfs', 'inversiones', 'bolsa', 'portafolio'],
    slug: 'guia-completa-invertir-etfs',
    featured: false,
    status: 'published',
    views: 2890,
    author: 'Admin',
    publishedAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    title: 'Estrategias de ahorro automático',
    category: 'Ahorro',
    difficulty: 'Principiante',
    duration: '25 minutos',
    description: 'Configura sistemas automáticos para ahorrar sin esfuerzo.',
    objectives: [
      'Configurar transferencias automáticas',
      'Establecer metas de ahorro',
      'Usar aplicaciones de redondeo',
      'Crear un fondo de emergencia'
    ],
    tools: [
      'Aplicación bancaria',
      'Apps de ahorro',
      'Calculadora de metas'
    ],
    introduction: 'El ahorro automático es la clave para construir riqueza sin depender de la disciplina diaria. Aprende a configurar sistemas que ahorren por ti.',
    steps: [
      {
        title: 'Analizar tus ingresos y gastos',
        content: 'Revisa tus últimos 3 meses de movimientos bancarios para identificar patrones de gasto.',
        tips: ['Categoriza todos tus gastos', 'Identifica gastos innecesarios']
      },
      {
        title: 'Configurar transferencia automática',
        content: 'Programa una transferencia automática desde tu cuenta corriente a una cuenta de ahorros el día que recibes tu salario.',
        tips: ['Comienza con un 10% de tus ingresos', 'Programa la transferencia para el día de pago']
      },
      {
        title: 'Usar aplicaciones de redondeo',
        content: 'Instala apps que redondeen tus compras y ahorren la diferencia automáticamente.',
        tips: ['Conecta la app con tu tarjeta principal', 'Revisa los ahorros acumulados mensualmente']
      },
      {
        title: 'Establecer metas específicas',
        content: 'Define metas claras: fondo de emergencia, vacaciones, enganche de casa, etc.',
        tips: ['Haz las metas específicas y medibles', 'Asigna fechas límite realistas']
      }
    ],
    conclusion: 'Con estos sistemas automáticos, ahorrar se vuelve un hábito inconsciente. Revisa y ajusta tus estrategias cada trimestre.',
    tags: ['ahorro', 'automatización', 'metas-financieras', 'apps'],
    slug: 'estrategias-ahorro-automatico',
    featured: true,
    status: 'draft',
    views: 0,
    author: 'Admin',
    publishedAt: null,
    updatedAt: '2024-01-18T16:45:00Z',
    createdAt: '2024-01-18T16:45:00Z'
  }
]

// GET - Obtener tutorial por ID
export async function GET(request, { params }) {
  try {
    const paramsData = await params
    const id = parseInt(paramsData.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de tutorial no válido' },
        { status: 400 }
      )
    }

    const tutorial = tutorials.find(t => t.id === id)
    
    if (!tutorial) {
      return NextResponse.json(
        { error: 'Tutorial no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar vistas si el tutorial está publicado
    if (tutorial.status === 'published') {
      tutorial.views += 1
    }

    return NextResponse.json(tutorial)
  } catch (error) {
    console.error('Error al obtener tutorial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar tutorial por ID
export async function PUT(request, { params }) {
  try {
    const paramsData = await params
    const id = parseInt(paramsData.id)
    const body = await request.json()
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de tutorial no válido' },
        { status: 400 }
      )
    }

    const tutorialIndex = tutorials.findIndex(t => t.id === id)
    
    if (tutorialIndex === -1) {
      return NextResponse.json(
        { error: 'Tutorial no encontrado' },
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

    if (body.category !== undefined && !body.category.trim()) {
      return NextResponse.json(
        { error: 'La categoría no puede estar vacía' },
        { status: 400 }
      )
    }

    // Validar dificultad si se proporciona
    if (body.difficulty !== undefined) {
      const validDifficulties = ['Principiante', 'Intermedio', 'Avanzado']
      if (!validDifficulties.includes(body.difficulty)) {
        return NextResponse.json(
          { error: 'La dificultad debe ser: Principiante, Intermedio o Avanzado' },
          { status: 400 }
        )
      }
    }

    // Verificar que el slug sea único (si se está actualizando)
    if (body.slug && body.slug !== tutorials[tutorialIndex].slug) {
      const existingTutorial = tutorials.find(tutorial => tutorial.slug === body.slug && tutorial.id !== id)
      if (existingTutorial) {
        return NextResponse.json(
          { error: 'Ya existe un tutorial con ese slug' },
          { status: 400 }
        )
      }
    }

    const currentTutorial = tutorials[tutorialIndex]
    const wasPublished = currentTutorial.status === 'published'
    const willBePublished = body.status === 'published'

    // Actualizar tutorial
    const updatedTutorial = {
      ...currentTutorial,
      ...body,
      id: currentTutorial.id, // Mantener ID original
      createdAt: currentTutorial.createdAt, // Mantener fecha de creación
      updatedAt: new Date().toISOString(),
      // Actualizar publishedAt solo si se está publicando por primera vez
      publishedAt: willBePublished && !wasPublished ? new Date().toISOString() : 
                   willBePublished ? currentTutorial.publishedAt : null
    }

    tutorials[tutorialIndex] = updatedTutorial

    return NextResponse.json(updatedTutorial)
  } catch (error) {
    console.error('Error al actualizar tutorial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar tutorial por ID
export async function DELETE(request, { params }) {
  try {
    const paramsData = await params
    const id = parseInt(paramsData.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de tutorial no válido' },
        { status: 400 }
      )
    }

    const tutorialIndex = tutorials.findIndex(t => t.id === id)
    
    if (tutorialIndex === -1) {
      return NextResponse.json(
        { error: 'Tutorial no encontrado' },
        { status: 404 }
      )
    }

    const deletedTutorial = tutorials[tutorialIndex]
    tutorials.splice(tutorialIndex, 1)

    return NextResponse.json({
      message: 'Tutorial eliminado correctamente',
      deletedTutorial
    })
  } catch (error) {
    console.error('Error al eliminar tutorial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}