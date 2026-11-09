import { useCallback, useEffect, useState } from 'react';
import { FASES } from './data/fases';
import type { FaseId } from './data/tipos';

const PREFIJO = 'mesa29n:';

/** Estado guardado en este dispositivo (localStorage). Nada sale del navegador. */
export function useGuardado<T>(clave: string, inicial: T): [T, (v: T | ((a: T) => T)) => void] {
  const [valor, setValor] = useState<T>(() => {
    try {
      const crudo = localStorage.getItem(PREFIJO + clave);
      return crudo === null ? inicial : (JSON.parse(crudo) as T);
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
      /* almacenamiento lleno o bloqueado: la guía sigue funcionando sin guardar */
    }
  }, [clave, valor]);
  return [valor, setValor];
}

export function borrarTodo() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIJO))
    .forEach((k) => localStorage.removeItem(k));
}

/** Ruta actual a partir del hash: «#/dudas/votante» → ['dudas', 'votante'] */
export function useRuta(): string[] {
  const leer = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const alCambiar = () => {
      setRuta(leer());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);
  return ruta;
}

/** Día de la votación. */
export const DIA = new Date(2026, 10, 29);

// Para ensayar: ?ahora=2026-11-29T08:42 fija la hora inicial y el reloj sigue corriendo desde ahí.
const simulada = new URLSearchParams(window.location.search).get('ahora');
const desfase = simulada && !Number.isNaN(Date.parse(simulada)) ? Date.parse(simulada) - Date.now() : 0;
export const esEnsayo = desfase !== 0;

export function useAhora(): Date {
  const leer = useCallback(() => new Date(Date.now() + desfase), []);
  const [ahora, setAhora] = useState(leer);
  useEffect(() => {
    const t = setInterval(() => setAhora(leer()), 15000);
    return () => clearInterval(t);
  }, [leer]);
  return ahora;
}

/** Minutos transcurridos desde las 00:00 del día de la votación (negativo si aún no ha llegado). */
export const minutosDesdeElDia = (ahora: Date) => Math.floor((ahora.getTime() - DIA.getTime()) / 60000);

export const hhmm = (min: number) => `${Math.floor(min / 60) % 24}:${String(min % 60).padStart(2, '0')}`;

export const aMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

export interface Interrupcion { ini: string; fin: string }

/** Minutos de prórroga: suma de las interrupciones ya cerradas. */
export function prorroga(interrupciones: Interrupcion[]): number {
  return interrupciones.reduce((total, i) => {
    const d = aMinutos(i.fin) - aMinutos(i.ini);
    return total + (d > 0 ? d : 0);
  }, 0);
}

export type Momento = { fase: FaseId; estado: 'falta' | 'hoy' | 'pasado' };

/** Qué fase toca según el reloj y, pasadas las 20:00, según lo que ya esté marcado como hecho. */
export function faseQueToca(ahora: Date, hechos: Record<string, boolean>, minProrroga: number): Momento {
  const m = minutosDesdeElDia(ahora);
  if (m < 0) return { fase: 'antes', estado: 'falta' };
  if (m >= 30 * 60) return { fase: 'antes', estado: 'pasado' };
  if (m < 8 * 60) return { fase: 'antes', estado: 'hoy' };
  if (m < 9 * 60) return { fase: 'constitucion', estado: 'hoy' };
  if (m < 20 * 60 + minProrroga) return { fase: 'votacion', estado: 'hoy' };
  for (const id of ['cierre', 'escrutinio'] as const) {
    const fase = FASES.find((f) => f.id === id)!;
    const pendientes = fase.bloques.some((b) => b.marcable && b.pasos.some((p) => !hechos[p.id]));
    if (pendientes) return { fase: id, estado: 'hoy' };
  }
  return { fase: 'entrega', estado: 'hoy' };
}

export const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
