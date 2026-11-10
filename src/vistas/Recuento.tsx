import { useState } from 'react';
import { Aviso, Sobre } from '../componentes';
import { useGuardado } from '../util';

interface Linea { id: number; nombre: string; votos: number }
interface Urna {
  lineas: Linea[];
  blancos: number;
  nulos: number;
  /** Solo Senado: papeletas válidas con algún candidato marcado. */
  validas: number;
  /** Personas anotadas en la lista numerada que han votado en esta elección. */
  votantes: string;
}
interface Datos {
  censo: string;
  certificaciones: string;
  interventores: string;
  maxSenado: 1 | 2 | 3;
  congreso: Urna;
  senado: Urna;
  /** Estados anteriores, para deshacer. Va dentro del mismo estado para que cada pulsación sea atómica. */
  historial: { eleccion: Eleccion; urna: Urna }[];
}
type Eleccion = 'congreso' | 'senado';

const URNA_VACIA: Urna = { lineas: [], blancos: 0, nulos: 0, validas: 0, votantes: '' };
const INICIAL: Datos = { censo: '', certificaciones: '', interventores: '', maxSenado: 3, congreso: URNA_VACIA, senado: URNA_VACIA, historial: [] };

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
const num = (s: string) => (s.trim() === '' ? null : Math.max(0, Math.floor(Number(s)) || 0));

function Numero({ etiqueta, valor, cambiar, ayuda }: { etiqueta: string; valor: string; cambiar: (v: string) => void; ayuda?: string }) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      <input type="number" inputMode="numeric" min={0} value={valor} onChange={(e) => cambiar(e.target.value)} />
      {ayuda && <small>{ayuda}</small>}
    </label>
  );
}

