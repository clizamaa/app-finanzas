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
    title: 'Finanzas Freelancer',
    slug: 'finanzas-freelancer-2',
    category: 'tutoriales',
    excerpt: 'El mundo laboral está cambiando, y cada vez más personas optan por el camino del freelancing. Ser independiente ofrece libertad, flexibilidad y la posibilidad de trabajar en proyectos que realmente apasionan.',
    content: `Introducción a las Finanazas Freelancer 
El mundo laboral está cambiando, y cada vez más personas optan por el camino del freelancing. Ser independiente ofrece libertad, flexibilidad y la posibilidad de trabajar en proyectos que realmente apasionan. Sin embargo, esta libertad trae consigo un gran desafío: la gestión de las finanazas freelancer. 

A diferencia de un empleo tradicional con salario fijo, el freelancer enfrenta ingresos variables, periodos de abundancia y temporadas de baja demanda. Por eso, dominar la educación financiera se convierte en una habilidad indispensable. 

¿Qué significa ser freelancer y cómo impacta en tus finanzas? 
Un freelancer es un trabajador autónomo que ofrece sus servicios de manera independiente, ya sea en áreas creativas, tecnológicas, consultoría o educación. A nivel financiero, esto implica: 
Ingresos irregulares: los pagos dependen de proyectos. 
Autogestión fiscal: cada freelancer debe declarar sus propios impuestos. 
Responsabilidad total: el éxito económico depende de su organización y disciplina. 

Ventajas y desventajas financieras del trabajo independiente 
Ventajas: 
Potencial de ingresos ilimitado. 
Posibilidad de diversificar fuentes de ingreso. 
Control absoluto sobre precios y tarifas. 
Desventajas: 
Falta de seguridad social. 
Mayor riesgo de impagos por parte de clientes. 
Necesidad de una planificación rigurosa. 

Retos Comunes en las Finanazas Freelancer 
Uno de los principales retos es la inestabilidad económica. A diferencia de un salario mensual, los ingresos de un freelancer pueden fluctuar drásticamente. Además: 

Prestaciones ausentes: no hay seguro médico, vacaciones pagadas ni pensión automática. 
Acceso limitado a créditos: muchos bancos dudan al otorgar préstamos por la falta de ingresos fijos. 
Administración compleja: facturación, contratos y contabilidad requieren mayor esfuerzo.`,
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
