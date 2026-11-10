# CLAUDE.md

Guía interactiva no oficial para Mesas electorales (elecciones generales del 29/11/2026). Vite + React 19 + TypeScript, sin backend. Se publica en https://alejandrocatalaespi.es/elecciones.

## Comandos
- `npm run dev` → http://localhost:5183/elecciones/
- `npm run build` → `tsc --noEmit` + `vite build` (base `/elecciones/`, cambiable con `BASE`)
- `npm run publicar` → compila y copia `dist/` a `../web-personal-gemini3/public/elecciones`. Después hay que hacer commit y push en ese otro repo (Firebase App Hosting despliega desde `main`).

## Reglas de contenido
- La fuente es el manual oficial del Ministerio del Interior. Cada paso, resultado e incidencia lleva `pag` con la página del manual.
- No afirmar nada que el manual no diga. Si el manual no resuelve un caso, se dice y se remite a la persona representante de la Administración o a la Junta Electoral de Zona.
- La portada (`src/vistas/Portada.tsx`) se muestra antes de elegir perfil y contiene el aviso de origen (`AvisoOrigen`): no oficial, hecha con IA, puede contener errores. Ese aviso también va en «Más» y no debe quitarse ni suavizarse.
- Auditoría frase a frase contra el manual hecha el 10/11/2026. Al tocar contenido, redactar pegado al texto del manual y no atribuir tareas a quien el manual no nombra.
- La app no debe parecer oficial: sin escudos ni logotipos del Gobierno, y con el aviso de «guía no oficial».

## Arquitectura
- Contenido como datos tipados en `src/data/` (`tipos.ts`, `fases.ts`, `asistentes.ts`, `incidencias.ts`, `info.ts`).
- Rutas por hash (`useRuta` en `src/util.ts`): `#/`, `#/fase/<id>`, `#/dudas`, `#/dudas/<asistente>`, `#/dudas/incidencia/<id>`, `#/recuento`, `#/sobres`, `#/accesibilidad`, `#/info`, `#/mas`, `#/perfil`, `#/portada`.
- Estado en `localStorage` con prefijo `mesa29n:` (`useGuardado`): `portadaVista`, `rol`, `hechos`, `soloMio`, `interrupciones`, `recuento`, `sobres`.
- `faseQueToca` decide la fase por el reloj; pasadas las 20:00 (más la prórroga) avanza según los pasos marcados. `?ahora=2026-11-29T08:42` simula la hora.
- El historial de deshacer del recuento vive dentro del mismo estado `recuento`, para que cada pulsación sea atómica. Deshacer recupera recuentos, no la lista de nombres (añadir o quitar una línea no se deshace).
- PWA: `src/sw.js` es una plantilla; el plugin `servicioSinConexion` de `vite.config.ts` genera `dist/sw.js` con la lista de archivos y una versión derivada de ella. Al instalarse guarda toda la app (funciona sin cobertura desde la primera visita). Páginas: red primero; `/assets/`: caché primero. Solo se registra en producción; para probarlo: `npm run build && npx vite preview` (puerto 4183).
- `main.tsx` redirige `/elecciones` a `/elecciones/`: sin la barra final la página queda fuera del ámbito del service worker.
- Un `Bloque` con `soloPara` solo se muestra a esos perfiles (bloques «Lo que puedes hacer tú» de interventores y apoderados); no entran en el buscador.

## Diseño
Estilos en `src/estilos.css`. Azul de bolígrafo para lo que hace el usuario, sepia solo para el Senado, rojo de precinto para avisos. Casillas que se marcan con «X», veredictos como sello. Tipografías autoalojadas: Atkinson Hyperlegible (texto) y Archivo ancha (titulares y cifras).
