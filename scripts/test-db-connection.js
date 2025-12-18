const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Intentar conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos!');
    
    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa:', result);
    
    // Verificar si existen las tablas principales
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('📋 Tablas encontradas:', tables.length);
    
    if (tables.length > 0) {
      console.log('📋 Lista de tablas:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('⚠️  No se encontraron tablas. Puede que necesites ejecutar las migraciones.');
    }
    
    // Verificar información de la base de datos
    const dbInfo = await prisma.$queryRaw`SELECT DATABASE() as current_db, VERSION() as version`;
    console.log('ℹ️  Información de la base de datos:', dbInfo[0]);
    
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    
    if (error.code) {
      console.error('Código de error:', error.code);
    }
    
    // Sugerencias basadas en el tipo de error
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica que la dirección del servidor sea correcta');
      console.log('   - Asegúrate de que el puerto 3306 esté abierto');
      console.log('   - Confirma que el servidor MySQL esté ejecutándose');
    } else if (error.message.includes('Access denied')) {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica el usuario y contraseña en DATABASE_URL');
      console.log('   - Confirma que el usuario tenga permisos en la base de datos');
    } else if (error.message.includes('Unknown database')) {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica que el nombre de la base de datos sea correcto');
      console.log('   - Asegúrate de que la base de datos exista en el servidor');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada.');
  }
}

// Mostrar información de configuración (sin mostrar la contraseña completa)
function showConnectionInfo() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const url = new URL(dbUrl);
    console.log('🔧 Configuración de conexión:');
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Puerto: ${url.port}`);
    console.log(`   Usuario: ${url.username}`);
    console.log(`   Base de datos: ${url.pathname.substring(1)}`);
    console.log(`   Contraseña: ${'*'.repeat(url.password.length)} (oculta)`);
    console.log('');
  } else {
    console.log('⚠️  No se encontró DATABASE_URL en las variables de entorno');
  }
}

console.log('🚀 Iniciando prueba de conexión a la base de datos\n');
showConnectionInfo();
testDatabaseConnection();
