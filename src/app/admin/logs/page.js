'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Función helper para peticiones autenticadas
const authenticatedFetch = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
import { 
  ArrowLeft, 
  FileSearch, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldOff,
  Trash2
} from 'lucide-react'


const LogsPage = () => {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [stats, setStats] = useState({})
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [blockedIPs, setBlockedIPs] = useState(new Set())
  const [blockingIP, setBlockingIP] = useState(null)

  // Datos de ejemplo para los logs
  const sampleLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
      level: 'info',
      message: 'Usuario admin inició sesión exitosamente',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      action: 'login'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
      level: 'success',
      message: 'Artículo "Mejores apps de presupuesto" creado exitosamente',
      user: 'editor@example.com',
      ip: '192.168.1.101',
      action: 'create_article'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
      level: 'warning',
      message: 'Intento de acceso con credenciales incorrectas',
      user: 'unknown@example.com',
      ip: '192.168.1.102',
      action: 'failed_login'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutos atrás
      level: 'error',
      message: 'Error al conectar con la base de datos',
      user: 'system',
      ip: 'localhost',
      action: 'database_error'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hora atrás
      level: 'info',
      message: 'Categoría "Inversiones" actualizada',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      action: 'update_category'
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 horas atrás
      level: 'success',
      message: 'Usuario nuevo registrado: editor2@example.com',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      action: 'create_user'
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
      level: 'warning',
      message: 'Múltiples intentos de login fallidos desde IP 192.168.1.105',
      user: 'system',
      ip: '192.168.1.105',
      action: 'security_alert'
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 horas atrás
      level: 'info',
      message: 'Backup automático completado exitosamente',
      user: 'system',
      ip: 'localhost',
      action: 'backup'
    }
  ]

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true)
      setCurrentPage(page)
      const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      if (t) {
        console.log('LogsPage: token present, first 10 chars:', t.substring(0, 10) + '...')
      } else {
        console.log('LogsPage: token missing before fetchLogs')
      }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })
      
      if (selectedAction !== 'all') {
        params.append('action', selectedAction)
      }
      
      if (selectedDate) {
        params.append('startDate', selectedDate)
        params.append('endDate', selectedDate)
      }
      
      if (searchTerm) {
              params.append('search', searchTerm)
            }

            const response = await authenticatedFetch(`/api/logs?${params}`, { cache: 'no-store' })
            if (response.ok) {
              const data = await response.json()
              setLogs(data.logs)
        setFilteredLogs(data.logs)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        console.error('Error fetching logs')
        // Fallback a datos de ejemplo si falla la API
        setLogs(sampleLogs)
        setFilteredLogs(sampleLogs)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      // Fallback a datos de ejemplo si falla la API
      setLogs(sampleLogs)
      setFilteredLogs(sampleLogs)
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetchLogs(1)
    fetchBlockedIPs()
  }, [])

  // Refetch logs when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchLogs(1)
    }, 500) // Debounce para evitar muchas llamadas

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedAction, selectedDate])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'visit_home':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'visit_articles_list':
        return <FileSearch className="h-5 w-5 text-green-500" />
      case 'view_article':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'admin_access':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  // Cargar IPs bloqueadas
  const fetchBlockedIPs = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/blocked-ips')
      
      if (response.ok) {
        const data = await response.json()
        const blockedIPSet = new Set(data.blockedIPs.map(item => item.ip))
        setBlockedIPs(blockedIPSet)
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error)
    }
  }

  // Bloquear IP
  const blockIP = async (ip) => {
    try {
      setBlockingIP(ip)
      const response = await authenticatedFetch('/api/admin/blocked-ips', {
        method: 'POST',
        body: JSON.stringify({
          ip,
          reason: 'Bloqueado desde panel de logs'
        })
      })
      
      if (response.ok) {
        setBlockedIPs(prev => new Set([...prev, ip]))
        alert('IP bloqueada exitosamente')
      } else {
        const data = await response.json()
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error blocking IP:', error)
      alert('Error al bloquear IP')
    } finally {
      setBlockingIP(null)
    }
  }

  // Borrar todos los logs
  const deleteAllLogs = async () => {
    const confirmed = window.confirm(
      '⚠️ ADVERTENCIA: Esta acción eliminará TODOS los logs del sistema de forma permanente.\n\n' +
      'Esta información es crítica para la seguridad y auditoría del sitio.\n\n' +
      '¿Estás completamente seguro de que deseas continuar?'
    )
    
    if (!confirmed) return
    
    // Segunda confirmación para información tan delicada
    const doubleConfirmed = window.confirm(
      '🚨 CONFIRMACIÓN FINAL\n\n' +
      'Vas a eliminar TODOS los registros de acceso del sistema.\n' +
      'Esta acción NO se puede deshacer.\n\n' +
      'Escribe "CONFIRMAR" en tu mente y haz clic en Aceptar para proceder.'
    )
    
    if (!doubleConfirmed) return
    
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/logs?all=true', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setLogs([])
        setFilteredLogs([])
        alert('✅ Todos los logs han sido eliminados exitosamente')
        fetchLogs() // Recargar para mostrar página vacía
      } else {
        const data = await response.json()
        alert(`❌ Error: ${data.message || 'No se pudieron eliminar los logs'}`)
      }
    } catch (error) {
      console.error('Error deleting all logs:', error)
      alert('❌ Error al eliminar los logs')
    } finally {
      setLoading(false)
    }
  }

  // Desbloquear IP
  const unblockIP = async (ip) => {
    try {
      setBlockingIP(ip)
      const response = await authenticatedFetch(`/api/admin/blocked-ips?ip=${encodeURIComponent(ip)}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBlockedIPs(prev => {
          const newSet = new Set(prev)
          newSet.delete(ip)
          return newSet
        })
        alert('IP desbloqueada exitosamente')
      } else {
        const data = await response.json()
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error unblocking IP:', error)
      alert('Error al desbloquear la IP')
    } finally {
      setBlockingIP(null)
    }
  }

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'visit_home':
        return 'bg-blue-100 text-blue-800'
      case 'visit_articles_list':
        return 'bg-green-100 text-green-800'
      case 'view_article':
        return 'bg-emerald-100 text-emerald-800'
      case 'admin_access':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionLabel = (action) => {
    switch (action) {
      case 'visit_home':
        return 'Visita Home'
      case 'visit_articles_list':
        return 'Lista Artículos'
      case 'view_article':
        return 'Ver Artículo'
      case 'admin_access':
        return 'Acceso Admin'
      default:
        return action.replace('_', ' ').toUpperCase()
    }
  }

  const refreshLogs = () => {
    fetchLogs(1)
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/admin"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileSearch className="h-8 w-8 mr-3 text-gray-600" />
                  Logs del Sistema
                </h1>
                <p className="text-gray-600 mt-2">
                  Registro de actividades y eventos del sistema
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshLogs}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
                
                <button
                  onClick={deleteAllLogs}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  title="Borrar todos los logs - Acción irreversible"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Borrar Todos
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar en logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">Todas las acciones</option>
                  <option value="visit_home">Visita Home</option>
                  <option value="visit_articles_list">Lista Artículos</option>
                  <option value="view_article">Ver Artículo</option>
                  <option value="admin_access">Acceso Admin</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedAction('all')
                  setSelectedDate('')
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Info className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Visitas Home</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.visit_home || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileSearch className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lista Artículos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.visit_articles_list || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ver Artículos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.view_article || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Acceso Admin</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.admin_access || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Registros ({filteredLogs.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <FileSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron logs con los filtros aplicados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ruta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getActionIcon(log.action)}
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(log.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={log.path}>
                            {log.path}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>{log.ip}</span>
                            {blockedIPs.has(log.ip) ? (
                              <button
                                onClick={() => unblockIP(log.ip)}
                                disabled={blockingIP === log.ip}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 disabled:opacity-50"
                                title="Desbloquear IP"
                              >
                                {blockingIP === log.ip ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <ShieldOff className="h-3 w-3" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => blockIP(log.ip)}
                                disabled={blockingIP === log.ip}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50"
                                title="Bloquear IP"
                              >
                                {blockingIP === log.ip ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Shield className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.article ? (
                            <span className="text-blue-600 hover:text-blue-800" title={log.article.title}>
                              {log.article.title.length > 30 ? `${log.article.title.substring(0, 30)}...` : log.article.title}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user ? (
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              {log.user.name}
                            </div>
                          ) : (
                            <span className="text-gray-400">Anónimo</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Paginación */}
            {!loading && filteredLogs.length > 0 && pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => fetchLogs(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchLogs(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{' '}
                      <span className="font-medium">{((currentPage - 1) * 20) + 1}</span>
                      {' '}a{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 20, pagination.totalCount || 0)}
                      </span>
                      {' '}de{' '}
                      <span className="font-medium">{pagination.totalCount || 0}</span>
                      {' '}resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => fetchLogs(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Números de página */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNumber;
                        if (pagination.totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNumber = pagination.totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => fetchLogs(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNumber === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => fetchLogs(currentPage + 1)}
                        disabled={currentPage >= pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default LogsPage
