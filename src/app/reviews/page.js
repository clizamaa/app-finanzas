'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Star, Filter, Search, Smartphone, Shield, ArrowRight } from 'lucide-react'

// Metadata moved to layout.js due to 'use client' directive

const ReviewsPage = () => {
  // Datos de ejemplo - en producción vendrían de la base de datos
  const apps = [
    {
      id: 1,
      name: 'YNAB (You Need A Budget)',
      description: 'La aplicación de presupuesto más completa del mercado con metodología probada.',
      rating: 4.8,
      downloads: '2M+',
      price: '$14.99/mes',
      category: 'Presupuesto',
      platform: ['iOS', 'Android', 'Web'],
      pros: [
        'Metodología de presupuesto muy efectiva',
        'Sincronización en tiempo real',
        'Excelente soporte al cliente',
        'Educación financiera integrada'
      ],
      cons: [
        'Precio relativamente alto',
        'Curva de aprendizaje pronunciada',
        'No tiene versión gratuita'
      ],
      features: ['Presupuesto', 'Sincronización bancaria', 'Reportes', 'Metas'],
      security: 'Cifrado de grado bancario',
      slug: 'ynab-review',
      featured: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mint',
      description: 'Aplicación gratuita completa para seguimiento de gastos y presupuesto.',
      rating: 4.5,
      downloads: '10M+',
      price: 'Gratis',
      category: 'Presupuesto',
      platform: ['iOS', 'Android', 'Web'],
      pros: [
        'Completamente gratuita',
        'Categorización automática',
        'Alertas de facturas',
        'Monitoreo de crédito incluido'
      ],
      cons: [
        'Muchos anuncios',
        'Categorización a veces incorrecta',
        'Interfaz algo desactualizada'
      ],
      features: ['Presupuesto', 'Seguimiento gastos', 'Alertas', 'Crédito'],
      security: 'Autenticación de dos factores',
      slug: 'mint-review',
      featured: false,
      lastUpdated: '2024-01-12'
    },
    {
      id: 3,
      name: 'Revolut',
      description: 'Banco digital con múltiples divisas y funciones de inversión.',
      rating: 4.6,
      downloads: '25M+',
      price: 'Freemium',
      category: 'Banco Digital',
      platform: ['iOS', 'Android'],
      pros: [
        'Múltiples divisas sin comisiones',
        'Tarjeta física incluida',
        'Funciones de inversión',
        'Interfaz moderna y intuitiva'
      ],
      cons: [
        'Soporte al cliente limitado',
        'Algunas funciones requieren plan premium',
        'No disponible en todos los países'
      ],
      features: ['Múltiples divisas', 'Inversiones', 'Tarjeta', 'Transferencias'],
      security: 'Regulado por FCA',
      slug: 'revolut-review',
      featured: true,
      lastUpdated: '2024-01-10'
    },
    {
      id: 4,
      name: 'PocketGuard',
      description: 'Aplicación simple que te dice cuánto puedes gastar.',
      rating: 4.3,
      downloads: '1M+',
      price: 'Freemium',
      category: 'Presupuesto',
      platform: ['iOS', 'Android'],
      pros: [
        'Interfaz muy simple',
        'Cálculo automático de dinero disponible',
        'Seguimiento de suscripciones',
        'Alertas útiles'
      ],
      cons: [
        'Funciones limitadas en versión gratuita',
        'No tiene versión web',
        'Menos opciones de personalización'
      ],
      features: ['Presupuesto simple', 'Suscripciones', 'Alertas', 'Metas'],
      security: 'Cifrado SSL',
      slug: 'pocketguard-review',
      featured: false,
      lastUpdated: '2024-01-08'
    },
    {
      id: 5,
      name: 'Robinhood',
      description: 'Plataforma de inversión sin comisiones para principiantes.',
      rating: 4.2,
      downloads: '20M+',
      price: 'Gratis',
      category: 'Inversión',
      platform: ['iOS', 'Android', 'Web'],
      pros: [
        'Sin comisiones de trading',
        'Interfaz muy amigable',
        'Acceso a criptomonedas',
        'Educación financiera'
      ],
      cons: [
        'Funciones de análisis limitadas',
        'Solo disponible en algunos países',
        'Controversias pasadas'
      ],
      features: ['Trading sin comisiones', 'Criptomonedas', 'ETFs', 'Educación'],
      security: 'Protección SIPC',
      slug: 'robinhood-review',
      featured: false,
      lastUpdated: '2024-01-05'
    },
    {
      id: 6,
      name: 'Wise (ex-TransferWise)',
      description: 'La mejor opción para transferencias internacionales.',
      rating: 4.7,
      downloads: '5M+',
      price: 'Por transacción',
      category: 'Transferencias',
      platform: ['iOS', 'Android', 'Web'],
      pros: [
        'Tarifas muy competitivas',
        'Tipo de cambio real',
        'Múltiples divisas',
        'Transparencia total en costos'
      ],
      cons: [
        'No es un banco completo',
        'Límites en algunos países',
        'Verificación puede ser lenta'
      ],
      features: ['Transferencias', 'Múltiples divisas', 'Tarjeta', 'API'],
      security: 'Regulado globalmente',
      slug: 'wise-review',
      featured: true,
      lastUpdated: '2024-01-03'
    }
  ]

  const categories = ['Todas', 'Presupuesto', 'Banco Digital', 'Inversión', 'Transferencias']
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  // Filtrar apps
  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === 'Todas' || app.category === selectedCategory
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Ordenar apps
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'downloads') {
      const aDownloads = parseInt(a.downloads.replace(/[^0-9]/g, ''))
      const bDownloads = parseInt(b.downloads.replace(/[^0-9]/g, ''))
      return bDownloads - aDownloads
    }
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getPriceColor = (price) => {
    if (price === 'Gratis') return 'text-emerald'
    if (price === 'Freemium') return 'text-navy'
    return 'text-orange'
  }

  return (
        <div className="bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Filters */}
            <div className="bg-light-gray rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar aplicaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-emerald text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald/10 hover:text-emerald'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
                >
                  <option value="rating">Mejor calificadas</option>
                  <option value="downloads">Más descargadas</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg">
                Mostrando {sortedApps.length} de {apps.length} aplicaciones
                {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
                {searchTerm && ` que coinciden con "${searchTerm}"`}
              </p>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="reviews">
              {sortedApps.map((app) => (
                <div key={app.id} className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100 ${app.featured ? 'ring-2 ring-emerald/20' : ''}`}>
                  {app.featured && (
                    <div className="bg-gradient-to-r from-emerald to-green-600 text-white px-4 py-3 text-sm font-bold text-center">
                      ⭐ Recomendada por nuestros expertos
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* App Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-navy mb-3">{app.name}</h3>
                        <p className="text-gray-600 mb-4 text-lg leading-relaxed">{app.description}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-3">
                            {renderStars(app.rating)}
                          </div>
                          <span className="text-lg font-semibold text-navy">{app.rating}</span>
                          <span className="text-gray-500 ml-2">({app.downloads} descargas)</span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className={`text-xl font-bold ${getPriceColor(app.price)}`}>
                          {app.price}
                        </div>
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2">
                          {app.category}
                        </div>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center mb-6">
                      <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600 font-medium">
                        Disponible en: {app.platform.join(', ')}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-navy mb-3">Características principales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.features.map((feature, index) => (
                          <span key={index} className="bg-emerald/10 text-emerald px-3 py-2 rounded-full text-sm font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald mb-3 flex items-center">
                          <span className="w-5 h-5 bg-emerald text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
                          Pros:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {app.pros.slice(0, 2).map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-emerald rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-orange mb-3 flex items-center">
                          <span className="w-5 h-5 bg-orange text-white rounded-full flex items-center justify-center text-xs mr-2">✗</span>
                          Contras:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {app.cons.slice(0, 2).map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="flex items-center mb-6">
                      <Shield className="h-5 w-5 text-emerald mr-3" />
                      <span className="text-gray-600 font-medium">Seguridad: {app.security}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/reviews/${app.slug}`}
                        className="bg-emerald text-white px-8 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 font-semibold flex items-center"
                      >
                        Ver review completa
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                      <span className="text-sm text-gray-500">
                        Actualizado: {new Date(app.lastUpdated).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {sortedApps.length === 0 && (
              <div className="bg-light-gray rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-navy mb-4">
                  No encontramos resultados
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas')
                    setSearchTerm('')
                  }}
                  className="bg-emerald text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200"
                >
                  Limpiar filtros
                </button>
              </div>
            )}


          </div>
        </div>
      )
    }

export default ReviewsPage