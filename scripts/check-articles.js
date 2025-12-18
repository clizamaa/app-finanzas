const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkArticles() {
  try {
    console.log('=== ARTÍCULOS EN LA BASE DE DATOS ===\n');
    
    let articles
    try {
      articles = await prisma.article.findMany({
        include: {
          category: true,
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (err) {
      console.log('⚠️ Prisma findMany falló, usando consulta RAW...\n')
      articles = await prisma.$queryRawUnsafe(
        `SELECT 
           a.id, a.title, a.slug, a.excerpt, a.content, a.image, a.featured, a.views, a.createdAt, a.updatedAt,
           c.id AS categoryId, c.name AS categoryName, c.slug AS categorySlug,
           u.id AS authorId, u.name AS authorName
         FROM article a
         LEFT JOIN category c ON a.categoryId = c.id
         LEFT JOIN User u ON a.authorId = u.id
         ORDER BY a.createdAt DESC`
      )
      articles = articles.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        image: r.image,
        featured: r.featured === 1 || r.featured === true || r.featured === '1',
        views: typeof r.views === 'number' ? r.views : (parseInt(r.views) || 0),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        category: r.categoryId ? { id: r.categoryId, name: r.categoryName, slug: r.categorySlug } : null,
        author: r.authorId ? { id: r.authorId, name: r.authorName } : null
      }))
    }
    
    if (articles.length === 0) {
      console.log('❌ No se encontraron artículos en la base de datos.');
    } else {
      console.log(`✅ Se encontraron ${articles.length} artículo(s):\n`)
      
      articles.forEach((article, index) => {
        console.log(`Artículo ${index + 1}:`)
        console.log(`  ID: ${article.id}`)
        console.log(`  Título: ${article.title || 'Sin título'}`)
        console.log(`  Slug: ${article.slug || 'Sin slug'}`)
        console.log(`  Publicado: ${article.published === true ? 'Sí' : 'No'}`)
        console.log(`  Destacado: ${article.featured === true ? 'Sí' : 'No'}`)
        console.log(`  Vistas: ${typeof article.views === 'number' ? article.views : (parseInt(article.views) || 0)}`)
        console.log(`  Categoría: ${article.category?.name || 'Sin categoría'}`)
        console.log(`  Autor: ${article.author?.name || 'Sin autor'}`)
        console.log(`  Fecha creación: ${article.createdAt || 'No especificada'}`)
        console.log(`  Última actualización: ${article.updatedAt || 'No especificada'}`)
        console.log(`  Extracto: ${article.excerpt ? String(article.excerpt).substring(0, 100) + '...' : 'Sin extracto'}`)
        console.log('')
      });
    }
    
    // Verificar categorías
    console.log('\n=== CATEGORÍAS EN LA BASE DE DATOS ===\n');
    const categories = await prisma.category.findMany();
    
    if (categories.length === 0) {
      console.log('❌ No se encontraron categorías.');
    } else {
      console.log(`✅ Se encontraron ${categories.length} categoría(s):\n`);
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (ID: ${category.id}, Slug: ${category.slug})`);
      });
    }
    
    // Verificar estructura de URLs
    console.log('\n=== DIAGNÓSTICO DE VISIBILIDAD ===\n');
    
    const publishedArticles = articles.filter(a => a.published === true)
    console.log(`Artículos publicados: ${publishedArticles.length}`);
    
    const articlesWithSlug = articles.filter(a => a.slug && a.slug.trim() !== '');
    console.log(`Artículos con slug: ${articlesWithSlug.length}`);
    
    const articlesWithCategory = articles.filter(a => a.categoryId);
    console.log(`Artículos con categoría: ${articlesWithCategory.length}`);
    
    if (publishedArticles.length > 0) {
      console.log('\n📋 URLs esperadas para artículos publicados:');
      publishedArticles.forEach(article => {
        if (article.slug) {
          console.log(`  - http://localhost:3000/articulos/${article.slug}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error al consultar artículos:', error.message);
    console.error('Stack:', error.stack);
  } finally {
      await prisma.$disconnect()
  }
}

checkArticles();
