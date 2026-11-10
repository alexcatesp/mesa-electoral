import { useMemo, useState } from 'react';
import { Aviso, Cuerpo, Pag, Volver } from '../componentes';
import { ASISTENTES, asistentePorId } from '../data/asistentes';
import { FASES } from '../data/fases';
import { INCIDENCIAS } from '../data/incidencias';
import { ACCESIBILIDAD, INFORMACION } from '../data/info';
import type { Asistente, Incidencia, NodoResultado } from '../data/tipos';
import { sinAcentos } from '../util';

/** Un resultado del buscador. Cada uno enlaza directamente a su respuesta, ya abierta. */
interface Hallazgo {
  titulo: string;
  donde: string;
  href: string;
  /** Frases de la respuesta, para enseñar un extracto. */
  frases: string[];
  texto: string;
  enTitulo: string;
}

/** Todos los caminos de un asistente hasta cada respuesta, con los índices de las opciones elegidas. */
export function caminosDe(a: Asistente): { indices: number[]; respuestas: string[]; preguntas: string[]; nodo: NodoResultado }[] {
  const salida: ReturnType<typeof caminosDe> = [];
  const recorrer = (id: string, indices: number[], respuestas: string[], preguntas: string[], vistos: Set<string>) => {
    const n = a.nodos[id];
    if (!n || vistos.has(id)) return;
    if (n.tipo === 'resultado') {
      salida.push({ indices, respuestas, preguntas, nodo: n });
      return;
    }
    const v = new Set(vistos).add(id);
    n.opciones.forEach((o, i) => recorrer(o.ir, [...indices, i], [...respuestas, o.texto], [...preguntas, n.pregunta], v));
  };
  recorrer(a.inicio, [], [], [], new Set());
  return salida;
}

function indice(): Hallazgo[] {
  const une = (...partes: (string | string[] | undefined)[]) => partes.flat().filter(Boolean).join(' ');
  const hallazgos: (Omit<Hallazgo, 'texto' | 'enTitulo'> & { buscar: string })[] = [];
  for (const a of ASISTENTES) {
    for (const c of caminosDe(a)) {
      const frases = [...(c.nodo.texto ?? []), ...(c.nodo.puntos ?? [])];
      hallazgos.push({
        titulo: c.nodo.titulo,
        donde: [a.titulo, ...c.respuestas].join(' › '),
        href: `#/dudas/${a.id}/r/${c.indices.join('.')}`,
        frases,
        buscar: une(a.titulo, c.preguntas, c.respuestas, c.nodo.titulo, frases),
      });
    }
  }
  for (const i of INCIDENCIAS) {
    hallazgos.push({ titulo: i.titulo, donde: i.momento, href: `#/dudas/incidencia/${i.id}`, frases: i.texto, buscar: une(i.titulo, i.texto) });
  }
  for (const f of FASES) {
    for (const b of f.bloques.filter((x) => !x.soloPara)) {
      for (const p of b.pasos) {
        const frases = [...(p.texto ?? []), ...(p.puntos ?? []), ...(p.ojo ? [p.ojo] : []), ...(p.dices ? [p.dices] : [])];
        hallazgos.push({ titulo: p.titulo, donde: f.nombre, href: `#/fase/${f.id}/${p.id}`, frases, buscar: une(p.titulo, frases) });
      }
    }
  }
  for (const [lista, donde, ruta] of [
    [ACCESIBILIDAD, 'Accesibilidad', 'accesibilidad'],
    [INFORMACION, 'Información general', 'info'],
  ] as const) {
    for (const x of lista) {
      const frases = [...(x.texto ?? []), ...(x.puntos ?? [])];
      hallazgos.push({ titulo: x.titulo, donde, href: `#/${ruta}/${x.id}`, frases, buscar: une(x.titulo, frases) });
    }
  }
  return hallazgos.map(({ buscar, ...h }) => ({ ...h, texto: sinAcentos(buscar), enTitulo: sinAcentos(h.titulo) }));
}

/** Primera frase de la respuesta que contiene las palabras buscadas (o la primera, si ninguna). */
function extracto(h: Hallazgo, palabras: string[]): string {
  const frase = h.frases.find((f) => palabras.some((p) => sinAcentos(f).includes(p))) ?? h.frases[0] ?? '';
  return frase.length > 150 ? frase.slice(0, 147).replace(/\s+\S*$/, '') + '…' : frase;
}

