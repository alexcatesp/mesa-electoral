export type Rol = 'presidencia' | 'vocal' | 'suplente' | 'interventor' | 'apoderado';
/** Quién hace un paso. «mesa» = presidencia y vocales. */
export type Quien = Rol | 'mesa';

export const ROLES: { id: Rol; nombre: string; corto: string; resumen: string }[] = [
  { id: 'presidencia', nombre: 'Presidente o presidenta', corto: 'Presidencia', resumen: 'Rellenas el acta de constitución, recibes los sobres de voto y mantienes el orden en el local.' },
  { id: 'vocal', nombre: 'Vocal', corto: 'Vocal', resumen: 'Compruebas la identidad de cada votante y que figura en el censo.' },
  { id: 'suplente', nombre: 'Suplente', corto: 'Suplente', resumen: 'Acudes a las 8:00 por si hay que sustituir a un titular. Si no, puedes irte cuando tu nombre conste en el acta.' },
  { id: 'interventor', nombre: 'Interventor o interventora', corto: 'Interventor/a', resumen: 'Representas a una candidatura en esta Mesa, con voz pero sin voto.' },
  { id: 'apoderado', nombre: 'Apoderado o apoderada', corto: 'Apoderado/a', resumen: 'Representas a una candidatura y puedes acceder a todos los locales electorales.' },
];

export const NOMBRE_QUIEN: Record<Quien, string> = {
  mesa: 'Toda la Mesa',
  presidencia: 'Presidencia',
  vocal: 'Vocales',
  suplente: 'Suplentes',
  interventor: 'Interventores',
  apoderado: 'Apoderados',
};

export function teToca(rol: Rol, quien: Quien[]): boolean {
  return quien.includes(rol) || (quien.includes('mesa') && (rol === 'presidencia' || rol === 'vocal'));
}

export interface Paso {
  id: string;
  titulo: string;
  quien: Quien[];
  texto?: string[];
  puntos?: string[];
  /** Lo que se dice en voz alta. */
  dices?: string;
  /** Advertencia importante. */
  ojo?: string;
  /** Página del manual oficial. */
  pag: string;
  /** Asistente relacionado. */
  asistente?: string;
  /** Otra pantalla relacionada. */
  enlace?: { texto: string; href: string };
}

export interface Bloque {
  titulo?: string;
  nota?: string;
  /** true: los pasos van en orden y se numeran. */
  ordenado: boolean;
  /** true: cada paso se puede marcar como hecho. */
  marcable: boolean;
  /** Si se indica, el bloque solo se muestra a esos perfiles. */
  soloPara?: Rol[];
  pasos: Paso[];
}

export type FaseId = 'antes' | 'constitucion' | 'votacion' | 'cierre' | 'escrutinio' | 'entrega';

export interface Fase {
  id: FaseId;
  hora: string;
  nombre: string;
  /** Completa «Toca…» */
  toca: string;
  paraTi: Record<Rol, string>;
  bloques: Bloque[];
}

export interface Opcion { texto: string; ir: string }
export interface NodoPregunta { tipo: 'pregunta'; pregunta: string; ayuda?: string; opciones: Opcion[] }
export interface NodoResultado {
  tipo: 'resultado';
  veredicto: 'si' | 'no' | 'ojo' | 'info';
  titulo: string;
  texto?: string[];
  puntos?: string[];
  pag: string;
  /** Enlace a otro asistente. */
  seguir?: { texto: string; asistente: string };
}
export type Nodo = NodoPregunta | NodoResultado;

export interface Asistente {
  id: string;
  titulo: string;
  resumen: string;
  inicio: string;
  nodos: Record<string, Nodo>;
}

export interface Incidencia {
  id: string;
  momento: 'Al formar la Mesa' | 'Durante la votación' | 'En el cierre y el escrutinio';
  titulo: string;
  texto: string[];
  pag: string;
  asistente?: string;
}
