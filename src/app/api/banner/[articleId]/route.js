import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export async function GET(request, { params }) {
  try {
    const articleId = params.articleId
    if (!articleId) {
      return NextResponse.json({ error: 'articleId faltante' }, { status: 400 })
    }
    const dir = join(process.cwd(), 'public', 'uploads', 'banners')
    let files
    try {
      files = await readdir(dir)
    } catch {
      return NextResponse.json({ error: 'Sin banners' }, { status: 404 })
    }
    const candidates = files.filter(f => f.startsWith(`${articleId}_`))
    if (candidates.length === 0) {
      return NextResponse.json({ error: 'Banner no encontrado' }, { status: 404 })
    }
    let latest = candidates[0]
    let latestTime = 0
    for (const f of candidates) {
      try {
        const s = await stat(join(dir, f))
        const t = s.mtimeMs
        if (t > latestTime) {
          latestTime = t
          latest = f
        }
      } catch {}
    }
    let baseUrl = ''
    if (process.env.NEXT_PUBLIC_APP_URL) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
    } else if (request.headers.get('x-forwarded-host')) {
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      const host = request.headers.get('x-forwarded-host')
      baseUrl = `${protocol}://${host}`
    } else {
      const reqUrl = new URL(request.url)
      baseUrl = `${reqUrl.protocol}//${reqUrl.host}`
    }
    const url = `${baseUrl}/uploads/banners/${latest}`
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
