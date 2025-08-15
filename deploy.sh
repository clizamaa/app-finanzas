#!/bin/bash

# Script de deploy para cPanel - AppFinanzasHoy
# Ejecutar desde la raíz del proyecto

set -e  # Salir si hay errores

echo "🚀 Iniciando proceso de deploy para cPanel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    log_error "No se encontró package.json. Ejecutar desde la raíz del proyecto."
    exit 1
fi

log_info "Verificando dependencias..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js version: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado"
    exit 1
fi

NPM_VERSION=$(npm --version)
log_success "npm version: $NPM_VERSION"

# Limpiar instalación anterior
log_info "Limpiando archivos temporales..."
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build

# Instalar dependencias
log_info "Instalando dependencias..."
npm ci --production

# Generar Prisma Client
log_info "Generando Prisma Client..."
npx prisma generate

# Construir aplicación
log_info "Construyendo aplicación para producción..."
NODE_ENV=production npm run build

log_success "Build completado exitosamente"

# Crear archivo de información del deploy
log_info "Creando información del deploy..."
cat > deploy-info.json << EOF
{
  "deployDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nodeVersion": "$NODE_VERSION",
  "npmVersion": "$NPM_VERSION",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'N/A')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'N/A')",
  "environment": "production"
}
EOF

# Crear directorio de deploy
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
log_info "Creando paquete de deploy: $DEPLOY_DIR"

mkdir -p "$DEPLOY_DIR"

# Copiar archivos necesarios para el deploy
log_info "Copiando archivos para deploy..."

# Archivos principales
cp -r src "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp -r prisma "$DEPLOY_DIR/"
cp -r .next "$DEPLOY_DIR/"

# Archivos de configuración
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"
cp server.js "$DEPLOY_DIR/"
cp .env.production.example "$DEPLOY_DIR/"
cp deploy-info.json "$DEPLOY_DIR/"

# Archivos opcionales
[ -f "jsconfig.json" ] && cp jsconfig.json "$DEPLOY_DIR/"
[ -f "postcss.config.mjs" ] && cp postcss.config.mjs "$DEPLOY_DIR/"
[ -f ".cpanel.yml" ] && cp .cpanel.yml "$DEPLOY_DIR/"

# Crear archivo README para el deploy
cat > "$DEPLOY_DIR/DEPLOY-README.md" << 'EOF'
# Deploy en cPanel - Instrucciones

## Pasos a seguir:

1. **Subir archivos**: Subir todo el contenido de esta carpeta a `public_html` en cPanel

2. **Configurar variables de entorno**:
   - Renombrar `.env.production.example` a `.env.production`
   - Completar todas las variables con valores reales
   - Configurar credenciales de base de datos MySQL

3. **Configurar aplicación Node.js en cPanel**:
   - Ir a "Node.js App" en cPanel
   - Crear nueva aplicación
   - Startup file: `server.js`
   - Application mode: Production

4. **Instalar dependencias en el servidor**:
   ```bash
   npm install --production
   ```

5. **Configurar base de datos**:
   ```bash
   npx prisma db push
   ```

6. **Iniciar aplicación** desde cPanel Node.js App Manager

## Verificación:
- Comprobar que la aplicación esté ejecutándose
- Verificar que el sitio cargue correctamente
- Probar funcionalidades principales

EOF

# Crear archivo ZIP para fácil subida
log_info "Creando archivo ZIP para deploy..."
zip -r "$DEPLOY_DIR.zip" "$DEPLOY_DIR" -x "*.DS_Store" "*Thumbs.db"

log_success "Deploy preparado exitosamente!"
log_info "Archivos listos en: $DEPLOY_DIR/"
log_info "Archivo ZIP: $DEPLOY_DIR.zip"

echo ""
log_info "📋 Próximos pasos:"
echo "   1. Subir el contenido de '$DEPLOY_DIR/' a cPanel"
echo "   2. Configurar variables de entorno (.env.production)"
echo "   3. Crear aplicación Node.js en cPanel"
echo "   4. Configurar base de datos MySQL"
echo "   5. Iniciar la aplicación"
echo ""
log_success "🎉 Deploy listo para cPanel!"