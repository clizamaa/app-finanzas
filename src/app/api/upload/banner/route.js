import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export async function POST(request) {
  try {
    const data = await request.formData()
    const file = data.get('file')
    const articleId = data.get('articleId')
    if (!file || !articleId) {
      return NextResponse.json({ error: 'Archivo o articleId faltante' }, { status: 400 })
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Archivo demasiado grande' }, { status: 400 })
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${articleId}_${timestamp}_${originalName}`
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'banners')
    const filePath = join(uploadsDir, fileName)
    try {
      await writeFile(filePath, buffer)
    } catch {
      await mkdir(uploadsDir, { recursive: true })
      await writeFile(filePath, buffer)
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
    const fileUrl = `${baseUrl}/uploads/banners/${fileName}`
    return NextResponse.json({
      url: fileUrl,
      message: 'Banner subido exitosamente',
      filename: fileName,
      size: file.size,
      type: file.type,
      articleId
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
