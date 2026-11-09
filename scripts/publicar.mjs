// Copia la compilación a la web personal (carpeta hermana), que la sirve en /elecciones.
// Uso: npm run publicar   (o DESTINO=/otra/carpeta npm run publicar)
import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const destino = process.env.DESTINO || path.resolve('..', 'web-personal-gemini3', 'public', 'elecciones');
if (!existsSync(path.dirname(destino))) {
  console.error(`No existe ${path.dirname(destino)}. Indica la carpeta con DESTINO=...`);
  process.exit(1);
}
rmSync(destino, { recursive: true, force: true });
cpSync('dist', destino, { recursive: true });
console.log(`Copiado dist/ → ${destino}`);
