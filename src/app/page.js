import Link from 'next/link'
import { ArrowRight, Star, TrendingUp, Shield, Users, BookOpen, Quote, Calendar, Clock, Eye } from 'lucide-react'
import FeaturedArticles from '@/components/FeaturedArticles'



export default function Home() {
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
      description: 'Aprende a usar las herramientas financieras más populares paso a paso.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Shield,
      title: 'Información Confiable',
      description: 'Contenido verificado por expertos en finanzas personales.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Únete a miles de usuarios que ya mejoraron sus finanzas.',
      color: 'bg-purple-50 text-purple-600'
    }
  ]

  const stats = [
    { number: '50+', label: 'Apps Analizadas', icon: Shield },
    { number: '100+', label: 'Artículos Publicados', icon: BookOpen },
    { number: '10K+', label: 'Usuarios Activos', icon: Users },
    { number: '4.8', label: 'Rating Promedio', icon: Star }
  ]

  const testimonials = [
    {
      text: "Gracias a AppFinanzasHoy encontré la app perfecta para gestionar mi presupuesto. Los reviews son súper detallados.",
      author: "María González",
      role: "Emprendedora"
    },
    {
      text: "Los tutoriales me ayudaron a entender cómo usar YNAB correctamente. Ahora tengo mis finanzas bajo control.",
      author: "Carlos Ruiz",
      role: "Freelancer"
    }
  ]

  return (
    <div className="bg-white">
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
                <Link
                  href="/reviews"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-navy transition-all duration-200"
                >
                  Ver Reviews
                </Link>
              </div>

              {/* Stats en Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-emerald mr-2" />
                        <span className="text-2xl font-bold">{stat.number}</span>
                      </div>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-navy">Último Artículo</h4>
                      <p className="text-sm text-gray-500">Hace 2 horas</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">
                    Las 10 Mejores Apps de Presupuesto 2024
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Análisis completo de las aplicaciones más populares para gestionar tu presupuesto personal...
                  </p>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="mr-4">2.5k vistas</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8 min lectura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Estilo Blogger */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              ¿Por qué elegir AppFinanzasHoy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos tu recurso confiable para navegar el complejo mundo de las finanzas personales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 ${feature.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <FeaturedArticles />

      {/* Testimonials Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Lo que dicen nuestros lectores
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Miles de personas han transformado sus finanzas gracias a nuestro contenido
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <Quote className="h-8 w-8 text-emerald mb-4" />
                <p className="text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
