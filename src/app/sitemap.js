import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL || 'https://appfinanzashoy.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tutoriales`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Dynamic pages - Articles
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: {
            slug: true
          }
        }
      },
    })

    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/articulos/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Dynamic pages - Categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/articulos/categoria/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticPages, ...articlePages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  } finally {
    await prisma.$disconnect()
  }
}