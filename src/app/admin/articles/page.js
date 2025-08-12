'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Clock,
  ArrowLeft,
  MoreVertical
} from 'lucide-react'
import { showError, showDeleteConfirm, showSuccess } from '@/lib/sweetAlert'

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar artículos desde la API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('adminToken')
        const response = await fetch('/api/admin/articles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al cargar los artículos')
        }
        
        const data = await response.json()
        setArticles(data.articles || [])
        setFilteredArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Filtrar artículos
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category.slug === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'published') {
        filtered = filtered.filter(article => article.published === true)
      } else if (selectedStatus === 'draft') {
        filtered = filtered.filter(article => article.published === false)
      }
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory, selectedStatus])

  const handleDelete = async (id) => {
    const result = await showDeleteConfirm('este artículo');
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Error al eliminar el artículo')
        }
        
        setArticles(articles.filter(article => article.id !== id))
      } catch (error) {
        console.error('Error deleting article:', error)
        showError('Error', 'No se pudo eliminar el artículo')
      }
    }
  }

  const toggleFeatured = async (id) => {
    try {
      const article = articles.find(a => a.id === id)
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          featured: !article.featured
        })
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar el artículo')
      }
      
      setArticles(articles.map(article => 
        article.id === id 
          ? { ...article, featured: !article.featured }
          : article
      ))
    } catch (error) {
      console.error('Error updating article:', error)
      showError('Error', 'No se pudo actualizar el artículo')
    }
  }

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'tutoriales', label: 'Tutoriales' },
    { value: 'analisis', label: 'Análisis' },
    { value: 'noticias', label: 'Noticias' }
  ]

  const statuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'published', label: 'Publicados' },
    { value: 'draft', label: 'Borradores' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar artículos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Artículos</h1>
                <p className="text-gray-600 mt-1">Administra todos los artículos del sitio</p>
              </div>
            </div>
            <Link
              href="/admin/articles/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Artículo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredArticles.length} de {articles.length} artículos
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">
                              {article.title}
                            </h3>
                            {article.featured && (
                              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Destacado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {article.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.published === true 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {article.published === true ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        {article.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {article.createdAt 
                          ? new Date(article.createdAt).toLocaleDateString('es-ES')
                          : 'Sin fecha'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/articulos/${article.slug}`}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Ver artículo"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/new?edit=${article.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar artículo"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => toggleFeatured(article.id)}
                          className={`transition-colors ${
                            article.featured 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={article.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron artículos
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer artículo'
                }
              </p>
              <Link
                href="/admin/articles/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Artículo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticlesManagement