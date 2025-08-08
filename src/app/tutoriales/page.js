import Link from 'next/link'
import { BookOpen, Clock, Users, TrendingUp, CheckCircle, Play, Star } from 'lucide-react'

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

  const categories = ['Todos', 'Presupuesto', 'Ahorro', 'Inversión', 'Deudas', 'Jubilación', 'Ingresos']
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Principiante': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured)
  const regularTutorials = tutorials.filter(tutorial => !tutorial.featured)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tutoriales de Finanzas Personales
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              Aprende a manejar tu dinero con nuestras guías paso a paso, desde conceptos básicos hasta estrategias avanzadas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{tutorials.length}</div>
                <div className="text-green-100">Tutoriales</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{tutorials.reduce((sum, t) => sum + t.students, 0).toLocaleString()}</div>
                <div className="text-green-100">Estudiantes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">4.7★</div>
                <div className="text-green-100">Rating Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Learning Path */}
        <div className="bg-gray-100 rounded-lg shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tu Ruta de Aprendizaje Recomendada
            </h2>
            <p className="text-xl text-gray-600">
              Sigue este orden para construir una base sólida en finanzas personales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fundamentos</h3>
              <p className="text-gray-600">Presupuesto y control de gastos</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Protección</h3>
              <p className="text-gray-600">Fondo de emergencia y manejo de deudas</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Crecimiento</h3>
              <p className="text-gray-600">Inversión y planificación a largo plazo</p>
            </div>
          </div>
        </div>

        {/* Featured Tutorials */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Tutoriales Destacados
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-green-200">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold">
                  ⭐ Tutorial Destacado
                </div>
                
                {/* Tutorial Image */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">{tutorial.category}</span>
                </div>

                <div className="p-6">
                  {/* Tutorial Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 mb-3">{tutorial.description}</p>
                    </div>
                  </div>

                  {/* Tutorial Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{tutorial.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{tutorial.steps} pasos</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {renderStars(tutorial.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{tutorial.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({tutorial.students} estudiantes)</span>
                  </div>

                  {/* What You'll Learn */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Lo que aprenderás:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tutorial.whatYoullLearn.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/tutoriales/${tutorial.slug}`}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium text-center inline-flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Comenzar tutorial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Tutorials */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Todos los Tutoriales
            </h2>
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Todas las categorías</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Todos los niveles</option>
                {difficulties.slice(1).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Tutorial Image */}
                <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-semibold">{tutorial.category}</span>
                </div>

                <div className="p-6">
                  {/* Tutorial Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      href={`/tutoriales/${tutorial.slug}`}
                      className="hover:text-green-600 transition-colors duration-200"
                    >
                      {tutorial.title}
                    </Link>
                  </h3>

                  {/* Tutorial Meta */}
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{tutorial.steps}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(tutorial.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{tutorial.rating} ({tutorial.students})</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tutorial.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={`/tutoriales/${tutorial.slug}`}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium text-center inline-flex items-center justify-center text-sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Comenzar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 mt-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-xl text-green-100 mb-6">
            Nuestro equipo está aquí para ayudarte en tu journey financiero
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center bg-gray-100 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Contáctanos
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TutorialesPage