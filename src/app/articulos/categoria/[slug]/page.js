'use client'

import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, Filter, Grid, List } from 'lucide-react'
import { useState } from 'react'

// Función para generar metadatos dinámicos
export async function generateMetadata({ params }) {
  // En producción, aquí harías una consulta a la base de datos
  const categoryNames = {
    'reviews': 'Reviews',
    'tutoriales': 'Tutoriales',
    'analisis': 'Análisis',
    'noticias': 'Noticias'
  }
  
  const categoryName = categoryNames[params.slug] || 'Categoría'
  
  return {
    title: `${categoryName} - Artículos de Finanzas Personales`,
    description: `Descubre todos nuestros artículos de ${categoryName.toLowerCase()} sobre finanzas personales, inversiones y aplicaciones financieras.`,
    openGraph: {
      title: `${categoryName} - AppFinanzasHoy`,
      description: `Artículos de ${categoryName.toLowerCase()} sobre finanzas personales`,
      type: 'website',
    },
  }
}

const CategoryPage = ({ params }) => {
  // En producción, estos datos vendrían de la base de datos
  const categories = {
    'reviews': {
      name: 'Reviews',
      description: 'Análisis detallados de las mejores aplicaciones y herramientas financieras del mercado.',
      color: 'blue',
      icon: '⭐'
    },
    'tutoriales': {
      name: 'Tutoriales',
      description: 'Guías paso a paso para mejorar tus finanzas personales y alcanzar tus objetivos financieros.',
      color: 'green',
      icon: '📚'
    },
    'analisis': {
      name: 'Análisis',
      description: 'Análisis profundos del mercado financiero, tendencias y oportunidades de inversión.',
      color: 'purple',
      icon: '📊'
    },
    'noticias': {
      name: 'Noticias',
      description: 'Las últimas noticias del mundo financiero que pueden impactar tus decisiones de inversión.',
      color: 'red',
      icon: '📰'
    }
  }

  const currentCategory = categories[params.slug] || categories['reviews']

  // Artículos de ejemplo filtrados por categoría
  const allArticles = [
    {
      id: 1,
      title: 'Las 10 Mejores Apps de Presupuesto Personal para 2024',
      excerpt: 'Descubre cuáles son las aplicaciones más efectivas para controlar tus gastos y crear un presupuesto que realmente funcione.',
      image: '/images/articles/presupuesto-apps.jpg',
      category: 'reviews',
      readTime: '8 min',
      views: 1250,
      publishedAt: '2024-01-15',
      slug: 'mejores-apps-presupuesto-2024',
      featured: true
    },
    {
      id: 2,
      title: 'Cómo Crear un Fondo de Emergencia en 6 Meses',
      excerpt: 'Aprende la estrategia paso a paso para construir tu colchón financiero y protegerte de imprevistos.',
      image: '/images/articles/fondo-emergencia.jpg',
      category: 'tutoriales',
      readTime: '6 min',
      views: 890,
      publishedAt: '2024-01-12',
      slug: 'como-crear-fondo-emergencia-6-meses',
      featured: false
    },
    {
      id: 3,
      title: 'Análisis: El Futuro de las Fintech en Latinoamérica',
      excerpt: 'Un análisis profundo sobre las tendencias y oportunidades en el sector fintech de la región.',
      image: '/images/articles/fintech-latam.jpg',
      category: 'analisis',
      readTime: '12 min',
      views: 1456,
      publishedAt: '2024-01-10',
      slug: 'futuro-fintech-latinoamerica',
      featured: true
    },
    {
      id: 4,
      title: 'Revolut vs Wise: Comparativa Completa 2024',
      excerpt: 'Comparamos las dos plataformas más populares para transferencias internacionales y manejo de múltiples divisas.',
      image: '/images/articles/revolut-vs-wise.jpg',
      category: 'reviews',
      readTime: '10 min',
      views: 2100,
      publishedAt: '2024-01-08',
      slug: 'revolut-vs-wise-comparativa-2024',
      featured: false
    },
    {
      id: 5,
      title: 'Guía Completa: Cómo Invertir en ETFs',
      excerpt: 'Todo lo que necesitas saber para comenzar a invertir en ETFs de forma inteligente y diversificada.',
      image: '/images/articles/invertir-etfs.jpg',
      category: 'tutoriales',
      readTime: '15 min',
      views: 1789,
      publishedAt: '2024-01-05',
      slug: 'guia-completa-invertir-etfs',
      featured: true
    },
    {
      id: 6,
      title: 'Bancos Digitales Alcanzan Record de Usuarios',
      excerpt: 'Los bancos digitales superan los 50 millones de usuarios en Latinoamérica durante 2024.',
      image: '/images/articles/bancos-digitales-record.jpg',
      category: 'noticias',
      readTime: '4 min',
      views: 856,
      publishedAt: '2024-01-03',
      slug: 'bancos-digitales-record-usuarios',
      featured: false
    }
  ]

  // Filtrar artículos por categoría
  const categoryArticles = allArticles.filter(article => article.category === params.slug)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link href="/articulos" className="hover:text-blue-600">Artículos</Link>
            <span>/</span>
            <span className="text-gray-900">{currentCategory.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/articulos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a artículos
        </Link>

        {/* Category Header */}
        <div className="bg-light-gray rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {currentCategory.description}
            </p>
            <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getColorClasses(currentCategory.color)}`}>
              <span className="font-medium">
                {categoryArticles.length} artículo{categoryArticles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((article) => (
              <article key={article.id} className="bg-light-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                  <span className="text-white font-semibold text-lg">{currentCategory.name}</span>
                  {article.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      Destacado
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Article Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      href={`/articulos/${article.slug}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {/* Article Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{formatViews(article.views)} vistas</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Leer artículo completo
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-light-gray rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Próximamente
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos trabajando en contenido increíble para esta categoría. ¡Vuelve pronto!
            </p>
            <Link
              href="/articulos"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Ver todos los artículos
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora Otras Categorías
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categories)
              .filter(([slug]) => slug !== params.slug)
              .map(([slug, category]) => (
                <Link
                  key={slug}
                  href={`/articulos/categoria/${slug}`}
                  className="bg-light-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {allArticles.filter(article => article.category === slug).length} artículos
                  </p>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage