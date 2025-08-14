import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Users, FileText, Globe } from 'lucide-react'

export default function PoliticaPrivacidad() {
  const lastUpdated = "15 de enero de 2025"

  const sections = [
    {
      id: 'informacion-recopilamos',
      title: 'Información que Recopilamos',
      icon: FileText,
      content: [
        {
          subtitle: 'Información Personal',
          text: 'Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, y cualquier otra información que elijas compartir cuando te suscribes a nuestro newsletter o interactúas con nuestro contenido.'
        },
        {
          subtitle: 'Información de Uso',
          text: 'Recopilamos automáticamente información sobre cómo utilizas nuestro sitio web, incluyendo páginas visitadas, tiempo de permanencia, enlaces en los que haces clic, y tu dirección IP.'
        },
        {
          subtitle: 'Cookies y Tecnologías Similares',
          text: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido.'
        }
      ]
    },
    {
      id: 'como-usamos',
      title: 'Cómo Usamos tu Información',
      icon: Users,
      content: [
        {
          subtitle: 'Provisión de Servicios',
          text: 'Utilizamos tu información para proporcionarte nuestros servicios, incluyendo el acceso a reviews, artículos y tutoriales sobre aplicaciones financieras.'
        },
        {
          subtitle: 'Comunicación',
          text: 'Podemos usar tu información de contacto para enviarte actualizaciones sobre nuevos contenidos, newsletters, y responder a tus consultas.'
        },
        {
          subtitle: 'Mejora del Servicio',
          text: 'Analizamos el uso del sitio para mejorar nuestros servicios, desarrollar nuevas funcionalidades y optimizar la experiencia del usuario.'
        },
        {
          subtitle: 'Cumplimiento Legal',
          text: 'Podemos usar tu información para cumplir con obligaciones legales, resolver disputas y hacer cumplir nuestros términos de servicio.'
        }
      ]
    },
    {
      id: 'compartir-informacion',
      title: 'Compartir tu Información',
      icon: Globe,
      content: [
        {
          subtitle: 'No Vendemos tu Información',
          text: 'Nunca vendemos, alquilamos o comercializamos tu información personal a terceros.'
        },
        {
          subtitle: 'Proveedores de Servicios',
          text: 'Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web y proporcionar nuestros servicios.'
        },
        {
          subtitle: 'Requisitos Legales',
          text: 'Podemos divulgar tu información si es requerido por ley o en respuesta a procesos legales válidos.'
        }
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad de la Información',
      icon: Lock,
      content: [
        {
          subtitle: 'Medidas de Protección',
          text: 'Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.'
        },
        {
          subtitle: 'Limitaciones',
          text: 'Aunque tomamos medidas razonables para proteger tu información, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro.'
        }
      ]
    },
    {
      id: 'tus-derechos',
      title: 'Tus Derechos',
      icon: Shield,
      content: [
        {
          subtitle: 'Acceso y Corrección',
          text: 'Tienes derecho a acceder, corregir o actualizar tu información personal que tenemos en nuestros registros.'
        },
        {
          subtitle: 'Eliminación',
          text: 'Puedes solicitar la eliminación de tu información personal, sujeto a ciertas excepciones legales.'
        },
        {
          subtitle: 'Portabilidad',
          text: 'Tienes derecho a recibir una copia de tu información personal en un formato estructurado y de uso común.'
        },
        {
          subtitle: 'Oposición',
          text: 'Puedes oponerte al procesamiento de tu información personal para ciertos propósitos, incluyendo marketing directo.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Política de Cookies',
      icon: Eye,
      content: [
        {
          subtitle: 'Qué son las Cookies',
          text: 'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.'
        },
        {
          subtitle: 'Tipos de Cookies que Usamos',
          text: 'Utilizamos cookies esenciales para el funcionamiento del sitio, cookies de análisis para entender cómo los usuarios interactúan con nuestro contenido, y cookies de preferencias para recordar tus configuraciones.'
        },
        {
          subtitle: 'Control de Cookies',
          text: 'Puedes controlar y eliminar cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.'
        }
      ]
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <span className="text-gray-900">Política de Privacidad</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-navy">
                Política de Privacidad
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              En AppFinanzasHoy, respetamos tu privacidad y nos comprometemos a proteger 
              tu información personal. Esta política explica cómo recopilamos, usamos y 
              protegemos tu información.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
              <span className="font-medium">Última actualización: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-navy mb-4">Índice de Contenidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <Icon className="h-5 w-5 text-blue-600 mr-3 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    {index + 1}. {section.title}
                  </span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={section.id} id={section.id} className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Tienes Preguntas sobre tu Privacidad?
            </h2>
            <p className="text-xl mb-6 text-blue-100">
              Si tienes alguna pregunta sobre esta Política de Privacidad o sobre 
              cómo manejamos tu información personal, no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sobre-nosotros"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Conoce Más Sobre Nosotros
              </Link>
              <Link
                href="/"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-100 rounded-xl p-6 mt-8">
          <p className="text-sm text-gray-600 text-center">
            <strong>Aviso Legal:</strong> Esta Política de Privacidad puede ser actualizada 
            periódicamente. Te notificaremos sobre cambios significativos publicando la nueva 
            política en esta página. Te recomendamos revisar esta política regularmente para 
            mantenerte informado sobre cómo protegemos tu información.
          </p>
        </div>
      </div>
    </div>
  )
}