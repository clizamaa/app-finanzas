const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function resetAdminPassword() {
  const connection = await mysql.createConnection({
    host: '216.246.47.124',
    port: 3306,
    user: 'dmvadcrp_admin',
    password: 'xv=BUI0_tqX9',
    database: 'dmvadcrp_app-finanzas'
  })

  try {
    console.log('🔑 Reseteando contraseña del admin...')
    
    // Generar nueva contraseña hasheada
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Actualizar la contraseña del admin
    const [result] = await connection.execute(
      'UPDATE User SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@appfinanzas.com']
    )
    
    if (result.affectedRows > 0) {
      console.log('✅ Contraseña del admin actualizada exitosamente')
      console.log('📧 Email: admin@appfinanzas.com')
      console.log('🔑 Nueva contraseña: admin123')
    } else {
      console.log('⚠️ No se encontró el usuario admin')
    }
    
    // Verificar que el usuario existe
    const [userRows] = await connection.execute(
      'SELECT id, email, name FROM User WHERE email = ?',
      ['admin@appfinanzas.com']
    )
    
    console.log('\n👤 Usuario admin:')
    console.log(userRows[0])
    
  } catch (error) {
    console.error('❌ Error reseteando contraseña:', error)
  } finally {
    await connection.end()
  }
}

resetAdminPassword()