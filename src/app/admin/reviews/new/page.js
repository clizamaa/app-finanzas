'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  X, 
  Star,
  Upload,
  AlertCircle
} from 'lucide-react'
import { showError, showInfo } from '@/lib/sweetAlert'

const NewReview = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = !!editId

  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: '',
    rating: 5,
    downloads: '',
    price: 'Gratis',
    pros: [''],
    cons: [''],
    features: [''],
    security: '',
    playStoreUrl: '',
    appStoreUrl: '',
    websiteUrl: '',
    developerName: '',
    lastUpdate: '',
    appSize: '',
    minAndroidVersion: '',
    minIosVersion: '',
    detailedReview: '',
    conclusion: '',
    slug: '',
    featured: false,
    status: 'draft'
  })

  const [categories] = useState([
    'Presupuesto',
    'Gestión Integral',
    'Control de Gastos',
    'Inversiones',
    'Banco Digital',
    'Transferencias',
    'Ahorro',
    'Criptomonedas',
    'Seguros',
    'Préstamos'
  ])

  const [priceOptions] = useState([
    'Gratis',
    'Freemium',
    'Pago único',
    'Suscripción mensual',
    'Suscripción anual'
  ])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      const fetchReviewData = async () => {
        try {
          const reviewId = searchParams.get('id')
          if (!reviewId) return
          
          const response = await fetch(`/api/admin/reviews/${reviewId}`)
          if (!response.ok) {
            throw new Error('Error al cargar la review')
          }
          
          const data = await response.json()
          setFormData(data)
        } catch (error) {
          console.error('Error fetching review data:', error)
          // Mantener formulario vacío si hay error
        }
      }
      
      fetchReviewData()
    }
  }, [isEditing, searchParams])

  // Generar slug automáticamente
  useEffect(() => {
    if (formData.appName && !isEditing) {
      const slug = formData.appName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug: slug + '-review' }))
    }
  }, [formData.appName, isEditing])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.appName.trim()) {
      newErrors.appName = 'El nombre de la app es requerido'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido'
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'La calificación debe estar entre 1 y 5'
    }

    if (!formData.detailedReview.trim()) {
      newErrors.detailedReview = 'La review detallada es requerida'
    }

    if (!formData.conclusion.trim()) {
      newErrors.conclusion = 'La conclusión es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Datos de la review:', formData)
      
      // Redirigir a la lista de reviews
      router.push('/admin/reviews')
    } catch (error) {
      console.error('Error al guardar la review:', error)
      showError('Error', 'No se pudo guardar la review. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Simular vista previa
    showInfo('Vista previa', 'Funcionalidad de vista previa en desarrollo')
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/reviews"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Editar Review' : 'Nueva Review'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Modifica los datos de la review' : 'Crea una nueva review de aplicación'}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePreview}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </button>
              <button
                type="submit"
                form="review-form"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Guardando...' : 'Guardar Review'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="review-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Básica */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la App *
                    </label>
                    <input
                      type="text"
                      name="appName"
                      value={formData.appName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.appName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: YNAB (You Need A Budget)"
                    />
                    {errors.appName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.appName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Descripción breve de la aplicación..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación *
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderStars(formData.rating)}
                      <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
                    </div>
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descargas
                    </label>
                    <input
                      type="text"
                      name="downloads"
                      value={formData.downloads}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 1M+, 500K+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio
                    </label>
                    <select
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pros y Contras */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pros y Contras</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ventajas (Pros)
                    </label>
                    {formData.pros.map((pro, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={pro}
                          onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ventaja de la aplicación"
                        />
                        {formData.pros.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('pros', index)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('pros')}
                      className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar ventaja
                    </button>
                  </div>

                  {/* Contras */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desventajas (Contras)
                    </label>
                    {formData.cons.map((con, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={con}
                          onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Desventaja de la aplicación"
                        />
                        {formData.cons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('cons', index)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('cons')}
                      className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar desventaja
                    </button>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Características Principales</h2>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Característica de la aplicación"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar característica
                </button>
              </div>

              {/* Review Detallada */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Detallada</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido de la Review *
                  </label>
                  <textarea
                    name="detailedReview"
                    value={formData.detailedReview}
                    onChange={handleInputChange}
                    rows={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.detailedReview ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Escribe aquí la review detallada de la aplicación..."
                  />
                  {errors.detailedReview && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.detailedReview}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conclusión *
                  </label>
                  <textarea
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.conclusion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Conclusión final de la review..."
                  />
                  {errors.conclusion && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.conclusion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Configuración de Publicación */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Publicación</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.slug ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="url-de-la-review"
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.slug}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Marcar como destacada
                    </label>
                  </div>
                </div>
              </div>

              {/* Información Técnica */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información Técnica</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desarrollador
                    </label>
                    <input
                      type="text"
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del desarrollador"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño de la App
                    </label>
                    <input
                      type="text"
                      name="appSize"
                      value={formData.appSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 45 MB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Última Actualización
                    </label>
                    <input
                      type="date"
                      name="lastUpdate"
                      value={formData.lastUpdate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min. Android
                      </label>
                      <input
                        type="text"
                        name="minAndroidVersion"
                        value={formData.minAndroidVersion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="6.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min. iOS
                      </label>
                      <input
                        type="text"
                        name="minIosVersion"
                        value={formData.minIosVersion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="13.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seguridad
                    </label>
                    <input
                      type="text"
                      name="security"
                      value={formData.security}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Cifrado bancario de 256 bits"
                    />
                  </div>
                </div>
              </div>

              {/* Enlaces */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Enlaces</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Play Store
                    </label>
                    <input
                      type="url"
                      name="playStoreUrl"
                      value={formData.playStoreUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://play.google.com/store/apps/details?id=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Store
                    </label>
                    <input
                      type="url"
                      name="appStoreUrl"
                      value={formData.appStoreUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://apps.apple.com/app/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewReview