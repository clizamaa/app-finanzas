const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixUserDates() {
  try {
    console.log('🔧 Corrigiendo fechas de usuarios...')
    
    // Obtener la fecha actual
    const now = new Date()
    
    // Actualizar usuarios con fechas válidas
    const updateAdmin = await prisma.user.updateMany({
      where: {
        email: 'admin@appfinanzas.com'
      },
      data: {
        createdAt: now,
        updatedAt: now
      }
    })
    
    const updateEditor = await prisma.user.updateMany({
      where: {
        email: 'editor@appfinanzas.com'
      },
      data: {
        createdAt: now,
        updatedAt: now
      }
    })
    
    // También actualizar roles si es necesario
    const updateRoles = await prisma.role.updateMany({
      data: {
        createdAt: now,
        updatedAt: now
      }
    })
    
    console.log('✅ Fechas corregidas exitosamente:')
    console.log(`   - Usuarios actualizados: ${updateAdmin.count + updateEditor.count}`)
    console.log(`   - Roles actualizados: ${updateRoles.count}`)
    console.log('')
    console.log('🎉 Ahora puedes intentar hacer login nuevamente.')
    
  } catch (error) {
    console.error('❌ Error corrigiendo fechas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserDates()