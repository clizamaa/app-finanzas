import Link from 'next/link'
import { Star, Download, ArrowRight } from 'lucide-react'

const PopularApps = () => {
  // Datos de ejemplo - en producción vendrían de la base de datos
  const popularApps = [
    {
      id: 1,
      name: 'YNAB (You Need A Budget)',
      description: 'La aplicación de presupuesto más completa para tomar control total de tus finanzas.',
      rating: 4.8,
      downloads: '1M+',
      category: 'Presupuesto',
      price: 'Freemium',
      pros: ['Metodología probada', 'Excelente soporte', 'Sincronización en tiempo real'],
      slug: 'ynab-review'
    },
    {
      id: 2,
      name: 'Mint',
      description: 'Gestión financiera gratuita con seguimiento automático de gastos y presupuestos.',
      rating: 4.6,
      downloads: '5M+',
      category: 'Gestión Integral',
      price: 'Gratis',
      pros: ['Completamente gratis', 'Categorización automática', 'Alertas inteligentes'],
      slug: 'mint-review'
    },
    {
      id: 3,
      name: 'PocketGuard',
      description: 'Evita gastos excesivos con esta app que te muestra cuánto puedes gastar.',
      rating: 4.5,
      downloads: '2M+',
      category: 'Control de Gastos',
      price: 'Freemium',
      pros: ['Interfaz simple', 'Prevención de sobregiros', 'Análisis de gastos'],
      slug: 'pocketguard-review'
    },
    {
      id: 4,
      name: 'Personal Capital',
      description: 'Herramienta avanzada para seguimiento de patrimonio neto e inversiones.',
      rating: 4.7,
      downloads: '3M+',
      category: 'Inversiones',
      price: 'Gratis',
      pros: ['Seguimiento de inversiones', 'Análisis de patrimonio', 'Asesoría gratuita'],
      slug: 'personal-capital-review'
    },
    {
      id: 5,
      name: 'Goodbudget',
      description: 'Sistema de sobres digitales para presupuestar de manera tradicional pero moderna.',
      rating: 4.4,
      downloads: '500K+',
      category: 'Presupuesto',
      price: 'Freemium',
      pros: ['Método de sobres', 'Sincronización familiar', 'Sin conexión bancaria'],
      slug: 'goodbudget-review'
    },
    {
      id: 6,
      name: 'Acorns',
      description: 'Invierte automáticamente el cambio de tus compras para construir riqueza.',
      rating: 4.3,
      downloads: '8M+',
      category: 'Inversiones',
      price: 'Suscripción',
      pros: ['Inversión automática', 'Micro-inversiones', 'Educación financiera'],
      slug: 'acorns-review'
    }
  ]

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-orange text-orange" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-orange text-orange opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      )
    }

    return stars
  }

  const getPriceColor = (price) => {
    switch (price) {
      case 'Gratis':
        return 'bg-green-100 text-green-800'
      case 'Freemium':
        return 'bg-emerald/20 text-emerald'
      case 'Suscripción':
        return 'bg-orange/20 text-orange'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Apps Más Populares
          </h2>
          <p className="text-xl text-text-gray max-w-3xl mx-auto">
            Descubre las aplicaciones de finanzas personales mejor valoradas por nuestra comunidad, 
            con análisis detallados y comparativas honestas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularApps.map((app) => (
            <div key={app.id} className="bg-light-gray rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-navy mb-2">{app.name}</h3>
                  <span className="text-sm text-text-gray">{app.category}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriceColor(app.price)}`}>
                  {app.price}
                </span>
              </div>

              <p className="text-text-gray mb-4 line-clamp-3">
                {app.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(app.rating)}
                  </div>
                  <span className="text-sm font-medium text-navy">{app.rating}</span>
                </div>
                <div className="flex items-center text-sm text-text-gray">
                  <Download className="h-4 w-4 mr-1" />
                  {app.downloads}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-navy mb-2">Características destacadas:</h4>
                <ul className="space-y-1">
                  {app.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="text-sm text-text-gray flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald rounded-full mr-2"></span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/reviews/${app.slug}`}
                className="w-full bg-emerald text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
              >
                Ver Review Completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/reviews"
            className="bg-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
          >
            Ver Todas las Reviews
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PopularApps