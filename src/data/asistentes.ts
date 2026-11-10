import type { Asistente } from './tipos';

const NULO_GUARDAR = 'No la destruyáis: la firma cada integrante de la Mesa, se une al acta de sesión de esa elección y va en el sobre n.º 1.';

export const ASISTENTES: Asistente[] = [
  {
    id: 'votante',
    titulo: '¿Puede votar esta persona?',
    resumen: 'Documento, censo, voto por correo y casos especiales.',
    inicio: 'doc',
    nodos: {
      doc: {
        tipo: 'pregunta',
        pregunta: '¿Con qué se identifica?',
        opciones: [
          { texto: 'DNI, pasaporte o permiso de conducir, original', ir: 'censo' },
          { texto: 'La aplicación MiDNI en su móvil', ir: 'midni' },
          { texto: 'Una fotocopia', ir: 'fotocopia' },
          { texto: 'Otro documento, o ninguno', ir: 'otro' },
        ],
      },
      midni: {
        tipo: 'pregunta',
        pregunta: '¿Ha abierto la aplicación delante de la Mesa y habéis leído su código QR con el dispositivo de la Mesa?',
        ayuda: 'Únicamente vale si abre la aplicación delante de la Mesa y obtiene en ese momento el código QR temporal.',
        opciones: [
          { texto: 'Sí, el verificador lo da por bueno', ir: 'censo' },
          { texto: 'No', ir: 'midni-no' },
        ],
      },
      'midni-no': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Así no queda identificada',
        texto: [
          'Con MiDNI solo vale abrir la aplicación delante de la Mesa y obtener en ese momento el código QR temporal, que comprobáis con el dispositivo de la Mesa. También puede identificarse con cualquiera de los otros documentos admitidos: pasaporte o permiso de conducir, originales y con fotografía.',
        ],
        pag: '7 y 8',
      },
      fotocopia: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Una fotocopia no vale',
        texto: ['Los documentos tienen que ser originales. Sí valen aunque estén caducados.'],
        pag: '8',
      },
      otro: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No queda identificada',
        texto: ['El manual solo admite DNI (también con MiDNI), pasaporte con fotografía o permiso de conducir con fotografía. Originales, aunque estén caducados.'],
        pag: '8',
      },
      censo: {
        tipo: 'pregunta',
        pregunta: '¿Aparece en la lista del censo de la Mesa?',
        ayuda: 'Mirad también los apéndices con altas y bajas de última hora, si los hay.',
        opciones: [
          { texto: 'Sí', ir: 'correo' },
          { texto: 'Aparece con algún dato equivocado', ir: 'errores' },
          { texto: 'No aparece', ir: 'nocenso' },
        ],
      },
      errores: {
        tipo: 'pregunta',
        pregunta: '¿Trae una certificación censal de corrección de errores?',
        ayuda: 'Corrige datos como un apellido o la dirección. No añade a nadie al censo.',
        opciones: [
          { texto: 'Sí', ir: 'errores-si' },
          { texto: 'No', ir: 'errores-no' },
        ],
      },
      'errores-no': {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Consultadlo antes de decidir',
        texto: [
          'El manual solo prevé este caso cuando la persona trae una certificación censal de corrección de errores. Si no la trae y dudáis de que sea la misma persona de la lista, preguntad a la persona representante de la Administración o a la Junta Electoral de Zona.',
        ],
        pag: '25',
      },
      'errores-si': {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Puede votar',
        texto: [
          'La certificación os permite identificarla en la lista del censo. Como a cualquier votante, se le aplica que no puede votar si pidió el voto por correo («C» delante del nombre).',
          'Anotad el caso solo en el acta de sesión. No va en el acta de escrutinio, porque no es una persona nueva en el censo.',
        ],
        pag: '25',
      },
      correo: {
        tipo: 'pregunta',
        pregunta: '¿Tiene una «C» delante del nombre, o figura en la relación de electores que han pedido el voto por correo?',
        opciones: [
          { texto: 'No', ir: 'otramesa' },
          { texto: 'Sí', ir: 'correo-si' },
        ],
      },
      'correo-si': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No puede votar en la Mesa',
        texto: ['Quien ha solicitado el voto por correo no puede votar presencialmente.'],
        pag: '5, 9 y 25',
      },
      otramesa: {
        tipo: 'pregunta',
        pregunta: '¿Es interventor o interventora con acreditación ante otra Mesa?',
        ayuda: 'Si lo es, entre vuestra documentación habrá una copia de su nombramiento para la otra Mesa.',
        opciones: [
          { texto: 'No', ir: 'si' },
          { texto: 'Sí', ir: 'otramesa-si' },
        ],
      },
      'otramesa-si': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No puede votar aquí',
        texto: ['Aunque figure en vuestro censo, quien ejerce de interventor ante otra Mesa no vota presencialmente en la vuestra. Votar dos veces en la misma elección es delito electoral.'],
        pag: '6 y 25',
      },
      si: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Puede votar',
        puntos: [
          'Entrega su sobre cerrado a la Presidencia.',
          'La Presidencia dice su nombre en voz alta, añade «vota» y le devuelve el sobre para que lo meta en la urna.',
          'Se la anota en la lista numerada de votantes, con su número en la lista del censo.',
          'Si solo vota en una elección, marcad «X» en la columna de la otra.',
        ],
        pag: '9',
      },
      nocenso: {
        tipo: 'pregunta',
        pregunta: '¿Qué trae?',
        opciones: [
          { texto: 'Una certificación censal de alta', ir: 'alta' },
          { texto: 'Una sentencia judicial que le reconoce el derecho a votar aquí', ir: 'alta' },
          { texto: 'La tarjeta censal que llega a casa', ir: 'tarjeta' },
          { texto: 'Es interventor o interventora de esta Mesa', ir: 'interventor' },
          { texto: 'Nada de lo anterior', ir: 'reclama' },
        ],
      },
      alta: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Puede votar',
        texto: ['Es un caso excepcional: la Oficina del Censo Electoral o un juez le han reconocido el derecho a estar en el censo de la Mesa. La certificación vale en original o recibida por fax a través del Ayuntamiento.'],
        puntos: [
          'En la lista numerada de votantes, indicad que aporta ese documento.',
          'Guardad el documento: va en el sobre n.º 1, junto a las listas del censo.',
          'Contad el caso en el acta de escrutinio y en el acta de sesión.',
        ],
        pag: '24 y 25',
      },
      tarjeta: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'La tarjeta censal no sirve para esto',
        texto: [
          'La tarjeta que todos los electores reciben en casa solo informa de la Mesa que les toca. No es una certificación censal de alta. En la propia tarjeta se indica la Mesa en la que está inscrita.',
        ],
        pag: '8 y 25',
      },
      interventor: {
        tipo: 'resultado',
        veredicto: 'info',
        titulo: 'Vota al final, con la Mesa',
        texto: ['Los interventores acreditados ante la Mesa votan después del voto por correo, y solo si están censados en la misma circunscripción.'],
        pag: '10 y 11',
        seguir: { texto: 'Comprobar si puede votar aquí', asistente: 'interventores' },
      },
      reclama: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No puede votar en la Mesa',
        texto: [
          'Nadie vota sin estar en las listas del censo, salvo con certificación censal de alta, sentencia judicial o siendo interventor de la Mesa.',
          'Sus consultas puede presentarlas ante la Junta Electoral de Zona. Si insiste ante la Mesa, la Presidencia le invita a deponer su actitud y, si no lo hace, puede pedir a los agentes de la autoridad que abandone el local.',
        ],
        pag: '8, 25 y 26',
      },
    },
  },
  {
    id: 'papeleta',
    titulo: '¿Válido, nulo o en blanco?',
    resumen: 'Qué hacer con cada sobre al abrirlo en el escrutinio.',
    inicio: 'eleccion',
    nodos: {
      eleccion: {
        tipo: 'pregunta',
        pregunta: '¿De qué urna es el sobre?',
        opciones: [
          { texto: 'Congreso (blanco)', ir: 'c' },
          { texto: 'Senado (sepia)', ir: 's' },
        ],
      },
      c: {
        tipo: 'pregunta',
        pregunta: '¿Qué os habéis encontrado?',
        opciones: [
          { texto: 'Un sobre con una papeleta sin marcas', ir: 'valido' },
          { texto: 'Un sobre vacío', ir: 'blanco-vacio' },
          { texto: 'Un sobre con varias papeletas', ir: 'c-varias' },
          { texto: 'Una papeleta suelta, sin sobre', ir: 'nulo-sinsobre' },
          { texto: 'Sobre o papeleta que no son del modelo oficial', ir: 'nulo-modelo' },
          { texto: 'Un sobre alterado', ir: 'nulo-alterado' },
          { texto: 'Una papeleta con algo escrito, tachado o cambiado', ir: 'c-marcas' },
          { texto: 'Una papeleta de una candidatura retirada', ir: 'blanco-retirada' },
          { texto: 'Otra cosa', ir: 'otro-caso' },
        ],
      },
      'c-varias': {
        tipo: 'pregunta',
        pregunta: '¿Son todas de la misma candidatura?',
        opciones: [
          { texto: 'Sí, todas iguales', ir: 'valido-varias' },
          { texto: 'No, hay de candidaturas distintas', ir: 'nulo-varias' },
        ],
      },
      'c-marcas': {
        tipo: 'pregunta',
        pregunta: '¿Qué tiene la papeleta?',
        opciones: [
          { texto: 'Nombres modificados, añadidos o tachados, o el orden cambiado', ir: 'nulo-modificada' },
          { texto: 'Una leyenda o expresión, u otra alteración voluntaria o intencionada', ir: 'nulo-modificada' },
          { texto: 'Solo una señal, cruz o aspa junto a algún candidato', ir: 'senal' },
        ],
      },
      s: {
        tipo: 'pregunta',
        pregunta: '¿Qué os habéis encontrado?',
        opciones: [
          { texto: 'Un sobre con una papeleta con candidatos marcados', ir: 's-cuantos' },
          { texto: 'Un sobre con una papeleta sin ningún candidato marcado', ir: 'blanco-sinmarcar' },
          { texto: 'Un sobre vacío', ir: 'blanco-vacio' },
          { texto: 'Una papeleta suelta, sin sobre', ir: 'nulo-sinsobre' },
          { texto: 'Sobre o papeleta que no son del modelo oficial', ir: 'nulo-modelo' },
          { texto: 'Un sobre alterado', ir: 'nulo-alterado' },
          { texto: 'Una papeleta con nombres modificados, añadidos o tachados, o con leyendas', ir: 'nulo-modificada' },
          { texto: 'Un voto a una candidatura legalmente retirada', ir: 'blanco-retirada' },
          { texto: 'Otra cosa', ir: 'otro-caso' },
        ],
      },
      's-cuantos': {
        tipo: 'pregunta',
        pregunta: '¿Cuántos candidatos ha marcado?',
        ayuda:
          'El máximo general es 3. Es 2 en Gran Canaria, Tenerife, Mallorca, Ceuta y Melilla. Es 1 en Menorca, Ibiza, Formentera, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma.',
        opciones: [
          { texto: 'El máximo permitido aquí, o menos', ir: 'valido-senado' },
          { texto: 'Más del máximo', ir: 'nulo-senado' },
        ],
      },
      'otro-caso': {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Este asistente no cubre ese caso',
        texto: [
          'Repasad la lista de votos en blanco y nulos de la página 12 del manual. Si el caso no está, esta guía no puede deciros qué hacer: consultad a la persona representante de la Administración o a la Junta Electoral de Zona.',
          'Si alguien protesta o reclama, la Mesa resuelve por mayoría de sus integrantes y la papeleta no se destruye: se firma, se une al acta de sesión y va en el sobre n.º 1.',
        ],
        pag: '12 y 13',
      },
      valido: { tipo: 'resultado', veredicto: 'si', titulo: 'Voto válido', texto: ['Es un voto a la candidatura de la papeleta.'], pag: '11 y 12' },
      'valido-varias': {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Un solo voto válido',
        texto: ['Varias papeletas de la misma candidatura en un sobre cuentan como un único voto para esa candidatura.'],
        pag: '12',
      },
      'valido-senado': {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Voto válido',
        texto: ['Es un voto para cada candidato o candidata marcado. Para el recuento del Senado tenéis una plantilla auxiliar entre la documentación.'],
        pag: '6 y 12',
      },
      senal: {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Válido, salvo que la marca altere la papeleta',
        texto: [
          'Una señal, cruz o aspa al lado de algún candidato no anula el voto, mientras no tenga entidad suficiente para considerar que se ha alterado la configuración de la papeleta o que expresa reproche a algún candidato o a su formación política.',
          'Si hay protesta o reclamación, la Mesa resuelve por mayoría de sus integrantes y la papeleta no se destruye.',
        ],
        pag: '12 y 13',
      },
      'blanco-vacio': { tipo: 'resultado', veredicto: 'info', titulo: 'Voto en blanco', texto: ['Un sobre sin papeleta es un voto en blanco. Los votos en blanco se contabilizan por separado.'], pag: '12' },
      'blanco-retirada': {
        tipo: 'resultado',
        veredicto: 'info',
        titulo: 'Voto en blanco',
        texto: ['El voto a favor de una candidatura legalmente retirada se cuenta como voto en blanco.'],
        pag: '12',
      },
      'blanco-sinmarcar': {
        tipo: 'resultado',
        veredicto: 'info',
        titulo: 'Voto en blanco',
        texto: ['En el Senado, una papeleta sin ningún candidato marcado es un voto en blanco.'],
        pag: '12',
      },
      'nulo-sinsobre': { tipo: 'resultado', veredicto: 'no', titulo: 'Voto nulo', texto: ['Una papeleta sin sobre es un voto nulo.', NULO_GUARDAR], pag: '12 y 13' },
      'nulo-modelo': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Voto nulo',
        texto: ['Los votos en sobres o papeletas distintos del modelo oficial son nulos.', NULO_GUARDAR],
        pag: '12 y 13',
      },
      'nulo-alterado': { tipo: 'resultado', veredicto: 'no', titulo: 'Voto nulo', texto: ['Los votos emitidos en sobres alterados son nulos.', NULO_GUARDAR], pag: '12 y 13' },
      'nulo-varias': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Voto nulo',
        texto: ['En el Congreso, un sobre con papeletas de candidaturas distintas es un voto nulo.', NULO_GUARDAR],
        pag: '12 y 13',
      },
      'nulo-modificada': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Voto nulo',
        texto: [
          'Son nulas las papeletas con nombres modificados, añadidos o tachados, con el orden alterado, con leyendas o expresiones, o con cualquier otra alteración voluntaria o intencionada.',
          NULO_GUARDAR,
        ],
        pag: '12 y 13',
      },
      'nulo-senado': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Voto nulo',
        texto: ['En el Senado es nula la papeleta con más candidatos marcados de los permitidos en la circunscripción.', NULO_GUARDAR],
        pag: '12 y 13',
      },
    },
  },
  {
    id: 'correo',
    titulo: 'Un sobre de voto por correo',
    resumen: 'Qué comprobar antes de meterlo en la urna.',
    inicio: 'certificado',
    nodos: {
      certificado: {
        tipo: 'pregunta',
        pregunta: 'Al abrir el sobre dirigido a la Presidencia, ¿contiene el certificado de inscripción en el censo?',
        ayuda: 'Abrid solo el sobre exterior. El sobre de votación, el que lleva la papeleta, no se abre.',
        opciones: [
          { texto: 'Sí', ir: 'inscrito' },
          { texto: 'No', ir: 'destruir' },
        ],
      },
      destruir: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'Destruid el sobre y todo lo que contiene',
        texto: ['Sin certificado de inscripción en el censo no cuenta ni como voto válido ni como voto nulo.'],
        pag: '10',
      },
      inscrito: {
        tipo: 'pregunta',
        pregunta: '¿La persona está inscrita en el censo de la Mesa?',
        opciones: [
          { texto: 'Sí', ir: 'urna' },
          { texto: 'No', ir: 'noinscrito' },
        ],
      },
      noinscrito: {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Consultadlo antes de hacer nada',
        texto: [
          'El manual pide comprobar la inscripción, pero no dice qué hacer si la persona no está en vuestro censo. Esta guía no puede resolverlo: antes de hacer nada con el sobre, consultad a la persona representante de la Administración o a la Junta Electoral de Zona.',
        ],
        pag: '10',
      },
      urna: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'A la urna, sin abrir',
        puntos: [
          'La Presidencia introduce cada sobre de votación en la urna que le corresponde (los sobres del Congreso son blancos y los del Senado, sepia).',
          'Anotad a la persona en la lista numerada de votantes.',
          'Si el sobre se ha recibido desde el extranjero y contiene una «solicitud de reintegro de gastos», guardadla: va en el sobre n.º 1.',
        ],
        pag: '10',
      },
    },
  },
  {
    id: 'interventores',
    titulo: 'Interventores: posesión y voto',
    resumen: 'Si se le da posesión del cargo y si puede votar en esta Mesa.',
    inicio: 'que',
    nodos: {
      que: {
        tipo: 'pregunta',
        pregunta: '¿Qué necesitáis resolver?',
        opciones: [
          { texto: 'Se presenta con su nombramiento', ir: 'hora' },
          { texto: 'Quiere votar en esta Mesa', ir: 'acreditado' },
        ],
      },
      hora: {
        tipo: 'pregunta',
        pregunta: '¿Se presenta después de las 8:30, con el acta de constitución ya confeccionada?',
        ayuda: 'Los interventores presentan su nombramiento entre las 8:00 y las 8:30.',
        opciones: [
          { texto: 'No', ir: 'dos' },
          { texto: 'Sí', ir: 'tarde' },
        ],
      },
      tarde: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No se le da posesión del cargo',
        texto: ['Quien llega después de las 8:30, con el acta de constitución ya confeccionada, no toma posesión. Sí podrá votar en la Mesa si tiene derecho a ello.'],
        pag: '23',
        seguir: { texto: 'Comprobar si puede votar aquí', asistente: 'interventores' },
      },
      dos: {
        tipo: 'pregunta',
        pregunta: '¿Ya han tomado posesión dos interventores de su misma candidatura?',
        opciones: [
          { texto: 'No', ir: 'copia' },
          { texto: 'Sí', ir: 'tercero' },
        ],
      },
      tercero: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No se le da posesión',
        texto: ['Solo actúan dos interventores por candidatura ante la Mesa. Si se presentan más, toman posesión quienes primero entregaron sus credenciales. Los dos de una misma candidatura pueden sustituirse entre sí.'],
        pag: '19 y 23',
      },
      copia: {
        tipo: 'pregunta',
        pregunta: '¿El nombramiento coincide con la copia que tiene la Mesa?',
        opciones: [
          { texto: 'Sí, todo en orden', ir: 'posesion' },
          { texto: 'La Mesa no ha recibido la copia', ir: 'dudas' },
          { texto: 'Dudamos de la autenticidad del nombramiento', ir: 'dudas' },
          { texto: 'Dudamos de la identidad de la persona', ir: 'dudas' },
        ],
      },
      posesion: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Se le da posesión del cargo',
        puntos: [
          'Numerad el nombramiento y su copia según el orden de llegada.',
          'Decidle que la Mesa le reconoce.',
          'Incluid su nombre en el acta de constitución, que firmará.',
          'Devolvedle el nombramiento.',
        ],
        texto: ['Basta una sola acreditación para todas las elecciones del día, si su formación participa en ellas.'],
        pag: '4 y 23',
      },
      dudas: {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Si lo exige, se le da posesión y se anota',
        texto: [
          'La Presidencia le da posesión del cargo si así lo exige, y anota el hecho en el acta de constitución para que se aclare después.',
          'Si la Mesa no tiene la copia, quedaos con el nombramiento: se adjunta al expediente en el sobre n.º 1.',
        ],
        pag: '4 y 23',
      },
      acreditado: {
        tipo: 'pregunta',
        pregunta: '¿Ante qué Mesa tiene la acreditación?',
        opciones: [
          { texto: 'Ante esta Mesa', ir: 'encenso' },
          { texto: 'Ante otra Mesa', ir: 'otra' },
        ],
      },
      otra: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No vota aquí',
        texto: ['Los interventores con acreditación ante otra Mesa no votan presencialmente en la vuestra, aunque figuren en vuestro censo. Nadie puede votar más de una vez.'],
        pag: '25',
      },
      encenso: {
        tipo: 'pregunta',
        pregunta: '¿Figura en el censo de esta Mesa?',
        opciones: [
          { texto: 'Sí', ir: 'vota' },
          { texto: 'No', ir: 'circunscripcion' },
        ],
      },
      vota: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Vota aquí, al final',
        texto: ['Vota a continuación del voto por correo, cuando votan las personas que integran la Mesa.'],
        pag: '10',
      },
      circunscripcion: {
        tipo: 'pregunta',
        pregunta: '¿Está inscrito en el censo de alguna Mesa de la misma circunscripción?',
        ayuda:
          'La circunscripción es la provincia. En las islas, para el Senado, cada isla es una circunscripción, así que debe estar censado en la misma isla. Los datos de su inscripción figuran en el nombramiento.',
        opciones: [
          { texto: 'Sí, en la misma provincia (o en la misma isla)', ir: 'vota-fuera' },
          { texto: 'No', ir: 'solo-correo' },
        ],
      },
      'vota-fuera': {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Vota aquí, al final',
        texto: [
          'Vota a continuación del voto por correo, cuando votan las personas que integran la Mesa. En la lista numerada de votantes, indicad la Sección y la Mesa donde le habría correspondido votar: están en su nombramiento.',
          'Este voto se suma al máximo de votantes posibles de la Mesa cuando cuadréis el escrutinio.',
        ],
        pag: '10 a 12',
      },
      'solo-correo': {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'No puede votar en esta Mesa',
        texto: ['Si no le corresponde votar en la misma circunscripción en todas las elecciones convocadas, solo puede votar por correo, en todas ellas (Instrucción 1/2019 de la Junta Electoral Central).'],
        pag: '11 y 24',
      },
    },
  },
  {
    id: 'constitucion',
    titulo: 'Falta gente para constituir la Mesa',
    resumen: 'Quién sustituye a quién y cuándo llamar a la Junta Electoral.',
    inicio: 'quien',
    nodos: {
      quien: {
        tipo: 'pregunta',
        pregunta: '¿Quién falta?',
        opciones: [
          { texto: 'Un titular, pero ha venido alguno de sus suplentes', ir: 'suplente' },
          { texto: 'La Presidencia y también sus dos suplentes', ir: 'presidencia' },
          { texto: 'No llegamos a tres personas ni con suplentes', ir: 'notres' },
        ],
      },
      suplente: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Entra su suplente',
        texto: ['Como garantía de la constitución de la Mesa, cada titular tiene designados dos suplentes. El suplente presente ocupa el puesto.'],
        pag: '3',
      },
      presidencia: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'Preside el primer o la primera vocal',
        texto: ['Asume la presidencia la persona designada como primer vocal. La vocalía que deja vacante la ocupa su suplente.'],
        pag: '22',
        seguir: { texto: 'Seguimos sin ser tres', asistente: 'constitucion' },
      },
      notres: {
        tipo: 'pregunta',
        pregunta: '¿Son ya las 10:00?',
        opciones: [
          { texto: 'Todavía no', ir: 'junta' },
          { texto: 'Sí, y la Mesa sigue sin constituirse', ir: 'diez' },
        ],
      },
      junta: {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Avisad a la Junta Electoral de Zona',
        puntos: [
          'Quienes sí habéis acudido comunicáis lo ocurrido a la Junta Electoral de Zona.',
          'Además, enviáis por correo certificado una declaración escrita explicando lo sucedido.',
          'La Junta designa a quienes formarán la Mesa. Puede ordenar que entren electores presentes en el local.',
        ],
        texto: ['El teléfono de la Junta os lo da la persona representante de la Administración.'],
        pag: '22',
      },
      diez: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'La Junta convocará una nueva votación',
        texto: [
          'Comunicadlo a la Junta Electoral de Zona. Convocará una nueva votación dentro de los dos días siguientes, fijará la convocatoria en la puerta del local y hará nuevos nombramientos para la Mesa.',
        ],
        pag: '22',
      },
    },
  },
  {
    id: 'interrupcion',
    titulo: 'Faltan papeletas o hay que parar',
    resumen: 'Cuándo interrumpir la votación y cuándo suspenderla.',
    inicio: 'motivo',
    nodos: {
      motivo: {
        tipo: 'pregunta',
        pregunta: '¿Qué ocurre?',
        opciones: [
          { texto: 'Se han acabado las papeletas de una candidatura', ir: 'reponer' },
          { texto: 'La votación lleva más de una hora interrumpida', ir: 'suspender' },
          { texto: 'Otro motivo hace imposible votar', ir: 'suspender' },
        ],
      },
      reponer: {
        tipo: 'pregunta',
        pregunta: '¿Puede reponerlas quien representa a esa candidatura?',
        opciones: [
          { texto: 'Sí, trae papeletas', ir: 'sigue' },
          { texto: 'No', ir: 'interrumpir' },
        ],
      },
      sigue: {
        tipo: 'resultado',
        veredicto: 'si',
        titulo: 'La votación continúa',
        texto: ['Colocad las papeletas en la cabina, en su sitio según el orden de proclamación.'],
        pag: '5 y 23',
      },
      interrumpir: {
        tipo: 'resultado',
        veredicto: 'ojo',
        titulo: 'Interrumpid la votación',
        puntos: [
          'La Presidencia llama a la Junta Electoral de Zona, que envía papeletas de inmediato.',
          'La interrupción no puede durar más de una hora.',
          'La votación se prorroga el mismo tiempo que haya estado parada.',
        ],
        texto: ['Apuntad la hora de inicio y de fin en la pantalla de la votación: os calculará la nueva hora de cierre.'],
        pag: '23',
      },
      suspender: {
        tipo: 'resultado',
        veredicto: 'no',
        titulo: 'La votación puede suspenderse',
        puntos: [
          'Antes de decidir, la Presidencia recaba el parecer de todos los miembros de la Mesa y, si es posible, consulta a la Junta Electoral de Zona.',
          'La decisión se recoge en un escrito razonado.',
          'La Presidencia ordena destruir todas las papeletas depositadas en las urnas hasta ese momento.',
          'Envía de inmediato una copia del escrito a la Junta Electoral Provincial, en mano o por correo certificado.',
        ],
        texto: ['La Junta Electoral de Zona convocará nuevas elecciones en la Mesa dentro de los dos días siguientes.'],
        pag: '24',
      },
    },
  },
];

export const asistentePorId = (id: string) => ASISTENTES.find((a) => a.id === id);
