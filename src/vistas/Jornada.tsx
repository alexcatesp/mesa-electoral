import { useEffect, useRef } from 'react';
import { TarjetaPaso } from '../componentes';
import { FASES } from '../data/fases';
import { teToca, type Fase, type FaseId, type Rol } from '../data/tipos';
import { aMinutos, DIA, faseQueToca, hhmm, minutosDesdeElDia, prorroga, useAhora, useGuardado, type Interrupcion } from '../util';

const SIGUIENTE: Partial<Record<FaseId, FaseId>> = {
  antes: 'constitucion',
  constitucion: 'votacion',
  votacion: 'cierre',
  cierre: 'escrutinio',
  escrutinio: 'entrega',
};

function duracion(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function Cabecera({ fase, ahora, minProrroga, estado }: { fase: Fase; ahora: Date; minProrroga: number; estado: 'falta' | 'hoy' | 'pasado' }) {
  const m = minutosDesdeElDia(ahora);
  if (estado === 'falta') {
    const dias = Math.ceil((DIA.getTime() - ahora.getTime()) / 86400000);
    return (
      <header className="ahora">
        <p className="ahora-cifra">{dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`}</p>
        <p className="ahora-frase">
          La votación es el domingo 29 de noviembre de 2026. Hay que estar en el local electoral a las 8:00.
        </p>
      </header>
    );
  }
  if (estado === 'pasado') {
    return (
      <header className="ahora">
        <p className="ahora-cifra">Jornada terminada</p>
        <p className="ahora-frase">La votación fue el 29 de noviembre de 2026. La guía sigue disponible para consultarla.</p>
      </header>
    );
  }
  const hora = ahora.getHours() * 60 + ahora.getMinutes();
  const cierre = 20 * 60 + minProrroga;
  let despues = '';
  if (fase.id === 'antes') despues = `La Mesa se reúne a las 8:00, dentro de ${duracion(8 * 60 - m)}.`;
  if (fase.id === 'constitucion') despues = `La votación empieza a las 9:00, dentro de ${duracion(9 * 60 - m)}.`;
  if (fase.id === 'votacion') {
    despues = `Se cierra a las ${hhmm(cierre)}, dentro de ${duracion(cierre - m)}.`;
    if (minProrroga > 0) despues += ` Incluye ${duracion(minProrroga)} de prórroga.`;
  }
  return (
    <header className="ahora">
      <p className="ahora-cifra">
        <span className="ahora-son">Son las</span> <time>{hhmm(hora)}</time>
      </p>
      <p className="ahora-frase">
        Toca {fase.toca}. {despues}
      </p>
    </header>
  );
}

function Interrupciones({ lista, cambiar, ahora }: { lista: Interrupcion[]; cambiar: (l: Interrupcion[]) => void; ahora: Date }) {
  const ahoraTxt = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const total = prorroga(lista);
  const editar = (i: number, campo: keyof Interrupcion, v: string) => cambiar(lista.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));
  return (
    <section className="caja" aria-labelledby="t-interrupciones">
      <h3 id="t-interrupciones">Interrupciones de la votación</h3>
      <p>
        Si hay que parar la votación, apunta aquí cuándo empieza y cuándo se reanuda. El cierre se retrasa ese mismo tiempo.
      </p>
      {lista.map((x, i) => {
        const d = aMinutos(x.fin) - aMinutos(x.ini);
        return (
          <div className="interrupcion" key={i}>
            <label>
              Se paró a las
              <input type="time" value={x.ini} onChange={(e) => editar(i, 'ini', e.target.value)} />
            </label>
            <label>
              Se reanudó a las
              <input type="time" value={x.fin} onChange={(e) => editar(i, 'fin', e.target.value)} />
            </label>
            {!x.fin && (
              <button type="button" className="boton" onClick={() => editar(i, 'fin', ahoraTxt)}>
                Reanudar ahora
              </button>
            )}
            <button type="button" className="boton boton-suave" onClick={() => cambiar(lista.filter((_, j) => j !== i))}>
              Quitar
            </button>
            {d > 60 && (
              <p className="interrupcion-nota">
                Dura más de una hora: la votación puede suspenderse. <a href="#/dudas/interrupcion">Ver qué hacer</a>
              </p>
            )}
            {x.fin && d <= 0 && <p className="interrupcion-nota">La hora de reanudación debe ser posterior a la de parada.</p>}
          </div>
        );
      })}
      <button type="button" className="boton boton-suave" onClick={() => cambiar([...lista, { ini: ahoraTxt, fin: '' }])}>
        Apuntar una interrupción ahora
      </button>
      <p className="cierre">
        Hora de cierre: <strong>{hhmm(20 * 60 + total)}</strong>
        {total > 0 && ` (20:00 más ${duracion(total)})`}
      </p>
    </section>
  );
}

export function Jornada({ rol, faseVista }: { rol: Rol; faseVista?: string }) {
  const ahora = useAhora();
  const [hechos, setHechos] = useGuardado<Record<string, boolean>>('hechos', {});
  const [soloMio, setSoloMio] = useGuardado('soloMio', false);
  const [interrupciones, setInterrupciones] = useGuardado<Interrupcion[]>('interrupciones', []);

  const minProrroga = prorroga(interrupciones);
  const toca = faseQueToca(ahora, hechos, minProrroga);
  const fase = FASES.find((f) => f.id === faseVista) ?? FASES.find((f) => f.id === toca.fase)!;
  const esLaQueToca = fase.id === toca.fase;
  const siguiente = SIGUIENTE[fase.id] && FASES.find((f) => f.id === SIGUIENTE[fase.id]);

  // La tira del día se desplaza sola hasta la parte que se está viendo.
  const tira = useRef<HTMLElement>(null);
  useEffect(() => {
    const parada = tira.current?.querySelector<HTMLElement>('.dia-vista');
    if (parada && tira.current) tira.current.scrollLeft = parada.offsetLeft - (tira.current.clientWidth - parada.offsetWidth) / 2;
  }, [fase.id]);

  const marcables = fase.bloques.filter((b) => b.marcable).flatMap((b) => b.pasos);
  const nHechos = marcables.filter((p) => hechos[p.id]).length;

  return (
    <>
      {esLaQueToca ? (
        <Cabecera fase={fase} ahora={ahora} minProrroga={minProrroga} estado={toca.estado} />
      ) : (
        <header className="ahora ahora-otra">
          <p className="ahora-frase">
            Estás repasando otra parte de la jornada. <a href="#/">Volver a lo que toca ahora</a>
          </p>
        </header>
      )}

      <nav className="dia" aria-label="Partes de la jornada" ref={tira}>
        <ol>
          {FASES.map((f) => (
            <li key={f.id}>
              <a
                href={f.id === toca.fase ? '#/' : `#/fase/${f.id}`}
                className={`dia-parada${f.id === fase.id ? ' dia-vista' : ''}${f.id === toca.fase ? ' dia-ahora' : ''}`}
                aria-current={f.id === fase.id ? 'step' : undefined}
              >
                <span className="dia-hora">{f.hora}</span>
                <span className="dia-nombre">{f.nombre}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="fase" aria-labelledby="t-fase">
        <h1 id="t-fase">{fase.nombre}</h1>
        <p className="para-ti">{fase.paraTi[rol]}</p>

        <div className="fase-barra">
          {marcables.length > 1 && (
            <span className="progreso">
              {nHechos} de {marcables.length} hechos
            </span>
          )}
          <label className="interruptor">
            <input type="checkbox" checked={soloMio} onChange={(e) => setSoloMio(e.target.checked)} />
            <span>Ver solo lo que me toca</span>
          </label>
        </div>

        {fase.bloques.map((bloque, i) => {
          const pasos = bloque.pasos.filter((p) => !soloMio || teToca(rol, p.quien));
          if (pasos.length === 0) return null;
          return (
            <div className="bloque" key={i}>
              {bloque.titulo && <h2>{bloque.titulo}</h2>}
              {bloque.nota && <p className="bloque-nota">{bloque.nota}</p>}
              <ol className="pasos">
                {pasos.map((p) => (
                  <TarjetaPaso
                    key={p.id}
                    paso={p}
                    rol={rol}
                    numero={bloque.ordenado ? bloque.pasos.indexOf(p) + 1 : undefined}
                    marcable={bloque.marcable}
                    hecho={Boolean(hechos[p.id])}
                    alMarcar={(v) => setHechos((h) => ({ ...h, [p.id]: v }))}
                  />
                ))}
              </ol>
            </div>
          );
        })}

        {soloMio && fase.bloques.every((b) => b.pasos.every((p) => !teToca(rol, p.quien))) && (
          <p className="vacio">En esta parte no tienes tareas propias. Quita el filtro para ver lo que hace el resto de la Mesa.</p>
        )}

        {fase.id === 'votacion' && <Interrupciones lista={interrupciones} cambiar={setInterrupciones} ahora={ahora} />}

        {siguiente && (
          <a className="boton boton-ancho" href={siguiente.id === toca.fase ? '#/' : `#/fase/${siguiente.id}`}>
            Después: {siguiente.nombre.toLowerCase()}
          </a>
        )}
      </section>
    </>
  );
}
