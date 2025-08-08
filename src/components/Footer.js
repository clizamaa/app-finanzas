import Link from 'next/link'
import { DollarSign, Mail, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Contenido': [
      { name: 'Artículos', href: '/articulos' },
      { name: 'Reviews', href: '/reviews' },
      { name: 'Tutoriales', href: '/tutoriales' },
      { name: 'Categorías', href: '/categorias' },
    ],
    'Recursos': [
      { name: 'Calculadoras', href: '/calculadoras' },
      { name: 'Herramientas', href: '/herramientas' },
      { name: 'Glosario', href: '/glosario' },
      { name: 'FAQ', href: '/faq' },
    ],
    'Empresa': [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Política de Privacidad', href: '/privacidad' },
      { name: 'Términos de Uso', href: '/terminos' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ]

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img src="/logo.png" alt="AppFinanzasHoy" className="h-12 w-auto" />
            </Link>
            <p className="text-gray-400 mb-4">
              Tu guía completa para las mejores aplicaciones de finanzas personales. 
              Reviews, tutoriales y consejos para gestionar tu dinero de manera inteligente.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>



        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} AppFinanzasHoy. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Términos
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer