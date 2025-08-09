import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Credenciales de administrador (en producción deberían estar en base de datos con hash)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // En producción usar bcrypt
}

// Clave secreta para JWT (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Validar que se proporcionen credenciales
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Verificar credenciales
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        username: username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      message: 'Login exitoso',
      token: token,
      user: {
        username: username,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para verificar token
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return NextResponse.json({
        valid: true,
        user: {
          username: decoded.username,
          role: decoded.role
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}