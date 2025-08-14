import Link from 'next/link'
import { ArrowLeft, Cookie, Eye, BarChart, Target, Settings } from 'lucide-react'

export default function PoliticaCookies() {
  const lastUpdated = "15 de enero de 2025"

  const cookieTypes = [
    {
      id: 'necesarias',
      title: 'Cookies Necesarias',
      icon: Settings,
      required: true,
      description: 'Estas cookies son esenciales para el funcionamiento básico del sitio web y no se pueden desactivar.',
      examples: [
        'Cookies de sesión para mantener tu navegación',
        'Cookies de seguridad para proteger contra ataques',
        'Cookies de preferencias básicas del sitio'
      ],
      duration: 'Sesión o hasta 1 año',
      color: 'bg-gray-50 border-gray-200'
    },
    {
      id: 'analiticas',
      title: 'Cookies de Análisis',
      icon: BarChart,
      required: false,
      description: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información de forma anónima.',
      examples: [
        'Google Analytics para medir el tráfico del sitio',
        'Cookies para entender qué páginas son más populares',
        'Información sobre el tiempo de permanencia en el sitio'
      ],
      duration: 'Hasta 2 años',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'marketing',
      title: 'Cookies de Marketing',
      icon: Target,
      required: false,
      description: 'Se utilizan para rastrear a los visitantes en los sitios web con la intención de mostrar anuncios relevantes y atractivos.',
      examples: [
        'Cookies de redes sociales para compartir contenido',
        'Cookies de publicidad personalizada',
        'Seguimiento de conversiones de campañas'
      ],
      duration: 'Hasta 1 año',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'funcionales',
      title: 'Cookies Funcionales',
      icon: Eye,
      required: false,
      description: 'Permiten que el sitio web proporcione funcionalidad y personalización mejoradas, como recordar tus preferencias.',
      examples: [
        'Preferencias de idioma y región',
        'Configuraciones de accesibilidad',
        'Contenido personalizado basado en tu actividad'
      ],
      duration: 'Hasta 1 año',
      color: 'bg-green-50 border-green-200'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <span className="text-gray-900">Política de Cookies</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Cookie className="h-12 w-12 text-orange-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-navy">
                Política de Cookies
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              En AppFinanzasHoy utilizamos cookies para mejorar tu experiencia de navegación, 
              analizar el tráfico del sitio y personalizar el contenido. Aquí te explicamos 
              qué cookies utilizamos y cómo puedes controlarlas.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800">
              <span className="font-medium">Última actualización: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* What are cookies */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            ¿Qué son las Cookies?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
              (ordenador, tablet o móvil) cuando visitas un sitio web. Estas cookies permiten 
              que el sitio web "recuerde" tus acciones y preferencias durante un período de tiempo.
            </p>
            <p className="text-lg leading-relaxed">
              Las cookies no contienen información personal identificable y no pueden dañar 
              tu dispositivo. Son una herramienta estándar utilizada por la mayoría de sitios 
              web para mejorar la experiencia del usuario.
            </p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
            Tipos de Cookies que Utilizamos
          </h2>
          
          {cookieTypes.map((cookieType, index) => {
            const Icon = cookieType.icon
            return (
              <div key={cookieType.id} className={`border-2 rounded-xl p-6 ${cookieType.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {cookieType.title}
                      </h3>
                      {cookieType.required && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Obligatorias
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {cookieType.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ejemplos de uso:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cookieType.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Duración:</h4>
                    <p className="text-sm text-gray-600">{cookieType.duration}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* How to control cookies */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            Cómo Controlar las Cookies
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                A través de nuestro Banner de Cookies
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cuando visitas nuestro sitio por primera vez, aparece un banner que te permite 
                aceptar todas las cookies, rechazar las opcionales, o configurar tus preferencias 
                de forma detallada.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                A través de tu Navegador
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos los navegadores modernos te permiten controlar las cookies. Puedes:
              </p>
              <ul className="text-gray-700 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Bloquear todas las cookies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Permitir solo cookies de sitios de confianza
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Eliminar cookies existentes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Configurar notificaciones cuando se instalen cookies
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Si deshabilitas las cookies necesarias, 
                algunas funcionalidades del sitio web pueden no funcionar correctamente.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Tienes Preguntas sobre las Cookies?
            </h2>
            <p className="text-xl mb-6 text-orange-100">
              Si tienes alguna pregunta sobre nuestra política de cookies o necesitas 
              más información, no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/privacidad"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Ver Política de Privacidad
              </Link>
              <Link
                href="/"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-100 rounded-xl p-6 mt-8">
          <p className="text-sm text-gray-600 text-center">
            <strong>Aviso Legal:</strong> Esta Política de Cookies puede ser actualizada 
            periódicamente para reflejar cambios en nuestras prácticas o por razones 
            operativas, legales o reglamentarias. Te recomendamos revisar esta página 
            regularmente para mantenerte informado.
          </p>
        </div>
      </div>
    </div>
  )
}