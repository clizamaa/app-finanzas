import { prisma } from './prisma'

/**
 * Verificar si una IP está bloqueada
 * Esta función se puede usar tanto en middleware como en API routes
 * @param {string} ip - Dirección IP a verificar
 * @returns {Promise<{blocked: boolean, reason?: string, blockedAt?: string, blockedBy?: string}>}
 */
export async function checkBlockedIP(ip) {
  try {
    if (!ip || ip === 'unknown') {
      return { blocked: false }
    }

    const prismaInstance = getPrismaInstance()
    
    const blockedIP = await prisma.blockedIP.findUnique({
      where: { ip },
      select: {
        ip: true,
        reason: true,
        blockedAt: true,
        blockedBy: true
      }
    })

    if (blockedIP) {
      return {
        blocked: true,
        reason: blockedIP.reason,
        blockedAt: blockedIP.blockedAt,
        blockedBy: blockedIP.blockedBy
      }
    }

    return { blocked: false }

  } catch (error) {
    console.error('Error verificando IP bloqueada:', error)
    // En caso de error, por seguridad permitir el acceso
    return { blocked: false, error: error.message }
  }
}

/**
 * Función para cerrar la conexión de Prisma cuando sea necesario
 * (útil en contextos donde el proceso termina)
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
