export interface Ficha {
  id: string;
  titulo: string;
  texto?: string[];
  puntos?: string[];
  pag: string;
}

export const ACCESIBILIDAD_GENERAL: string[] = [
  'Trata a la persona con respeto y naturalidad.',
  'No des por hecho que necesita ayuda: pregunta siempre antes.',
  'Explica las cosas de forma clara y comprensible.',
  'Respeta su autonomía, su voluntad y el secreto de su voto.',
  'Puede ir acompañada por la persona que ella elija.',
  'Ninguna discapacidad es motivo para impedir el voto.',
];

export const ACCESIBILIDAD: Ficha[] = [
  {
    id: 'visual',
    titulo: 'Es ciega o tiene discapacidad visual',
    puntos: [
      'Háblale directamente a ella.',
      'No la agarres ni la empujes. Si pide acompañamiento, ofrécele tu brazo para guiarla hasta la Mesa.',
      'Si lleva perro guía o de asistencia, el perro se queda con ella en todo momento.',
      'Si pidió votar con braille, comprueba que está en el listado de la Mesa y entrégale su kit.',
      'Facilítale el espacio habilitado para preparar el voto. Después vuelve a la Mesa y vota como cualquier elector.',
    ],
    pag: '16',
  },
  {
    id: 'signos',
    titulo: 'Es sorda y usa lengua de signos',
    puntos: [
      'Llama su atención antes de empezar a hablar.',
      'Ponte frente a ella y mantén el contacto visual.',
      'Si viene con intérprete, dirígete siempre a la persona sorda.',
      'Usa frases breves y claras, y muestra cada paso de forma visual.',
      'Si hace falta, usad notas escritas o un sistema de transcripción.',
      'Comprueba que ha identificado bien la Mesa, el turno y cómo introducir el voto.',
    ],
    pag: '16 y 17',
  },
  {
    id: 'oral',
    titulo: 'Es sorda y se comunica en lengua oral',
    puntos: [
      'Habla de frente y vocaliza con normalidad.',
      'No grites ni hables demasiado despacio.',
      'No te tapes la boca ni gires la cabeza al hablar.',
      'Explica con claridad la identificación, la entrega del sobre y la urna.',
      'Si no te ha entendido, repítelo con palabras más sencillas o por escrito.',
    ],
    pag: '17',
  },
  {
    id: 'sordociega',
    titulo: 'Es sordociega',
    puntos: [
      'Pregunta cómo prefiere comunicarse o recibir apoyo.',
      'Puede venir con una persona guía-intérprete, pero dirígete siempre a ella.',
      'Dale los apoyos que pida para orientarse en el local.',
      'Asegúrate de que localiza la Mesa, el espacio para preparar el voto y la urna.',
      'Dale el tiempo que necesite.',
    ],
    pag: '17',
  },
  {
    id: 'intelectual',
    titulo: 'Tiene discapacidad intelectual o le cuesta comprender',
    puntos: [
      'Dirígete siempre directamente a ella.',
      'Usa frases cortas y sencillas.',
      'Explica los pasos de uno en uno: identificación, preparación del voto, entrega del sobre y urna.',
      'Dale tiempo para procesar y responder, y comprueba que lo ha entendido.',
      'No la infantilices ni hables solo con quien la acompaña.',
      'Respeta sus decisiones y su derecho a votar.',
    ],
    pag: '17',
  },
  {
    id: 'fisica',
    titulo: 'Tiene discapacidad física o movilidad reducida',
    puntos: [
      'Pregunta si necesita apoyo antes de intervenir.',
      'Asegúrate de que llega sin obstáculos a la Mesa y a la urna.',
      'No toques su silla de ruedas, sus muletas ni otros apoyos sin permiso.',
      'Haz los ajustes necesarios para que se identifique, prepare el voto y lo introduzca con comodidad.',
    ],
    pag: '17',
  },
  {
    id: 'braille',
    titulo: 'Voto accesible con braille',
    texto: [
      'Si alguien de vuestro censo lo ha solicitado, la Mesa tiene un listado con su DNI y un kit en braille para cada persona. Entregádselo y facilitad el espacio del local con mesa y silla donde puede manejarlo.',
      'Cuando haya elegido, vuelve a la Mesa y vota igual que el resto. Puede llevarse el kit fuera del local y regresar más tarde, y puede ayudarle una persona de su confianza.',
      'Recomendadle que se lleve la documentación que le sobre: así se protege el secreto de su voto.',
    ],
    pag: '18',
  },
  {
    id: 'ayuda',
    titulo: 'No sabe leer o no puede manejar la papeleta',
    texto: [
      'El voto es personal: nadie puede votar en nombre de otra persona. Pero quien no sabe leer, o por discapacidad no puede elegir la papeleta, meterla en el sobre o entregarla a la Presidencia, puede pedir ayuda a una persona de su confianza.',
    ],
    pag: '9',
  },
  {
    id: 'libre',
    titulo: 'Si alguien duda de que el voto sea libre',
    texto: [
      'Las personas con discapacidad son autónomas e independientes, y así hay que tratarlas. Si un integrante de la Mesa, interventor o apoderado cree que un voto no es consciente, libre y voluntario, puede hacerlo constar en el acta de sesión, pero no impedir que ese voto entre en la urna.',
      'En el acta se identifica al elector solo por el número de su DNI o del documento que aporte (Instrucción 7/2019 de la Junta Electoral Central).',
    ],
    pag: '17 y 18',
  },
];

