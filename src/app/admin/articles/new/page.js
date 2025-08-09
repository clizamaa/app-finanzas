'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus
} from 'lucide-react'

const NewArticle = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    image: '',
    featured: false,
    published: false,
    tags: []
  })

  const [categories, setCategories] = useState([
    { id: '1', name: 'Reviews', slug: 'reviews' },
    { id: '2', name: 'Tutoriales', slug: 'tutoriales' },
    { id: '3', name: 'Análisis', slug: 'analisis' },
    { id: '4', name: 'Noticias', slug: 'noticias' }
  ])

  const [availableTags, setAvailableTags] = useState([
    { id: '1', name: 'Presupuesto', slug: 'presupuesto' },
    { id: '2', name: 'Apps', slug: 'apps' },
    { id: '3', name: 'Inversión', slug: 'inversion' },
    { id: '4', name: 'Ahorro', slug: 'ahorro' },
    { id: '5', name: 'Tutorial', slug: 'tutorial' }
  ])

  const [newTag, setNewTag] = useState('')

  // Generar slug automáticamente desde el título
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTagAdd = (tagId) => {
    if (!formData.tags.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagId]
      }))
    }
  }

  const handleTagRemove = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(id => id !== tagId)
    }))
  }

  const handleNewTag = () => {
    if (newTag.trim()) {
      const slug = newTag.toLowerCase().replace(/\s+/g, '-')
      const newTagObj = {
        id: Date.now().toString(),
        name: newTag.trim(),
        slug
      }
      setAvailableTags(prev => [...prev, newTagObj])
      handleTagAdd(newTagObj.id)
      setNewTag('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones básicas
      if (!formData.title || !formData.content || !formData.categoryId) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      // Encontrar la categoría seleccionada
      const selectedCategory = categories.find(cat => cat.id === formData.categoryId)
      if (!selectedCategory) {
        throw new Error('Por favor selecciona una categoría válida')
      }

      // Preparar datos para la API
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: selectedCategory.slug,
        tags: formData.tags,
        featured: formData.featured,
        status: formData.published ? 'published' : 'draft',
        author: 'Admin'
      }

      // Obtener token de autorización
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('No se encontró token de autorización')
      }

      // Llamada a la API para crear el artículo
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el artículo')
      }

      const result = await response.json()
      alert('Artículo creado exitosamente')
      router.push('/admin/articles')
    } catch (error) {
      console.error('Error al crear artículo:', error)
      alert(`Error al crear el artículo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, published: false }))
    await handleSubmit(new Event('submit'))
  }

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, published: true }))
    await handleSubmit(new Event('submit'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/articles"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nuevo Artículo</h1>
                <p className="text-gray-600 mt-1">Crea un nuevo artículo para el sitio</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                {preview ? 'Editar' : 'Vista Previa'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!preview ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Escribe el título del artículo..."
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="url-del-articulo"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Se genera automáticamente desde el título
                      </p>
                    </div>

                    <div>
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                        Extracto *
                      </label>
                      <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Breve descripción del artículo..."
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido</h2>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido del artículo *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Escribe el contenido en Markdown...\n\n## Ejemplo de título\n\nEste es un párrafo de ejemplo.\n\n- Lista item 1\n- Lista item 2\n\n**Texto en negrita**"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Puedes usar Markdown para formatear el contenido
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Publicación</h2>
                  
                  <div className="space-y-4">
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
                        Artículo destacado
                      </label>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={loading}
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar Borrador'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Publicando...' : 'Publicar Artículo'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h2>
                  
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagen Destacada</h2>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la imagen
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={formData.image}
                        alt="Vista previa"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h2>
                  
                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2">Etiquetas seleccionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tagId => {
                          const tag = availableTags.find(t => t.id === tagId)
                          return tag ? (
                            <span
                              key={tagId}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                            >
                              {tag.name}
                              <button
                                type="button"
                                onClick={() => handleTagRemove(tagId)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  {/* Available Tags */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">Etiquetas disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => !formData.tags.includes(tag.id))
                        .map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagAdd(tag.id)}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
                          >
                            + {tag.name}
                          </button>
                        ))
                      }
                    </div>
                  </div>

                  {/* New Tag */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleNewTag()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleNewTag}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Preview */
          <div className="bg-white rounded-lg shadow p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="mb-4">
                  {formData.categoryId && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {categories.find(c => c.id === formData.categoryId)?.name}
                    </span>
                  )}
                  {formData.featured && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Destacado
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Título del artículo'}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6">
                  {formData.excerpt || 'Extracto del artículo'}
                </p>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId)
                      return tag ? (
                        <span
                          key={tagId}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                        >
                          #{tag.name}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">
                  {formData.content || 'Contenido del artículo aparecerá aquí...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewArticle