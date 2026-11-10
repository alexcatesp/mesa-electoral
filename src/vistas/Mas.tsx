import { useState } from 'react';
import { Casilla, Cuerpo, Pag, Volver } from '../componentes';
import { SOBRES } from '../data/fases';
import { ACCESIBILIDAD, ACCESIBILIDAD_GENERAL, INFORMACION, type Ficha } from '../data/info';
import { ROLES, type Rol } from '../data/tipos';
import { borrarTodo, useGuardado } from '../util';
import { AvisoOrigen } from './Portada';

export function Perfil({ rol, elegir }: { rol: Rol | null; elegir: (r: Rol) => void }) {
  return (
    <section className="pagina perfil">
      <h1>{rol ? 'Cambiar de perfil' : '¿Cuál es tu papel en la Mesa?'}</h1>
      <p className="entradilla">
        {rol
          ? 'Si eres suplente y has entrado a sustituir a alguien, elige el puesto que ocupas ahora.'
          : 'La guía te dirá qué te toca hacer a ti en cada momento del 29 de noviembre. Puedes cambiarlo después.'}
      </p>
      <div className="roles">
        {ROLES.map((r) => (
          <button key={r.id} type="button" className="rol" aria-pressed={rol === r.id} onClick={() => elegir(r.id)}>
            <strong>{r.nombre}</strong>
            <span>{r.resumen}</span>
          </button>
        ))}
      </div>
      <p className="nota-legal">
        Guía no oficial, hecha con inteligencia artificial a partir del manual de instrucciones del Ministerio del Interior. Puede contener errores:
        ante cualquier duda, consulta el manual. <a href="#/portada">Leer el aviso completo</a>
      </p>
    </section>
  );
}

export function Sobres() {
  const [metidos, setMetidos] = useGuardado<Record<string, boolean>>('sobres', {});
  return (
    <section className="pagina">
      <Volver href="#/mas">Más</Volver>
      <h1>Qué va en cada sobre</h1>
      <p className="entradilla">
        Numerad los tres sobres antes de llenarlos. Al cerrarlos, firman la Presidencia, los vocales y los interventores, con las firmas cruzando la
        solapa.
      </p>
      {SOBRES.map((s) => (
        <article className="sobre-grande" key={s.n}>
          <header>
            <span className="sobre-numero">{s.n}</span>
            <div>
              <h2>Sobre número {s.n}</h2>
              <p>
                Se entrega a: {s.destino}. Lo lleva: {s.lleva}.
              </p>
            </div>
          </header>
          <ul className="contenido-sobre">
            {s.contenido.map((c) => {
              const clave = `${s.n}:${c}`;
              return (
                <li key={c}>
                  <Casilla marcada={Boolean(metidos[clave])} alCambiar={(v) => setMetidos((m) => ({ ...m, [clave]: v }))} etiqueta={`Dentro del sobre ${s.n}: ${c}`} />
                  <span className={metidos[clave] ? 'tachado' : ''}>{c}</span>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
      <p>
        Quien recibe los sobres firma un recibo, que está entre la documentación de la Mesa. Las actas de escrutinio no van en los sobres: el original
        se coloca en la entrada del local y la primera copia es para la persona representante de la Administración.
      </p>
      <Pag pag="13 a 16 y 36" />
    </section>
  );
}

function Fichas({ fichas }: { fichas: Ficha[] }) {
  return (
    <>
      {fichas.map((f) => (
        <details className="plegable" key={f.id}>
          <summary>{f.titulo}</summary>
          <div className="plegable-cuerpo">
            <Cuerpo puntos={f.puntos} texto={f.texto} />
            <Pag pag={f.pag} />
          </div>
        </details>
      ))}
    </>
  );
}

export function Accesibilidad() {
  return (
    <section className="pagina">
      <Volver href="#/mas">Más</Volver>
      <h1>Cuando vota una persona con discapacidad</h1>
      <ul className="puntos puntos-destacados">
        {ACCESIBILIDAD_GENERAL.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <h2>Según el caso</h2>
      <Fichas fichas={ACCESIBILIDAD} />
      <p className="entradilla">
        El Ministerio del Interior publica más información en{' '}
        <a href="https://infoelectoral.interior.gob.es/opencms/es/proceso-electoral/accesibilidad-y-procesos-electorales/" target="_blank" rel="noreferrer">
          Accesibilidad y procesos electorales
        </a>
        , y existe una versión del manual en lectura fácil elaborada por Plena Inclusión.
      </p>
    </section>
  );
}

export function Informacion() {
  return (
    <section className="pagina">
      <Volver href="#/mas">Más</Volver>
      <h1>Información general</h1>
      <Fichas fichas={INFORMACION} />
    </section>
  );
}

export function Mas({ rol }: { rol: Rol }) {
  const [confirmar, setConfirmar] = useState(false);
  const actual = ROLES.find((r) => r.id === rol)!;
  return (
    <section className="pagina">
      <h1>Más</h1>
      <ul className="lista-enlaces">
        <li><a href="#/sobres"><strong>Qué va en cada sobre</strong><span>Los tres sobres del final y a quién se entregan.</span></a></li>
        <li><a href="#/accesibilidad"><strong>Personas con discapacidad</strong><span>Cómo atender bien a cada votante y voto en braille.</span></a></li>
        <li><a href="#/info"><strong>Información general</strong><span>Derechos, orden público, interventores y apoderados.</span></a></li>
        <li><a href="#/perfil"><strong>Cambiar de perfil</strong><span>Ahora: {actual.nombre.toLowerCase()}.</span></a></li>
        <li><a href="#/portada"><strong>Ver la portada</strong><span>Qué es esta guía y el aviso sobre su origen.</span></a></li>
      </ul>

      <h2>Sobre esta guía</h2>
      <AvisoOrigen />
      <p>
        Cuando el manual no resuelve un caso, la guía lo dice y remite a la persona representante de la Administración o a la Junta Electoral de
        Zona, en lugar de dar una respuesta propia.
      </p>
      <p>
        Funciona sin cobertura una vez abierta. Tus marcas y el recuento se guardan solo en este dispositivo; no se envía nada a ningún servidor.
      </p>
      <p>
        Información oficial: <a href="https://infoelectoral.interior.gob.es" target="_blank" rel="noreferrer">infoelectoral.interior.gob.es</a>.
        Código abierto: <a href="https://github.com/alexcatesp/mesa-electoral" target="_blank" rel="noreferrer">github.com/alexcatesp/mesa-electoral</a>.
        Si ves un error, abre una incidencia en el repositorio.
      </p>

      <div className="fila-botones">
        {confirmar ? (
          <>
            <button type="button" className="boton boton-peligro" onClick={() => { borrarTodo(); window.location.hash = '#/'; window.location.reload(); }}>
              Sí, borrar todo
            </button>
            <button type="button" className="boton boton-suave" onClick={() => setConfirmar(false)}>No borrar</button>
          </>
        ) : (
          <button type="button" className="boton boton-suave" onClick={() => setConfirmar(true)}>
            Borrar mis marcas, el recuento y el perfil
          </button>
        )}
      </div>
    </section>
  );
}
