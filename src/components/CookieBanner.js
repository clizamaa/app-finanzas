'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Settings, Check } from 'lucide-react'

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setIsVisible(false)
  }

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return // Can't change necessary cookies
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!isVisible) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showSettings ? (
            // Main Banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cookie className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Utilizamos cookies para mejorar tu experiencia
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Utilizamos cookies esenciales para el funcionamiento del sitio y cookies opcionales 
                    para análisis y personalización. Puedes aceptar todas, rechazar las opcionales, 
                    o configurar tus preferencias.
                    <Link href="/cookies" className="text-blue-600 hover:text-blue-700 ml-1 underline">
                      Más información
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  Rechazar opcionales
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aceptar todas
                </button>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Configuración de Cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies Necesarias</h4>
                    <p className="text-sm text-gray-600">
                      Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies de Análisis</h4>
                    <p className="text-sm text-gray-600">
                      Nos ayudan a entender cómo los visitantes interactúan con el sitio web.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                        preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies de Marketing</h4>
                    <p className="text-sm text-gray-600">
                      Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                        preferences.marketing ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
                
                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies Funcionales</h4>
                    <p className="text-sm text-gray-600">
                      Permiten funcionalidades mejoradas y personalización, como recordar preferencias.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                        preferences.functional ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CookieBanner