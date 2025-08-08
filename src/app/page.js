import Link from 'next/link'
import { ArrowRight, Star, TrendingUp, Shield, Users, BookOpen } from 'lucide-react'
import FeaturedArticles from '@/components/FeaturedArticles'
import PopularApps from '@/components/PopularApps'


export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Reviews Detalladas',
      description: 'Análisis completos de las mejores apps de finanzas personales del mercado.'
    },
    {
      icon: TrendingUp,
      title: 'Tutoriales Prácticos',
      description: 'Aprende a usar las herramientas financieras más populares paso a paso.'
    },
    {
      icon: Shield,
      title: 'Información Confiable',
      description: 'Contenido verificado por expertos en finanzas personales.'
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Únete a miles de usuarios que ya mejoraron sus finanzas.'
    }
  ]

  const stats = [
    { number: '50+', label: 'Apps Analizadas' },
    { number: '100+', label: 'Artículos Publicados' },
    { number: '10K+', label: 'Usuarios Activos' },
    { number: '4.8', label: 'Rating Promedio' }
  ]

  return (
    <div className="bg-light-gray">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy to-emerald text-white" style={{backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Guía Definitiva para
              <span className="block text-emerald">Finanzas Personales</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Descubre las mejores aplicaciones financieras, lee reviews detalladas y aprende 
              a gestionar tu dinero de manera inteligente con nuestros tutoriales expertos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articulos"
                className="bg-emerald text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
              >
                Explorar Artículos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/reviews"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald hover:text-white hover:border-emerald transition-colors duration-200"
              >
                Ver Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <FeaturedArticles />

      {/* Popular Apps */}
      <PopularApps />


    </div>
  )
}
