'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const FeaturedArticles = () => {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/admin/articles')
        if (!response.ok) {
          throw new Error('Error al cargar los artículos')
        }
        const data = await response.json()
        // Validar que data sea un array antes de filtrar
        const articles = Array.isArray(data) ? data : (data.articles || [])
        // Filtrar solo artículos publicados y destacados, tomar los primeros 3
        const publishedArticles = articles.filter(article => 
          article.published === true && article.featured === true
        ).slice(0, 3)
        setFeaturedArticles(publishedArticles)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) {
    return (
      <section className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Artículos Destacados
            </h2>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Cargando los mejores artículos...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
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
      <section className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Artículos Destacados
            </h2>
            <p className="text-text-gray mb-4">No pudimos cargar los artículos en este momento.</p>
            <p className="text-gray-500">Estamos trabajando para solucionarlo. Por favor, intenta recargar la página más tarde.</p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredArticles.length === 0) {
    return (
      <section className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Artículos Destacados
            </h2>
            <p className="text-text-gray mb-2">Aún no hay artículos destacados disponibles.</p>
            <p className="text-gray-500">Pronto publicaremos contenido valioso sobre finanzas personales.</p>
          </div>
        </div>
      </section>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="bg-light-gray py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Artículos Destacados
          </h2>
          <p className="text-xl text-text-gray max-w-3xl mx-auto">
            Mantente al día con las últimas tendencias en finanzas personales y 
            descubre las mejores herramientas para gestionar tu dinero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-navy to-emerald flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{article.category?.name || 'Artículo'}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-light-gray text-navy px-3 py-1 rounded-full text-sm font-medium">
                    {article.category?.name || 'Artículo'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  <Link 
                    href={`/articulos/${article.slug}`}
                    className="hover:text-emerald transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-text-gray mb-4 line-clamp-3">
                  {article.excerpt || article.content?.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-gray mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime || '5 min'}
                    </div>
                  </div>
                </div>
                
                <Link
                  href={`/articulos/${article.slug}`}
                  className="inline-flex items-center text-emerald font-medium hover:text-green-600 transition-colors duration-200"
                >
                  Leer más
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/articulos"
            className="bg-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
          >
            Ver Todos los Artículos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedArticles