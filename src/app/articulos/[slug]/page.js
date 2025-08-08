'use client'

import Link from 'next/link'
import { Calendar, Clock, User, Share2, BookOpen, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import CommentSection from '@/components/CommentSection'
import RelatedArticles from '@/components/RelatedArticles'

// Metadata moved to layout.js due to 'use client' directive

const ArticlePage = ({ params }) => {
  // En producción, aquí harías una consulta a la base de datos usando params.slug
  const article = {
    id: 1,
    title: 'Las 10 Mejores Apps de Presupuesto Personal para 2024',
    excerpt: 'Descubre cuáles son las aplicaciones más efectivas para controlar tus gastos y crear un presupuesto que realmente funcione.',
    content: `
# Las 10 Mejores Apps de Presupuesto Personal para 2024

Gestionar las finanzas personales nunca ha sido tan importante como ahora. Con la inflación y los gastos en constante aumento, tener un control preciso de nuestro dinero se ha vuelto esencial. Afortunadamente, la tecnología nos ofrece herramientas poderosas para ayudarnos en esta tarea.

## ¿Por qué usar una app de presupuesto?

Las aplicaciones de presupuesto ofrecen ventajas significativas sobre los métodos tradicionales:

- **Automatización**: Sincronización automática con tus cuentas bancarias
- **Visualización**: Gráficos y reportes que facilitan la comprensión
- **Alertas**: Notificaciones cuando te acercas a tus límites
- **Accesibilidad**: Disponible en cualquier momento desde tu móvil

## Top 10 Apps de Presupuesto

### 1. YNAB (You Need A Budget)

**Precio**: $14.99/mes  
**Plataformas**: iOS, Android, Web

YNAB es considerada por muchos como la mejor aplicación de presupuesto disponible. Su metodología de "dar un trabajo a cada dólar" ha ayudado a millones de personas a tomar control de sus finanzas.

**Características destacadas:**
- Metodología probada de presupuesto
- Sincronización en tiempo real
- Excelente soporte al cliente
- Educación financiera integrada

### 2. Mint

**Precio**: Gratis  
**Plataformas**: iOS, Android, Web

Mint es una de las aplicaciones gratuitas más completas del mercado. Ofrece seguimiento automático de gastos, alertas de facturas y monitoreo de crédito.

**Características destacadas:**
- Completamente gratuita
- Categorización automática de transacciones
- Alertas de facturas y gastos inusuales
- Monitoreo de puntaje crediticio

### 3. PocketGuard

**Precio**: Gratis con versión premium a $7.99/mes  
**Plataformas**: iOS, Android

PocketGuard se enfoca en una pregunta simple: "¿Cuánto puedo gastar?" Su interfaz minimalista hace que sea fácil ver cuánto dinero tienes disponible después de facturas y ahorros.

**Características destacadas:**
- Interfaz simple e intuitiva
- Cálculo automático de dinero disponible
- Seguimiento de suscripciones
- Alertas de gastos excesivos

## Cómo elegir la app correcta

Al seleccionar una aplicación de presupuesto, considera estos factores:

1. **Tu estilo de presupuesto**: ¿Prefieres control manual o automatización?
2. **Características necesarias**: ¿Necesitas seguimiento de inversiones?
3. **Precio**: ¿Estás dispuesto a pagar por funciones premium?
4. **Seguridad**: ¿La app tiene buenas medidas de seguridad?

## Conclusión

La mejor aplicación de presupuesto es aquella que realmente usarás. Te recomendamos probar varias opciones gratuitas antes de comprometerte con una versión de pago. Recuerda que la herramienta es solo tan buena como la consistencia con la que la uses.

¿Has probado alguna de estas aplicaciones? ¡Déjanos saber tu experiencia en los comentarios!
    `,
    image: '/images/articles/presupuesto-apps.jpg',
    category: { name: 'Reviews', slug: 'reviews' },
    readTime: '8 min',
    views: 1250,
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    slug: 'mejores-apps-presupuesto-2024',
    tags: [
      { name: 'Presupuesto', slug: 'presupuesto' },
      { name: 'Apps', slug: 'apps' },
      { name: 'Finanzas Personales', slug: 'finanzas-personales' }
    ],
    author: {
      name: 'AppFinanzasHoy Team',
      bio: 'Expertos en finanzas personales y tecnología financiera'
    }
  }

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
      alert('URL copiada al portapapeles')
    }
  }

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
        <header className="bg-light-gray rounded-lg shadow-sm p-8 mb-8">
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
                <span>Publicado el {formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{article.readTime} de lectura</span>
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
        <div className="mb-8">
          <div className="h-64 md:h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-2xl">{article.category.name}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-light-gray rounded-lg shadow-sm p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>

        {/* Article Footer */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrito por</h3>
              <p className="text-gray-600">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.bio}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/articulos/tag/${tag.slug}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
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