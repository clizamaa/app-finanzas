'use client'

import Link from 'next/link'
import { Calendar, Clock, User, Search, Filter, BookOpen, Eye, ArrowRight } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AccessTracker from '@/components/AccessTracker'
import { NextSeo } from 'next-seo'

// Deshabilitar prerendering estático
export const dynamic = 'force-dynamic'

const ArticulosPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [isAnimating, setIsAnimating] = useState(false)
  const articlesPerPage = 5

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles')
        if (!response.ok) {
          throw new Error('Error al cargar los artículos')
        }
        const data = await response.json()
        // Los artículos ya vienen filtrados como publicados desde la API
        const articles = data.articles || []
        setArticles(articles)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Detectar parámetro de categoría en la URL
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    
    // Si hay parámetro de categoría y es diferente al seleccionado
    if (categoryParam && categoryParam !== selectedCategory) {
      setIsAnimating(true)
      setTimeout(() => {
        setSelectedCategory(categoryParam)
        setCurrentPage(1)
        setTimeout(() => setIsAnimating(false), 50)
      }, 150)
    }
    // Si no hay parámetro de categoría y no estamos en "todos", resetear a "todos"
    else if (!categoryParam && selectedCategory !== 'todos') {
      setIsAnimating(true)
      setTimeout(() => {
        setSelectedCategory('todos')
        setCurrentPage(1)
        setTimeout(() => setIsAnimating(false), 50)
      }, 150)
    }
  }, [searchParams, selectedCategory])

  // Generar categorías dinámicamente basadas en los artículos
  const categories = [
    { name: 'Todos', slug: 'todos', count: articles.length },
    ...Array.from(new Map(
      articles
        .filter(a => a.Category || a.category)
        .map(a => {
          const cat = a.Category || a.category
          return [cat.slug, { name: cat.name, slug: cat.slug }]
        })
    ).values()).map(cat => ({
      ...cat,
      count: articles.filter(a => (a.Category?.slug || a.category?.slug) === cat.slug).length
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

  // Filtrar artículos basándose en la categoría seleccionada
  const filteredArticles = selectedCategory === 'todos' 
    ? articles 
    : articles.filter(article => (article.Category?.slug || article.category?.slug) === selectedCategory)

  // Mostrar artículos filtrados, ordenados por fecha de creación (más recientes primero)
  const allArticles = filteredArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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
    <div className="bg-gray-50 min-h-screen">
      <NextSeo
        title="Artículos de Finanzas Personales - Reviews y Guías Completas"
        description="Descubre los mejores artículos sobre finanzas personales, aplicaciones financieras y consejos para gestionar tu dinero de manera inteligente."
        canonical={`${process.env.SITE_URL || 'https://appfinanzashoy.com'}/articulos`}
        openGraph={{
          title: 'Artículos de Finanzas Personales - AppFinanzasHoy',
          description: 'Reviews detalladas de apps financieras y guías completas para mejorar tus finanzas personales',
          url: `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/articulos`,
          type: 'website',
          images: [
            {
              url: '/images/og-image.svg',
              width: 1200,
              height: 630,
              alt: 'AppFinanzasHoy - Artículos de Finanzas Personales',
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'artículos finanzas, reviews apps financieras, guías dinero, finanzas personales, presupuesto, ahorro, inversión'
          },
          {
            name: 'author',
            content: 'AppFinanzasHoy Team'
          }
        ]}
      />
      <AccessTracker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-light-gray rounded-xl shadow-sm p-6 sticky top-8">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-navy mb-3">Categorías</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <button
                        onClick={() => {
                          // Actualizar URL con la categoría seleccionada
                          const newUrl = category.slug === 'todos' ? '/articulos' : `/articulos?category=${category.slug}`
                          router.replace(newUrl, { scroll: false })
                          setIsAnimating(true)
                          setTimeout(() => {
                            setSelectedCategory(category.slug)
                            setCurrentPage(1) // Reset to first page when filtering
                            setTimeout(() => setIsAnimating(false), 50)
                          }, 150)
                        }}
                        className={`w-full flex items-center justify-between transition-colors duration-200 p-2 rounded-lg hover:bg-emerald/10 ${
                          selectedCategory === category.slug 
                            ? 'text-emerald bg-emerald/10' 
                            : 'text-gray-600 hover:text-emerald'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>


            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3" id="articulos">
            {/* All Articles */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-navy">
                  {selectedCategory === 'todos' 
                    ? 'Todos los Artículos' 
                    : `Artículos de ${categories.find(cat => cat.slug === selectedCategory)?.name || 'Categoría'}`
                  }
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald focus:border-transparent">
                    <option>Más recientes</option>
                    <option>Más populares</option>
                    <option>Más leídos</option>
                  </select>
                </div>
              </div>
              
              <div className={`space-y-8 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                {allArticles
                  .slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
                  .map((article, index) => (
                    <article 
                      key={article.id} 
                      className={`bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100 ${
                        isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                      }`}
                      style={{
                        transitionDelay: isAnimating ? '0ms' : `${index * 100}ms`
                      }}
                    >
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
                                <span className="text-white font-semibold text-lg">{article.Category?.name || article.category?.name || 'Artículo'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="bg-emerald/10 text-emerald px-3 py-2 rounded-full text-xs font-semibold mr-3">
                              {article.Category?.name || article.category?.name || 'Artículo'}
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

// Componente wrapper con Suspense
const ArticulosPageWrapper = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
      <ArticulosPage />
    </Suspense>
  )
}

export default ArticulosPageWrapper