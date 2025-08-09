'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Download, ArrowRight } from 'lucide-react'

const PopularApps = () => {
  const [popularApps, setPopularApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (!response.ok) {
          throw new Error('Error al cargar las apps')
        }
        const data = await response.json()
        // Validar que data sea un array antes de filtrar
        if (Array.isArray(data)) {
          // Filtrar solo reviews publicadas y tomar las primeras 6
          const publishedApps = data.filter(app => app.status === 'published').slice(0, 6)
          setPopularApps(publishedApps)
        } else {
          setPopularApps([])
        }
      } catch (error) {
        console.error('Error fetching apps:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Apps Financieras Más Populares
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cargando las mejores aplicaciones financieras...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Apps Financieras Más Populares
            </h2>
            <p className="text-gray-600 mb-4">No pudimos cargar las aplicaciones en este momento.</p>
            <p className="text-gray-500">Estamos trabajando para solucionarlo. Por favor, intenta recargar la página más tarde.</p>
          </div>
        </div>
      </section>
    )
  }

  if (popularApps.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Apps Financieras Más Populares
            </h2>
            <p className="text-gray-600 mb-2">Aún no hay aplicaciones financieras disponibles.</p>
            <p className="text-gray-500">Pronto agregaremos las mejores apps para ayudarte con tus finanzas.</p>
          </div>
        </div>
      </section>
    )
  }

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
                  <h3 className="text-xl font-bold text-navy mb-2">{app.title}</h3>
                  <span className="text-sm text-text-gray">{app.category || 'App Financiera'}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriceColor(app.pricing || 'Gratis')}`}>
                  {app.pricing || 'Gratis'}
                </span>
              </div>

              <p className="text-text-gray mb-4 line-clamp-3">
                {app.excerpt || app.content?.substring(0, 150) + '...'}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(app.rating || 4.5)}
                  </div>
                  <span className="text-sm font-medium text-navy">{app.rating || 4.5}</span>
                </div>
                <div className="flex items-center text-sm text-text-gray">
                  <Download className="h-4 w-4 mr-1" />
                  {app.downloads || 'N/A'}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-navy mb-2">Características destacadas:</h4>
                <ul className="space-y-1">
                  {(app.pros || ['Excelente funcionalidad', 'Fácil de usar', 'Buena relación calidad-precio']).slice(0, 3).map((pro, index) => (
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