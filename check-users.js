const mysql = require('mysql2/promise')

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: '216.246.47.124',
    port: 3306,
    user: 'dmvadcrp_admin',
    password: 'xv=BUI0_tqX9',
    database: 'dmvadcrp_app-finanzas'
  })

  try {
    // Verificar usuarios existentes
    const [userRows] = await connection.execute(
      'SELECT id, email, name, roleId FROM User'
    )
    
    console.log('👥 Usuarios en la base de datos:')
    console.log(userRows)
    
    // Verificar roles existentes
    const [roleRows] = await connection.execute(
      'SELECT id, name, description FROM Role'
    )
    
    console.log('\n🔐 Roles en la base de datos:')
    console.log(roleRows)
    
  } catch (error) {
    console.error('❌ Error consultando usuarios:', error)
  } finally {
    await connection.end()
  }
}

checkUsers()