const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function recreateUsers() {
  try {
    console.log('🔧 Recreando usuarios y roles...')
    
    // Eliminar usuarios existentes
    await prisma.user.deleteMany({})
    console.log('✅ Usuarios eliminados')
    
    // Eliminar roles existentes
    await prisma.role.deleteMany({})
    console.log('✅ Roles eliminados')
    
    // Crear roles con fechas válidas
    const adminRole = await prisma.role.create({
      data: {
        id: 'admin_role_id',
        name: 'admin',
        description: 'Administrador con todos los permisos',
        permissions: {
          articles: { create: true, read: true, update: true, delete: true, publish: true },
          users: { create: true, read: true, update: true, delete: true },
          comments: { moderate: true }
        }
      }
    })
    
    const editorRole = await prisma.role.create({
      data: {
        id: 'editor_role_id',
        name: 'editor',
        description: 'Redactor que puede crear y editar artículos pero no publicar',
        permissions: {
          articles: { create: true, read: true, update: true, delete: false, publish: false },
          users: { create: false, read: false, update: false, delete: false },
          comments: { moderate: false }
        }
      }
    })
    
    console.log('✅ Roles creados')
    
    // Hash de las contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10)
    const editorPassword = await bcrypt.hash('editor123', 10)
    
    // Crear usuarios con fechas válidas
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin_user_id',
        email: 'admin@appfinanzas.com',
        name: 'Administrador',
        password: adminPassword,
        roleId: adminRole.id
      }
    })
    
    const editorUser = await prisma.user.create({
      data: {
        id: 'editor_user_id',
        email: 'editor@appfinanzas.com',
        name: 'Redactor',
        password: editorPassword,
        roleId: editorRole.id
      }
    })
    
    console.log('✅ Usuarios creados exitosamente:')
    console.log('👤 Administrador:')
    console.log('   Email: admin@appfinanzas.com')
    console.log('   Contraseña: admin123')
    console.log('   Permisos: Todos los permisos (crear, editar, publicar, eliminar)')
    console.log('')
    console.log('✏️ Redactor:')
    console.log('   Email: editor@appfinanzas.com')
    console.log('   Contraseña: editor123')
    console.log('   Permisos: Crear y editar artículos (solo borradores, no puede publicar)')
    console.log('')
    console.log('🎉 Ahora puedes intentar hacer login nuevamente.')
    
  } catch (error) {
    console.error('❌ Error recreando usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

recreateUsers()