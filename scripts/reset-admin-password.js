const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
require('dotenv').config()

async function resetAdminPassword() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL no encontrada en .env')
    return
  }

  const urlParts = new URL(dbUrl)
  
  const connection = await mysql.createConnection({
    host: urlParts.hostname,
    port: parseInt(urlParts.port) || 3306,
    user: urlParts.username,
    password: urlParts.password,
    database: urlParts.pathname.substring(1)
  })

  try {
    console.log('🔑 Reseteando contraseña del admin...')

    // Determine table name for User
    const [tables] = await connection.execute('SHOW TABLES')
    const tableList = tables.map(t => Object.values(t)[0])
    const userTable = tableList.find(t => t.toLowerCase() === 'user') || 'User'
    
    // Generar nueva contraseña hasheada
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Actualizar la contraseña del admin
    const [result] = await connection.execute(
      `UPDATE ${userTable} SET password = ? WHERE email = ?`,
      [hashedPassword, 'admin@appfinanzashoy.com']
    )
    
    if (result.affectedRows > 0) {
      console.log('✅ Contraseña del admin actualizada exitosamente')
      console.log('📧 Email: admin@appfinanzashoy.com')
      console.log('🔑 Nueva contraseña: admin123')
    } else {
      console.log('⚠️ No se encontró el usuario admin con email admin@appfinanzashoy.com')
      // Check if maybe it is under the old email admin@appfinanzas.com
      const [oldUser] = await connection.execute(
        `SELECT * FROM ${userTable} WHERE email = ?`,
        ['admin@appfinanzas.com']
      )
      if (oldUser.length > 0) {
        console.log('ℹ️ Se encontró usuario con email antiguo admin@appfinanzas.com. Actualizando...')
        await connection.execute(
            `UPDATE ${userTable} SET password = ?, email = ? WHERE email = ?`,
            [hashedPassword, 'admin@appfinanzashoy.com', 'admin@appfinanzas.com']
        )
        console.log('✅ Usuario actualizado a admin@appfinanzashoy.com con nueva contraseña')
      }
    }
    
    // Verificar que el usuario existe
    const [userRows] = await connection.execute(
      `SELECT id, email, name FROM ${userTable} WHERE email = ?`,
      ['admin@appfinanzashoy.com']
    )
    
    if (userRows.length > 0) {
        console.log('\n👤 Usuario admin:')
        console.log(userRows[0])
    }
    
  } catch (error) {
    console.error('❌ Error reseteando contraseña:', error)
  } finally {
    await connection.end()
  }
}

resetAdminPassword()
