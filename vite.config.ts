import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La app se publica en una subcarpeta: https://alejandrocatalaespi.es/elecciones/
// Para otra ruta: BASE=/otra/ npm run build
export default defineConfig({
  base: process.env.BASE || '/elecciones/',
  plugins: [react()],
  server: { port: 5183 },
});
