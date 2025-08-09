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
  Clock,
  BookOpen,
  Target,
  Wrench,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

const NewTutorial = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = !!editId

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Principiante',
    duration: '',
    objectives: [''],
    tools: [''],
    steps: [{
      title: '',
      description: '',
      tips: '',
      warning: ''
    }],
    introduction: '',
    conclusion: '',
    slug: '',
    featured: false,
    status: 'draft'
  })

  const [categories] = useState([
    'Presupuesto',
    'Ahorro',
    'Inversiones',
    'Deudas',
    'Planificación',
    'Impuestos',
    'Seguros',
    'Criptomonedas',
    'Educación Financiera',
    'Emprendimiento'
  ])

  const [difficulties] = useState([
    'Principiante',
    'Intermedio',
    'Avanzado'
  ])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [expandedStep, setExpandedStep] = useState(0)

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      const fetchTutorialData = async () => {
        try {
          const tutorialId = searchParams.get('id')
          if (!tutorialId) return
          
          const response = await fetch(`/api/admin/tutorials/${tutorialId}`)
          if (!response.ok) {
            throw new Error('Error al cargar el tutorial')
          }
          
          const data = await response.json()
          setFormData(data)
        } catch (error) {
          console.error('Error fetching tutorial data:', error)
          // Mantener formulario vacío si hay error
        }
      }
      
      fetchTutorialData()
    }
  }, [isEditing, searchParams])

  // Generar slug automáticamente
  useEffect(() => {
    if (formData.title && !isEditing) {
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

  const handleStepChange = (stepIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex ? { ...step, [field]: value } : step
      )
    }))
  }

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        title: '',
        description: '',
        tips: '',
        warning: ''
      }]
    }))
    setExpandedStep(formData.steps.length)
  }

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }))
      if (expandedStep >= formData.steps.length - 1) {
        setExpandedStep(Math.max(0, expandedStep - 1))
      }
    }
  }

  const moveStep = (index, direction) => {
    const newSteps = [...formData.steps]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newSteps.length) {
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]]
      setFormData(prev => ({ ...prev, steps: newSteps }))
      setExpandedStep(newIndex)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
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

    if (!formData.duration.trim()) {
      newErrors.duration = 'La duración es requerida'
    }

    if (!formData.introduction.trim()) {
      newErrors.introduction = 'La introducción es requerida'
    }

    if (!formData.conclusion.trim()) {
      newErrors.conclusion = 'La conclusión es requerida'
    }

    // Validar pasos
    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step_${index}_title`] = `El título del paso ${index + 1} es requerido`
      }
      if (!step.description.trim()) {
        newErrors[`step_${index}_description`] = `La descripción del paso ${index + 1} es requerida`
      }
    })

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
      
      console.log('Datos del tutorial:', formData)
      
      // Redirigir a la lista de tutoriales
      router.push('/admin/tutorials')
    } catch (error) {
      console.error('Error al guardar el tutorial:', error)
      alert('Error al guardar el tutorial. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Simular vista previa
    alert('Vista previa del tutorial (funcionalidad pendiente)')
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-100 text-green-800'
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800'
      case 'Avanzado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/tutorials"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Editar Tutorial' : 'Nuevo Tutorial'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Modifica los pasos del tutorial' : 'Crea un nuevo tutorial paso a paso'}
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
                form="tutorial-form"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Guardando...' : 'Guardar Tutorial'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="tutorial-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Básica */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Tutorial *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Cómo crear un presupuesto personal efectivo"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Descripción breve del tutorial..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dificultad
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.duration ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej: 15 min"
                      />
                      {errors.duration && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.duration}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivos */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Objetivos del Tutorial
                </h2>
                
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Objetivo que logrará el usuario"
                    />
                    {formData.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('objectives', index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar objetivo
                </button>
              </div>

              {/* Herramientas */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Herramientas Necesarias
                </h2>
                
                {formData.tools.map((tool, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tool}
                      onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Herramienta o recurso necesario"
                    />
                    {formData.tools.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tools', index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tools')}
                  className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar herramienta
                </button>
              </div>

              {/* Introducción */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Introducción</h2>
                
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.introduction ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Introduce el tutorial, explica por qué es importante y qué aprenderá el usuario..."
                />
                {errors.introduction && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.introduction}
                  </p>
                )}
              </div>

              {/* Pasos del Tutorial */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Pasos del Tutorial ({formData.steps.length})
                  </h2>
                  <button
                    type="button"
                    onClick={addStep}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Paso
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      {/* Step Header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedStep(expandedStep === index ? -1 : index)}
                      >
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3">
                            Paso {index + 1}
                          </span>
                          <h3 className="font-medium text-gray-900">
                            {step.title || `Paso ${index + 1}`}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveStep(index, 'up')
                            }}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveStep(index, 'down')
                            }}
                            disabled={index === formData.steps.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          {formData.steps.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeStep(index)
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      {expandedStep === index && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Paso *
                              </label>
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  errors[`step_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Título descriptivo del paso"
                              />
                              {errors[`step_${index}_title`] && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {errors[`step_${index}_title`]}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                              </label>
                              <textarea
                                value={step.description}
                                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  errors[`step_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Explica detalladamente qué debe hacer el usuario en este paso"
                              />
                              {errors[`step_${index}_description`] && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {errors[`step_${index}_description`]}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Consejos (Opcional)
                              </label>
                              <textarea
                                value={step.tips}
                                onChange={(e) => handleStepChange(index, 'tips', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Consejos útiles para este paso"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Advertencias (Opcional)
                              </label>
                              <textarea
                                value={step.warning}
                                onChange={(e) => handleStepChange(index, 'warning', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Cosas importantes a evitar o tener en cuenta"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusión */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Conclusión</h2>
                
                <textarea
                  name="conclusion"
                  value={formData.conclusion}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.conclusion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Resumen del tutorial, próximos pasos recomendados, recursos adicionales..."
                />
                {errors.conclusion && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.conclusion}
                  </p>
                )}
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
                      placeholder="url-del-tutorial"
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
                      Marcar como destacado
                    </label>
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Categoría:</span>
                    <span className="text-sm font-medium">{formData.category || 'Sin categoría'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dificultad:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(formData.difficulty)}`}>
                      {formData.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formData.duration || 'No especificada'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pasos:</span>
                    <span className="text-sm font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {formData.steps.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Objetivos:</span>
                    <span className="text-sm font-medium flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {formData.objectives.filter(obj => obj.trim()).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Herramientas:</span>
                    <span className="text-sm font-medium flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      {formData.tools.filter(tool => tool.trim()).length}
                    </span>
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

export default NewTutorial