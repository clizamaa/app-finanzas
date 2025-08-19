'use client'

import Link from 'next/link'
import { Calendar, Clock, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

const RelatedArticles = ({ currentArticleId, category }) => {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await fetch(`/api/articles?category=${category}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          
          // Los artículos ya vienen filtrados por publicados desde el API
          const articles = data.articles || []
          
          // Filtrar excluyendo el artículo actual
          const filtered = articles
            .filter(article => article.id !== currentArticleId)
            .slice(0, 3) // Máximo 3 artículos relacionados
          
          setRelatedArticles(filtered)
        }
      } catch (error) {
        console.error('Error fetching related articles:', error)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRelatedArticles()
    }
  }, [currentArticleId, category])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  if (loading) {
    return (
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Artículos Relacionados
          </h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <section className="bg-light-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-emerald mr-3" />
            <h2 className="text-3xl font-bold text-navy">
              Artículos Relacionados
            </h2>
          </div>
          <p className="text-xl text-text-gray max-w-3xl mx-auto">
            Continúa aprendiendo con estos artículos que podrían interesarte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedArticles.map((article) => (
            <article key={article.id} className="bg-light-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-navy to-emerald flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{article.category.name}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <Link
                    href={`/articulos/categoria/${article.category.slug}`}
                    className="inline-block bg-emerald/20 text-emerald px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald/30 transition-colors duration-200"
                  >
                    {article.category.name}
                  </Link>
                </div>

                {/* Article Title */}
                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="hover:text-emerald transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h3>

                {/* Article Excerpt */}
                <p className="text-text-gray mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-text-gray">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{formatViews(article.views)} vistas</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="mt-4">
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Leer artículo
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center mt-12">
          <Link
            href="/articulos"
            className="inline-flex items-center bg-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Ver todos los artículos
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles