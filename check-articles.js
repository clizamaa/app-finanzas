const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkArticles() {
  try {
    console.log('=== ARTÍCULOS EN LA BASE DE DATOS ===\n');
    
    const articles = await prisma.article.findMany({
      include: {
        Category: true,
        User: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (articles.length === 0) {
      console.log('❌ No se encontraron artículos en la base de datos.');
    } else {
      console.log(`✅ Se encontraron ${articles.length} artículo(s):\n`);
      
      articles.forEach((article, index) => {
        console.log(`Artículo ${index + 1}:`);
        console.log(`  ID: ${article.id}`);
        console.log(`  Título: ${article.title || 'Sin título'}`);
        console.log(`  Slug: ${article.slug || 'Sin slug'}`);
        console.log(`  Estado: ${article.status || 'Sin estado'}`);
        console.log(`  Publicado: ${article.published || 'No especificado'}`);
        console.log(`  Destacado: ${article.featured || 'No especificado'}`);
        console.log(`  Vistas: ${article.views || '0'}`);
        console.log(`  Categoría: ${article.Category?.name || 'Sin categoría'}`);
      console.log(`  Autor: ${article.User?.name || 'Sin autor'}`);
        console.log(`  Fecha creación: ${article.createdAt || 'No especificada'}`);
        console.log(`  Última actualización: ${article.updatedAt || 'No especificada'}`);
        console.log(`  Extracto: ${article.excerpt ? article.excerpt.substring(0, 100) + '...' : 'Sin extracto'}`);
        console.log('');
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
    
    const publishedArticles = articles.filter(a => a.published === '1' || a.published === 1);
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
    await prisma.$disconnect();
  }
}

checkArticles();