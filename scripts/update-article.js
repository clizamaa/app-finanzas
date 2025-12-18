const jwt = require('jsonwebtoken')
require('dotenv').config()

async function main() {
  const id = '3aeb7627-90fe-4d85-9608-45858d3aaee9'
  const secret = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'
  const token = jwt.sign(
    { userId: 'admin_user_id', email: 'admin@appfinanzas.com', role: 'admin' },
    secret,
    { expiresIn: '30m' }
  )
  const contentSrc = 'Introducción a las Finanzas Freelancer. El freelancing ofrece libertad y flexibilidad, pero exige una buena gestión financiera por la variabilidad de ingresos. Claves: ingresos irregulares, autogestión fiscal y responsabilidad total.'
  const payload = {
    title: 'Finanzas Freelancer',
    slug: 'finanzas-freelancer',
    content: contentSrc.slice(0, 160)
  }
  const res = await fetch(`http://localhost:3000/api/admin/articles/${id}`, {
    method: 'PATCH',
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
