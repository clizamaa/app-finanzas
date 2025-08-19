'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Star, 
  BookOpen, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  X,
  EyeOff,
  Globe,
  Shield
} from 'lucide-react'
import { authenticatedFetch } from '@/lib/auth'
import { showSuccess, showError } from '@/lib/sweetAlert'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState([])
  const [userFormData, setUserFormData] = useState({
    email: '',
    name: '',
    password: '',
    roleId: ''
  })
  const [userFormLoading, setUserFormLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchDashboardData()
    fetchRoles()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        const response = await fetch('/api/admin/auth/login', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleUserInputChange = (e) => {
    const { name, value } = e.target
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setUserFormLoading(true)

    try {
      const response = await authenticatedFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userFormData)
      })

      const data = await response.json()

      if (response.ok) {
        showSuccess('¡Éxito!', 'Usuario creado correctamente')
        setShowCreateUserModal(false)
        setUserFormData({ email: '', name: '', password: '', roleId: '' })
        fetchDashboardData() // Recargar estadísticas
      } else {
        showError('Error', data.message || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      showError('Error', 'Error de conexión al crear usuario')
    } finally {
      setUserFormLoading(false)
    }
  }

  const fetchDashboardData = async () => {
     try {
       setLoading(true)
       const token = localStorage.getItem('adminToken')
       const response = await fetch('/api/admin/stats', {
         headers: {
           'Authorization': `Bearer ${token}`
         }
       })
       if (response.ok) {
         const data = await response.json()
         setStats({
           articles: data.overview.totalArticles,
           reviews: data.overview.totalReviews,
           tutorials: data.overview.totalTutorials,
           categories: data.overview.totalCategories,
           users: data.overview.totalUsers,
           totalViews: data.overview.totalViews,
           comments: 0 // No tenemos comentarios en la API aún
         })
         setRecentActivity(data.recentActivity.map(activity => ({
           ...activity,
           time: getTimeAgo(activity.timestamp)
         })))
       }
     } catch (error) {
       console.error('Error al cargar datos del dashboard:', error)
     } finally {
       setLoading(false)
     }
   }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  }

  // Helper para verificar si el usuario es admin
  const isAdmin = () => {
    return currentUser?.role?.name === 'admin'
  }

  const quickActions = [
    {
      title: 'Nuevo Artículo',
      description: 'Crear un nuevo artículo',
      icon: FileText,
      href: '/admin/articles/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nuevo Usuario',
      description: 'Crear un nuevo usuario',
      icon: Users,
      href: '/admin/users/new',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Nueva Categoría',
      description: 'Crear una nueva categoría',
      icon: FolderOpen,
      href: '/admin/categories/',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'LOGS',
      description: 'Ver registros del sistema',
      icon: Globe,
      href: '/admin/logs',
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      title: 'IPs Bloqueadas',
      description: 'Gestionar IPs bloqueadas',
      icon: Shield,
      href: '/admin/blocked-ips',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ]

  const managementSections = [
    {
      title: 'Gestionar Artículos',
      description: 'Ver, editar y eliminar artículos',
      icon: FileText,
      href: '/admin/articles',
      count: stats?.articles || 0,
      color: 'text-blue-600'
    },
    {
      title: 'Gestionar Categorías',
      description: 'Ver, editar y eliminar categorías',
      icon: FolderOpen,
      href: '/admin/categories',
      count: stats?.categories || 0,
      color: 'text-purple-600'
    },
    // Solo incluir gestión de usuarios si es admin
    ...(isAdmin() ? [{
      title: 'Gestionar Usuarios',
      description: 'Crear, editar y administrar usuarios',
      icon: Users,
      href: '/admin/users',
      count: stats?.users || 0,
      color: 'text-indigo-600'
    }] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Gestiona el contenido de tu sitio web</p>
            </div>
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ver Sitio Web
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {loading ? (
          <div className={`grid grid-cols-1 ${isAdmin() ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
            {[...Array(isAdmin() ? 3 : 2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className={`grid grid-cols-1 ${isAdmin() ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Artículos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.articles}</p>
                </div>
              </div>
            </div>

            {isAdmin() && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.users || 0}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vistas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                
                // Manejar la tarjeta de "Nuevo Usuario" de forma especial
                if (action.title === 'Nuevo Usuario') {
                  // Solo mostrar si es admin
                  if (!isAdmin()) {
                    return null
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => setShowCreateUserModal(true)}
                      className={`${action.color} text-white p-6 rounded-lg transition-colors block w-full text-left`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-8 w-8 mr-4" />
                        <div>
                          <h3 className="font-semibold text-lg">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                }
                
                // Manejar la tarjeta de "LOGS" de forma especial
                if (action.title === 'LOGS') {
                  // Solo mostrar si es admin
                  if (!isAdmin()) {
                    return null
                  }
                }
                
                // Manejar la tarjeta de "IPs Bloqueadas" de forma especial
                if (action.title === 'IPs Bloqueadas') {
                  // Solo mostrar si es admin
                  if (!isAdmin()) {
                    return null
                  }
                }
                
                // Para las demás tarjetas, usar Link normal
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className={`${action.color} text-white p-6 rounded-lg transition-colors block`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-8 w-8 mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Management Sections */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gestión de Contenido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managementSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <Link
                    key={index}
                    href={section.href}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className={`h-8 w-8 ${section.color} mr-4`} />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{section.count}</p>
                        <p className="text-xs text-gray-500">elementos</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'article' && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          {activity.type === 'review' && (
                             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                               <Star className="w-4 h-4 text-green-600" />
                             </div>
                           )}
                          {activity.type === 'tutorial' && (
                             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                               <BookOpen className="w-4 h-4 text-purple-600" />
                             </div>
                           )}
                          {activity.type === 'category' && (
                             <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                               <FolderOpen className="w-4 h-4 text-orange-600" />
                             </div>
                           )}
                          {activity.type === 'user' && (
                             <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                               <Users className="w-4 h-4 text-indigo-600" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.action === 'published' ? 'bg-green-100 text-green-800' :
                            activity.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                            activity.action === 'created' ? 'bg-purple-100 text-purple-800' :
                            activity.action === 'featured' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.action === 'published' ? 'Publicado' :
                             activity.action === 'updated' ? 'Actualizado' :
                             activity.action === 'created' ? 'Creado' :
                             activity.action === 'featured' ? 'Destacado' : activity.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Usuario</h2>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={userFormData.name}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="roleId"
                  value={userFormData.roleId}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name === 'admin' ? '👤 Administrador' : '✏️ Redactor'} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {userFormLoading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard