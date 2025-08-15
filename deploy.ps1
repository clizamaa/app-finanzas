# Script de deploy para cPanel - AppFinanzasHoy (PowerShell)
# Ejecutar desde la raiz del proyecto: .\deploy.ps1

# Configuracion de errores
$ErrorActionPreference = "Stop"

# Funciones de output
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-ErrorMsg {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Host "Iniciando proceso de deploy para cPanel..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-ErrorMsg "No se encontro package.json. Ejecutar desde la raiz del proyecto."
    exit 1
}

Write-Info "Verificando dependencias..."

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-ErrorMsg "Node.js no esta instalado o no esta en el PATH"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Success "npm version: $npmVersion"
} catch {
    Write-ErrorMsg "npm no esta instalado o no esta en el PATH"
    exit 1
}

# Limpiar archivos temporales
Write-Info "Limpiando archivos temporales..."
if (Test-Path "deploy-*") {
    Remove-Item "deploy-*" -Recurse -Force
}
if (Test-Path "*.zip") {
    Remove-Item "*.zip" -Force
}

# Instalar dependencias de produccion
Write-Info "Instalando dependencias de produccion..."
npm ci --only=production

# Generar Prisma Client
Write-Info "Generando Prisma Client..."
npx prisma generate

# Construir la aplicacion
Write-Info "Construyendo la aplicacion..."
npm run build

# Crear informacion de deploy
$deployInfo = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    nodeVersion = $nodeVersion
    npmVersion = $npmVersion
    gitCommit = if (Test-Path ".git") { git rev-parse HEAD } else { "N/A" }
} | ConvertTo-Json

$deployInfo | Out-File -FilePath "deploy-info.json" -Encoding UTF8

# Crear directorio de deploy
$deployDir = "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

Write-Info "Empaquetando archivos en $deployDir..."

# Copiar archivos necesarios
$filesToCopy = @(
    ".next",
    "public",
    "prisma",
    "package.json",
    "server.js",
    "next.config.js",
    "deploy-info.json"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        if (Test-Path $file -PathType Container) {
            Copy-Item $file -Destination $deployDir -Recurse -Force
        } else {
            Copy-Item $file -Destination $deployDir -Force
        }
        Write-Success "Copiado: $file"
    } else {
        Write-Warning "No encontrado: $file"
    }
}

# Crear archivo ZIP
$zipName = "$deployDir.zip"
Write-Info "Creando archivo ZIP: $zipName"

Compress-Archive -Path $deployDir -DestinationPath $zipName -Force

Write-Success "Deploy package creado exitosamente!"
Write-Host ""
Write-Host "Archivos generados:" -ForegroundColor Cyan
Write-Host "- Directorio: $deployDir" -ForegroundColor White
Write-Host "- Archivo ZIP: $zipName" -ForegroundColor White
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "1. Subir el archivo $zipName a tu cPanel" -ForegroundColor White
Write-Host "2. Extraer en el directorio de tu aplicacion Node.js" -ForegroundColor White
Write-Host "3. Configurar variables de entorno" -ForegroundColor White
Write-Host "4. Instalar dependencias: npm install --production" -ForegroundColor White
Write-Host "5. Iniciar la aplicacion" -ForegroundColor White
Write-Host ""
Write-Host "Consulta cpanel-deploy.md para instrucciones detalladas." -ForegroundColor Green

Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")