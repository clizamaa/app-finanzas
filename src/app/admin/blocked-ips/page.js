'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Plus, 
  Trash2, 
  Search,
  Calendar,
  User,
  AlertTriangle,
  ArrowLeft,
  Ban,
  X,
  List
} from 'lucide-react'
import { authenticatedFetch } from '@/lib/auth'
import { showSuccess, showError, showDeleteConfirm } from '@/lib/sweetAlert'

const BlockedIPsManagement = () => {
  const [blockedIPs, setBlockedIPs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [formData, setFormData] = useState({
    ip: '',
    reason: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [availableIPs, setAvailableIPs] = useState([])
  const [loadingIPs, setLoadingIPs] = useState(false)
  const [showIPSelector, setShowIPSelector] = useState(false)

  useEffect(() => {
    fetchBlockedIPs()
  }, [])

  const fetchBlockedIPs = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/admin/blocked-ips')
      const data = await response.json()
      
      if (response.ok) {
        setBlockedIPs(data.blockedIPs || [])
      } else {
        showError('Error', data.message || 'Error al cargar IPs bloqueadas')
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error)
      showError('Error', 'Error al cargar IPs bloqueadas')
    } finally {
      setLoading(false)
    }
  }

  const fetchIPsFromLogs = async () => {
    try {
      setLoadingIPs(true)
      const response = await authenticatedFetch('/api/logs?limit=1000')
      const data = await response.json()
      
      if (response.ok) {
        // Extraer IPs únicas de los logs
        const uniqueIPs = [...new Set(data.logs.map(log => log.ip))]
        
        // Filtrar IPs que ya están bloqueadas
        const alreadyBlockedIPs = blockedIPs.map(blocked => blocked.ip)
        const availableIPs = uniqueIPs.filter(ip => !alreadyBlockedIPs.includes(ip))
        
        setAvailableIPs(availableIPs)
        setShowIPSelector(true)
      } else {
        showError('Error', 'Error al cargar IPs desde logs')
      }
    } catch (error) {
      console.error('Error fetching IPs from logs:', error)
      showError('Error', 'Error al cargar IPs desde logs')
    } finally {
      setLoadingIPs(false)
    }
  }

  const selectIPFromLogs = (ip) => {
    setFormData({...formData, ip})
    setShowIPSelector(false)
  }

  const handleBlockIP = async (e) => {
    e.preventDefault()
    if (!formData.ip.trim()) {
      showError('Error', 'La dirección IP es requerida')
      return
    }

    setFormLoading(true)
    try {
      const response = await authenticatedFetch('/api/admin/blocked-ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        showSuccess('Éxito', 'IP bloqueada exitosamente')
        setFormData({ ip: '', reason: '' })
        setShowBlockModal(false)
        fetchBlockedIPs()
      } else {
        showError('Error', data.message || 'Error al bloquear IP')
      }
    } catch (error) {
      console.error('Error blocking IP:', error)
      showError('Error', 'Error al bloquear IP')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUnblockIP = async (ip) => {
    const result = await showDeleteConfirm(`la IP ${ip}`)
    if (result.isConfirmed) {
      try {
        const response = await authenticatedFetch(`/api/admin/blocked-ips?ip=${encodeURIComponent(ip)}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (response.ok) {
          showSuccess('Éxito', 'IP desbloqueada exitosamente')
          fetchBlockedIPs()
        } else {
          showError('Error', data.message || 'Error al desbloquear IP')
        }
      } catch (error) {
        console.error('Error unblocking IP:', error)
        showError('Error', 'Error al desbloquear IP')
      }
    }
  }

  const filteredIPs = blockedIPs.filter(blockedIP => 
    blockedIP.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blockedIP.reason && blockedIP.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando IPs bloqueadas...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">IPs Bloqueadas</h1>
                <p className="text-gray-600 mt-1">Gestiona las direcciones IP bloqueadas del sitio</p>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Ban className="h-4 w-4 mr-2" />
              Bloquear IP
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por IP o razón..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>{searchTerm ? `${filteredIPs.length} IPs encontradas` : `${blockedIPs.length} IPs bloqueadas`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blocked IPs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección IP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Razón
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Bloqueo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIPs.map((blockedIP) => (
                  <tr key={blockedIP.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Ban className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {blockedIP.ip}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {blockedIP.reason || 'Sin razón especificada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(blockedIP.blockedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleUnblockIP(blockedIP.ip)}
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Desbloquear IP"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIPs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron IPs' : 'No hay IPs bloqueadas'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no has bloqueado ninguna dirección IP'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Block IP Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Bloquear Dirección IP</h2>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleBlockIP} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección IP *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.ip}
                      onChange={(e) => setFormData({...formData, ip: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ej: 192.168.1.100"
                      required
                    />
                    <button
                      type="button"
                      onClick={fetchIPsFromLogs}
                      disabled={loadingIPs}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                      title="Seleccionar IP desde logs"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  {loadingIPs && (
                    <p className="text-sm text-blue-600 mt-1">Cargando IPs desde logs...</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón del bloqueo
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe la razón del bloqueo..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {formLoading ? 'Bloqueando...' : 'Bloquear IP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IP Selector Modal */}
      {showIPSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Seleccionar IP desde Logs</h2>
              <button
                onClick={() => setShowIPSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-80 overflow-y-auto">
              {availableIPs.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay IPs disponibles</h3>
                  <p className="text-gray-600">Todas las IPs de los logs ya están bloqueadas o no hay logs disponibles.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecciona una IP de los logs del sistema ({availableIPs.length} disponibles):
                  </p>
                  {availableIPs.map((ip, index) => (
                    <button
                      key={index}
                      onClick={() => selectIPFromLogs(ip)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{ip}</div>
                          <div className="text-sm text-gray-500">Clic para seleccionar</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowIPSelector(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockedIPsManagement