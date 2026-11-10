import type { Incidencia } from './tipos';

export const INCIDENCIAS: Incidencia[] = [
  {
    id: 'i-presidencia',
    momento: 'Al formar la Mesa',
    titulo: 'No viene la Presidencia ni sus suplentes',
    texto: ['Preside la persona designada como primer vocal. Su vocalía la ocupa su suplente.'],
    pag: '22',
    asistente: 'constitucion',
  },
  {
    id: 'i-notres',
    momento: 'Al formar la Mesa',
    titulo: 'No hay tres personas para constituir la Mesa',
    texto: [
      'Quienes sí han acudido avisan a la Junta Electoral de Zona y envían por correo certificado una declaración escrita. La Junta designa a los integrantes y puede ordenar que entren electores presentes en el local.',
      'Si a las 10:00 la Mesa sigue sin constituirse, la Junta convoca nueva votación dentro de los dos días siguientes.',
    ],
    pag: '22',
    asistente: 'constitucion',
  },
  {
    id: 'i-material',
    momento: 'Al formar la Mesa',
    titulo: 'Falta material o está en mal estado',
    texto: [
      'A cualquier hora del día, la Presidencia lo comunica de inmediato a la Junta Electoral de Zona para que lo sustituya o suministre. El teléfono lo facilita la persona representante de la Administración.',
      'Si es una urna con el precinto roto y no llega uno nuevo, se asegura el cierre con cualquier medio al alcance.',
    ],
    pag: '4 y 22',
  },
  {
    id: 'i-interventor-dudas',
    momento: 'Al formar la Mesa',
    titulo: 'Dudas con el nombramiento de un interventor',
    texto: [
      'Si la Mesa no ha recibido la copia del nombramiento, o duda de su autenticidad o de la identidad de quien se presenta, la Presidencia le da posesión del cargo si lo exige y lo anota en el acta de constitución para aclararlo después.',
    ],
    pag: '23',
    asistente: 'interventores',
  },
  {
    id: 'i-interventor-tarde',
    momento: 'Al formar la Mesa',
    titulo: 'Un interventor llega después de las 8:30',
    texto: ['Con el acta de constitución ya confeccionada no se le da posesión del cargo. Sí puede votar en la Mesa si tiene derecho a ello.'],
    pag: '23',
    asistente: 'interventores',
  },
  {
    id: 'i-interventor-tres',
    momento: 'Al formar la Mesa',
    titulo: 'Se presentan más de dos interventores de una candidatura',
    texto: [
      'Solo actúan dos por candidatura. Toman posesión quienes primero presentaron sus credenciales.',
      'Una sola acreditación sirve para todas las elecciones del día en las que participe su formación.',
    ],
    pag: '23',
  },
  {
    id: 'i-copia-acta',
    momento: 'Al formar la Mesa',
    titulo: 'La Presidencia no entrega la copia del acta de constitución',
    texto: [
      'Si la rehúsa o la demora ante quien tiene derecho a reclamarla, se extiende por duplicado la protesta, firmada por quien reclama. Un ejemplar se une al expediente electoral y el otro lo remite quien reclama a la Junta Electoral competente para el escrutinio general.',
    ],
    pag: '23',
  },
  {
    id: 'i-papeletas',
    momento: 'Durante la votación',
    titulo: 'Se acaban las papeletas de una candidatura',
    texto: [
      'Si no las repone quien representa a la candidatura, la votación se interrumpe. La Presidencia llama a la Junta Electoral de Zona, que suministra papeletas. La interrupción dura como máximo una hora y la votación se prorroga ese mismo tiempo.',
    ],
    pag: '23',
    asistente: 'interrupcion',
  },
  {
    id: 'i-suspension',
    momento: 'Durante la votación',
    titulo: 'Hay que suspender la votación',
    texto: [
      'Solo si la interrupción supera una hora o algo hace imposible votar. La Presidencia recaba el parecer de toda la Mesa y, si puede, consulta a la Junta Electoral de Zona. La decisión va en un escrito razonado, se destruyen las papeletas depositadas en las urnas y se envía copia del escrito a la Junta Electoral Provincial, en mano o por correo certificado.',
    ],
    pag: '24',
    asistente: 'interrupcion',
  },
  {
    id: 'i-nocenso',
    momento: 'Durante la votación',
    titulo: 'No está en el censo, pero trae un documento',
    texto: [
      'Con una certificación censal de alta (original o por fax a través del Ayuntamiento) o una sentencia judicial, puede votar. Se indica en la lista numerada, el documento va en el sobre n.º 1 y el caso se cuenta en las actas de escrutinio y de sesión.',
      'La tarjeta censal que llega a casa no es una certificación de alta. Tampoco lo es el certificado de inscripción que acompaña a los votos por correo.',
    ],
    pag: '24 y 25',
    asistente: 'votante',
  },
  {
    id: 'i-errores',
    momento: 'Durante la votación',
    titulo: 'Sus datos están mal en el censo',
    texto: [
      'Con una certificación censal de corrección de errores (apellido, dirección…) la Mesa puede identificarle en la lista. No añade a nadie al censo: el caso se anota solo en el acta de sesión, no en la de escrutinio.',
    ],
    pag: '25',
    asistente: 'votante',
  },
  {
    id: 'i-correo',
    momento: 'Durante la votación',
    titulo: 'Pidió el voto por correo y quiere votar en persona',
    texto: ['No puede. En la lista del censo tendrá una «C» delante del nombre, o figurará en la relación de electores que han solicitado el voto por correo.'],
    pag: '25',
    asistente: 'votante',
  },
  {
    id: 'i-otra-mesa',
    momento: 'Durante la votación',
    titulo: 'Es interventor en otra Mesa y está en nuestro censo',
    texto: ['No puede votar presencialmente aquí. Entre la documentación tendréis copia de su acreditación ante la otra Mesa, precisamente para evitar el doble voto.'],
    pag: '6 y 25',
  },
  {
    id: 'i-abstencion',
    momento: 'Durante la votación',
    titulo: 'Votó solo al Congreso y vuelve para votar al Senado',
    texto: ['No puede. Quien vota en una elección y no en la otra queda marcado con una «X» en la elección en la que se abstuvo, y ya no puede votar en ella más tarde. Lo mismo al revés.'],
    pag: '9',
  },
  {
    id: 'i-reclamaciones',
    momento: 'Durante la votación',
    titulo: 'Un votante reclama o hace consultas a la Mesa',
    texto: [
      'El electorado solo puede reclamar por dudas sobre la identidad de alguien que acude a votar, o por la negativa de la Mesa a acreditar su ejercicio del derecho de voto. La Presidencia no admite más consultas que las del propio ejercicio del voto y las de interventores y apoderados. El resto se lleva a la Junta Electoral de Zona.',
      'Si la persona insiste, la Presidencia le invita a deponer su actitud y puede pedir a los agentes de la autoridad que abandone el local.',
    ],
    pag: '25 y 26',
  },
  {
    id: 'i-voluntario',
    momento: 'Durante la votación',
    titulo: 'Alguien cree que una persona con discapacidad no vota libremente',
    texto: [
      'Un miembro de la Mesa, interventor o apoderado puede hacerlo constar en el acta de sesión, pero no se impide que el voto entre en la urna. En el acta se identifica a la persona solo por el número de su DNI o del documento que aporte (Instrucción 7/2019 de la Junta Electoral Central).',
    ],
    pag: '17 y 18',
  },
  {
    id: 'i-orden',
    momento: 'Durante la votación',
    titulo: 'Grupos en la puerta, propaganda o alguien armado',
    texto: [
      'No se permiten grupos que entorpezcan el acceso, ni personas que coaccionen, ni propaganda electoral en el local o sus inmediaciones, ni armas (salvo las fuerzas de seguridad requeridas por la Presidencia). La Presidencia puede pedir el auxilio de las Fuerzas y Cuerpos de Seguridad.',
      'Los incidentes que afecten al orden se anotan en el acta de sesión con el nombre y apellidos de quienes los provocaron.',
    ],
    pag: '20 y 21',
  },
  {
    id: 'i-medios',
    momento: 'Durante la votación',
    titulo: 'Vienen medios de comunicación',
    texto: [
      'Los medios acreditados por la Administración Electoral pueden tomar imágenes generales de la votación, con las personas concretas como algo accesorio (salvo cargos públicos o personas de notoriedad). Las entrevistas a electores se hacen fuera del colegio.',
    ],
    pag: '21',
  },
  {
    id: 'i-emblemas',
    momento: 'Durante la votación',
    titulo: 'Un interventor o apoderado lleva símbolos de su partido',
    texto: [
      'Pueden llevar emblemas o adhesivos discretos, solo para identificar a su candidatura. No cabe un uniforme o vestimenta diseñada por la formación, ni indumentaria con símbolos partidistas (acuerdos de la Junta Electoral Central de 15/06/2016 y 24/11/2017).',
    ],
    pag: '19',
  },
  {
    id: 'i-correo-sin',
    momento: 'En el cierre y el escrutinio',
    titulo: 'Un voto por correo llega sin certificado de inscripción',
    texto: ['Se destruye el sobre con todo lo que contiene. No cuenta como voto válido ni como nulo.'],
    pag: '10',
    asistente: 'correo',
  },
  {
    id: 'i-publico',
    momento: 'En el cierre y el escrutinio',
    titulo: 'Alguien del público protesta por el recuento',
    texto: ['Quienes asisten como público no pueden formular reclamaciones ni protestas durante el escrutinio. La Presidencia ordena la expulsión inmediata de quien lo entorpezca o perturbe.'],
    pag: '26',
  },
  {
    id: 'i-examen',
    momento: 'En el cierre y el escrutinio',
    titulo: 'Piden ver una papeleta',
    texto: ['Un notario, un candidato o un representante de candidatura que tenga dudas sobre el contenido de una papeleta puede pedirla para examinarla ante la Mesa.'],
    pag: '26',
  },
  {
    id: 'i-parar',
    momento: 'En el cierre y el escrutinio',
    titulo: 'Queremos parar el recuento y seguir luego',
    texto: ['No se puede. El escrutinio es público y no se suspende hasta que se hayan contado todos los votos.'],
    pag: '26',
  },
  {
    id: 'i-reclamada',
    momento: 'En el cierre y el escrutinio',
    titulo: 'Hay una reclamación sobre una papeleta',
    texto: [
      'La Mesa resuelve por mayoría de sus integrantes. La papeleta reclamada no se destruye: la firma cada integrante de la Mesa, se une al acta de sesión y va en el sobre n.º 1.',
    ],
    pag: '13',
    asistente: 'papeleta',
  },
];
