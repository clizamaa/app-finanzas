/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'AppFinanzasHoy - Tu Guía de Finanzas Personales',
  description: 'Descubre las mejores aplicaciones de finanzas personales, reviews detalladas y tutoriales para gestionar tu dinero de manera inteligente.',
  canonical: 'https://appfinanzashoy.com',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://appfinanzashoy.com',
    siteName: 'AppFinanzasHoy',
    title: 'AppFinanzasHoy - Tu Guía de Finanzas Personales',
    description: 'Descubre las mejores aplicaciones de finanzas personales, reviews detalladas y tutoriales para gestionar tu dinero de manera inteligente.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AppFinanzasHoy - Finanzas Personales',
      },
    ],
  },
  twitter: {
    handle: '@appfinanzashoy',
    site: '@appfinanzashoy',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'keywords',
      content: 'finanzas personales, aplicaciones financieras, presupuesto, ahorro, inversión, reviews apps financieras',
    },
    {
      name: 'author',
      content: 'AppFinanzasHoy Team',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
}

export default defaultSEOConfig