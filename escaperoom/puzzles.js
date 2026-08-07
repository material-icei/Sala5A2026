/**
 * TESOROS DEL PASADO — Sala de Escape
 * Puzzle data: 4 civilizations × 3 puzzles
 *
 * Puzzle types:
 *   "choice"  — opción múltiple (texto o emoji)
 *   "text"    — escribir la respuesta
 *   "order"   — ordenar elementos arrastrando
 *   "match"   — unir pares (columna A ↔ columna B)
 *   "drag"    — arrastrar items a una zona
 */

const LEVELS = [

  /* ═══════════════════════════════════════
     NIVEL 1 · PREHISTORIA 🦴
  ═══════════════════════════════════════ */
  {
    id: "prehistoria",
    name: "Prehistoria",
    emoji: "🦴",
    color: "#3A8F5C",
    colorLight: "#EAF6EE",
    tlLabel: "Los primeros humanos",
    tlFact: "Hace más de 2 millones de años, los primeros humanos aprendieron a usar herramientas de piedra y vivían en cuevas.",
    puzzles: [

      // P1 — Opción múltiple
      {
        type: "choice",
        instruction: "🔍 Acertijo 1 — Elegí la respuesta correcta",
        question: "¿Cuál de estas herramientas usaban los seres humanos prehistóricos para cazar?",
        options: [
          { label: "🗡️ Lanza de piedra", value: "a", correct: true },
          { label: "📱 Teléfono celular",  value: "b", correct: false },
          { label: "🔧 Llave inglesa",     value: "c", correct: false },
          { label: "🎸 Guitarra eléctrica",value: "d", correct: false }
        ],
        funFact: "¡Correcto! Los humanos prehistóricos tallaban piedras para hacer lanzas y puntas de flecha con las que cazaban mamuts y bisontes. 🦣"
      },

      // P2 — Ordenar
      {
        type: "order",
        instruction: "🔍 Acertijo 2 — Ordená de más antiguo a más moderno",
        question: "Arrastrá y soltá para ordenar cómo fue evolucionando la humanidad:",
        items: [
          { id: "a", label: "🦣 Caza de mamuts" },
          { id: "b", label: "🔥 Dominio del fuego" },
          { id: "c", label: "🏘️ Primeros pueblos" },
          { id: "d", label: "🎨 Pinturas en cuevas" }
        ],
        correctOrder: ["b", "a", "d", "c"],
        funFact: "¡Muy bien! El fuego fue primero (hace ~1 millón de años), luego la caza organizada, las pinturas rupestres y finalmente los primeros asentamientos. 🔥"
      },

      // P3 — Texto
      {
        type: "text",
        instruction: "🔍 Acertijo 3 — Escribí la respuesta",
        question: "¿En qué tipo de lugar vivían los primeros seres humanos antes de construir casas?",
        hint: "Pista: es una oquedad natural en la roca… 🪨",
        answer: ["cueva", "cuevas", "caverna", "cavernas", "gruta", "grutas"],
        funFact: "¡Exacto! Las cuevas les daban abrigo del frío y de los animales salvajes. Allí también dibujaron las primeras pinturas de la historia. 🎨"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 2 · ANTIGUO EGIPTO 🐫
  ═══════════════════════════════════════ */
  {
    id: "egipto",
    name: "Antiguo Egipto",
    emoji: "🐫",
    color: "#E8A010",
    colorLight: "#FEF8D8",
    tlLabel: "Faraones y pirámides",
    tlFact: "Hace 5.000 años, los egipcios construyeron las pirámides y desarrollaron la escritura jeroglífica.",
    puzzles: [

      // P1 — Opción múltiple con imágenes emoji
      {
        type: "choice",
        instruction: "🔍 Acertijo 1 — Elegí la respuesta correcta",
        question: "¿Cómo se llama el gran río que atraviesa Egipto y que dio vida a su civilización?",
        options: [
          { label: "🌊 El Amazonas",  value: "a", correct: false },
          { label: "💧 El Nilo",      value: "b", correct: true  },
          { label: "🏞️ El Danubio",  value: "c", correct: false },
          { label: "🌀 El Ganges",    value: "d", correct: false }
        ],
        funFact: "¡Genial! El Nilo es el río más largo del mundo. Sus inundaciones anuales dejaban tierra fértil donde los egipcios cultivaban trigo y construyeron toda su civilización. 🌾"
      },

      // P2 — Match (unir pares)
      {
        type: "match",
        instruction: "🔍 Acertijo 2 — Uní cada elemento con su descripción",
        question: "¿Qué es cada cosa del Antiguo Egipto? Hacé clic en un elemento de la izquierda y después en su pareja de la derecha.",
        pairs: [
          { left: "🔺 Pirámide",    right: "Tumba del faraón" },
          { left: "📜 Papiro",      right: "Material para escribir" },
          { left: "🐱 Gato",        right: "Animal sagrado" },
          { left: "👁️ Ojo de Horus", right: "Símbolo de protección" }
        ],
        funFact: "¡Perfecto! Los egipcios momificaban a los faraones y los enterraban en pirámides llenas de tesoros. Los gatos eran adorados como dioses. 😺"
      },

      // P3 — Drag (arrastrar al cofre correcto)
      {
        type: "drag",
        instruction: "🔍 Acertijo 3 — Arrastrá al grupo correcto",
        question: "¿Quiénes pertenecen al Antiguo Egipto? Arrastrá solo los personajes o cosas egipcias al cofre dorado.",
        allItems: [
          { id: "1", label: "👑 Faraón",      correct: true  },
          { id: "2", label: "🏺 Momia",       correct: true  },
          { id: "3", label: "🏹 Cleopatra",   correct: true  },
          { id: "4", label: "🦕 Dinosaurio",  correct: false },
          { id: "5", label: "🦁 Esfinge",     correct: true  },
          { id: "6", label: "🧙 Merlín",      correct: false }
        ],
        funFact: "¡Excelente! Faraón, Momia, Cleopatra y la Esfinge son del Antiguo Egipto. Los dinosaurios vivieron mucho antes y Merlín es un mago medieval. 🧠"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 3 · GRECIA 🏛️
  ═══════════════════════════════════════ */
  {
    id: "grecia",
    name: "Grecia",
    emoji: "🏛️",
    color: "#4AAFCC",
    colorLight: "#E5F5FA",
    tlLabel: "Dioses y filósofos",
    tlFact: "Hace 2.500 años, los griegos inventaron la democracia, los Juegos Olímpicos y las grandes preguntas de la filosofía.",
    puzzles: [

      // P1 — Opción múltiple
      {
        type: "choice",
        instruction: "🔍 Acertijo 1 — Elegí la respuesta correcta",
        question: "¿Quién era el dios más importante del Olimpo según los antiguos griegos?",
        options: [
          { label: "🔱 Poseidón",  value: "a", correct: false },
          { label: "⚡ Zeus",      value: "b", correct: true  },
          { label: "☀️ Apolo",    value: "c", correct: false },
          { label: "🪖 Ares",     value: "d", correct: false }
        ],
        funFact: "¡Correcto! Zeus era el rey de los dioses del Olimpo. Lanzaba rayos cuando se enojaba. Poseidón controlaba el mar y Ares era el dios de la guerra. ⚡"
      },

      // P2 — Ordenar (los Juegos Olímpicos)
      {
        type: "order",
        instruction: "🔍 Acertijo 2 — Ordená los eventos de los Juegos Olímpicos griegos",
        question: "¿En qué orden ocurrían estas cosas en los Juegos Olímpicos antiguos?",
        items: [
          { id: "a", label: "🏟️ Llegada de atletas a Olimpia" },
          { id: "b", label: "🏃 Competencias deportivas" },
          { id: "c", label: "🔥 Encendido del fuego sagrado" },
          { id: "d", label: "🌿 Entrega de corona de olivo" }
        ],
        correctOrder: ["a", "c", "b", "d"],
        funFact: "¡Muy bien! Primero llegaban los atletas, se encendía el fuego sagrado, luego las competencias, y el ganador recibía una corona de ramas de olivo. 🌿"
      },

      // P3 — Texto
      {
        type: "text",
        instruction: "🔍 Acertijo 3 — Escribí la respuesta",
        question: "¿Cómo se llama el famoso templo griego que está en la colina de Atenas, dedicado a la diosa Atenea?",
        hint: "Pista: comienza con 'P' y terminaba con '-non' 🏛️",
        answer: ["partenon", "partenón", "el partenon", "el partenón"],
        funFact: "¡Exacto! El Partenón fue construido hace 2.500 años en la Acrópolis de Atenas. Estaba dedicado a Atenea, diosa de la sabiduría. Hoy es uno de los monumentos más famosos del mundo. 🏛️"
      }
    ]
  },

  /* ═══════════════════════════════════════
     NIVEL 4 · ROMA ⚔️
  ═══════════════════════════════════════ */
  {
    id: "roma",
    name: "Roma",
    emoji: "⚔️",
    color: "#C24E28",
    colorLight: "#FDF0EC",
    tlLabel: "Emperadores y coliseos",
    tlFact: "Hace 2.000 años, el Imperio Romano dominó Europa, África y Asia, dejando caminos, acueductos y leyes que aún usamos.",
    puzzles: [

      // P1 — Match
      {
        type: "match",
        instruction: "🔍 Acertijo 1 — Uní cada elemento con su descripción",
        question: "Unime con lo que le corresponde a cada elemento romano:",
        pairs: [
          { left: "🏟️ Coliseo",        right: "Arena para gladiadores" },
          { left: "🛣️ Calzada romana",  right: "Caminos de piedra" },
          { left: "💧 Acueducto",       right: "Lleva agua a las ciudades" },
          { left: "🦁 Gladiador",       right: "Luchador del anfiteatro" }
        ],
        funFact: "¡Brillante! Los romanos construyeron más de 80.000 km de caminos. ¡Sus acueductos traían agua desde montañas lejanas hasta las ciudades! 🏙️"
      },

      // P2 — Drag
      {
        type: "drag",
        instruction: "🔍 Acertijo 2 — Arrastrá al grupo correcto",
        question: "¿Cuáles de estos son aportes del Imperio Romano? Arrastrá los correctos al cofre.",
        allItems: [
          { id: "1", label: "📅 Calendario",      correct: true  },
          { id: "2", label: "⚖️ Leyes escritas",  correct: true  },
          { id: "3", label: "🍕 Pizza moderna",   correct: false },
          { id: "4", label: "🛣️ Caminos",         correct: true  },
          { id: "5", label: "📱 Internet",        correct: false },
          { id: "6", label: "🏛️ Arcos de triunfo",correct: true  }
        ],
        funFact: "¡Excelente! El calendario, las leyes, los caminos y los arcos de triunfo son aportes romanos. ¡La pizza y el internet llegaron mucho después! 🍕"
      },

      // P3 — Opción múltiple
      {
        type: "choice",
        instruction: "🔍 Acertijo 3 — Elegí la respuesta correcta",
        question: "¿En qué idioma hablaban los romanos del Imperio?",
        options: [
          { label: "🇮🇹 Italiano", value: "a", correct: false },
          { label: "🏛️ Latín",    value: "b", correct: true  },
          { label: "🇬🇷 Griego",  value: "c", correct: false },
          { label: "🦅 Etrusco",  value: "d", correct: false }
        ],
        funFact: "¡Correcto! Los romanos hablaban latín, y de ahí vienen el español, el italiano, el francés y el portugués. ¡Cuando decís 'animal' o 'ciudad' estás usando palabras que vienen del latín! 🌐"
      }
    ]
  }
];