export const INFORMACION: Ficha[] = [
  {
    id: 'derechos',
    titulo: 'Tus derechos por estar en la Mesa',
    puntos: [
      'Dieta de 75 €.',
      'Permiso retribuido el día de la votación, si es laborable.',
      'Reducción de cinco horas en la jornada del día siguiente, para quien trabaja por cuenta ajena y para el personal funcionario.',
      'Protección de la Seguridad Social frente a contingencias derivadas de la participación.',
    ],
    texto: ['Corresponden a presidencia y vocales cuando ejercen como tales durante la jornada.'],
    pag: '3',
  },
  {
    id: 'documentos',
    titulo: 'Documentos que identifican a un votante',
    puntos: ['DNI, también mediante la aplicación MiDNI.', 'Pasaporte con fotografía.', 'Permiso de conducir con fotografía.'],
    texto: [
      'Valen caducados, pero deben ser originales, nunca fotocopias. Con MiDNI, la persona abre la aplicación delante de la Mesa y genera en ese momento el código QR, que se comprueba con el dispositivo de la Mesa.',
    ],
    pag: '7 y 8',
  },
  {
    id: 'colores',
    titulo: 'Colores de sobres y papeletas',
    puntos: ['Congreso de los Diputados: blanco.', 'Senado: sepia.'],
    pag: '5',
  },
  {
    id: 'entrar',
    titulo: 'Quién puede entrar en el local electoral',
    puntos: [
      'Votantes y quienes les presten asistencia.',
      'Representantes de las candidaturas, candidatos y candidatas.',
      'Interventores y apoderados.',
      'Notarios y notarias.',
      'Agentes de la autoridad requeridos por la Presidencia.',
      'Integrantes de las Juntas Electorales.',
      'Jueces y juezas de Instrucción, y quienes actúen por delegación.',
      'Representantes de la Administración.',
    ],
    texto: ['Cualquier otra persona necesita autorización de la Presidencia para permanecer en el local.'],
    pag: '21',
  },
  {
    id: 'orden',
    titulo: 'Normas de orden público',
    puntos: [
      'La Presidencia tiene la autoridad exclusiva dentro del local y puede pedir el auxilio de las Fuerzas y Cuerpos de Seguridad.',
      'La entrada debe estar siempre libre y accesible.',
      'No se permiten grupos que entorpezcan el acceso ni personas que coaccionen o dificulten el voto.',
      'Nadie entra con armas, salvo las fuerzas de seguridad requeridas por la Presidencia.',
      'No hay propaganda electoral en el local ni en sus inmediaciones.',
      'Los incidentes se anotan en el acta de sesión, con nombre y apellidos de quienes los provocaron.',
    ],
    pag: '20 y 21',
  },
  {
    id: 'interventores',
    titulo: 'Qué pueden hacer los interventores',
    puntos: [
      'Cada candidatura puede nombrar dos por Mesa. Actúan solo en la Mesa donde están acreditados y pueden sustituirse entre sí.',
      'Asisten a la Mesa y participan en sus deliberaciones con voz, pero sin voto.',
      'Pueden comprobar la identidad de los votantes y su inscripción en el censo.',
      'Pueden formular reclamaciones y protestas, y pedir certificaciones y copias de las actas.',
      'Firman el acta de constitución, la lista numerada, las actas de escrutinio y de sesión y los sobres.',
      'Votan en la Mesa donde están acreditados si les corresponde votar en esa circunscripción. Si no, solo por correo.',
    ],
    pag: '8, 19 y 20',
  },
  {
    id: 'apoderados',
    titulo: 'Qué pueden hacer los apoderados',
    puntos: [
      'Representan a la candidatura y pueden entrar libremente en todos los locales electorales.',
      'Examinan la votación y el escrutinio en cualquier Mesa, formulan reclamaciones y protestas y piden certificaciones.',
      'Si no hay interventores de su candidatura, pueden actuar como tales, con voz y sin voto.',
      'Se identifican ante la Mesa con sus credenciales y su documento de identidad.',
      'No votan en la Mesa si no figuran en su censo.',
    ],
    pag: '20',
  },
  {
    id: 'censo',
    titulo: 'Las listas del censo no salen del local',
    texto: [
      'Permanecen en el local electoral y van en el sobre n.º 1 al terminar. Las candidaturas sí pueden llevarse, al acabar la jornada, las listas del censo de las que ya disponían antes (Acuerdo de la Junta Electoral Central de 8 de junio de 2015).',
    ],
    pag: '5',
  },
  {
    id: 'circunscripcion',
    titulo: 'Qué es la circunscripción',
    texto: [
      'En estas elecciones es la provincia. Para el Senado, en los archipiélagos lo es cada isla: Gran Canaria, Tenerife, Fuerteventura, La Gomera, El Hierro, Lanzarote, La Palma, Mallorca, Menorca, Ibiza y Formentera.',
      'En la papeleta del Senado se pueden marcar hasta 3 candidatos; hasta 2 en Gran Canaria, Tenerife, Mallorca, Ceuta y Melilla; y 1 en Menorca, Ibiza, Formentera, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma.',
    ],
    pag: '11 y 12',
  },
];
