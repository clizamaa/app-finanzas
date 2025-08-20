const { PrismaClient } = require('../src/generated/prisma-client')

const prisma = new PrismaClient()

async function createBlockedIPTable() {
  try {
    // Crear la tabla blockedip manualmente
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS blockedip (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        ip VARCHAR(191) NOT NULL UNIQUE,
        reason TEXT,
        blockedBy VARCHAR(191),
        blockedAt VARCHAR(191),
        createdAt VARCHAR(191),
        updatedAt VARCHAR(191),
        INDEX idx_blockedip_ip (ip)
      )
    `
    
    console.log('✅ Tabla blockedip creada exitosamente')
  } catch (error) {
    console.error('❌ Error creando tabla blockedip:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createBlockedIPTable()