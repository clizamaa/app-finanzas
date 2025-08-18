const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTableStructure() {
  try {
    console.log('Verificando estructura de la tabla article...');
    
    // Describir la estructura de la tabla
    const columns = await prisma.$queryRaw`DESCRIBE article`;
    console.log('\nEstructura de la tabla article:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} (Null: ${col.Null}, Default: ${col.Default})`);
    });
    
    // Verificar algunos datos de ejemplo
    console.log('\nPrimeros 3 registros:');
    const sampleData = await prisma.$queryRaw`SELECT id, title, published, status, featured FROM article LIMIT 3`;
    sampleData.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Published: ${row.published} (${typeof row.published}), Status: ${row.status}, Featured: ${row.featured} (${typeof row.featured})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableStructure();