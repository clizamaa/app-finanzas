#!/usr/bin/env node

/**
 * Script para generar secrets seguros para el deploy de producción
 * Uso: node generate-secrets.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generando secrets seguros para producción...\n');

// Generar secrets
const nextAuthSecret = crypto.randomBytes(64).toString('hex');
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Mostrar secrets generados
console.log('✅ Secrets generados exitosamente:\n');
console.log('NEXTAUTH_SECRET=' + nextAuthSecret);
console.log('JWT_SECRET=' + jwtSecret);
console.log('');

// Crear template de .env.production
const envTemplate = `# Archivo de variables de entorno para producción
# Generado automáticamente el ${new Date().toISOString()}

# ⚠️  IMPORTANTE: Completar con tus datos reales antes de usar

# Base de datos MySQL en cPanel
# Formato: mysql://usuario:contraseña@localhost:3306/nombre_bd
DATABASE_URL="mysql://TU_USUARIO_BD:TU_CONTRASEÑA@localhost:3306/TU_BASE_DATOS"

# NextAuth - Secret generado automáticamente
NEXTAUTH_SECRET="${nextAuthSecret}"
NEXTAUTH_URL="https://TU_DOMINIO.com"

# JWT Secret - Secret generado automáticamente
JWT_SECRET="${jwtSecret}"

# Configuración del sitio
SITE_URL="https://TU_DOMINIO.com"
SITE_NAME="AppFinanzasHoy"

# Entorno de producción
NODE_ENV="production"

# Desactivar telemetría de Next.js
NEXT_TELEMETRY_DISABLED=1

# ========================================
# INSTRUCCIONES:
# ========================================
# 1. Reemplazar TU_USUARIO_BD con tu usuario de MySQL
# 2. Reemplazar TU_CONTRASEÑA con tu contraseña de MySQL
# 3. Reemplazar TU_BASE_DATOS con el nombre de tu base de datos
# 4. Reemplazar TU_DOMINIO.com con tu dominio real
# 5. Guardar este archivo como .env.production en tu servidor
# 6. NUNCA subir este archivo a repositorios públicos
`;

// Guardar template
const templatePath = path.join(__dirname, '.env.production.template');
fs.writeFileSync(templatePath, envTemplate);

console.log('📄 Template creado: .env.production.template');
console.log('');
console.log('📋 Próximos pasos:');
console.log('1. Editar .env.production.template con tus datos reales');
console.log('2. Renombrar a .env.production');
console.log('3. Subir al servidor (NO al repositorio)');
console.log('');
console.log('🔒 Los secrets ya están incluidos en el template');
console.log('✅ ¡Listo para usar en producción!');

// Crear también un archivo con solo los secrets para referencia
const secretsPath = path.join(__dirname, 'secrets-generated.txt');
const secretsContent = `Secrets generados el ${new Date().toISOString()}

NEXTAUTH_SECRET=${nextAuthSecret}
JWT_SECRET=${jwtSecret}

⚠️  IMPORTANTE: 
- Estos secrets son únicos y seguros
- Guárdalos en un lugar seguro
- NO los compartas públicamente
- Úsalos en tu archivo .env.production
`;

fs.writeFileSync(secretsPath, secretsContent);
console.log('💾 Secrets guardados en: secrets-generated.txt');
console.log('');
console.log('⚠️  RECORDATORIO DE SEGURIDAD:');
console.log('- NO subir secrets-generated.txt al repositorio');
console.log('- NO compartir los secrets públicamente');
console.log('- Mantener .env.production seguro en el servidor');