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
  Star,
  ArrowLeft,
  Download
} from 'lucide-react'
import { showDeleteConfirm } from '@/lib/sweetAlert'

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/admin/reviews')
        if (!response.ok) {
          throw new Error('Error al cargar las reviews')
        }
        const data = await response.json()
        setReviews(data)
        setFilteredReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Por ahora, usar array vacío si no hay API
        setReviews([])
        setFilteredReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Filtrar reviews
  useEffect(() => {
    let filtered = reviews

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(review => review.category === selectedCategory)
    }

    if (selectedRating !== 'all') {
      const rating = parseFloat(selectedRating)
      filtered = filtered.filter(review => review.rating >= rating)
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, selectedCategory, selectedRating])

  const handleDelete = async (id) => {
    const review = reviews.find(r => r.id === id)
    const result = await showDeleteConfirm(`la review de "${review.appName}"`);
    if (result.isConfirmed) {
      setReviews(reviews.filter(review => review.id !== id))
    }
  }

  const toggleFeatured = (id) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, featured: !review.featured }
        : review
    ))
  }

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Presupuesto', label: 'Presupuesto' },
    { value: 'Gestión Integral', label: 'Gestión Integral' },
    { value: 'Control de Gastos', label: 'Control de Gastos' },
    { value: 'Inversiones', label: 'Inversiones' },
    { value: 'Banco Digital', label: 'Banco Digital' },
    { value: 'Transferencias', label: 'Transferencias' }
  ]

  const ratings = [
    { value: 'all', label: 'Todas las calificaciones' },
    { value: '4.5', label: '4.5+ estrellas' },
    { value: '4.0', label: '4.0+ estrellas' },
    { value: '3.5', label: '3.5+ estrellas' },
    { value: '3.0', label: '3.0+ estrellas' }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reviews...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Reviews</h1>
                <p className="text-gray-600 mt-1">Administra las reviews de aplicaciones</p>
              </div>
            </div>
            <Link
              href="/admin/reviews/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Review
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
                placeholder="Buscar reviews..."
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

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredReviews.length} de {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${review.featured ? 'ring-2 ring-yellow-200' : ''}`}>
              {review.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 text-sm font-bold text-center rounded-t-lg">
                  ⭐ Review Destacada
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{review.appName}</h3>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/reviews/${review.slug}`}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Ver review"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/reviews/edit/${review.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar review"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => toggleFeatured(review.id)}
                          className={`transition-colors ${
                            review.featured 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={review.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{review.description}</p>
                    
                    {/* Rating and Category */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {review.category}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Download className="h-4 w-4 text-gray-400 mr-1" />
                        </div>
                        <p className="text-xs text-gray-500">Descargas</p>
                        <p className="text-sm font-medium text-gray-900">{review.downloads}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        </div>
                        <p className="text-xs text-gray-500">Vistas</p>
                        <p className="text-sm font-medium text-gray-900">{review.views.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="text-sm">💰</span>
                        </div>
                        <p className="text-xs text-gray-500">Precio</p>
                        <p className="text-sm font-medium text-gray-900">{review.price}</p>
                      </div>
                    </div>
                    
                    {/* Status and Date */}
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {review.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {review.publishedAt 
                            ? new Date(review.publishedAt).toLocaleDateString('es-ES')
                            : 'Sin publicar'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron reviews
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedRating !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primera review'
              }
            </p>
            <Link
              href="/admin/reviews/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Review
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsManagement