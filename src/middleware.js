import { NextResponse } from 'next/server'

export async function middleware(request) {
  const path = request.nextUrl.pathname || '/'
  console.log(`[Middleware] Incoming request: ${request.method} ${path}`)

  if (path.startsWith('/api/admin')) {
    return NextResponse.json({ message: 'Admin deshabilitado' }, { status: 404 })
  }
  if (path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  // Derivar IP del cliente
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'

  // Debug: Verificar si llega el token
  const authHeader = request.headers.get('authorization')
  if (request.nextUrl.pathname.startsWith('/api/admin/auth/login')) {
    console.log(`Middleware - ${request.method} ${request.nextUrl.pathname} - Auth Incoming: ${authHeader ? 'Present' : 'Missing'}`)
  }
  if (request.nextUrl.pathname.startsWith('/api/logs')) {
    console.log(`Middleware - ${request.method} ${request.nextUrl.pathname} - Auth Incoming: ${authHeader ? 'Present' : 'Missing'}`)
  }

  // Inyectar cabecera x-client-ip hacia la request siguiente
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-client-ip', ip)

  // Verify if Authorization is preserved
  if (request.nextUrl.pathname.startsWith('/api/admin/auth/login')) {
    console.log(`Middleware - Auth Outgoing: ${requestHeaders.get('authorization') ? 'Present' : 'Missing'}`)
  }
  if (request.nextUrl.pathname.startsWith('/api/logs')) {
    console.log(`Middleware - Auth Outgoing: ${requestHeaders.get('authorization') ? 'Present' : 'Missing'}`)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
