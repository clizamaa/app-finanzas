import Link from 'next/link'
import { Calendar, Clock, TrendingUp } from 'lucide-react'

const RelatedArticles = ({ currentArticleId, category }) => {
  // En producción, estos datos vendrían de una consulta a la base de datos
  // filtrada por categoría y excluyendo el artículo actual
  const relatedArticles = [
    {
      id: 2,
      title: 'Cómo Crear un Fondo de Emergencia en 6 Meses',
      excerpt: 'Aprende la estrategia paso a paso para construir tu colchón financiero y protegerte de imprevistos.',
      image: '/images/articles/fondo-emergencia.jpg',
      category: { name: 'Tutoriales', slug: 'tutoriales' },
      readTime: '6 min',
      publishedAt: '2024-01-12',
      slug: 'como-crear-fondo-emergencia-6-meses',
      views: 890
    },
    {
      id: 3,
      title: 'Inversión para Principiantes: Guía Completa 2024',
      excerpt: 'Todo lo que necesitas saber para comenzar a invertir tu dinero de forma inteligente y segura.',
      image: '/images/articles/inversion-principiantes.jpg',
      category: { name: 'Tutoriales', slug: 'tutoriales' },
      readTime: '12 min',
      publishedAt: '2024-01-10',
      slug: 'inversion-principiantes-guia-completa-2024',
      views: 1456
    },
    {
      id: 4,
      title: 'Las 5 Mejores Tarjetas de Crédito sin Anualidad',
      excerpt: 'Descubre cuáles son las tarjetas de crédito que ofrecen los mejores beneficios sin costo anual.',
      image: '/images/articles/tarjetas-credito.jpg',
      category: { name: 'Reviews', slug: 'reviews' },
      readTime: '7 min',
      publishedAt: '2024-01-08',
      slug: 'mejores-tarjetas-credito-sin-anualidad',
      views: 1123
    },
    {
      id: 5,
      title: 'Criptomonedas: ¿Vale la Pena Invertir en 2024?',
      excerpt: 'Análisis completo del mercado de criptomonedas y si es una buena opción de inversión este año.',
      image: '/images/articles/criptomonedas-2024.jpg',
      category: { name: 'Análisis', slug: 'analisis' },
      readTime: '10 min',
      publishedAt: '2024-01-05',
      slug: 'criptomonedas-vale-pena-invertir-2024',
      views: 2341
    }
  ]

  // Filtrar artículos relacionados (excluyendo el actual)
  const filteredArticles = relatedArticles.filter(article => article.id !== currentArticleId)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  if (filteredArticles.length === 0) {
    return null
  }

  return (
    <section className="bg-light-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-emerald mr-3" />
            <h2 className="text-3xl font-bold text-navy">
              Artículos Relacionados
            </h2>
          </div>
          <p className="text-xl text-text-gray max-w-3xl mx-auto">
            Continúa aprendiendo con estos artículos que podrían interesarte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(0, 3).map((article) => (
            <article key={article.id} className="bg-light-gray rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Article Image */}
              <div className="h-48 bg-gradient-to-br from-navy to-emerald flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{article.category.name}</span>
              </div>

              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <Link
                    href={`/articulos/categoria/${article.category.slug}`}
                    className="inline-block bg-emerald/20 text-emerald px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald/30 transition-colors duration-200"
                  >
                    {article.category.name}
                  </Link>
                </div>

                {/* Article Title */}
                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="hover:text-emerald transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h3>

                {/* Article Excerpt */}
                <p className="text-text-gray mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-text-gray">
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
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{formatViews(article.views)} vistas</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="mt-4">
                  <Link
                    href={`/articulos/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Leer artículo
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center mt-12">
          <Link
            href="/articulos"
            className="inline-flex items-center bg-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Ver todos los artículos
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles