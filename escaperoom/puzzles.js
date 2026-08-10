/**
 * TESOROS DEL PASADO — Sala de Escape
 * Puzzles basados en el contenido del ABP (A. Videla & F. García, ICEI 2025)
 * Competencias: Observar · Describir · Reconocer · Crear · Explicar
 *
 * Tipos de acertijo:
 *  "imgChoice"   — elegir la imagen correcta entre varias
 *  "imgOrder"    — ordenar imágenes arrastrando (cronológico)
 *  "imgDrag"     — arrastrar imágenes al grupo correcto
 *  "imgMatch"    — unir imagen con su nombre/descripción
 *  "text"        — escribir la respuesta
 */

const IMG = name => `iconos/${name}.png`;

const LEVELS = [

  /* ═══════════════════════════════════════
     NIVEL 1 · PREHISTORIA 🦴
     Objetivos ABP: conocer los primeros humanos,
     sus herramientas, sus viviendas y el fuego
  ═══════════════════════════════════════ */
  {
    id: "prehistoria",
    name: "Prehistoria",
    emoji: "🦴",
    color: "#7B5E3A",
    colorLight: "#F5ECD7",
    bgGradient: "linear-gradient(135deg, #5C3D1E 0%, #8B6340 100%)",
    tlLabel: "Los primeros humanos",
    tlFact: "Hace más de 2 millones de años, los primeros humanos aprendieron a usar herramientas de piedra, dominar el fuego y vivir en cuevas pintando en sus paredes.",
    puzzles: [

      /* P1 — ¿Cuál es la vivienda del hombre prehistórico? */
      {
        type: "imgChoice",
        instruction: "🔍 Acertijo 1 — Observá bien las imágenes",
        question: "Los primeros humanos vivían en un lugar oscuro y natural, protegidos del frío y los animales. ¿Cuál de estas imágenes muestra ese lugar?",
        options: [
          { img: IMG("cueva"),   label: "Cueva",  correct: true  },
          { img: IMG("choza"),   label: "Choza",  correct: false },
          { img: IMG("oasis"),   label: "Oasis",  correct: false },
          { img: IMG("coliseo"), label: "Coliseo",correct: false }
        ],
        funFact: "¡Correcto! Los primeros humanos vivían en CUEVAS. Allí también hacían sus primeras pinturas con animales y cazadores. ¡Las cuevas eran su hogar y su galería de arte! 🎨"
      },

      /* P2 — Ordenar cronológicamente inventos prehistóricos */
      {
        type: "imgOrder",
        instruction: "🔍 Acertijo 2 — Ordená del más antiguo al más moderno",
        question: "Arrastrá las imágenes para ordenar estos grandes inventos de la Prehistoria, ¡del primero al último!",
        items: [
          { id: "fuego", img: IMG("fuego"),              label: "Dominio del fuego" },
          { id: "hombre",img: IMG("hombre-prehistorico"),label: "Primeros cazadores" },
          { id: "cueva", img: IMG("cueva"),              label: "Pinturas en cuevas" },
          { id: "choza", img: IMG("choza"),              label: "Primeras aldeas" }
        ],
        correctOrder: ["fuego","hombre","cueva","choza"],
        funFact: "¡Muy bien! Primero dominaron el fuego, luego aprendieron a cazar en grupo, después decoraron sus cuevas con pinturas, y finalmente construyeron las primeras aldeas. 🔥"
      },

      /* P3 — ¿Qué inventó el hombre prehistórico? (drag al cofre) */
      {
        type: "imgDrag",
        instruction: "🔍 Acertijo 3 — Arrastrá los inventos prehistóricos al cofre",
        question: "¿Cuáles de estas cosas inventaron o usaron los hombres prehistóricos? ¡Arrastrá solo los correctos al cofre dorado!",
        allItems: [
          { id: "fuego",   img: IMG("fuego"),               label: "El fuego",      correct: true  },
          { id: "rueda",   img: IMG("rueda"),               label: "La rueda",      correct: true  },
          { id: "piramide",img: IMG("piramide"),            label: "Pirámide",      correct: false },
          { id: "hombre",  img: IMG("hombre-prehistorico"), label: "Herramienta de piedra", correct: true },
          { id: "coliseo", img: IMG("coliseo"),             label: "Coliseo",       correct: false }
        ],
        funFact: "¡Genial! Los prehistóricos descubrieron el fuego, inventaron la rueda y crearon herramientas de piedra. Las pirámides y el Coliseo vinieron mucho después. 🪨"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 2 · ANTIGUO EGIPTO 🐫
     Objetivos ABP: faraones, pirámides, el Nilo,
     momias, escritura jeroglífica
  ═══════════════════════════════════════ */
  {
    id: "egipto",
    name: "Antiguo Egipto",
    emoji: "🐫",
    color: "#C49A00",
    colorLight: "#FFF8D0",
    bgGradient: "linear-gradient(135deg, #8B6E00 0%, #C49A00 100%)",
    tlLabel: "Faraones y pirámides",
    tlFact: "Hace 5.000 años, los egipcios construyeron las pirámides, inventaron la escritura jeroglífica y momificaban a sus faraones para la vida eterna.",
    puzzles: [

      /* P1 — ¿Quién era el faraón? imgChoice */
      {
        type: "imgChoice",
        instruction: "🔍 Acertijo 1 — Reconocé al personaje",
        question: "En el Antiguo Egipto había un rey muy poderoso que llevaba una corona especial y símbolos sagrados. ¿Cuál imagen muestra al FARAÓN?",
        options: [
          { img: IMG("faraon"),            label: "El Faraón",     correct: true  },
          { img: IMG("zeus"),              label: "Un dios griego", correct: false },
          { img: IMG("hombre-prehistorico"),label: "Un prehistórico",correct: false },
          { img: IMG("emperador"),         label: "Un romano",     correct: false }
        ],
        funFact: "¡Correcto! El FARAÓN era el rey del Antiguo Egipto. Llevaba la corona con cobra y el cetro. ¡Era considerado un dios en la Tierra! 👑"
      },

      /* P2 — Match: imagen ↔ nombre */
      {
        type: "imgMatch",
        instruction: "🔍 Acertijo 2 — Uní cada imagen con su nombre",
        question: "Hacé clic en una imagen de la izquierda y después en el nombre correcto de la derecha:",
        pairs: [
          { img: IMG("piramide"), label: "Pirámide",  desc: "Tumba del faraón" },
          { img: IMG("momia"),    label: "Momia",     desc: "Cuerpo preservado" },
          { img: IMG("camello"),  label: "Camello",   desc: "Animal del desierto" },
          { img: IMG("oasis"),    label: "Oasis",     desc: "Agua en el desierto" }
        ],
        funFact: "¡Perfecto! Las PIRÁMIDES eran las tumbas de los faraones. Las MOMIAS eran cuerpos conservados para la vida eterna. Los CAMELLOS cruzaban el desierto y los OASIS eran sus puntos de agua. 🌴"
      },

      /* P3 — ¿Qué pertenece al Antiguo Egipto? imgDrag */
      {
        type: "imgDrag",
        instruction: "🔍 Acertijo 3 — Arrastrá lo que es del Antiguo Egipto",
        question: "¡Solo algunos de estos pertenecen al Antiguo Egipto! Arrastrá los correctos al cofre dorado:",
        allItems: [
          { id: "piramide", img: IMG("piramide"), label: "Pirámide",  correct: true  },
          { id: "faraon",   img: IMG("faraon"),   label: "Faraón",    correct: true  },
          { id: "momia",    img: IMG("momia"),    label: "Momia",     correct: true  },
          { id: "coliseo",  img: IMG("coliseo"),  label: "Coliseo",   correct: false },
          { id: "zeus",     img: IMG("zeus"),     label: "Zeus",      correct: false }
        ],
        funFact: "¡Excelente! La pirámide, el faraón y la momia son del Antiguo Egipto. El Coliseo es romano y Zeus es un dios griego. ¡Cada civilización tiene sus propios tesoros! 🏺"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 3 · GRECIA 🏛️
     Objetivos ABP: dioses del Olimpo, templos,
     democracia, Juegos Olímpicos
  ═══════════════════════════════════════ */
  {
    id: "grecia",
    name: "Grecia",
    emoji: "🏛️",
    color: "#2E7EAA",
    colorLight: "#E0F2FA",
    bgGradient: "linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)",
    tlLabel: "Dioses y filósofos",
    tlFact: "Hace 2.500 años, los griegos construyeron templos para sus dioses, inventaron los Juegos Olímpicos y crearon la democracia — el gobierno del pueblo.",
    puzzles: [

      /* P1 — ¿Quién es Zeus? imgChoice */
      {
        type: "imgChoice",
        instruction: "🔍 Acertijo 1 — Reconocé al dios griego",
        question: "Los griegos adoraban a muchos dioses. El más poderoso lanzaba rayos y vivía en el Monte Olimpo. ¿Cuál imagen muestra a ese dios?",
        options: [
          { img: IMG("zeus"),    label: "Zeus ⚡",       correct: true  },
          { img: IMG("faraon"),  label: "Faraón",        correct: false },
          { img: IMG("momia"),   label: "Momia",         correct: false },
          { img: IMG("emperador"),label: "Emperador",    correct: false }
        ],
        funFact: "¡Correcto! ZEUS era el rey de los dioses griegos. Vivía en el Monte Olimpo y lanzaba rayos cuando se enojaba. Su símbolo era el águila dorada. ⚡"
      },

      /* P2 — imgOrder: Olimpo → Partenón → Zeus */
      {
        type: "imgOrder",
        instruction: "🔍 Acertijo 2 — Ordená del más grande al más pequeño",
        question: "Arrastrá las imágenes para ordenar: primero el hogar de los dioses, después el templo de Atenea, y por último el propio dios:",
        items: [
          { id: "olimpo",   img: IMG("monte-olimpo"), label: "Monte Olimpo\n" },
          { id: "partenon", img: IMG("partenon"),     label: "Partenón\n" },
          { id: "zeus",     img: IMG("zeus"),         label: "Zeus\n" }
        ],
        correctOrder: ["olimpo","partenon","zeus"],
        funFact: "¡Muy bien! El MONTE OLIMPO era donde vivían todos los dioses. El PARTENÓN era el templo construido para Atenea en Atenas. Y ZEUS era el dios más poderoso de todos. 🏔️"
      },

      /* P3 — Match imagen ↔ descripción */
      {
        type: "imgMatch",
        instruction: "🔍 Acertijo 3 — Uní cada imagen con lo que representa",
        question: "Hacé clic en una imagen de la izquierda y luego en su descripción correcta a la derecha:",
        pairs: [
          { img: IMG("zeus"),        label: "Zeus",         desc: "Rey de los dioses griegos" },
          { img: IMG("partenon"),    label: "Partenón",     desc: "Templo de la diosa Atenea" },
          { img: IMG("monte-olimpo"),label: "Monte Olimpo", desc: "Donde vivían los dioses" }
        ],
        funFact: "¡Excelente! En la Grecia antigua todo estaba conectado: los dioses vivían en el OLIMPO, se les construían TEMPLOS como el Partenón, y ZEUS los gobernaba a todos. 🏛️"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 4 · ROMA ⚔️
     Objetivos ABP: emperadores, gladiadores,
     Coliseo, numeración romana, aportes a la cultura
  ═══════════════════════════════════════ */
  {
    id: "roma",
    name: "Roma",
    emoji: "⚔️",
    color: "#A93226",
    colorLight: "#FADBD8",
    bgGradient: "linear-gradient(135deg, #7B241C 0%, #C0392B 100%)",
    tlLabel: "Emperadores y coliseos",
    tlFact: "Hace 2.000 años, el Imperio Romano dominó Europa con sus emperadores, legionarios y gladiadores. Nos dejaron los números romanos, los acueductos y el Coliseo.",
    puzzles: [

      /* P1 — ¿Qué es el Coliseo? imgChoice */
      {
        type: "imgChoice",
        instruction: "🔍 Acertijo 1 — Reconocé el monumento romano",
        question: "Los romanos construyeron un gran anfiteatro donde los gladiadores peleaban frente a miles de personas. ¿Cuál imagen muestra ese lugar?",
        options: [
          { img: IMG("coliseo"),  label: "Coliseo",    correct: true  },
          { img: IMG("partenon"), label: "Partenón",   correct: false },
          { img: IMG("piramide"), label: "Pirámide",   correct: false },
          { img: IMG("cueva"),    label: "Cueva",      correct: false }
        ],
        funFact: "¡Correcto! El COLISEO de Roma podía albergar hasta 80.000 espectadores. Allí los gladiadores combatían y el pueblo romano se divertía. ¡Era el estadio más grande de la antigüedad! 🏟️"
      },

      /* P2 — imgOrder cronológico de las 4 civilizaciones */
      {
        type: "imgOrder",
        instruction: "🔍 Acertijo 2 — ¡El gran orden final! De más antigua a más reciente",
        question: "Ahora que conocés todas las civilizaciones, ordenalas de la más antigua a la más reciente arrastrando las imágenes:",
        items: [
          { id: "hombre", img: IMG("hombre-prehistorico"), label: "Prehistoria" },
          { id: "faraon", img: IMG("faraon"),              label: "Antiguo Egipto" },
          { id: "zeus",   img: IMG("zeus"),                label: "Grecia" },
          { id: "col",    img: IMG("coliseo"),             label: "Roma" }
        ],
        correctOrder: ["hombre","faraon","zeus","col"],
        funFact: "¡Sos un verdadero explorador del tiempo! Prehistoria → Egipto → Grecia → Roma. ¡Esa es la línea del tiempo de los Tesoros del Pasado! ⏳"
      },

      /* P3 — Match: número romano ↔ imagen del coliseo/emperador */
      {
        type: "imgMatch",
        instruction: "🔍 Acertijo 3 — Uní cada imagen con su civilización",
        question: "¿A qué civilización pertenece cada imagen? Uní imagen con civilización:",
        pairs: [
          { img: IMG("cueva"), label: "Caverna", desc: "Prehistoria 🦴" },
          { img: IMG("piramide"),       label: "Piramide",       desc: "Egipto 🐫" },
          { img: IMG("partenon"),    label: "Partenón",     desc: "Grecia ⚡" },          
          { img: IMG("coliseo"),         label: "Coliseo",         desc: "Roma ⚔️" }
        ],
        funFact: "¡Bravo! Sabés un montón sobre historia antigua"
      }
    ]
  }
];
