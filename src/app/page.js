'use client'

import Link from 'next/link'
import { ArrowRight, Star, TrendingUp, Shield, Users, BookOpen, Quote, Calendar, Clock, Eye } from 'lucide-react'
import FeaturedArticles from '@/components/FeaturedArticles'
import AccessTracker from '@/components/AccessTracker'
import { useState, useEffect } from 'react'

export default function Home() {
  const [latestArticle, setLatestArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestArticle = async () => {
      try {
        const response = await fetch('/api/articles?limit=1', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data.articles) && data.articles.length > 0) {
            setLatestArticle(data.articles[0])
          }
        }
      } catch (error) {
        console.error('Error fetching latest article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticle()
  }, [])

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  const features = [
    {
      icon: BookOpen,
      title: 'Reviews Detalladas',
      description: 'Análisis completos de las mejores apps de finanzas personales del mercado.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Tutoriales Prácticos',
      description: 'Guías paso a paso para sacar el máximo provecho a tus herramientas financieras.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Shield,
      title: 'Seguridad Primero',
      description: 'Evaluamos la seguridad y privacidad para proteger tus datos personales.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Únete a una comunidad que comparte consejos y experiencias reales.',
      color: 'bg-yellow-50 text-yellow-600'
    }
  ]

  const stats = [
    { label: 'Lectores Mensuales', value: '10k+' },
    { label: 'Artículos Publicados', value: '150+' },
    { label: 'Apps Analizadas', value: '50+' },
    { label: 'Guías Prácticas', value: '30+' }
  ]

  const testimonials = [
    {
      text: "Las reviews son muy claras y me ayudaron a elegir la app perfecta para mi presupuesto.",
      author: "María García",
      role: "Emprendedora"
    },
    {
      text: "Gracias a sus tutoriales, ahora entiendo cómo gestionar mis finanzas con YNAB.",
      author: "Juan Pérez",
      role: "Estudiante"
    },
    {
      text: "Los tutoriales me ayudaron a entender cómo usar YNAB correctamente. Ahora tengo mis finanzas bajo control.",
      author: "Carlos Ruiz",
      role: "Freelancer"
    }
  ]

  return (
    <div className="bg-white">
      <AccessTracker />
      {/* Hero Section - Estilo Blogger */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-slate-800 to-navy">
        <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-emerald/20 text-emerald px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                Blog #1 en Finanzas Personales
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Domina tus
                <span className="block text-emerald">Finanzas Personales</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Descubre reviews honestas, tutoriales prácticos y consejos expertos para 
                tomar el control total de tu dinero y alcanzar tus metas financieras.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/articulos"
                  className="bg-emerald text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  Explorar Contenido
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

              </div>

              {/* Stats en Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 hidden">
                {stats.map((stat, index) => {
                  return (
                    <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tarjeta del Último Artículo */}
            <div className="block">
              <div className="relative">
                {loading ? (
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    <div className="mt-6">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ) : latestArticle ? (
                  <Link href={`/articulos/${latestArticle.slug}`} className="block group">
                    <div className="relative bg-gradient-to-br from-white via-white to-blue-50 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden border border-transparent hover:border-emerald/20">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-blue/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-emerald/30 rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-8 w-1 h-1 bg-blue/40 rounded-full animate-pulse delay-300"></div>
                      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple/30 rounded-full animate-bounce delay-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald/25 group-hover:scale-110 transition-all duration-300">
                            <BookOpen className="h-6 w-6 text-white group-hover:animate-pulse" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-semibold text-navy group-hover:text-emerald transition-colors duration-300">Último Artículo</h4>
                            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{formatTimeAgo(latestArticle.createdAt)}</p>
                          </div>
                          <div className="ml-auto">
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-emerald transition-colors duration-300">
                          {latestArticle.title}
                        </h3>
                        <div 
                          className="text-gray-600 text-sm line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 break-words"
                          dangerouslySetInnerHTML={{ __html: (() => {
                            try {
                              let html = latestArticle.excerpt || ''
                              const decode = (s) => {
                                const ta = document.createElement('textarea')
                                ta.innerHTML = s
                                return ta.value || s
                              }
                              if (/[&]((lt|gt|amp|quot|nbsp|#\d+));/i.test(html)) {
                                  html = decode(html)
                              }
                              return html
                            } catch {
                              return latestArticle.excerpt || ''
                            }
                          })() }}
                        />
                        <div className="mt-6 relative overflow-hidden rounded-xl">
                          <div className="bg-gradient-to-r from-emerald/10 to-blue/10 rounded-xl p-4 border border-emerald/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Leer ahora</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" /> Publicado recientemente
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>5 min</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span>{latestArticle.views || '0'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-navy">Último Artículo</h4>
                        <p className="text-sm text-gray-500">No disponible</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">
                      No hay artículos publicados
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Aún no hay artículos publicados en el sitio.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Estilo Blogger */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">¿Por qué AppFinanzasHoy?</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Compartimos información práctica y honesta para ayudarte a tomar mejores decisiones financieras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl shadow-sm border ${feature.color}`}>
                <feature.icon className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg text-navy">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedArticles />

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy">Lo que dicen nuestros lectores</h2>
            <p className="text-gray-600 mt-2">Experiencias reales de personas que transformaron sus finanzas con nuestra ayuda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <Quote className="h-6 w-6 text-emerald mb-4" />
                <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-navy">{t.author}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
