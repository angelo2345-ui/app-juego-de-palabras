/* Banco de preguntas del juego.
   En cada pregunta, la PRIMERA opción del arreglo "o" es la correcta.
   Las demás opciones son los distractores; en el juego se mezclan al azar.
   "a" y "b" forman la oración alrededor del hueco.  "w" explica la regla. */
window.BANK = [
  {a:"No quiero café,", b:"té.", o:["sino","si no"], w:"«Sino» se une cuando contrapone una idea a otra negada (no café, sino té). Prueba: puedes decir «pero sí»."},
  {a:"", b:"estudias, no aprobarás.", o:["Si no","Sino"], w:"«Si no» va separado cuando «si» es condicional y «no» niega el verbo. Equivale a «en caso de que no estudies»."},
  {a:"¿", b:"no viniste a clase?", o:["Por qué","Porque","Porqué","Por que"], w:"En una pregunta se escribe «por qué»: dos palabras y tilde en «qué». Equivale a «¿por cuál motivo?»."},
  {a:"No fui a clase", b:"estaba enfermo.", o:["porque","por qué","porqué","por que"], w:"«Porque» es la conjunción causal: una palabra, sin tilde. Equivale a «ya que» o «debido a que»."},
  {a:"Nunca entendí el", b:"de su decisión.", o:["porqué","porque","por qué","por que"], w:"«Porqué» es un sustantivo masculino que significa «motivo». Suele llevar artículo (el porqué) y tiene plural: los porqués."},
  {a:"El motivo", b:"te llamé es importante.", o:["por que","porque","por qué","porqué"], w:"Aquí «por» es preposición y «que» es relativo. Equivale a «por el que» o «por el cual»."},
  {a:"Ya terminé la tarea,", b:"puedo salir.", o:["conque","con que","con qué"], w:"«Conque» es una conjunción consecutiva (así que, de modo que) y se escribe en una sola palabra."},
  {a:"¿", b:"vas a pagar la matrícula?", o:["Con qué","Conque","Con que"], w:"En una pregunta se escribe «con qué»: la preposición «con» más el interrogativo «qué», con tilde."},
  {a:"Este es el lápiz", b:"escribo.", o:["con que","conque","con qué"], w:"«Con» es preposición y «que» es relativo: «el lápiz con el que escribo». Va separado y sin tilde."},
  {a:"Ana no fue a la reunión y yo", b:".", o:["tampoco","tan poco"], w:"«Tampoco» es un adverbio de negación que se suma a algo ya negado. Es lo contrario de «también» y va junto."},
  {a:"Comió", b:"que sigue con hambre.", o:["tan poco","tampoco"], w:"Aquí «tan» intensifica a «poco» (comió muy poco), por eso van separadas."},
  {a:"Ella canta", b:"que parece profesional.", o:["tan bien","también"], w:"«Tan bien» intensifica «bien» y se separa. Puedes comprobarlo cambiándolo por «tan mal»."},
  {a:"Si tú vas, yo", b:"voy.", o:["también","tan bien"], w:"«También» es un adverbio de afirmación que equivale a «igualmente». Se escribe junto."},
  {a:"El informe presenta los resultados y,", b:", las conclusiones.", o:["asimismo","a sí mismo"], w:"«Asimismo» significa «además» o «también» y se escribe en una sola palabra."},
  {a:"Juan se critica", b:"con dureza.", o:["a sí mismo","asimismo"], w:"«A sí mismo» es la preposición «a» más el pronombre reflexivo «sí» y «mismo». Se refiere a la misma persona que el sujeto."},
  {a:"", b:"de estudiar, trabaja por las tardes.", o:["Aparte","A parte"], w:"«Aparte de» expresa «además de» y va junto. «A parte» solo se usa si «parte» es un sustantivo: «a parte de los alumnos»."},
  {a:"Le cobraron cinco pesos", b:"en la cuenta.", o:["de más","demás"], w:"«De más» significa «en exceso» o «de sobra»: cobrar de más."},
  {a:"Los", b:"estudiantes ya entregaron el trabajo.", o:["demás","de más"], w:"«Demás» significa «restantes» y se escribe junto: los demás, lo demás."},
  {a:"Me gusta el deporte,", b:"el béisbol.", o:["sobre todo","sobretodo"], w:"«Sobre todo» es una locución adverbial que significa «principalmente» y va separada."},
  {a:"Hacía frío y me puse el", b:".", o:["sobretodo","sobre todo"], w:"«Sobretodo» (junto) es un sustantivo: una prenda de abrigo larga. Solo se escribe junto con ese sentido."},
  {a:"", b:"si apruebas el examen.", o:["A ver","Haber"], w:"«A ver» (preposición más verbo) expresa curiosidad o expectativa. «Haber» es un verbo: «debe haber llegado»."},
  {a:"Almorzamos exactamente al", b:".", o:["mediodía","medio día"], w:"«Mediodía» (junto) es el momento en que el sol está más alto, hacia las doce. «Medio día» es la mitad de un día: trabajó medio día."},
  {a:"Salimos", b:"de la lluvia.", o:["a pesar","apesar"], w:"«A pesar de» es una locución de tres palabras separadas."},
  {a:"Es muy inteligente y,", b:", muy responsable.", o:["además","a demás"], w:"«Además» significa «también» o «por añadidura» y se escribe en una sola palabra."},
  {a:"Ni", b:"me saludó.", o:["siquiera","si quiera"], w:"«Ni siquiera» expresa «ni tan solo» y «siquiera» va junto. «Si quiera» (separado) es «si» más el verbo querer: «si quiera ayuda, pídala»."},
  {a:"Hoy no tengo nada", b:".", o:["que hacer","quehacer"], w:"«Que hacer» (separado) es pronombre más infinitivo: «nada que hacer». «Quehacer» es un sustantivo: los quehaceres domésticos."},
  {a:"Los invitados se sentaron", b:"a la fogata.", o:["en torno","entorno"], w:"«En torno a» significa «alrededor de» y se escribe separado. «Entorno» es un sustantivo: el ambiente que rodea."},
  {a:"Vive en un", b:"rural muy tranquilo.", o:["entorno","en torno"], w:"«Entorno» (junto) es un sustantivo que significa «ambiente» o «lo que rodea». Aquí lo acompaña el artículo «un»."}
];

/* Resumen de reglas que se muestra en el repaso rápido antes de jugar. */
window.REPASO = [
  ["sino / si no", "«Sino» contrapone (no té, sino café). «Si no» es condición (si no vienes, te llamo)."],
  ["porque / por qué / porqué / por que", "Causa; pregunta; sustantivo (el motivo); preposición más relativo (el motivo por que vine)."],
  ["conque / con que / con qué", "Consecuencia (así que); preposición más relativo; pregunta."],
  ["tampoco / tan poco", "Negación de algo ya negado; intensidad de «poco»."],
  ["también / tan bien", "Adición (yo también); intensidad de «bien»."],
  ["asimismo / a sí mismo", "Además; el mismo sujeto (se critica a sí mismo)."],
  ["aparte / a parte", "Además de; «a» más el sustantivo «parte»."],
  ["demás / de más", "Los restantes; en exceso."],
  ["sobre todo / sobretodo", "Principalmente; prenda de abrigo."],
  ["siquiera / si quiera", "«Ni siquiera»; «si» más el verbo querer."],
  ["en torno / entorno", "Alrededor de; ambiente."],
  ["que hacer / quehacer", "Pronombre más infinitivo; ocupación, tarea."]
];
