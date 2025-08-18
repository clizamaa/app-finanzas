const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: '216.246.47.124',
    port: 3306,
    user: 'dmvadcrp_admin',
    password: 'xv=BUI0_tqX9',
    database: 'dmvadcrp_app-finanzas'
  })

  try {
    // Verificar si ya existe el rol admin
    const [roleRows] = await connection.execute(
      'SELECT * FROM Role WHERE name = ?',
      ['admin']
    )

    let roleId = 'admin_role_id'
    if (roleRows.length === 0) {
      // Crear rol admin
      await connection.execute(
        'INSERT INTO Role (id, name, description, permissions, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
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
      'SELECT * FROM User WHERE email = ?',
      ['admin@appfinanzashoy.com']
    )

    if (userRows.length === 0) {
      // Crear usuario admin
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await connection.execute(
        'INSERT INTO User (id, email, name, password, roleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
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