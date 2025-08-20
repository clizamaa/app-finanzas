const { PrismaClient } = require('../src/generated/prisma-client')

const prisma = new PrismaClient()

async function fixDateFields() {
  try {
    console.log('🔧 Actualizando campos de fecha...')
    
    // Actualizar campos de fecha en la tabla User
    await prisma.$executeRaw`
      ALTER TABLE User 
      MODIFY COLUMN createdAt DATETIME(3),
      MODIFY COLUMN updatedAt DATETIME(3)
    `
    
    console.log('✅ Campos de fecha en User actualizados')
    
    // Actualizar campos de fecha en la tabla role
    await prisma.$executeRaw`
      ALTER TABLE role 
      MODIFY COLUMN createdAt DATETIME(3),
      MODIFY COLUMN updatedAt DATETIME(3)
    `
    
    console.log('✅ Campos de fecha en Role actualizados')
    
    // Actualizar campos de fecha en la tabla blockedip
    await prisma.$executeRaw`
      ALTER TABLE blockedip 
      MODIFY COLUMN blockedAt DATETIME(3),
      MODIFY COLUMN createdAt DATETIME(3),
      MODIFY COLUMN updatedAt DATETIME(3)
    `
    
    console.log('✅ Campos de fecha en BlockedIP actualizados')
    
    console.log('🎉 Todos los campos de fecha han sido actualizados exitosamente')
    
  } catch (error) {
    console.error('❌ Error actualizando campos de fecha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixDateFields()