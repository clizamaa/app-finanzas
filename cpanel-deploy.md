# Guía de Deploy en cPanel - AppFinanzasHoy

## Requisitos Previos

1. **Hosting con soporte Node.js** (versión 18 o superior)
2. **Base de datos MySQL** configurada
3. **Acceso a cPanel** con Node.js App Manager
4. **Dominio configurado**: appfinanzashoy.com

## Pasos para el Deploy

### 1. Preparación del Proyecto

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Construir la aplicación
npm run build
```

### 2. Configuración de Variables de Entorno

Crear archivo `.env.production` en el servidor:

```env
# Base de datos
DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_bd"

# NextAuth
NEXTAUTH_SECRET="tu_secret_muy_seguro_aqui"
NEXTAUTH_URL="https://appfinanzashoy.com"

# JWT
JWT_SECRET="tu_jwt_secret_aqui"

# Configuración del sitio
SITE_URL="https://appfinanzashoy.com"
SITE_NAME="AppFinanzasHoy"

# Entorno
NODE_ENV="production"
```

### 3. Configuración en cPanel

#### A. Crear Aplicación Node.js

1. Ir a **Node.js App** en cPanel
2. Crear nueva aplicación:
   - **Node.js Version**: 18.x o superior
   - **Application Mode**: Production
   - **Application Root**: `public_html` (o subdirectorio)
   - **Application URL**: tu dominio
   - **Application Startup File**: `server.js`

#### B. Configurar package.json para cPanel

```json
{
  "name": "app-finanzas",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT",
    "lint": "next lint",
    "postinstall": "npx prisma generate"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 4. Archivo server.js para cPanel

Crear `server.js` en la raíz del proyecto:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

### 5. Configuración de Base de Datos

#### A. Crear Base de Datos en cPanel

1. Ir a **MySQL Databases**
2. Crear nueva base de datos
3. Crear usuario y asignar privilegios
4. Anotar credenciales para `.env.production`

#### B. Migrar Base de Datos

```bash
# En el servidor, ejecutar:
npx prisma db push
```

### 6. Subir Archivos

#### Archivos a subir:

- Todo el proyecto excepto:
  - `node_modules/`
  - `.next/`
  - `.env` (usar `.env.production`)
  - `*.log`

#### Estructura en el servidor:

```
public_html/
├── server.js
├── package.json
├── next.config.js
├── .env.production
├── prisma/
├── src/
├── public/
└── ...
```

### 7. Instalación en el Servidor

```bash
# En el terminal de cPanel o SSH:
cd public_html
npm install --production
npm run build
```

### 8. Configurar Dominio

#### A. En cPanel Node.js App:

1. Seleccionar la aplicación creada
2. Configurar **Application URL** con tu dominio
3. **Restart** la aplicación

#### B. Configurar .htaccess (si es necesario):

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:PORT/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
```

### 9. Verificación Post-Deploy

#### Checklist:

- [ ] Aplicación Node.js ejecutándose
- [ ] Base de datos conectada
- [ ] Variables de entorno configuradas
- [ ] Dominio apuntando correctamente
- [ ] SSL certificado activo
- [ ] Sitemap accesible: `/sitemap.xml`
- [ ] Robots.txt accesible: `/robots.txt`
- [ ] Páginas principales cargando

### 10. Comandos Útiles

```bash
# Ver logs de la aplicación
tail -f logs/app.log

# Reiniciar aplicación
# (Desde cPanel Node.js App Manager)

# Verificar estado
curl https://appfinanzashoy.com

# Verificar base de datos
npx prisma studio
```

### 11. Troubleshooting

#### Problemas Comunes:

1. **Error de conexión a BD**:
   - Verificar credenciales en `.env.production`
   - Comprobar que la BD existe
   - Verificar permisos del usuario

2. **Aplicación no inicia**:
   - Verificar versión de Node.js
   - Comprobar `server.js`
   - Revisar logs en cPanel

3. **Rutas no funcionan**:
   - Verificar configuración de dominio
   - Comprobar `.htaccess`
   - Revisar `next.config.js`

4. **Errores de build**:
   - Ejecutar `npm run build` localmente
   - Verificar dependencias
   - Comprobar espacio en disco

### 12. Mantenimiento

#### Actualizaciones:

```bash
# Backup de BD
mysqldump -u usuario -p nombre_bd > backup.sql

# Subir nuevos archivos
# Reinstalar dependencias si es necesario
npm install

# Rebuild
npm run build

# Reiniciar aplicación desde cPanel
```

## Notas Importantes

- **Puerto**: cPanel asigna automáticamente el puerto
- **SSL**: Configurar Let's Encrypt en cPanel
- **Backups**: Configurar backups automáticos
- **Monitoreo**: Usar herramientas de cPanel para monitorear
- **Performance**: Considerar CDN para archivos estáticos

## Contacto de Soporte

Para problemas específicos del hosting, contactar al proveedor de cPanel con esta documentación.