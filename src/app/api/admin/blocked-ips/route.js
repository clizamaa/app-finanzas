import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'

// Middleware para verificar autenticación y permisos de admin
const verifyAdminAuth = async (request) => {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token de autorización requerido', status: 401 }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (decoded.role !== 'admin') {
      return { error: 'Permisos de administrador requeridos', status: 403 }
    }

    return { success: true, userId: decoded.userId }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}

// GET - Obtener todas las IPs bloqueadas
export async function GET(request) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const blockedIPs = await prisma.BlockedIP.findMany({
      orderBy: {
        blockedAt: 'desc'
      }
    })

    return NextResponse.json({
      blockedIPs
    })

  } catch (error) {
    console.error('Error obteniendo IPs bloqueadas:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Bloquear una IP
export async function POST(request) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { ip, reason } = await request.json()

    if (!ip) {
      return NextResponse.json(
        { message: 'IP es requerida' },
        { status: 400 }
      )
    }

    // Verificar si la IP ya está bloqueada
    const existingBlock = await prisma.BlockedIP.findUnique({
      where: { ip }
    })

    if (existingBlock) {
      return NextResponse.json(
        { message: 'Esta IP ya está bloqueada' },
        { status: 400 }
      )
    }

    // Crear el bloqueo
    const blockedIP = await prisma.BlockedIP.create({
      data: {
        id: randomUUID(),
        ip,
        reason: reason || 'Bloqueado por administrador',
        blockedBy: authResult.userId,
        blockedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      message: 'IP bloqueada exitosamente',
      blockedIP
    })

  } catch (error) {
    console.error('Error bloqueando IP:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Desbloquear una IP
export async function DELETE(request) {
  try {
    const authResult = await verifyAdminAuth(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')

    if (!ip) {
      return NextResponse.json(
        { message: 'IP es requerida' },
        { status: 400 }
      )
    }

    // Verificar si la IP está bloqueada
    const blockedIP = await prisma.BlockedIP.findUnique({
      where: { ip }
    })

    if (!blockedIP) {
      return NextResponse.json(
        { message: 'Esta IP no está bloqueada' },
        { status: 404 }
      )
    }

    // Eliminar el bloqueo
    await prisma.BlockedIP.delete({
      where: { ip }
    })

    return NextResponse.json({
      message: 'IP desbloqueada exitosamente'
    })

  } catch (error) {
    console.error('Error desbloqueando IP:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}