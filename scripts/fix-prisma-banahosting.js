#!/usr/bin/env node
/**
 * Script para solucionar problemas de Prisma en BanaHosting
 * Este script debe ejecutarse en el servidor después de subir los archivos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando solución de problemas de Prisma en BanaHosting...');

// Función para ejecutar comandos con manejo de errores
function runCommand(command, description) {
    console.log(`\n📋 ${description}`);
    console.log(`Ejecutando: ${command}`);
    
    try {
        const output = execSync(command, { 
            stdio: 'inherit',
            cwd: process.cwd(),
            env: { ...process.env, NODE_ENV: 'production' }
        });
        console.log(`✅ ${description} - Completado`);
        return true;
    } catch (error) {
        console.error(`❌ Error en: ${description}`);
        console.error(`Código de salida: ${error.status}`);
        console.error(`Error: ${error.message}`);
        return false;
    }
}

// Función para verificar archivos necesarios
function checkRequiredFiles() {
    console.log('\n🔍 Verificando archivos necesarios...');
    
    const requiredFiles = [
        'package.json',
        'prisma/schema.prisma',
        '.env.production'
    ];
    
    const missingFiles = [];
    
    requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            missingFiles.push(file);
            console.log(`❌ Archivo faltante: ${file}`);
        } else {
            console.log(`✅ Archivo encontrado: ${file}`);
        }
    });
    
    if (missingFiles.length > 0) {
        console.error('\n❌ Archivos faltantes detectados. Por favor, verifica que todos los archivos se hayan subido correctamente.');
        return false;
    }
    
    return true;
}

// Función para limpiar instalaciones previas
function cleanPreviousInstallations() {
    console.log('\n🧹 Limpiando instalaciones previas...');
    
    const dirsToClean = ['node_modules', '.next'];
    
    dirsToClean.forEach(dir => {
        if (fs.existsSync(dir)) {
            console.log(`Eliminando: ${dir}`);
            try {
                fs.rmSync(dir, { recursive: true, force: true });
                console.log(`✅ ${dir} eliminado`);
            } catch (error) {
                console.log(`⚠️  No se pudo eliminar ${dir}: ${error.message}`);
            }
        }
    });
}

// Función principal
async function main() {
    console.log('🚀 BanaHosting Prisma Fix Script v1.0');
    console.log('=====================================\n');
    
    // Paso 1: Verificar archivos
    if (!checkRequiredFiles()) {
        process.exit(1);
    }
    
    // Paso 2: Limpiar instalaciones previas
    cleanPreviousInstallations();
    
    // Paso 3: Instalar dependencias sin scripts de post-instalación
    console.log('\n📦 Instalando dependencias...');
    const installSuccess = runCommand(
        'npm install --production --ignore-scripts',
        'Instalación de dependencias (sin scripts)'
    );
    
    if (!installSuccess) {
        console.log('\n⚠️  Instalación normal falló, intentando con método alternativo...');
        runCommand(
            'npm ci --production --ignore-scripts',
            'Instalación limpia de dependencias'
        );
    }
    
    // Paso 4: Instalar Prisma manualmente
    console.log('\n🔧 Instalando Prisma manualmente...');
    runCommand(
        'npm install prisma @prisma/client --save',
        'Instalación manual de Prisma'
    );
    
    // Paso 5: Generar cliente Prisma
    console.log('\n⚙️  Generando cliente Prisma...');
    const generateSuccess = runCommand(
        'npx prisma generate',
        'Generación del cliente Prisma'
    );
    
    if (!generateSuccess) {
        console.log('\n⚠️  Generación falló, intentando método alternativo...');
        runCommand(
            'node_modules/.bin/prisma generate',
            'Generación alternativa del cliente Prisma'
        );
    }
    
    // Paso 6: Verificar la instalación
    console.log('\n🔍 Verificando instalación...');
    
    try {
        require('../src/generated/prisma-client');
        console.log('✅ Cliente Prisma instalado correctamente');
    } catch (error) {
        console.error('❌ Error al verificar cliente Prisma:', error.message);
    }
    
    // Paso 7: Construir la aplicación
    console.log('\n🏗️  Construyendo aplicación...');
    const buildSuccess = runCommand(
        'npm run build',
        'Construcción de la aplicación Next.js'
    );
    
    if (buildSuccess) {
        console.log('\n🎉 ¡Proceso completado exitosamente!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Ejecutar migraciones: npx prisma migrate deploy');
        console.log('2. Iniciar la aplicación: npm start');
        console.log('3. Verificar que la aplicación funcione correctamente');
    } else {
        console.log('\n⚠️  La construcción falló. Revisa los logs anteriores.');
        console.log('\n🔧 Comandos de diagnóstico:');
        console.log('- Verificar Node.js: node --version');
        console.log('- Verificar npm: npm --version');
        console.log('- Verificar Prisma: npx prisma --version');
        console.log('- Ver logs detallados: npm run build --verbose');
    }
}

// Ejecutar el script
main().catch(error => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
});