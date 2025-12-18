// Seed categories directly via Prisma (no auth required)
const { PrismaClient } = require('../src/generated/prisma-client')
const { randomUUID } = require('crypto')

const prisma = new PrismaClient()

function slugify(name) {
  return String(name)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function ensureCategory(name) {
  const slug = slugify(name)
  const existsRows = await prisma.$queryRawUnsafe(`SELECT id FROM category WHERE slug = ? LIMIT 1`, slug)
  if (Array.isArray(existsRows) && existsRows.length > 0) {
    console.log(`✔ Categoria ya existe: ${name} (slug: ${slug})`)
    return { id: existsRows[0].id, name, slug }
  }
  const id = randomUUID()
  await prisma.$executeRawUnsafe(
    `INSERT INTO category (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    id,
    name,
    slug,
    ''
  )
  console.log(`+ Categoria creada: ${name} (slug: ${slug})`)
  return { id, name, slug }
}
async function main() {
  const names = ['Articulos', 'Analisi', 'Review', 'tutoriales']
  for (const n of names) {
    await ensureCategory(n)
  }
  const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as cnt FROM category`)
  const cnt = Array.isArray(rows) && rows[0]?.cnt ? Number(rows[0].cnt) : 0
  console.log(`Total categorias: ${cnt}`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
