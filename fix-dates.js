const mysql = require('mysql2/promise')

async function fixDates() {
  const connection = await mysql.createConnection({
    host: '216.246.47.124',
    port: 3306,
    user: 'dmvadcrp_admin',
    password: 'xv=BUI0_tqX9',
    database: 'dmvadcrp_app-finanzas'
  })

  try {
    console.log('🔧 Corrigiendo fechas inválidas...')
    
    // Corregir fechas en la tabla User
    await connection.execute(
      'UPDATE User SET updatedAt = NOW() WHERE updatedAt = "0000-00-00 00:00:00" OR updatedAt IS NULL'
    )
    
    await connection.execute(
      'UPDATE User SET createdAt = NOW() WHERE createdAt = "0000-00-00 00:00:00" OR createdAt IS NULL'
    )
    
    console.log('✅ Fechas de usuarios corregidas')
    
    // Corregir fechas en la tabla Role
    await connection.execute(
      'UPDATE Role SET updatedAt = NOW() WHERE updatedAt = "0000-00-00 00:00:00" OR updatedAt IS NULL'
    )
    
    await connection.execute(
      'UPDATE Role SET createdAt = NOW() WHERE createdAt = "0000-00-00 00:00:00" OR createdAt IS NULL'
    )
    
    console.log('✅ Fechas de roles corregidas')
    
    // Verificar que las fechas estén correctas
    const [userRows] = await connection.execute(
      'SELECT id, email, createdAt, updatedAt FROM User'
    )
    
    console.log('\n📅 Fechas de usuarios después de la corrección:')
    userRows.forEach(user => {
      console.log(`${user.email}: createdAt=${user.createdAt}, updatedAt=${user.updatedAt}`)
    })
    
  } catch (error) {
    console.error('❌ Error corrigiendo fechas:', error)
  } finally {
    await connection.end()
  }
}

fixDates()