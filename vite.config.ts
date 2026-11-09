import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Genera sw.js a partir de src/sw.js con la lista de archivos de la compilación,
 * para que la guía quede guardada entera en la primera visita y funcione sin cobertura.
 * La versión cambia con el contenido, así cada despliegue renueva la copia guardada.
 */
function servicioSinConexion(): Plugin {
  return {
    name: 'servicio-sin-conexion',
    apply: 'build',
    generateBundle(_opciones, paquete) {
      const compilados = Object.keys(paquete).filter(
        // Basta con woff2 (lo usan todos los navegadores actuales) y sobran los glifos vietnamitas.
        (f) => f !== 'index.html' && !f.endsWith('.woff') && !f.includes('vietnamese')
      );
      const publicos = readdirSync('public');
      const archivos = [...compilados, ...publicos].sort();
      const version = createHash('sha1').update(archivos.join('|')).digest('hex').slice(0, 8);
      const codigo = readFileSync('src/sw.js', 'utf8').replace('__VERSION__', version).replace('"__ARCHIVOS__"', JSON.stringify(archivos));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: codigo });
    },
  };
}

// La app se publica en una subcarpeta: https://alejandrocatalaespi.es/elecciones/
// Para otra ruta: BASE=/otra/ npm run build
export default defineConfig({
  base: process.env.BASE || '/elecciones/',
  plugins: [react(), servicioSinConexion()],
  server: { port: 5183 },
  preview: { port: 4183, strictPort: true },
});
