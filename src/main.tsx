import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource-variable/archivo/wdth.css';
import './estilos.css';
import { App } from './App';

// «/elecciones» (sin barra final) queda fuera del ámbito del service worker: sin esto no funcionaría sin cobertura.
if (window.location.pathname + '/' === import.meta.env.BASE_URL) {
  window.location.replace(import.meta.env.BASE_URL + window.location.search + window.location.hash);
}

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Copia local para usar la guía sin cobertura (solo en la versión publicada).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  });
}
