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
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react'
import { showDeleteConfirm } from '@/lib/sweetAlert'

const TutorialsManagement = () => {
  const [tutorials, setTutorials] = useState([])
  const [filteredTutorials, setFilteredTutorials] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/api/admin/tutorials')
        if (!response.ok) {
          throw new Error('Error al cargar los tutoriales')
        }
        const data = await response.json()
        setTutorials(data)
        setFilteredTutorials(data)
      } catch (error) {
        console.error('Error fetching tutorials:', error)
        // Por ahora, usar array vacío si no hay API
        setTutorials([])
        setFilteredTutorials([])
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])



  // Filtrar tutoriales
  useEffect(() => {
    let filtered = tutorials

    if (searchTerm) {
      filtered = filtered.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === selectedDifficulty)
    }

    setFilteredTutorials(filtered)
  }, [tutorials, searchTerm, selectedCategory, selectedDifficulty])

  const handleDelete = async (id) => {
    const tutorial = tutorials.find(t => t.id === id)
    const result = await showDeleteConfirm(`el tutorial "${tutorial.title}"`);
    if (result.isConfirmed) {
      setTutorials(tutorials.filter(tutorial => tutorial.id !== id))
    }
  }

  const toggleFeatured = (id) => {
    setTutorials(tutorials.map(tutorial => 
      tutorial.id === id 
        ? { ...tutorial, featured: !tutorial.featured }
        : tutorial
    ))
  }

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Presupuesto', label: 'Presupuesto' },
    { value: 'Ahorro', label: 'Ahorro' },
    { value: 'Inversiones', label: 'Inversiones' },
    { value: 'Deudas', label: 'Deudas' },
    { value: 'Planificación', label: 'Planificación' },
    { value: 'Impuestos', label: 'Impuestos' },
    { value: 'Seguros', label: 'Seguros' }
  ]

  const difficulties = [
    { value: 'all', label: 'Todas las dificultades' },
    { value: 'Principiante', label: 'Principiante' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' }
  ]

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tutoriales...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Tutoriales</h1>
                <p className="text-gray-600 mt-1">Administra los tutoriales paso a paso</p>
              </div>
            </div>
            <Link
              href="/admin/tutorials/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tutorial
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
                placeholder="Buscar tutoriales..."
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

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredTutorials.length} de {tutorials.length} tutoriales
            </div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${tutorial.featured ? 'ring-2 ring-yellow-200' : ''}`}>
              {tutorial.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 text-sm font-bold text-center rounded-t-lg">
                  ⭐ Tutorial Destacado
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{tutorial.title}</h3>
                      <div className="flex items-center space-x-2 ml-2">
                        <Link
                          href={`/tutoriales/${tutorial.slug}`}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Ver tutorial"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/tutorials/edit/${tutorial.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar tutorial"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => toggleFeatured(tutorial.id)}
                          className={`transition-colors ${
                            tutorial.featured 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={tutorial.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleDelete(tutorial.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar tutorial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
                    
                    {/* Category and Difficulty */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tutorial.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        </div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="text-sm font-medium text-gray-900">{tutorial.duration}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                        </div>
                        <p className="text-xs text-gray-500">Pasos</p>
                        <p className="text-sm font-medium text-gray-900">{tutorial.steps}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        </div>
                        <p className="text-xs text-gray-500">Vistas</p>
                        <p className="text-sm font-medium text-gray-900">{tutorial.views.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Engagement */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{tutorial.likes} likes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{((tutorial.likes / tutorial.views) * 100).toFixed(1)}% engagement</span>
                      </div>
                    </div>
                    
                    {/* Tools Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Herramientas necesarias:</p>
                      <div className="flex flex-wrap gap-1">
                        {tutorial.tools.slice(0, 2).map((tool, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {tool}
                          </span>
                        ))}
                        {tutorial.tools.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{tutorial.tools.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Status and Date */}
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tutorial.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tutorial.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {tutorial.publishedAt 
                            ? new Date(tutorial.publishedAt).toLocaleDateString('es-ES')
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

        {filteredTutorials.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron tutoriales
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer tutorial'
              }
            </p>
            <Link
              href="/admin/tutorials/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Tutorial
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TutorialsManagement