(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@appfinanzas.com', password: 'admin123' })
    })
    const text = await res.text()
    console.log('STATUS:', res.status)
    try {
      const json = JSON.parse(text)
      console.log('BODY(JSON):', JSON.stringify(json, null, 2))
    } catch {
      console.log('BODY(TEXT):', text)
    }
  } catch (e) {
    console.error('Request failed:', e)
  }
})()