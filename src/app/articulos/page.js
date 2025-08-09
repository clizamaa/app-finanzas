'use client'

import Link from 'next/link'
import { Calendar, Clock, User, Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

const ArticulosPage = () => {
  const [articles, setArticles] = useState([])
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
        // Filtrar solo artículos publicados
        const publishedArticles = data.filter(article => article.status === 'published')
        setArticles(publishedArticles)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Generar categorías dinámicamente basadas en los artículos
  const categories = [
    { name: 'Todos', slug: 'todos', count: articles.length },
    ...Array.from(new Set(articles.map(a => a.category)))
      .map(category => ({
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        count: articles.filter(a => a.category === category).length
      }))
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const featuredArticles = articles.filter(article => article.featured)
  const regularArticles = articles.filter(article => !article.featured)

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

  if (articles.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-light-gray border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Artículos sobre Finanzas Personales
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubre guías, consejos y análisis profundos sobre las mejores aplicaciones 
                financieras y estrategias para gestionar tu dinero de manera inteligente.
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600 text-lg">No hay artículos publicados aún.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-light-gray border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Artículos sobre Finanzas Personales
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre guías, consejos y análisis profundos sobre las mejores aplicaciones 
              financieras y estrategias para gestionar tu dinero de manera inteligente.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-light-gray rounded-lg shadow-sm p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Buscar</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorías</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={category.slug === 'todos' ? '/articulos' : `/articulos/categoria/${category.slug}`}
                        className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['Presupuesto', 'Apps', 'Inversiones', 'YNAB', 'Mint', 'Seguridad', 'Tutorial'].map((tag) => (
                    <Link
                      key={tag}
                      href={`/articulos/tag/${tag.toLowerCase()}`}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <article key={article.id} className="bg-light-gray rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">{article.category.name}</span>
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                            Destacado
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                            {article.category.name}
                          </span>
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          <Link 
                            href={`/articulos/${article.slug}`}
                            className="hover:text-blue-600 transition-colors duration-200"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {article.views} vistas
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Todos los Artículos</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Más recientes</option>
                    <option>Más populares</option>
                    <option>Más leídos</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                {regularArticles.map((article) => (
                  <article key={article.id} className="bg-light-gray rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">{article.category.name}</span>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                            {article.category.name}
                          </span>
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          <Link 
                            href={`/articulos/${article.slug}`}
                            className="hover:text-blue-600 transition-colors duration-200"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {article.views} vistas
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span key={tag.slug} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-light-gray border border-gray-300 rounded-lg hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-light-gray border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-light-gray border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-light-gray border border-gray-300 rounded-lg hover:bg-gray-50">
                  Siguiente
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ArticulosPage