'use client'

import { useEffect } from 'react'

const StructuredData = ({ type, data }) => {
  useEffect(() => {
    let structuredData = {}

    switch (type) {
      case 'website':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AppFinanzasHoy',
          description: 'Tu guía de finanzas personales con reviews de apps y tutoriales',
          url: process.env.SITE_URL || 'https://appfinanzashoy.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/articulos?search={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
          publisher: {
            '@type': 'Organization',
            name: 'AppFinanzasHoy',
            url: process.env.SITE_URL || 'https://appfinanzashoy.com',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/images/og-image.svg`
            }
          }
        }
        break

      case 'article':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.excerpt,
          image: data.image ? `${process.env.SITE_URL || 'https://appfinanzashoy.com'}${data.image}` : `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/images/og-image.svg`,
          author: {
            '@type': 'Person',
            name: data.author?.name || 'AppFinanzasHoy Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'AppFinanzasHoy',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/images/og-image.svg`
            }
          },
          datePublished: data.createdAt,
          dateModified: data.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/articulos/${data.slug}`
          },
          articleSection: data.category?.name,
          keywords: data.tags?.map(tag => tag.name).join(', ') || 'finanzas personales'
        }
        break

      case 'review':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'SoftwareApplication',
            name: data.appName,
            applicationCategory: 'FinanceApplication',
            operatingSystem: data.platforms?.join(', ') || 'iOS, Android',
            offers: {
              '@type': 'Offer',
              price: data.price || '0',
              priceCurrency: 'USD'
            }
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: 5,
            worstRating: 1
          },
          author: {
            '@type': 'Person',
            name: 'AppFinanzasHoy Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'AppFinanzasHoy'
          },
          datePublished: data.createdAt,
          reviewBody: data.content
        }
        break

      case 'breadcrumb':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }
        break

      case 'organization':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AppFinanzasHoy',
          url: process.env.SITE_URL || 'https://appfinanzashoy.com',
          logo: `${process.env.SITE_URL || 'https://appfinanzashoy.com'}/images/og-image.svg`,
          description: 'Tu guía de finanzas personales con reviews de aplicaciones y tutoriales especializados',
          sameAs: [
            // Agregar redes sociales cuando estén disponibles
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: 'Spanish'
          }
        }
        break

      default:
        return
    }

    // Crear o actualizar el script de datos estructurados
    const existingScript = document.getElementById(`structured-data-${type}`)
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.id = `structured-data-${type}`
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(`structured-data-${type}`)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [type, data])

  return null // Este componente no renderiza nada visible
}

export default StructuredData