// La búsqueda se conserva al volver de un resultado.
let ultimaConsulta = '';
const MAX_RESULTADOS = 40;

function TarjetaIncidencia({ i }: { i: Incidencia }) {
  const asistente = i.asistente ? asistentePorId(i.asistente) : undefined;
  return (
    <details className="plegable" id={i.id}>
      <summary>{i.titulo}</summary>
      <div className="plegable-cuerpo">
        <Cuerpo texto={i.texto} />
        <div className="paso-pie">
          {asistente && <a className="boton boton-suave" href={`#/dudas/${asistente.id}`}>{asistente.titulo}</a>}
          <Pag pag={i.pag} />
        </div>
      </div>
    </details>
  );
}

export function Dudas() {
  const [consulta, setConsultaEstado] = useState(ultimaConsulta);
  const setConsulta = (v: string) => {
    ultimaConsulta = v;
    setConsultaEstado(v);
  };
  const todo = useMemo(indice, []);
  const palabras = sinAcentos(consulta).split(/\s+/).filter((p) => p.length > 1 || /\d/.test(p));
  // Primero lo que coincide en el título; después, lo que solo coincide en el texto.
  const coinciden = palabras.length ? todo.filter((h) => palabras.every((p) => h.texto.includes(p))) : [];
  const enTitulo = (h: Hallazgo) => palabras.every((p) => h.enTitulo.includes(p));
  const ordenados = [...coinciden.filter(enTitulo), ...coinciden.filter((h) => !enTitulo(h))];
  const hallazgos = ordenados.slice(0, MAX_RESULTADOS);
  const momentos = ['Al formar la Mesa', 'Durante la votación', 'En el cierre y el escrutinio'] as const;

  return (
    <section className="pagina">
      <h1>Resolver una duda</h1>
      <label className="buscador">
        <span>Busca por palabras: «fotocopia», «precinto», «correo»…</span>
        <input type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="¿Qué ha pasado?" autoComplete="off" />
      </label>

      {palabras.length > 0 ? (
        <div aria-live="polite">
          {hallazgos.length === 0 ? (
            <p className="vacio">
              No hay nada con esas palabras. Prueba con otras o pregunta a la persona representante de la Administración, que está en el local.
            </p>
          ) : (
            <>
              <p className="entradilla">
                {ordenados.length === 1 ? '1 resultado.' : `${ordenados.length} resultados.`}
                {ordenados.length > MAX_RESULTADOS && ` Se muestran los ${MAX_RESULTADOS} primeros: añade otra palabra para afinar.`}
              </p>
              <ul className="lista-enlaces">
                {hallazgos.map((h) => (
                  <li key={h.href}>
                    <a href={h.href}>
                      <strong>{h.titulo}</strong>
                      <span>{h.donde}</span>
                      {h.frases.length > 0 && <span className="extracto">{extracto(h, palabras)}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <>
          <h2>Asistentes paso a paso</h2>
          <p className="entradilla">Responde a un par de preguntas y te dicen qué hacer.</p>
          <ul className="lista-enlaces lista-asistentes">
            {ASISTENTES.map((a) => (
              <li key={a.id}>
                <a href={`#/dudas/${a.id}`}>
                  <strong>{a.titulo}</strong>
                  <span>{a.resumen}</span>
                </a>
              </li>
            ))}
          </ul>

          {momentos.map((m) => (
            <div key={m}>
              <h2>{m}</h2>
              {INCIDENCIAS.filter((i) => i.momento === m).map((i) => (
                <TarjetaIncidencia key={i.id} i={i} />
              ))}
            </div>
          ))}
          <Aviso>
            Si tu caso no aparece, no improvises: pregunta a la persona representante de la Administración o llama a la Junta Electoral de Zona.
          </Aviso>
        </>
      )}
    </section>
  );
}

export function IncidenciaVista({ id }: { id: string }) {
  const i = INCIDENCIAS.find((x) => x.id === id);
  const asistente = i?.asistente ? asistentePorId(i.asistente) : undefined;
  return (
    <section className="pagina">
      <Volver href="#/dudas">Volver a las dudas</Volver>
      {i ? (
        <>
          <h1>{i.titulo}</h1>
          <p className="entradilla">{i.momento}</p>
          <div className="respuesta">
            <Cuerpo texto={i.texto} />
            <div className="paso-pie">
              {asistente && <a className="boton boton-suave" href={`#/dudas/${asistente.id}`}>{asistente.titulo}</a>}
              <Pag pag={i.pag} />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>Resolver una duda</h1>
          <p className="vacio">Esa página no existe. Vuelve a la lista de dudas.</p>
        </>
      )}
    </section>
  );
}

const VEREDICTO = { si: 'Sí', no: 'No', ojo: 'Atención', info: 'Resultado' } as const;

/** Texto del sello: en el recuento dice qué tipo de voto es; en el resto, la respuesta corta. */
function sello(titulo: string, veredicto: keyof typeof VEREDICTO): string {
  if (/voto nulo/i.test(titulo)) return 'Nulo';
  if (/voto en blanco/i.test(titulo)) return 'En blanco';
  if (/voto válido/i.test(titulo)) return 'Válido';
  return VEREDICTO[veredicto];
}

/** Reconstruye las respuestas a partir de los índices de opción de la dirección. Si alguno no es válido, se para ahí. */
function caminoDesde(a: Asistente, ruta?: string): { nodo: string; respuesta: string }[] {
  if (!ruta) return [];
  const camino: { nodo: string; respuesta: string }[] = [];
  let id = a.inicio;
  for (const trozo of ruta.split('.')) {
    const n = a.nodos[id];
    const o = n?.tipo === 'pregunta' ? n.opciones[Number(trozo)] : undefined;
    if (!o || !/^\d+$/.test(trozo)) break;
    camino.push({ nodo: o.ir, respuesta: o.texto });
    id = o.ir;
  }
  return camino;
}

export function AsistenteVista({ id, ruta }: { id: string; ruta?: string }) {
  const asistente = asistentePorId(id);
  const [camino, setCamino] = useState<{ nodo: string; respuesta: string }[]>(() => (asistente ? caminoDesde(asistente, ruta) : []));
  if (!asistente) {
    return (
      <section className="pagina">
        <Volver href="#/dudas">Todas las dudas</Volver>
        <h1>Resolver una duda</h1>
        <p className="vacio">Esa página no existe. Vuelve a la lista de dudas para elegir un asistente.</p>
      </section>
    );
  }
  const actualId = camino.length ? camino[camino.length - 1].nodo : asistente.inicio;
  const nodo = asistente.nodos[actualId];

  return (
    <section className="pagina asistente">
      <Volver href="#/dudas">Volver a las dudas</Volver>
      <h1>{asistente.titulo}</h1>

      {camino.length > 0 && (
        <ol className="camino" aria-label="Tus respuestas">
          {camino.map((c, i) => (
            <li key={i}>
              <button type="button" onClick={() => setCamino(camino.slice(0, i))} title="Cambiar esta respuesta">
                {c.respuesta}
              </button>
            </li>
          ))}
        </ol>
      )}

      {nodo.tipo === 'pregunta' ? (
        <div className="pregunta" key={actualId}>
          <h2>{nodo.pregunta}</h2>
          {nodo.ayuda && <p className="entradilla">{nodo.ayuda}</p>}
          <div className="opciones">
            {nodo.opciones.map((o) => (
              <button type="button" key={o.texto} className="opcion" onClick={() => setCamino([...camino, { nodo: o.ir, respuesta: o.texto }])}>
                {o.texto}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`veredicto veredicto-${nodo.veredicto}`} key={actualId} role="status">
          <p className="veredicto-sello">{sello(nodo.titulo, nodo.veredicto)}</p>
          <h2>{nodo.titulo}</h2>
          <Cuerpo texto={nodo.texto} puntos={nodo.puntos} />
          <Pag pag={nodo.pag} />
          <div className="veredicto-pie">
            {nodo.seguir && (
              <a className="boton" href={`#/dudas/${nodo.seguir.asistente}`} onClick={() => setCamino([])}>
                {nodo.seguir.texto}
              </a>
            )}
            <button type="button" className="boton boton-suave" onClick={() => setCamino([])}>
              Empezar otra consulta
            </button>
          </div>
        </div>
      )}

      {camino.length > 0 && nodo.tipo === 'pregunta' && (
        <button type="button" className="boton boton-suave" onClick={() => setCamino(camino.slice(0, -1))}>
          Volver a la pregunta anterior
        </button>
      )}
    </section>
  );
}
