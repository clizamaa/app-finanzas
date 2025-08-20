const { PrismaClient } = require('../src/generated/prisma-client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    });
    
    console.log('=== USUARIOS ALMACENADOS EN LA BASE DE DATOS ===\n');
    
    if (users.length === 0) {
      console.log('No se encontraron usuarios en la base de datos.');
    } else {
      users.forEach((user, index) => {
        console.log(`Usuario ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`  Rol: ${user.role?.name || 'Sin rol asignado'}`);
        console.log(`  Fecha de creación: ${user.createdAt || 'No especificada'}`);
        console.log(`  Última actualización: ${user.updatedAt || 'No especificada'}`);
        console.log('');
      });
      
      console.log(`Total de usuarios registrados: ${users.length}`);
    }
    
    // También mostrar información sobre las tablas
    console.log('\n=== INFORMACIÓN DE ALMACENAMIENTO ===');
    console.log('Los usuarios se almacenan en:');
    console.log('- Tabla: "user" (mapeada desde el modelo User)');
    console.log('- Base de datos: MySQL');
    console.log('- Esquema definido en: prisma/schema.prisma');
    
  } catch (error) {
    console.error('Error al consultar usuarios:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();