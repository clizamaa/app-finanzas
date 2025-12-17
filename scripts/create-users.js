const bcrypt = require('bcrypt')
const { PrismaClient } = require('../src/generated/prisma-client')

const prisma = new PrismaClient()

async function createUsers() {
  try {
    // Hash de las contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10)
    const editorPassword = await bcrypt.hash('editor123', 10)

    // Actualizar usuarios con contraseñas hasheadas
    await prisma.user.update({
      where: { id: 'admin_user_id' },
      data: { password: adminPassword }
    })

    await prisma.user.update({
      where: { id: 'editor_user_id' },
      data: { password: editorPassword }
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
    console.log('🔐 Los usuarios han sido creados con contraseñas hasheadas de forma segura.')

  } catch (error) {
    console.error('❌ Error creando usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()