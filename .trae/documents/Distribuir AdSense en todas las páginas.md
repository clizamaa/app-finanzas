## Enfoque recomendado
- Mantener el loader de AdSense sólo en el layout global (ya añadido en [layout.js](file:///c:/Users/Chris/Desktop/Proyectos/app-finanzas/src/app/layout.js#L64-L71)). Esto inyecta el script en el head de TODAS las páginas y evita duplicados y errores.

## Si deseas colocarlo manualmente en cada página
1. Crear un pequeño componente `AdSenseScript` que use `next/script` con `strategy="beforeInteractive"`.
2. Importar e incluir ese componente en cada `page.js` que quieras (artículos, categoría, reviews, tutoriales, sobre-nosotros, privacidad, cookies, página principal), evitando repetir en layouts anidados.
3. Advertencia: cargar el loader varias veces genera advertencias “adsbygoogle already defined” y puede romper la carga; por eso prefiero el loader único global.

## Mostrar anuncios (lo que falta para verlos)
1. Crear un componente reutilizable `AdSlot` que renderice:
   - `ins.adsbygoogle` con tus `data-ad-client` y `data-ad-slot`.
   - En `useEffect`, ejecutar `(window.adsbygoogle = window.adsbygoogle || []).push({});`.
2. Insertar `AdSlot` en las plantillas donde quieras anuncios (p.ej., arriba y/o dentro de artículos, listados de categoría, reviews, tutoriales).

## Consent Mode
- Integrar Consent Mode v2 con tu `CookieBanner` para cumplir GDPR antes de inicializar anuncios.

## Verificación
- Navegar por varias rutas (inicio, artículo, categoría) y confirmar que:
  - El loader aparece en head.
  - No hay warnings de doble carga.
  - Los `AdSlot` muestran anuncios después de aprobación de AdSense.

## Próximo paso
- Confirmar si quieres la colocación manual en cada `page.js` (con el componente `AdSenseScript`), o mantener el loader global y proceder a implementar `AdSlot` en las páginas donde deseas anuncios.