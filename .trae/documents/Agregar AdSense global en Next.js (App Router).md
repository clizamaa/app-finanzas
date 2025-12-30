## Dónde colocarlo
- En este proyecto con App Router, el lugar correcto es el archivo global de layout: [layout.js](file:///c:/Users/Chris/Desktop/Proyectos/app-finanzas/src/app/layout.js#L62-L79).
- No uses `app/head.js` para scripts; en App Router los scripts se añaden con el componente `next/script`.

## Implementación propuesta
1. Importar el componente Script:
   ```jsx
   import Script from "next/script";
   ```
2. Insertar el script de AdSense en `RootLayout` con `strategy="beforeInteractive"` (se inyecta en `<head>` de todas las páginas):
   ```jsx
   <Script
     id="adsense-loader"
     strategy="beforeInteractive"
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6333563034016198"
     crossOrigin="anonymous"
   />
   ```
- Colocación: dentro del JSX de `RootLayout` (puede ir junto al principio del árbol; Next.js lo pondrá en `<head>` por la estrategia).
- Opcional: añadir explícitamente `<head>` en el layout y poner ahí el `Script` si prefieres verlo en el árbol:
   ```jsx
   <html lang="es" className={inter.variable}>
     <head>
       <Script ... />
     </head>
     <body>...</body>
   </html>
   ```

## Consideraciones
- El código de AdSense mostrado lleva `async` y `crossorigin`; con `next/script` no necesitas `async` manual, y `crossOrigin="anonymous"` queda soportado.
- Para mostrar anuncios, después del loader necesitarás colocar bloques de anuncio (`<ins class="adsbygoogle" ...>` + `window.adsbygoogle.push({})`) donde quieras que aparezcan.
- Cumplimiento: dado que ya tienes `CookieBanner`, podemos integrar Consent Mode v2 para EEA antes de cargar anuncios si lo necesitas.

## Verificación
- Ejecutar el proyecto y abrir varias páginas para confirmar que el script aparece en `<head>`.
- Revisar la consola del navegador para asegurar que no hay errores del dominio `googlesyndication.com`.

## Próximo paso
- Proceder a editar `src/app/layout.js` para añadir el `Script` y, si lo deseas, crear un componente de bloque de anuncios reutilizable para insertarlo en tus páginas o secciones específicas.