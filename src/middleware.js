import { NextResponse } from 'next/server'
import { checkBlockedIP } from './lib/blockedIP'

export async function middleware(request) {
  try {
    // Obtener la IP del cliente
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'

    // Verificar si la IP está bloqueada directamente (sin fetch)
    const result = await checkBlockedIP(ip)

    if (result.blocked) {
      // IP bloqueada - devolver error 403
      return new NextResponse(
        JSON.stringify({
          error: 'Acceso denegado',
          message: 'Su dirección IP ha sido bloqueada',
          reason: result.reason || 'Violación de términos de servicio'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // IP no bloqueada - continuar con la solicitud
    return NextResponse.next()

  } catch (error) {
    console.error('Error en middleware de IP bloqueada:', error)
    // En caso de error, permitir el acceso para no romper el sitio
    return NextResponse.next()
  }
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Aplicar a todas las rutas excepto:
     * - api/admin/blocked-ips (para que los admins puedan gestionar bloqueos)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     */
    '/((?!api/admin/blocked-ips/check|api/admin/blocked-ips|_next/static|_next/image|favicon.ico).*)'
  ]
}