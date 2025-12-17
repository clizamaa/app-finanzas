const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
require('dotenv').config()

async function createAdmin() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL no encontrada en .env')
    return
  }
  
  const urlParts = new URL(dbUrl)
  
  console.log(`🔌 Conectando a ${urlParts.hostname}...`)

  const connection = await mysql.createConnection({
    host: urlParts.hostname,
    port: parseInt(urlParts.port) || 3306,
    user: urlParts.username,
    password: urlParts.password,
    database: urlParts.pathname.substring(1)
  })

  try {
    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES')
    const tableList = tables.map(t => Object.values(t)[0])
    console.log('📋 Tablas encontradas:', tableList.join(', '))
    
    const tableNames = tableList.map(t => t.toLowerCase())
    if (!tableNames.includes('role')) {
      console.error('❌ La tabla Role no existe. Ejecuta las migraciones primero.')
      return
    }

    const roleTable = tableList.find(t => t.toLowerCase() === 'role')
    const userTable = tableList.find(t => t.toLowerCase() === 'user') || 'User' // Default to User if not found (though check above implies it should be found if role is found usually)

    console.log(`Using table names: ${roleTable}, ${userTable}`)

    // Verificar si ya existe el rol admin
    const [roleRows] = await connection.execute(
      `SELECT * FROM ${roleTable} WHERE name = ?`,
      ['admin']
    )

    let roleId = 'admin_role_id'
    if (roleRows.length === 0) {
      // Crear rol admin
      await connection.execute(
        `INSERT INTO ${roleTable} (id, name, description, permissions, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          roleId,
          'admin',
          'Administrador con todos los permisos',
          JSON.stringify({
            articles: { create: true, read: true, update: true, delete: true, publish: true },
            users: { create: true, read: true, update: true, delete: true },
            comments: { moderate: true }
          })
        ]
      )
      console.log('✅ Rol admin creado')
    } else {
      roleId = roleRows[0].id
      console.log('ℹ️ Rol admin ya existe')
    }

    // Verificar si ya existe el usuario admin
    const [userRows] = await connection.execute(
      `SELECT * FROM ${userTable} WHERE email = ?`,
      ['admin@appfinanzashoy.com']
    )

    if (userRows.length === 0) {
      // Crear usuario admin
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await connection.execute(
        `INSERT INTO ${userTable} (id, email, name, password, roleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          'admin_user_id',
          'admin@appfinanzashoy.com',
          'Administrador',
          hashedPassword,
          roleId
        ]
      )
      
      console.log('✅ Usuario admin creado exitosamente')
      console.log('📧 Email: admin@appfinanzashoy.com')
      console.log('🔑 Password: admin123')
    } else {
      console.log('⚠️ Usuario admin ya existe')
    }

  } catch (error) {
    console.error('❌ Error creando admin:', error)
  } finally {
    await connection.end()
  }
}

createAdmin()
