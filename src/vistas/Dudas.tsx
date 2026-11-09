import { useMemo, useState } from 'react';
import { Aviso, Cuerpo, Pag, Volver } from '../componentes';
import { ASISTENTES, asistentePorId } from '../data/asistentes';
import { FASES } from '../data/fases';
import { INCIDENCIAS } from '../data/incidencias';
import { ACCESIBILIDAD, INFORMACION } from '../data/info';
import type { Incidencia } from '../data/tipos';
import { sinAcentos } from '../util';

interface Hallazgo { titulo: string; donde: string; href: string; texto: string }

function indice(): Hallazgo[] {
  const une = (...partes: (string | string[] | undefined)[]) => partes.flat().filter(Boolean).join(' ');
  return [
    ...ASISTENTES.map((a) => ({
      titulo: a.titulo,
      donde: 'Asistente paso a paso',
      href: `#/dudas/${a.id}`,
      texto: une(a.titulo, a.resumen, Object.values(a.nodos).map((n) => (n.tipo === 'pregunta' ? une(n.pregunta, n.ayuda, n.opciones.map((o) => o.texto)) : une(n.titulo, n.texto, n.puntos)))),
    })),
    ...INCIDENCIAS.map((i) => ({ titulo: i.titulo, donde: i.momento, href: `#/dudas/incidencia/${i.id}`, texto: une(i.titulo, i.texto) })),
    ...FASES.flatMap((f) =>
      f.bloques.flatMap((b) =>
        b.pasos.map((p) => ({ titulo: p.titulo, donde: f.nombre, href: `#/fase/${f.id}`, texto: une(p.titulo, p.texto, p.puntos, p.ojo, p.dices) }))
      )
    ),
    ...ACCESIBILIDAD.map((x) => ({ titulo: x.titulo, donde: 'Accesibilidad', href: '#/accesibilidad', texto: une(x.titulo, x.texto, x.puntos) })),
    ...INFORMACION.map((x) => ({ titulo: x.titulo, donde: 'Información general', href: '#/info', texto: une(x.titulo, x.texto, x.puntos) })),
  ].map((h) => ({ ...h, texto: sinAcentos(h.texto) }));
}

function TarjetaIncidencia({ i, abierta }: { i: Incidencia; abierta?: boolean }) {
  const asistente = i.asistente ? asistentePorId(i.asistente) : undefined;
  return (
    <details className="plegable" open={abierta} id={i.id}>
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

export function Dudas({ incidenciaAbierta }: { incidenciaAbierta?: string }) {
  const [consulta, setConsulta] = useState('');
  const todo = useMemo(indice, []);
  const palabras = sinAcentos(consulta).split(/\s+/).filter((p) => p.length > 1);
  const hallazgos = palabras.length ? todo.filter((h) => palabras.every((p) => h.texto.includes(p))).slice(0, 30) : [];
  const momentos = ['Al formar la Mesa', 'Durante la votación', 'Durante el escrutinio'] as const;

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
            <ul className="lista-enlaces">
              {hallazgos.map((h) => (
                <li key={h.href + h.titulo}>
                  <a href={h.href}>
                    <strong>{h.titulo}</strong>
                    <span>{h.donde}</span>
                  </a>
                </li>
              ))}
            </ul>
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
                <TarjetaIncidencia key={i.id} i={i} abierta={i.id === incidenciaAbierta} />
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

const VEREDICTO = { si: 'Sí', no: 'No', ojo: 'Atención', info: 'Resultado' } as const;

export function AsistenteVista({ id }: { id: string }) {
  const asistente = asistentePorId(id);
  const [camino, setCamino] = useState<{ nodo: string; respuesta: string }[]>([]);
  if (!asistente) {
    return (
      <section className="pagina">
        <Volver href="#/dudas">Todas las dudas</Volver>
        <p className="vacio">Ese asistente no existe.</p>
      </section>
    );
  }
  const actualId = camino.length ? camino[camino.length - 1].nodo : asistente.inicio;
  const nodo = asistente.nodos[actualId];

  return (
    <section className="pagina asistente">
      <Volver href="#/dudas">Todas las dudas</Volver>
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
          <p className="veredicto-sello">{VEREDICTO[nodo.veredicto]}</p>
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
