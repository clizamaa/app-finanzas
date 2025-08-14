'use client'

import Link from 'next/link'
import { Calendar, Clock, User, Search, Filter, BookOpen, Eye, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

const ArticulosPage = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 5

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/admin/articles')
        if (!response.ok) {
          throw new Error('Error al cargar los artículos')
        }
        const data = await response.json()
        // Filtrar solo artículos publicados desde la forma correcta de respuesta
        const list = Array.isArray(data) ? data : (data.articles || [])
        const publishedArticles = list.filter(article => article.published === true)
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
    ...Array.from(new Map(
      articles
        .filter(a => a.category)
        .map(a => [a.category.slug, { name: a.category.name, slug: a.category.slug }])
    ).values()).map(cat => ({
      ...cat,
      count: articles.filter(a => a.category?.slug === cat.slug).length
    }))
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha no disponible'
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Mostrar todos los artículos juntos, ordenados por fecha de creación (más recientes primero)
  const allArticles = articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
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
            className="bg-emerald text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600 text-lg">No hay artículos publicados aún.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-light-gray rounded-xl shadow-sm p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-navy mb-3">Buscar</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-navy mb-3">Categorías</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={category.slug === 'todos' ? '/articulos' : `/articulos/categoria/${category.slug}`}
                        className="flex items-center justify-between text-gray-600 hover:text-emerald transition-colors duration-200 p-2 rounded-lg hover:bg-emerald/10"
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['Presupuesto', 'Apps', 'Inversiones', 'YNAB', 'Mint', 'Seguridad', 'Tutorial'].map((tag) => (
                    <Link
                      key={tag}
                      href={`/articulos/tag/${tag.toLowerCase()}`}
                      className="bg-emerald/10 text-emerald px-3 py-2 rounded-full text-sm font-medium hover:bg-emerald/20 transition-colors duration-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3" id="articulos">
            {/* All Articles */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-navy">Todos los Artículos</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald focus:border-transparent">
                    <option>Más recientes</option>
                    <option>Más populares</option>
                    <option>Más leídos</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-8">
                {allArticles
                  .slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
                  .map((article) => (
                    <article key={article.id} className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                          <div className="h-56 rounded-xl overflow-hidden">
                            {article.image ? (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-full bg-gradient-to-br from-emerald to-emerald/80 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">{article.category?.name || 'Artículo'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="bg-emerald/10 text-emerald px-3 py-2 rounded-full text-xs font-semibold mr-3">
                              {article.category?.name || 'Artículo'}
                            </span>
                            {article.featured && (
                              <span className="bg-orange/10 text-orange px-3 py-2 rounded-full text-xs font-semibold mr-3">
                                ⭐ Destacado
                              </span>
                            )}
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(article.createdAt || article.updatedAt)}
                          </div>
                          
                          <h3 className="text-2xl font-bold text-navy mb-4 leading-tight">
                            <Link 
                              href={`/articulos/${article.slug}`}
                              className="hover:text-emerald transition-colors duration-200"
                            >
                              {article.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="font-medium">{article.readTime || '5 min lectura'}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="font-medium">{article.views || '1.2k'} vistas</span>
                              </div>
                            </div>
                            
                            <Link 
                              href={`/articulos/${article.slug}`}
                              className="bg-emerald text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 flex items-center"
                            >
                              Leer más
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </div>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span key={tag.slug} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>

            {/* Pagination */}
            {allArticles.length > articlesPerPage && (
              <div className="mt-16 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-3 text-sm font-semibold ${
                      currentPage === 1 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'text-gray-600 bg-white hover:bg-emerald hover:text-white'
                    } border border-gray-300 rounded-xl transition-all duration-200`}
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.ceil(allArticles.length / articlesPerPage))].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-3 text-sm font-semibold ${
                        currentPage === index + 1
                          ? 'text-white bg-emerald border-emerald shadow-md'
                          : 'text-gray-600 bg-white hover:bg-emerald hover:text-white border-gray-300'
                      } border rounded-xl transition-all duration-200`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(allArticles.length / articlesPerPage)))}
                    disabled={currentPage === Math.ceil(allArticles.length / articlesPerPage)}
                    className={`px-4 py-3 text-sm font-semibold ${
                      currentPage === Math.ceil(allArticles.length / articlesPerPage)
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-600 bg-white hover:bg-emerald hover:text-white'
                    } border border-gray-300 rounded-xl transition-all duration-200`}
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ArticulosPage