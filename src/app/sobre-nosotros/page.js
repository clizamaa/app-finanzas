import Link from 'next/link'
import { ArrowLeft, Users, Target, Eye, Heart, Award, Globe } from 'lucide-react'

export default function SobreNosotros() {
  const teamValues = [
    {
      icon: Target,
      title: 'Nuestra Misión',
      description: 'Democratizar el acceso a información financiera de calidad, ayudando a las personas a tomar decisiones inteligentes sobre sus finanzas personales a través de reviews honestas y contenido educativo.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Eye,
      title: 'Nuestra Visión',
      description: 'Ser la plataforma de referencia en español para reviews y educación sobre aplicaciones financieras, creando una comunidad informada y empoderada financieramente.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Heart,
      title: 'Nuestros Valores',
      description: 'Transparencia, honestidad e independencia en cada review. Priorizamos el beneficio de nuestros usuarios por encima de cualquier interés comercial.',
      color: 'bg-orange-50 text-orange-600'
    }
  ]

  const stats = [
    { number: '50+', label: 'Apps Analizadas', description: 'Reviews detalladas de las mejores aplicaciones financieras' },
    { number: '100+', label: 'Artículos Publicados', description: 'Contenido educativo y guías prácticas' },
    { number: '10K+', label: 'Usuarios Activos', description: 'Comunidad creciente de usuarios informados' },
    { number: '4.8', label: 'Rating de Confianza', description: 'Valoración promedio de nuestros usuarios' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <span className="text-gray-900">Sobre Nosotros</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy to-blue-800 rounded-2xl text-white p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 text-emerald mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Sobre AppFinanzasHoy
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Somos tu guía confiable en el mundo de las finanzas personales digitales. 
              Desde 2024, ayudamos a miles de personas a encontrar las mejores aplicaciones 
              financieras a través de reviews honestas, tutoriales prácticos y análisis detallados.
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald text-white font-semibold">
              <Award className="h-5 w-5 mr-2" />
              Plataforma de confianza desde 2024
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Quiénes Somos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un equipo apasionado por democratizar el acceso a información financiera de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamValues.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 ${value.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-4 text-center">{value.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Nuestro Impacto
            </h2>
            <p className="text-xl text-gray-600">
              Cifras que reflejan nuestro compromiso con la comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-navy mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-light-gray rounded-2xl p-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8 text-center">
              Nuestra Historia
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                AppFinanzasHoy nació de una necesidad real: la falta de información confiable 
                y en español sobre aplicaciones financieras. En un mundo donde las fintech 
                proliferan día a día, encontrar la app correcta para gestionar tu dinero 
                se había vuelto una tarea abrumadora.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Nuestro equipo, formado por expertos en finanzas personales y tecnología, 
                decidió crear una plataforma donde la transparencia y la honestidad fueran 
                los pilares fundamentales. Cada review que publicamos pasa por un riguroso 
                proceso de análisis, donde probamos personalmente cada aplicación.
              </p>
              <p className="text-lg leading-relaxed">
                Hoy, somos la comunidad de referencia para miles de personas que buscan 
                mejorar su salud financiera a través de la tecnología. Nuestro compromiso 
                es seguir creciendo junto a nuestra audiencia, siempre manteniendo la 
                independencia y calidad que nos caracteriza.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-emerald to-green-600 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Estamos aquí para ayudarte en tu journey financiero
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articulos"
              className="bg-white text-emerald px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Explorar Contenido
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald transition-colors duration-200"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}