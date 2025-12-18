const jwt = require('jsonwebtoken')
require('dotenv').config()

async function main() {
  const secret = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura'
  const token = jwt.sign(
    { userId: 'admin_user_id', email: 'admin@appfinanzas.com', role: 'admin' },
    secret,
    { expiresIn: '1h' }
  )
  const payload = {
    title: 'Finanzas Freelancer Completo',
    category: 'tutoriales',
    excerpt: 'El mundo laboral está cambiando, y cada vez más personas optan por el camino del freelancing. Ser independiente ofrece libertad, flexibilidad y la posibilidad de trabajar en proyectos que realmente apasionan.',
    content: `<h2>Introducción a las Finanzas Freelancer</h2>
<p>El mundo laboral está cambiando, y cada vez más personas optan por el camino del freelancing. Ser independiente ofrece libertad, flexibilidad y la posibilidad de trabajar en proyectos que realmente apasionan. Sin embargo, esta libertad trae consigo un gran desafío: la gestión de las finanzas freelancer.</p>
<p>A diferencia de un empleo tradicional con salario fijo, el freelancer enfrenta ingresos variables, periodos de abundancia y temporadas de baja demanda. Por eso, dominar la educación financiera se convierte en una habilidad indispensable.</p>
<h3>¿Qué significa ser freelancer y cómo impacta en tus finanzas?</h3>
<p>Un freelancer es un trabajador autónomo que ofrece sus servicios de manera independiente, ya sea en áreas creativas, tecnológicas, consultoría o educación. A nivel financiero, esto implica:</p>
<ul>
  <li><strong>Ingresos irregulares:</strong> los pagos dependen de proyectos.</li>
  <li><strong>Autogestión fiscal:</strong> cada freelancer debe declarar sus propios impuestos.</li>
  <li><strong>Responsabilidad total:</strong> el éxito económico depende de su organización y disciplina.</li>
</ul>
<h3>Ventajas y desventajas financieras del trabajo independiente</h3>
<p><strong>Ventajas:</strong></p>
<ul>
  <li>Potencial de ingresos ilimitado.</li>
  <li>Posibilidad de diversificar fuentes de ingreso.</li>
  <li>Control absoluto sobre precios y tarifas.</li>
  </ul>
<p><strong>Desventajas:</strong></p>
<ul>
  <li>Falta de seguridad social.</li>
  <li>Mayor riesgo de impagos por parte de clientes.</li>
  <li>Necesidad de una planificación rigurosa.</li>
</ul>
<h3>Retos Comunes en las Finanzas Freelancer</h3>
<p>Uno de los principales retos es la inestabilidad económica. A diferencia de un salario mensual, los ingresos de un freelancer pueden fluctuar drásticamente. Además:</p>
<ul>
  <li><strong>Prestaciones ausentes:</strong> no hay seguro médico, vacaciones pagadas ni pensión automática.</li>
  <li><strong>Acceso limitado a créditos:</strong> muchos bancos dudan al otorgar préstamos por la falta de ingresos fijos.</li>
  <li><strong>Administración compleja:</strong> facturación, contratos y contabilidad requieren mayor esfuerzo.</li>
</ul>`,
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
