import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const FeaturedArticles = () => {
  // Datos de ejemplo - en producción vendrían de la base de datos
  const featuredArticles = [
    {
      id: 1,
      title: 'Las 10 Mejores Apps de Presupuesto Personal para 2024',
      excerpt: 'Descubre cuáles son las aplicaciones más efectivas para controlar tus gastos y crear un presupuesto que realmente funcione.',
      image: '/images/articles/presupuesto-apps.jpg',
      category: 'Reviews',
      readTime: '8 min',
      publishedAt: '2024-01-15',
      slug: 'mejores-apps-presupuesto-2024'
    },
    {
      id: 2,
      title: 'Cómo Configurar YNAB: Guía Completa para Principiantes',
      excerpt: 'Tutorial paso a paso para configurar You Need A Budget y comenzar a tomar control total de tus finanzas personales.',
      image: '/images/articles/ynab-tutorial.jpg',
      category: 'Tutoriales',
      readTime: '12 min',
      publishedAt: '2024-01-12',
      slug: 'como-configurar-ynab-guia-completa'
    },
    {
      id: 3,
      title: 'Mint vs PocketGuard: Comparativa Detallada',
      excerpt: 'Análisis completo de dos de las apps de finanzas más populares. Descubre cuál se adapta mejor a tu estilo de vida.',
      image: '/images/articles/mint-vs-pocketguard.jpg',
      category: 'Comparativas',
      readTime: '10 min',
      publishedAt: '2024-01-10',
      slug: 'mint-vs-pocketguard-comparativa'
    }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="bg-light-gray py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Artículos Destacados
          </h2>
          <p className="text-xl text-text-gray max-w-3xl mx-auto">
            Mantente al día con las últimas tendencias en finanzas personales y 
            descubre las mejores herramientas para gestionar tu dinero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 bg-gray-200">
                {/* Placeholder para imagen */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-emerald flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{article.category}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-light-gray text-navy px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  <Link 
                    href={`/articulos/${article.slug}`}
                    className="hover:text-emerald transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-text-gray mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-gray mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
                
                <Link
                  href={`/articulos/${article.slug}`}
                  className="inline-flex items-center text-emerald font-medium hover:text-green-600 transition-colors duration-200"
                >
                  Leer más
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/articulos"
            className="bg-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
          >
            Ver Todos los Artículos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedArticles