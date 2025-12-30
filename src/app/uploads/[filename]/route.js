import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request, { params }) {
  try {
    // Next.js 15 requires awaiting params
    const { filename } = await params
    
    // Intentar varias ubicaciones posibles para encontrar el archivo
    // 1. public/uploads (desarrollo/producción estándar)
    // 2. .next/standalone/public/uploads (producción standalone)
    // 3. ../public/uploads (si cwd es .next/server)
    
    const possiblePaths = [
      join(process.cwd(), 'public', 'uploads', filename),
      join(process.cwd(), 'public', 'uploads', 'banners', filename), // También buscar en banners
      join(process.cwd(), '.next', 'standalone', 'public', 'uploads', filename),
      join(process.cwd(), '..', 'public', 'uploads', filename)
    ]

    let filePath = null
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        filePath = p
        break
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const buffer = await readFile(filePath)
    
    // Determinar content type
    const ext = filename.split('.').pop().toLowerCase()
    const contentTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
