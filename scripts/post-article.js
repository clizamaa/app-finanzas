const jwt = require('jsonwebtoken')
require('dotenv').config()

async function main() {
  const secret = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'
  const token = jwt.sign(
    { userId: 'admin_user_id', email: 'admin@appfinanzas.com', role: 'admin' },
    secret,
    { expiresIn: '1h' }
  )
  const excerptFull = 'El mundo laboral está cambiando, y cada vez más personas optan por el camino del freelancing. Ser independiente ofrece libertad, flexibilidad y la posibilidad de trabajar en proyectos que realmente apasionan.'
  const contentSource = 'Introducción a las Finanazas Freelancer. El freelancing ofrece libertad y flexibilidad, pero exige una buena gestión financiera por la variabilidad de ingresos. Claves: ingresos irregulares, autogestión fiscal y responsabilidad total. Ventajas: potencial de ingresos, diversificación y control de precios. Desventajas: falta de seguridad social, riesgo de impagos y necesidad de planificación.'
  const contentShort = contentSource.slice(0, 180)
  const payload = {
    title: 'Finanazas Freelancer',
    category: 'tutoriales',
    excerpt: excerptFull.slice(0, 180),
    content: contentShort,
    image: '/uploads/imagen%20articulo1.png',
    featured: true,
    published: true
  }
  const res = await fetch('http://localhost:3000/api/admin/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const text = await res.text()
  console.log('STATUS', res.status)
  console.log(text)
}

main().catch(e => {
  console.error('REQ_ERR', e)
  process.exit(1)
})
