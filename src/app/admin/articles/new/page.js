'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading,
  Quote,
  Code,
  Image,
  Type
} from 'lucide-react'
import { showError, showSuccess, showToast } from '@/lib/sweetAlert'

// Editor WYSIWYG con Quill
import QuillEditor from '@/components/QuillEditor'

const NewArticle = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = !!editId
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
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

  const [categories, setCategories] = useState([])

  const [availableTags, setAvailableTags] = useState([
    { id: '1', name: 'Presupuesto', slug: 'presupuesto' },
    { id: '2', name: 'Apps', slug: 'apps' },
    { id: '3', name: 'Inversión', slug: 'inversion' },
    { id: '4', name: 'Ahorro', slug: 'ahorro' },
    { id: '5', name: 'Tutorial', slug: 'tutorial' }
  ])

  const [newTag, setNewTag] = useState('')

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch('/api/admin/categories', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        } else {
          console.error('Error fetching categories:', response.status)
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  // Cargar datos del artículo si está en modo edición
  useEffect(() => {
    if (isEditing && editId) {
      const fetchArticle = async () => {
        try {
          setLoadingData(true)
          const token = localStorage.getItem('adminToken')
          if (!token) {
            throw new Error('No se encontró token de autorización')
          }

          const response = await fetch(`/api/admin/articles/${editId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Error al cargar el artículo')
          }

          const data = await response.json()
          const article = data.article

          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            categoryId: article.categoryId ? String(article.categoryId) : '',
            image: article.image || '',
            featured: article.featured === '1',
            published: article.published === '1',
            tags: (article.Tag || article.tags)?.map(tag => tag.id) || []
          })
        } catch (error) {
          console.error('Error fetching article:', error)
          showError('Error al cargar', `No se pudo cargar el artículo: ${error.message}`)
          router.push('/admin/articles')
        } finally {
          setLoadingData(false)
        }
      }

      fetchArticle()
    }
  }, [isEditing, editId, router])

  // Generar slug automáticamente desde el título (solo para nuevos artículos)
  useEffect(() => {
    if (!isEditing && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isEditing])

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
    // Usar el estado actual de published del formulario
    await handleSubmitWithStatus(formData.published)
  }

  const handleSaveDraft = async () => {
    await handleSubmitWithStatus(false)
  }

  const handlePublish = async () => {
    await handleSubmitWithStatus(true)
  }

  const handleSubmitWithStatus = async (publishedStatus) => {
    const event = new Event('submit')
    event.preventDefault()
    
    setLoading(true)
    try {
      // Validaciones básicas
      if (!formData.title || !formData.content || !formData.categoryId || !formData.image) {
        showError('Campos requeridos', 'Por favor completa todos los campos requeridos: título, contenido, categoría e imagen')
        return
      }

      // Encontrar la categoría seleccionada
      const selectedCategory = categories.find(cat => String(cat.id) === String(formData.categoryId))
      if (!selectedCategory) {
        throw new Error('Por favor selecciona una categoría válida')
      }

      // Preparar datos para la API con el estado de publicación correcto
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: formData.categoryId,
        tags: formData.tags,
        featured: formData.featured,
        published: publishedStatus, // Usar el parámetro directamente
        author: 'Admin',
        image: formData.image || null
      }

      // Si es modo edición, usar formato diferente
      if (isEditing) {
        // Para PUT/PATCH usar formato directo
        delete articleData.author // El endpoint no espera este campo para updates
        delete articleData.tags // Evitar enviar tags: requiere connect/disconnect y no está soportado en el endpoint
      } else {
        // Para POST, usar category slug como antes
        const selectedCategory = categories.find(cat => String(cat.id) === String(formData.categoryId))
        if (selectedCategory) {
          articleData.category = selectedCategory.slug
          delete articleData.categoryId
        }
        // Remover el campo author ya que se obtiene del token
        delete articleData.author
      }

      // Obtener token de autorización
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('No se encontró token de autorización')
      }

      // Determinar URL y método según el modo
      const url = isEditing ? `/api/admin/articles/${editId}` : '/api/admin/articles'
      const method = isEditing ? 'PUT' : 'POST'

      // Llamada a la API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al ${isEditing ? 'actualizar' : 'crear'} el artículo`)
      }

      const result = await response.json()
      
      // Actualizar el estado local
      setFormData(prev => ({ ...prev, published: publishedStatus }))
      
      showSuccess('¡Éxito!', `Artículo ${publishedStatus ? 'publicado' : 'guardado como borrador'} exitosamente`)
      router.push('/admin/articles')
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} artículo:`, error)
      showError('Error', `No se pudo ${isEditing ? 'actualizar' : 'crear'} el artículo: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Si está cargando datos del artículo
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del artículo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pb-8">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Modifica el artículo existente' : 'Crea un nuevo artículo para el sitio'}
                </p>
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
                      Contenido del artículo <span className="text-red-600">*</span>
                    </label>
                    <div className="prose max-w-none">
                      <QuillEditor
                        value={formData.content}
                        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                        placeholder="Escribe el contenido del artículo aquí...\n\nPuedes usar el formato rich text para dar estilo a tu contenido."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Usa la barra de herramientas para dar formato al texto. El contenido se guarda como HTML y se renderiza directamente en la vista pública.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publication */}
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
                        {loading ? (isEditing ? 'Actualizando...' : 'Publicando...') : (isEditing ? 'Actualizar Artículo' : 'Publicar Artículo')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoría <span className="text-red-600">*</span></h2>
                  
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagen Destacada <span className="text-red-600">*</span></h2>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                      Subir imagen (JPG, PNG, WebP, GIF) Máx. 5MB
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      required={!isEditing && !formData.image}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const token = localStorage.getItem('adminToken')
                          if (!token) throw new Error('No se encontró token de autorización')

                          const form = new FormData()
                          form.append('file', file)

                          const uploadRes = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`
                            },
                            body: form
                          })

                          if (!uploadRes.ok) throw new Error('Error al subir imagen')

                          const result = await uploadRes.json()
                          setFormData(prev => ({ ...prev, image: result.url }))
                        } catch (error) {
                          console.error('Error uploading image:', error)
                          showError('Error', 'No se pudo subir la imagen. Intenta de nuevo.')
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.image && (
                      <div className="mt-4">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h2>
                  
                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">Etiquetas seleccionadas:</p>
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
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                          >
                            {tag.name}
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="bg-white rounded-lg shadow-lg p-8">
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
                      {categories.find(c => String(c.id) === String(formData.categoryId))?.name}
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
              
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: (() => {
                    try {
                      let html = formData.content || ''
                      const decode = (s) => {
                        const ta = document.createElement('textarea')
                        ta.innerHTML = s
                        return ta.value || s
                      }
                      for (let i = 0; i < 3; i++) {
                        if (/[&]((lt|gt|amp|quot|#\d+));/i.test(html)) {
                          html = decode(html)
                        } else {
                          break
                        }
                      }
                      const parser = new DOMParser()
                      const doc = parser.parseFromString(html, 'text/html')
                      doc.querySelectorAll('.ql-ui').forEach(el => el.remove())
                      doc.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'))
                      doc.querySelectorAll('[data-list]').forEach(el => el.removeAttribute('data-list'))
                      return doc.body.innerHTML || 'Contenido del artículo aparecerá aquí...'
                    } catch {
                      return formData.content || 'Contenido del artículo aparecerá aquí...'
                    }
                  })() }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewArticle
