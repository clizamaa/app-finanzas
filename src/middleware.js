import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Derivar IP del cliente
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'

  // Inyectar cabecera x-client-ip hacia la request siguiente
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-client-ip', ip)

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