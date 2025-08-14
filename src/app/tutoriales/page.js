import TutorialesClient from '../../components/TutorialesClient'

export const metadata = {
  title: 'Tutoriales de Finanzas Personales - Guías Paso a Paso',
  description: 'Aprende a manejar tu dinero con nuestros tutoriales completos. Desde presupuesto básico hasta inversiones avanzadas.',
  keywords: 'tutoriales finanzas, guías dinero, aprender finanzas, educación financiera, presupuesto tutorial',
  openGraph: {
    title: 'Tutoriales de Finanzas Personales - AppFinanzasHoy',
    description: 'Guías completas para mejorar tus finanzas personales',
    type: 'website',
  },
}

const TutorialesPage = () => {
  // Datos de ejemplo - en producción vendrían de la base de datos
  const tutorials = [
    {
      id: 1,
      title: 'Cómo Crear tu Primer Presupuesto Personal',
      description: 'Aprende a crear un presupuesto efectivo desde cero con nuestra guía paso a paso.',
      difficulty: 'Principiante',
      duration: '15 min',
      students: 2340,
      rating: 4.8,
      category: 'Presupuesto',
      image: '/images/tutorials/presupuesto-basico.jpg',
      slug: 'crear-primer-presupuesto-personal',
      featured: true,
      steps: 6,
      tools: ['Excel', 'Calculadora', 'Apps de presupuesto'],
      whatYoullLearn: [
        'Identificar tus ingresos y gastos',
        'Categorizar gastos correctamente',
        'Establecer metas financieras realistas',
        'Usar herramientas de seguimiento'
      ],
      publishedAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Construye tu Fondo de Emergencia en 6 Meses',
      description: 'Estrategia probada para crear un colchón financiero que te proteja de imprevistos.',
      difficulty: 'Principiante',
      duration: '20 min',
      students: 1890,
      rating: 4.9,
      category: 'Ahorro',
      image: '/images/tutorials/fondo-emergencia.jpg',
      slug: 'construir-fondo-emergencia-6-meses',
      featured: true,
      steps: 8,
      tools: ['Cuenta de ahorros', 'Apps de ahorro automático'],
      whatYoullLearn: [
        'Calcular el tamaño ideal de tu fondo',
        'Estrategias de ahorro automático',
        'Dónde guardar tu fondo de emergencia',
        'Cuándo y cómo usar el fondo'
      ],
      publishedAt: '2024-01-12'
    },
    {
      id: 3,
      title: 'Inversión para Principiantes: Tu Primera Cartera',
      description: 'Guía completa para comenzar a invertir de forma inteligente y diversificada.',
      difficulty: 'Intermedio',
      duration: '35 min',
      students: 1567,
      rating: 4.7,
      category: 'Inversión',
      image: '/images/tutorials/inversion-principiantes.jpg',
      slug: 'inversion-principiantes-primera-cartera',
      featured: false,
      steps: 12,
      tools: ['Broker online', 'Apps de inversión', 'Calculadora de riesgo'],
      whatYoullLearn: [
        'Conceptos básicos de inversión',
        'Cómo evaluar tu tolerancia al riesgo',
        'Diversificación de cartera',
        'Elegir tu primer broker'
      ],
      publishedAt: '2024-01-10'
    },
    {
      id: 4,
      title: 'Elimina tus Deudas con el Método Avalancha',
      description: 'Aprende la estrategia más efectiva para liberarte de deudas de forma sistemática.',
      difficulty: 'Intermedio',
      duration: '25 min',
      students: 2156,
      rating: 4.6,
      category: 'Deudas',
      image: '/images/tutorials/eliminar-deudas.jpg',
      slug: 'eliminar-deudas-metodo-avalancha',
      featured: true,
      steps: 10,
      tools: ['Calculadora de deudas', 'Hoja de cálculo', 'Apps de seguimiento'],
      whatYoullLearn: [
        'Diferencia entre método avalancha y bola de nieve',
        'Priorizar deudas por tasa de interés',
        'Crear un plan de pagos acelerados',
        'Mantener la motivación durante el proceso'
      ],
      publishedAt: '2024-01-08'
    },
    {
      id: 5,
      title: 'Planificación de Jubilación: Nunca es Tarde',
      description: 'Estrategias para asegurar tu futuro financiero sin importar tu edad actual.',
      difficulty: 'Avanzado',
      duration: '45 min',
      students: 987,
      rating: 4.8,
      category: 'Jubilación',
      image: '/images/tutorials/planificacion-jubilacion.jpg',
      slug: 'planificacion-jubilacion-nunca-tarde',
      featured: false,
      steps: 15,
      tools: ['Calculadora de jubilación', 'Cuentas de retiro', 'Asesor financiero'],
      whatYoullLearn: [
        'Calcular cuánto necesitas para jubilarte',
        'Opciones de cuentas de retiro',
        'Estrategias de inversión a largo plazo',
        'Planificación fiscal en la jubilación'
      ],
      publishedAt: '2024-01-05'
    },
    {
      id: 6,
      title: 'Cómo Negociar un Mejor Salario',
      description: 'Técnicas probadas para aumentar tus ingresos a través de negociación efectiva.',
      difficulty: 'Intermedio',
      duration: '30 min',
      students: 1432,
      rating: 4.5,
      category: 'Ingresos',
      image: '/images/tutorials/negociar-salario.jpg',
      slug: 'como-negociar-mejor-salario',
      featured: false,
      steps: 9,
      tools: ['Investigación salarial', 'Documentos de logros', 'Scripts de negociación'],
      whatYoullLearn: [
        'Investigar salarios del mercado',
        'Documentar tus logros y valor',
        'Timing perfecto para negociar',
        'Técnicas de negociación efectivas'
      ],
      publishedAt: '2024-01-03'
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      <TutorialesClient tutorials={tutorials} />
    </div>
  )
}

export default TutorialesPage