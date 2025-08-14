'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, User, Share2, BookOpen, ArrowLeft } from 'lucide-react'
import { showToast } from '@/lib/sweetAlert'
// Ya no necesitamos ReactMarkdown porque el contenido viene en HTML
import CommentSection from '@/components/CommentSection'
import RelatedArticles from '@/components/RelatedArticles'
import { useParams } from 'next/navigation'
import { getAuthToken } from '@/lib/auth'

// Metadata moved to layout.js due to 'use client' directive

const ArticlePage = () => {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        const response = await fetch(`/api/articles/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        })
        if (!response.ok) {
          if (response.status === 404) {
            setError('Artículo no encontrado')
          } else if (response.status === 401) {
            setError('No autorizado')
          } else {
            throw new Error('Error al cargar el artículo')
          }
          return
        }
        
        const data = await response.json()
        setArticle(data.article)
      } catch (error) {
        console.error('Error fetching article:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      showToast('URL copiada al portapapeles', 'success')
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📰</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-4">{error === 'No autorizado' ? 'Inicia sesión para ver la previsualización del borrador.' : 'El artículo que buscas no existe o no está disponible'}</p>
          <Link 
            href={error === 'No autorizado' ? '/admin/login' : '/articulos'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {error === 'No autorizado' ? 'Ir a iniciar sesión' : 'Ver todos los artículos'}
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  // Calcular tiempo de lectura aproximado (250 palabras por minuto)
  const wordsCount = article.content ? article.content.split(/\s+/).length : 0
  const readTime = Math.ceil(wordsCount / 250)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link href="/articulos" className="hover:text-blue-600">Artículos</Link>
            <span>/</span>
            <Link href={`/articulos/categoria/${article.category.slug}`} className="hover:text-blue-600">
              {article.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/articulos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a artículos
        </Link>

        {/* Article Header */}
        <header className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category.name}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {article.excerpt}
          </p>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4 md:mb-0">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Publicado el {formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{readTime} min de lectura</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.views} vistas</span>
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </button>
          </div>
        </header>

        {/* Article Image */}
        {article.image ? (
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="h-64 md:h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">{article.category.name}</span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Article Footer */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrito por</h3>
              <p className="text-gray-600">AppFinanzasHoy Team</p>
              <p className="text-sm text-gray-500">Expertos en finanzas personales y tecnología financiera</p>
            </div>
            
            {article.tags && article.tags.length > 0 && (
              <div className="mt-4 md:mt-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/articulos/tag/${tag.slug}`}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection articleId={article.id} />
      </article>

      {/* Related Articles */}
      <RelatedArticles currentArticleId={article.id} category={article.category.slug} />
    </div>
  )
}

export default ArticlePage