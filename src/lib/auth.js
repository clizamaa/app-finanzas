// Utilidades para manejo de autenticación
import { useState, useEffect } from 'react'

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} Token de autenticación o null si no existe
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken')
  }
  return null
}

/**
 * Guarda el token de autenticación en localStorage
 * @param {string} token - Token de autenticación
 */
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token)
  }
}

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si hay un token válido
 */
export const isAuthenticated = () => {
  return !!getAuthToken()
}

/**
 * Realiza una petición autenticada a la API
 * @param {string} url - URL de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<Response>} Respuesta de la API
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken()
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  const response = await fetch(url, mergedOptions)
  
  // Si la respuesta es 401, el token probablemente expiró
  if (response.status === 401) {
    removeAuthToken()
    // Redirigir al login si estamos en el cliente
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  }
  
  return response
}

/**
 * Hook personalizado para verificar autenticación
 * @returns {object} Estado de autenticación y funciones
 */
export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authenticatedFetch('/api/admin/auth/login', {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuth(true)
      } else {
        removeAuthToken()
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      removeAuthToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        setAuthToken(data.token)
        setUser(data.user)
        setIsAuth(true)
        return { success: true, data }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
    setIsAuth(false)
  }

  return {
    isAuthenticated: isAuth,
    loading,
    user,
    login,
    logout,
    checkAuth
  }
}