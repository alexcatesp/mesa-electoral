import { useState, type ReactNode } from 'react';
import { asistentePorId } from './data/asistentes';
import { NOMBRE_QUIEN, teToca, type Paso, type Quien, type Rol } from './data/tipos';

export function Pag({ pag }: { pag: string }) {
  return <span className="pag">Manual oficial, pág. {pag}</span>;
}

/** Casilla de impreso: se marca con una X, como en los formularios en papel. */
export function Casilla({ marcada, alCambiar, etiqueta }: { marcada: boolean; alCambiar: (v: boolean) => void; etiqueta: string }) {
  return (
    <label className="casilla">
      <input type="checkbox" checked={marcada} onChange={(e) => alCambiar(e.target.checked)} aria-label={etiqueta} />
      <span className="casilla-caja" aria-hidden="true" />
    </label>
  );
}

export function Cuerpo({ texto, puntos }: { texto?: string[]; puntos?: string[] }) {
  return (
    <>
      {texto?.map((t) => <p key={t}>{t}</p>)}
      {puntos && (
        <ul className="puntos">
          {puntos.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}
    </>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return (
    <p className="aviso">
      <span className="aviso-marca" aria-hidden="true">!</span>
      <span>{children}</span>
    </p>
  );
}

function QuienLoHace({ quien, rol }: { quien: Quien[]; rol: Rol }) {
  const mio = teToca(rol, quien);
  const nombres = new Intl.ListFormat('es', { type: 'conjunction' }).format(quien.map((q) => NOMBRE_QUIEN[q]));
  return <span className={mio ? 'quien quien-mio' : 'quien'}>{mio ? `Te toca (${nombres.toLowerCase()})` : nombres}</span>;
}

interface PasoProps {
  paso: Paso;
  rol: Rol;
  numero?: number;
  marcable: boolean;
  hecho: boolean;
  alMarcar: (v: boolean) => void;
}

export function TarjetaPaso({ paso, rol, numero, marcable, hecho, alMarcar }: PasoProps) {
  const mio = teToca(rol, paso.quien);
  const [abiertoManual, setAbierto] = useState<boolean | null>(null);
  const tieneDetalle = Boolean(paso.texto || paso.puntos || paso.dices || paso.ojo || paso.asistente || paso.enlace);
  // Las listas de comprobación se ven plegadas, para abarcarlas de un vistazo; lo que se repite con cada votante, abierto.
  const abierto = abiertoManual ?? (mio && !marcable);
  const asistente = paso.asistente ? asistentePorId(paso.asistente) : undefined;

  return (
    <li className={`paso${mio ? ' paso-mio' : ''}${hecho ? ' paso-hecho' : ''}`}>
      <div className="paso-cabecera">
        {marcable ? (
          <Casilla marcada={hecho} alCambiar={(v) => { alMarcar(v); setAbierto(null); }} etiqueta={`Hecho: ${paso.titulo}`} />
        ) : (
          numero !== undefined && <span className="paso-numero" aria-hidden="true">{numero}</span>
        )}
        <button
          type="button"
          className="paso-titulo"
          aria-expanded={abierto}
          disabled={!tieneDetalle}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="paso-nombre">
            {marcable && numero !== undefined && <span className="paso-orden">{numero}. </span>}
            {paso.titulo}
          </span>
          <QuienLoHace quien={paso.quien} rol={rol} />
        </button>
      </div>
      {abierto && tieneDetalle && (
        <div className="paso-detalle">
          {paso.dices && (
            <p className="dices">
              <span className="dices-quien">Se dice en voz alta</span>
              {paso.dices}
            </p>
          )}
          <Cuerpo texto={paso.texto} puntos={paso.puntos} />
          {paso.ojo && <Aviso>{paso.ojo}</Aviso>}
          <div className="paso-pie">
            {asistente && <a className="boton boton-suave" href={`#/dudas/${asistente.id}`}>{asistente.titulo}</a>}
            {paso.enlace && <a className="boton boton-suave" href={paso.enlace.href}>{paso.enlace.texto}</a>}
            <Pag pag={paso.pag} />
          </div>
        </div>
      )}
    </li>
  );
}

export function Sobre({ tipo, children }: { tipo: 'congreso' | 'senado'; children: ReactNode }) {
  return <span className={`sobre sobre-${tipo}`}>{children}</span>;
}

export function Volver({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="volver" href={href}>
      <span aria-hidden="true">‹</span> {children}
    </a>
  );
}