export function Recuento() {
  const [guardado, setDatos] = useGuardado<Datos>('recuento', INICIAL);
  const datos = { ...INICIAL, ...guardado };
  const [eleccion, setEleccion] = useState<Eleccion>('congreso');
  const [nuevo, setNuevo] = useState('');
  const [marcados, setMarcados] = useState<number[]>([]);
  const [confirmar, setConfirmar] = useState(false);

  const urna = datos[eleccion];
  const esSenado = eleccion === 'senado';

  const cambiarUrna = (fn: (u: Urna) => Urna, deshacer = true) =>
    setDatos((d) => ({
      ...d,
      [eleccion]: fn(d[eleccion]),
      historial: deshacer ? [...(d.historial ?? []).slice(-99), { eleccion, urna: d[eleccion] }] : d.historial ?? [],
    }));
  const deshacer = () =>
    setDatos((d) => {
      const historial = d.historial ?? [];
      const i = historial.map((h) => h.eleccion).lastIndexOf(eleccion);
      if (i < 0) return d;
      // Se recuperan los recuentos, no la lista de nombres: lo añadido o quitado después se respeta.
      const antes = historial[i].urna;
      const actual = d[eleccion];
      const lineas = [
        ...actual.lineas.map((l) => ({ ...l, votos: antes.lineas.find((a) => a.id === l.id)?.votos ?? 0 })),
        ...antes.lineas.filter((a) => a.votos > 0 && !actual.lineas.some((l) => l.id === a.id)),
      ];
      return { ...d, [eleccion]: { ...antes, lineas, votantes: actual.votantes }, historial: historial.filter((_, j) => j !== i) };
    });
  const hayDeshacer = datos.historial.some((h) => h.eleccion === eleccion);

  const anadir = () => {
    const nombre = nuevo.trim();
    if (!nombre) return;
    cambiarUrna((u) => ({ ...u, lineas: [...u.lineas, { id: Math.max(Date.now(), ...u.lineas.map((l) => l.id + 1)), nombre, votos: 0 }] }), false);
    setNuevo('');
  };
  /** Quita una línea añadida por error. Solo se ofrece mientras no tiene votos. */
  const quitar = (id: number) => {
    cambiarUrna((u) => ({ ...u, lineas: u.lineas.filter((l) => l.id !== id) }), false);
    setMarcados((m) => m.filter((x) => x !== id));
  };
  const sumar = (id: number, n: number) =>
    cambiarUrna((u) => ({ ...u, lineas: u.lineas.map((l) => (l.id === id ? { ...l, votos: Math.max(0, l.votos + n) } : l)) }));

  const anotarPapeletaSenado = () => {
    const ids = marcados;
    if (ids.length === 0) cambiarUrna((u) => ({ ...u, blancos: u.blancos + 1 }));
    else if (ids.length > datos.maxSenado) cambiarUrna((u) => ({ ...u, nulos: u.nulos + 1 }));
    else cambiarUrna((u) => ({ ...u, validas: u.validas + 1, lineas: u.lineas.map((l) => (ids.includes(l.id) ? { ...l, votos: l.votos + 1 } : l)) }));
    setMarcados([]);
  };

  const aCandidaturas = esSenado ? urna.validas : urna.lineas.reduce((t, l) => t + l.votos, 0);
  const sobres = aCandidaturas + urna.blancos + urna.nulos;
  const votantes = num(urna.votantes);
  const censo = num(datos.censo);
  const certificaciones = num(datos.certificaciones) ?? 0;
  const interventores = num(datos.interventores) ?? 0;
  const maximo = censo === null ? null : censo + certificaciones + interventores;

  let textoSenado = 'Anotar voto en blanco (ninguno marcado)';
  if (marcados.length > datos.maxSenado) textoSenado = `Anotar voto nulo (más de ${datos.maxSenado} ${datos.maxSenado === 1 ? 'marcado' : 'marcados'})`;
  else if (marcados.length > 0) textoSenado = `Anotar papeleta con ${marcados.length} ${marcados.length === 1 ? 'marca' : 'marcas'}`;

  return (
    <section className="pagina recuento">
      <h1>Contador del escrutinio</h1>
      <p className="entradilla">
        Lleva la cuenta mientras la Presidencia lee las papeletas y comprueba que todo cuadra. Los datos se quedan en este móvil.
      </p>
      <Aviso>Es una ayuda. Lo único que vale es lo que escribáis y firméis en las actas de papel.</Aviso>

      <div className="pestanas" role="tablist" aria-label="Elección">
        {(['congreso', 'senado'] as const).map((e) => (
          <button key={e} type="button" role="tab" aria-selected={eleccion === e} className="pestana" onClick={() => { setEleccion(e); setMarcados([]); }}>
            <Sobre tipo={e}>{e === 'congreso' ? 'Congreso' : 'Senado'}</Sobre>
          </button>
        ))}
      </div>

      {esSenado && (
        <label className="campo">
          <span>Máximo de candidatos que se pueden marcar aquí</span>
          <select value={datos.maxSenado} onChange={(e) => setDatos((d) => ({ ...d, maxSenado: Number(e.target.value) as 1 | 2 | 3 }))}>
            <option value={3}>3: regla general</option>
            <option value={2}>2: Gran Canaria, Tenerife, Mallorca, Ceuta y Melilla</option>
            <option value={1}>1: Menorca, Ibiza, Formentera, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma</option>
          </select>
        </label>
      )}

      <h2>{esSenado ? 'Candidatos y candidatas' : 'Candidaturas'}</h2>
      {urna.lineas.length === 0 && (
        <p className="vacio">
          {esSenado
            ? 'Añade los nombres que aparecen en la papeleta del Senado. Puedes ir añadiéndolos según salgan.'
            : 'Añade las candidaturas según vayan saliendo de la urna, o todas antes de empezar.'}
        </p>
      )}

      {!esSenado && (
        <ul className="lineas">
          {urna.lineas.map((l) => (
            <li key={l.id}>
              <button type="button" className="linea-suma" onClick={() => sumar(l.id, 1)} aria-label={`Sumar un voto a ${l.nombre}`}>
                <span className="linea-nombre">{l.nombre}</span>
                <span className="linea-votos">{l.votos}</span>
                <span className="linea-mas" aria-hidden="true">+1</span>
              </button>
              {l.votos === 0 ? (
                <button type="button" className="linea-resta" onClick={() => quitar(l.id)} aria-label={`Quitar ${l.nombre} de la lista`}>
                  Quitar
                </button>
              ) : (
                <button type="button" className="linea-resta" onClick={() => sumar(l.id, -1)} aria-label={`Restar un voto a ${l.nombre}`}>
                  −1
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {esSenado && urna.lineas.length > 0 && (
        <>
          <p className="entradilla">Toca los nombres marcados en la papeleta que se está leyendo y después anótala.</p>
          <ul className="lineas lineas-senado">
            {urna.lineas.map((l) => {
              const marcado = marcados.includes(l.id);
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    className="linea-suma"
                    aria-pressed={marcado}
                    onClick={() => setMarcados((m) => (m.includes(l.id) ? m.filter((x) => x !== l.id) : [...m, l.id]))}
                  >
                    <span className="linea-caja" aria-hidden="true" />
                    <span className="linea-nombre">{l.nombre}</span>
                    <span className="linea-votos">{l.votos}</span>
                  </button>
                  {l.votos === 0 && (
                    <button type="button" className="linea-resta" onClick={() => quitar(l.id)} aria-label={`Quitar ${l.nombre} de la lista`}>
                      Quitar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <button type="button" className="boton boton-ancho" onClick={anotarPapeletaSenado}>
            {textoSenado}
          </button>
        </>
      )}

      <form className="anadir" onSubmit={(e) => { e.preventDefault(); anadir(); }}>
        <label>
          <span>{esSenado ? 'Nombre del candidato o candidata' : 'Nombre o siglas de la candidatura'}</span>
          <input value={nuevo} onChange={(e) => setNuevo(e.target.value)} autoComplete="off" />
        </label>
        <button type="submit" className="boton boton-suave" disabled={!nuevo.trim()}>
          Añadir
        </button>
      </form>

      <div className="especiales">
        <button type="button" className="especial" onClick={() => cambiarUrna((u) => ({ ...u, blancos: u.blancos + 1 }))}>
          <span>Voto en blanco</span>
          <strong>{urna.blancos}</strong>
        </button>
        <button type="button" className="especial especial-nulo" onClick={() => cambiarUrna((u) => ({ ...u, nulos: u.nulos + 1 }))}>
          <span>Voto nulo</span>
          <strong>{urna.nulos}</strong>
        </button>
      </div>
      <div className="fila-botones">
        <button type="button" className="boton boton-suave" onClick={deshacer} disabled={!hayDeshacer}>
          Deshacer lo último
        </button>
        <a className="boton boton-suave" href="#/dudas/papeleta">
          ¿Válido, nulo o en blanco?
        </a>
      </div>

      <h2>Comprobar que cuadra</h2>
      <div className="campos">
        <Numero etiqueta="Personas en las listas del censo" valor={datos.censo} cambiar={(v) => setDatos((d) => ({ ...d, censo: v }))} />
        <Numero
          etiqueta="Certificaciones censales de alta y sentencias"
          valor={datos.certificaciones}
          cambiar={(v) => setDatos((d) => ({ ...d, certificaciones: v }))}
        />
        <Numero
          etiqueta="Interventores no censados que han votado aquí"
          valor={datos.interventores}
          cambiar={(v) => setDatos((d) => ({ ...d, interventores: v }))}
        />
        <Numero
          etiqueta={`Votantes anotados para el ${esSenado ? 'Senado' : 'Congreso'}`}
          valor={urna.votantes}
          cambiar={(v) => cambiarUrna((u) => ({ ...u, votantes: v }), false)}
          ayuda="Los de la lista numerada, sin contar a quienes tienen «X» en esta elección."
        />
      </div>

      <ul className="cuadre" aria-live="polite">
        <li className="cuadre-dato">
          Sobres contados: <strong>{sobres}</strong>
          {esSenado ? ` (${urna.validas} con candidatos, ` : ` (${aCandidaturas} a candidaturas, `}
          {urna.blancos} en blanco, {plural(urna.nulos, 'nulo', 'nulos')})
        </li>
        {votantes === null ? (
          <li>Escribe cuántos votantes hay anotados para comparar con los sobres.</li>
        ) : sobres === votantes ? (
          <li className="cuadre-bien">Los sobres coinciden con los votantes anotados.</li>
        ) : (
          <li className="cuadre-mal">
            {sobres < votantes
              ? `${votantes - sobres === 1 ? 'Falta' : 'Faltan'} ${plural(votantes - sobres, 'sobre', 'sobres')} por contar`
              : `Hay ${plural(sobres - votantes, 'sobre', 'sobres')} más que votantes anotados`}. Si ya
            habéis vaciado la urna, repasad los sobres abiertos y la lista numerada.
          </li>
        )}
        {votantes !== null && maximo !== null && (
          votantes <= maximo ? (
            <li className="cuadre-bien">Los votantes ({votantes}) no superan el máximo posible ({maximo}).</li>
          ) : (
            <li className="cuadre-mal">
              Hay más votantes ({votantes}) que el máximo posible ({maximo}): censo, más certificaciones y sentencias, más interventores no censados.
            </li>
          )
        )}
      </ul>

      <h2>Anuncio del resultado</h2>
      <p className="entradilla">La Presidencia lo lee en voz alta al terminar el recuento de cada urna.</p>
      <div className="dices anuncio">
        <span className="dices-quien">Se dice en voz alta</span>
        <ul>
          <li>Personas en las listas del censo: {censo ?? '—'}</li>
          <li>Certificaciones censales de alta y sentencias: {certificaciones}</li>
          <li>Personas que han votado: {votantes ?? sobres}</li>
          <li>Votos nulos: {urna.nulos}</li>
          <li>Votos en blanco: {urna.blancos}</li>
          {urna.lineas.map((l) => (
            <li key={l.id}>
              {l.nombre}: {l.votos}
            </li>
          ))}
        </ul>
      </div>

      <div className="fila-botones">
        {confirmar ? (
          <>
            <button
              type="button"
              className="boton boton-peligro"
              onClick={() => { setDatos((d) => ({ ...d, [eleccion]: URNA_VACIA, historial: (d.historial ?? []).filter((h) => h.eleccion !== eleccion) })); setMarcados([]); setConfirmar(false); }}
            >
              Sí, borrar el recuento del {esSenado ? 'Senado' : 'Congreso'}
            </button>
            <button type="button" className="boton boton-suave" onClick={() => setConfirmar(false)}>
              No borrar
            </button>
          </>
        ) : (
          <button type="button" className="boton boton-suave" onClick={() => setConfirmar(true)}>
            Borrar el recuento del {esSenado ? 'Senado' : 'Congreso'}
          </button>
        )}
      </div>
    </section>
  );
}
