/** Aviso que debe verse antes de usar la guía y en «Más»: no es oficial y está hecha con IA. */
export function AvisoOrigen() {
  return (
    <div className="origen">
      <p>
        <strong>No es una aplicación oficial.</strong> Resume el «Manual de instrucciones para las personas que integran las Mesas electorales» de
        las elecciones a Cortes Generales del 29 de noviembre de 2026, y en cada paso indica la página del manual de la que sale.
      </p>
      <p>
        <strong>Está hecha con inteligencia artificial.</strong> Se ha realizado con Claude Fable 5.2, el modelo de IA generativa más avanzado
        que Anthropic ofrece al público hasta la fecha. Aun así, puede contener errores.
      </p>
      <p>
        <strong>Ante cualquier duda, manda el manual.</strong> Consulta el manual en papel que recibiste con tu nombramiento, a la persona
        representante de la Administración que estará en el local o a la Junta Electoral de Zona.
      </p>
    </div>
  );
}

export function Portada({ empezar, yaTienePerfil }: { empezar: () => void; yaTienePerfil: boolean }) {
  return (
    <section className="portada">
      <header className="ahora portada-cabecera">
        <h1 className="ahora-cifra">Mesa electoral 29N</h1>
        <p className="ahora-frase">Qué hacer en cada momento de la jornada electoral, según tu papel en la Mesa.</p>
      </header>

      <ul className="puntos portada-puntos">
        <li>
          Te dice qué toca ahora: constitución de la Mesa a las 8:00, votación a las 9:00, cierre a las 20:00, escrutinio y entrega de los sobres.
        </li>
        <li>Resuelve dudas con un par de preguntas: si una persona puede votar, si un voto es válido, nulo o en blanco, qué hacer con un voto por correo.</li>
        <li>Lleva la cuenta del escrutinio y comprueba que los sobres cuadran con los votantes anotados.</li>
        <li>Sirve para presidencia, vocales, suplentes, interventores y apoderados.</li>
        <li>Funciona sin cobertura y no recoge ningún dato tuyo.</li>
      </ul>

      <h2>Antes de usarla</h2>
      <AvisoOrigen />

      <button type="button" className="boton boton-ancho" onClick={empezar}>
        {yaTienePerfil ? 'Volver a la guía' : 'Elegir mi papel en la Mesa'}
      </button>
      <p className="nota-legal portada-enlace">
        Información oficial: <a href="https://infoelectoral.interior.gob.es" target="_blank" rel="noreferrer">infoelectoral.interior.gob.es</a>
      </p>
    </section>
  );
}
