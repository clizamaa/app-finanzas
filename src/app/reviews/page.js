'use client'

import Link from 'next/link'
import { Star, Download, DollarSign, Shield, Smartphone, Filter, Search } from 'lucide-react'
import { useState } from 'react'

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
    if (price === 'Gratis') return 'text-green-600'
    if (price === 'Freemium') return 'text-blue-600'
    return 'text-orange-600'
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Reviews de Apps Financieras
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Descubre las mejores aplicaciones financieras del mercado con nuestras reviews detalladas y comparativas imparciales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{apps.length}+</div>
              <div className="text-blue-100">Apps Revisadas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">4.5★</div>
              <div className="text-blue-100">Rating Promedio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">50M+</div>
              <div className="text-blue-100">Descargas Totales</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-gray-100 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar aplicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Mejor calificadas</option>
              <option value="downloads">Más descargadas</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {sortedApps.length} de {apps.length} aplicaciones
            {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
            {searchTerm && ` que coinciden con "${searchTerm}"`}
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedApps.map((app) => (
            <div key={app.id} className={`bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${app.featured ? 'ring-2 ring-blue-200' : ''}`}>
              {app.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 text-sm font-bold text-center">
                  ⭐ Recomendada por nuestros expertos
                </div>
              )}
              
              <div className="p-6">
                {/* App Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h3>
                    <p className="text-gray-600 mb-3">{app.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-2">
                        {renderStars(app.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{app.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({app.downloads} descargas)</span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-lg font-bold ${getPriceColor(app.price)}`}>
                      {app.price}
                    </div>
                    <div className="text-sm text-gray-500">{app.category}</div>
                  </div>
                </div>

                {/* Platforms */}
                <div className="flex items-center mb-4">
                  <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Disponible en: {app.platform.join(', ')}
                  </span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Características principales:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">✓ Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {app.pros.slice(0, 2).map((pro, index) => (
                        <li key={index}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2">✗ Contras:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {app.cons.slice(0, 2).map((con, index) => (
                        <li key={index}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Security */}
                <div className="flex items-center mb-4">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Seguridad: {app.security}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/reviews/${app.slug}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Ver review completa
                  </Link>
                  <span className="text-xs text-gray-500">
                    Actualizado: {new Date(app.lastUpdated).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedApps.length === 0 && (
          <div className="bg-gray-100 rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No encontramos resultados
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todas')
                setSearchTerm('')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mt-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encuentras la app que buscas?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Sugiérenos una aplicación para revisar y la incluiremos en nuestro próximo análisis
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Sugerir una app
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage