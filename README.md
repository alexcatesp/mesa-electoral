# Mesa electoral 29N

Guía interactiva para quienes integran una Mesa electoral en las elecciones a Cortes Generales del 29 de noviembre de 2026. Dice qué hay que hacer en cada momento de la jornada según tu papel: presidencia, vocal, suplente, interventor o apoderado.

**Abrir la guía:** https://alejandrocatalaespi.es/elecciones

> No es una aplicación oficial. Resume el «Manual de instrucciones para las personas que integran las Mesas electorales» del Ministerio del Interior, supervisado por la Junta Electoral Central. Cada paso cita la página del manual de la que sale. Ante la duda, manda el manual en papel y la Junta Electoral de Zona.

## Qué hace

- **Ahora.** Mira el reloj y enseña la parte de la jornada que toca (constitución a las 8:00, votación a las 9:00, cierre a las 20:00, escrutinio y entrega de sobres), con sus pasos y quién hace cada uno. Los tuyos van resaltados y se pueden marcar como hechos.
- **Dudas.** Seis asistentes de preguntas y respuestas: si una persona puede votar, si un voto es válido, nulo o en blanco, qué hacer con un sobre de voto por correo, interventores, falta de miembros para constituir la Mesa e interrupción de la votación. Además, las incidencias de la parte II del manual y un buscador.
- **Recuento.** Contador de votos para Congreso y Senado, con deshacer, comprobación de que los sobres cuadran con los votantes anotados y el texto del anuncio de resultados.
- **Interrupciones.** Apunta cuándo se para y se reanuda la votación y calcula la nueva hora de cierre.
- **Sobres, accesibilidad e información general.** Qué va en cada uno de los tres sobres, cómo atender a votantes con discapacidad y normas de orden público.

Funciona sin cobertura una vez abierta (PWA). No tiene servidor ni cuentas: las marcas y el recuento se guardan solo en el navegador.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5183/elecciones/
npm run build    # comprueba tipos y compila en dist/
```

Para ensayar un momento de la jornada, añade la hora a la dirección: `/elecciones/?ahora=2026-11-29T08:42`.

La app se compila para servirse en `/elecciones/`. Para otra ruta: `BASE=/otra/ npm run build`.

`npm run publicar` compila y copia `dist/` a `../web-personal-gemini3/public/elecciones` (la web personal del autor). Con `DESTINO=/ruta` se copia a otra carpeta.

## Dónde está cada cosa

| Ruta | Contenido |
| --- | --- |
| `src/data/fases.ts` | Partes de la jornada, pasos, quién los hace y contenido de los sobres |
| `src/data/asistentes.ts` | Árboles de decisión de los asistentes |
| `src/data/incidencias.ts` | Incidencias y soluciones (parte II del manual) |
| `src/data/info.ts` | Accesibilidad e información general |
| `src/vistas/` | Pantallas: jornada, dudas, recuento y el resto |
| `public/sw.js` | Service worker para el uso sin conexión |

Todo el contenido son datos con tipos (`src/data/tipos.ts`). Para otras elecciones basta con cambiar esos ficheros y la fecha en `src/util.ts`.

## Corregir un error

Si algo no coincide con el manual oficial, abre una incidencia indicando la página del manual. El criterio es no afirmar nada que el manual no diga: cuando el manual no resuelve un caso, la guía lo dice y remite a la Junta Electoral de Zona.

## Licencia

Código bajo licencia MIT. El contenido procede de un documento público de la Administración General del Estado.
