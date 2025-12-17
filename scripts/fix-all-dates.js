const { PrismaClient } = require('../src/generated/prisma-client')

const prisma = new PrismaClient()

async function fixAllDates() {
  try {
    console.log('🔧 Corrigiendo todas las fechas inválidas...')
    
    // Obtener la fecha actual
    const now = new Date()
    
    // Actualizar todos los usuarios
    const usersResult = await prisma.$executeRaw`
      UPDATE User 
      SET createdAt = ${now}, updatedAt = ${now}
      WHERE createdAt IS NULL OR updatedAt IS NULL 
         OR createdAt = '0000-00-00 00:00:00' OR updatedAt = '0000-00-00 00:00:00'
         OR YEAR(createdAt) = 0 OR YEAR(updatedAt) = 0
    `
    
    // Actualizar todos los roles
    const rolesResult = await prisma.$executeRaw`
      UPDATE Role 
      SET createdAt = ${now}, updatedAt = ${now}
      WHERE createdAt IS NULL OR updatedAt IS NULL 
         OR createdAt = '0000-00-00 00:00:00' OR updatedAt = '0000-00-00 00:00:00'
         OR YEAR(createdAt) = 0 OR YEAR(updatedAt) = 0
    `
    
    console.log('✅ Fechas corregidas exitosamente:')
    console.log(`   - Usuarios actualizados: ${usersResult}`)
    console.log(`   - Roles actualizados: ${rolesResult}`)
    
    // Verificar que los usuarios existen
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    })
    
    console.log('')
    console.log('👥 Usuarios disponibles:')
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Rol: ${user.role.name}`)
    })
    
    console.log('')
    console.log('🎉 Ahora puedes intentar hacer login nuevamente.')
    
  } catch (error) {
    console.error('❌ Error corrigiendo fechas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllDates()