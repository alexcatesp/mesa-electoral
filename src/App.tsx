import { ROLES, type Rol } from './data/tipos';
import { esEnsayo, useGuardado, useRuta } from './util';
import { AsistenteVista, Dudas } from './vistas/Dudas';
import { Jornada } from './vistas/Jornada';
import { Accesibilidad, Informacion, Mas, Perfil, Sobres } from './vistas/Mas';
import { Portada } from './vistas/Portada';
import { Recuento } from './vistas/Recuento';

const MENU = [
  { href: '#/', nombre: 'Ahora', rutas: ['', 'fase'] },
  { href: '#/dudas', nombre: 'Dudas', rutas: ['dudas'] },
  { href: '#/recuento', nombre: 'Recuento', rutas: ['recuento'] },
  { href: '#/mas', nombre: 'Más', rutas: ['mas', 'sobres', 'accesibilidad', 'info', 'perfil', 'portada'] },
];

export function App() {
  const ruta = useRuta();
  const [rol, setRol] = useGuardado<Rol | null>('rol', null);
  const [portadaVista, setPortadaVista] = useGuardado('portadaVista', false);
  const seccion = ruta[0] ?? '';

  // La portada, con el aviso de que la guía no es oficial y está hecha con IA, va antes de todo lo demás.
  if (!portadaVista || seccion === 'portada') {
    return (
      <div className="marco marco-solo marco-portada">
        <main>
          <Portada
            yaTienePerfil={Boolean(rol)}
            empezar={() => {
              setPortadaVista(true);
              window.location.hash = rol ? '#/' : '#/perfil';
              window.scrollTo(0, 0);
            }}
          />
        </main>
      </div>
    );
  }

  if (!rol || seccion === 'perfil') {
    return (
      <div className="marco marco-solo">
        <main>
          <Perfil rol={rol} elegir={(r) => { setRol(r); window.location.hash = '#/'; }} />
        </main>
      </div>
    );
  }

  let vista;
  if (seccion === 'dudas' && ruta[1] === 'incidencia') vista = <Dudas incidenciaAbierta={ruta[2]} />;
  else if (seccion === 'dudas' && ruta[1]) vista = <AsistenteVista key={ruta[1]} id={ruta[1]} />;
  else if (seccion === 'dudas') vista = <Dudas />;
  else if (seccion === 'recuento') vista = <Recuento />;
  else if (seccion === 'sobres') vista = <Sobres />;
  else if (seccion === 'accesibilidad') vista = <Accesibilidad />;
  else if (seccion === 'info') vista = <Informacion />;
  else if (seccion === 'mas') vista = <Mas rol={rol} />;
  else vista = <Jornada rol={rol} faseVista={seccion === 'fase' ? ruta[1] : undefined} />;

  return (
    <div className="marco">
      <header className="barra">
        <a className="marca" href="#/">Mesa electoral 29N</a>
        <a className="barra-rol" href="#/perfil" title="Cambiar de perfil">
          {ROLES.find((r) => r.id === rol)!.corto}
        </a>
      </header>
      {esEnsayo && <p className="ensayo">Modo ensayo: la hora mostrada no es la real.</p>}
      <main>{vista}</main>
      <nav className="menu" aria-label="Secciones">
        {MENU.map((m) => (
          <a key={m.href} href={m.href} aria-current={m.rutas.includes(seccion) ? 'page' : undefined}>
            {m.nombre}
          </a>
        ))}
      </nav>
    </div>
  );
}
