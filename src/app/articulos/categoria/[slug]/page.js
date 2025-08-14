'use client'

import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, Filter, Grid, List } from 'lucide-react'
import { useState, useEffect, use } from 'react'

const CategoryPage = ({ params }) => {
  const resolvedParams = use(params)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryName, setCategoryName] = useState('')

  // Definir categorías disponibles
  const categories = {
    'analisis': { name: 'Análisis', icon: '📊' },
    'reviews': { name: 'Reviews', icon: '⭐' },
    'tutoriales': { name: 'Tutoriales', icon: '📚' },
    'noticias': { name: 'Noticias', icon: '📰' },
    'consejos': { name: 'Consejos', icon: '💡' }
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/admin/articles')
        if (!response.ok) {
          throw new Error('Error al cargar los artículos')
        }
        const data = await response.json()
        
        // Filtrar artículos por categoría y solo los publicados
        const categorySlug = resolvedParams.slug
        const filteredArticles = data.filter(article => 
          article.status === 'published' && 
          article.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
        )
        
        setArticles(filteredArticles)
        
        // Establecer el nombre de la categoría
        if (filteredArticles.length > 0) {
          setCategoryName(filteredArticles[0].category)
        } else {
          // Usar el nombre de la categoría predefinida o convertir slug a nombre legible
          setCategoryName(categories[categorySlug]?.name || categorySlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [resolvedParams.slug])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
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
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link href="/articulos" className="hover:text-blue-600">Artículos</Link>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/articulos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a artículos
        </Link>

        {/* Category Header */}
        <div className="bg-light-gray rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {categoryName}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Artículos de {categoryName.toLowerCase()} sobre finanzas personales y aplicaciones financieras.
              </p>
              <div className="inline-flex items-center px-4 py-2 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
              <span className="font-medium">
                {articles.length} artículo{articles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
              <article key={article.id} className="bg-light-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                  <span className="text-white font-semibold text-lg">{categoryName}</span>
                  {article.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      Destacado
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Article Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      href={`/articulos/${article.slug}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {/* Article Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                      <User className="h-4 w-4 mr-1" />
                      <span>{formatViews(article.views)} vistas</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Leer artículo completo
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-light-gray rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Próximamente
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos trabajando en contenido increíble para esta categoría. ¡Vuelve pronto!
            </p>
            <Link
              href="/articulos"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Ver todos los artículos
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora Otras Categorías
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categories)
              .filter(([slug]) => slug !== resolvedParams.slug)
              .map(([slug, category]) => (
                <Link
                  key={slug}
                  href={`/articulos/categoria/${slug}`}
                  className="bg-light-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Explorar artículos
                  </p>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage