var SCENARIOS = [
  {
    "id": "S001",
    "title": "Rimando sempre e poi mi giudico",
    "client_text": "Continuo a rimandare. Quando penso di iniziare mi sale una tensione e poi mi dico che non sono capace. In realtà quello che vorrei è solo partire, anche con qualcosa di piccolo. Mi basterebbe fare il primo passo.",
    "subset": {
      "P": [
        "P5",
        "P1",
        "P9",
        "P6"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E2": 2,
        "E4": 1
      },
      "P": {
        "P5": 2,
        "P1": 1,
        "P9": 1,
        "P6": 1
      },
      "I": {
        "I-P5-Comp": 2,
        "I-P5-Emo": 2,
        "I-P1-Cog": 1,
        "I-P9-Emo": 1,
        "I-P6-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione/preoccupazione prima di iniziare.",
        "E2": "Evitamento e blocco legati al timore di fallire.",
        "E4": "Senso di pressione che alimenta il rimando."
      },
      "P": {
        "P5": "Il rimando è il comportamento centrale.",
        "P1": "Standard/perfezione amplifica la soglia.",
        "P9": "Giudizio su merito/capacità colora l’azione.",
        "P6": "Il loop mentale mantiene lo stallo."
      },
      "I": {
        "I-P5-Comp": "Micro-azione per rompere l’inerzia.",
        "I-P5-Emo": "Consentire l’avvio senza slancio.",
        "I-P1-Cog": "Definire una soglia di “buono abbastanza” per sbloccare la chiusura.",
        "I-P9-Emo": "Notare l’emozione/vergogna senza giudizio e senza identificarvisi.",
        "I-P6-Emo": "Rientrare nel presente."
      }
    },
    "tags": [
      "procrastinazione",
      "evitamento"
    ],
    "difficulty": "easy",
    "intent": [
      "fare"
    ]
  },
  {
    "id": "S002",
    "title": "Dico sempre sì e poi esplodo",
    "client_text": "Accetto richieste anche quando non vorrei. Poi mi ritrovo sfinito e nervoso. So che dovrei muovermi diversamente: mi servirebbe definire un’azione concreta invece di restare lì ad accumulare.",
    "subset": {
      "P": [
        "P4",
        "P10",
        "P11"
      ]
    },
    "answer_key": {
      "E": {
        "E4": 2,
        "E5": 1,
        "E1": 1
      },
      "P": {
        "P4": 2,
        "P10": 1,
        "P11": 1
      },
      "I": {
        "I-P4-Comp": 2,
        "I-P4-Emo": 1,
        "I-P10-Comp": 1,
        "I-P11-Emo": 1
      }
    },
    "why": {
      "E": {
        "E4": "Sovraccarico dopo troppi sì.",
        "E5": "Irritazione quando il limite è superato.",
        "E1": "Tensione nel dire sì."
      },
      "P": {
        "P4": "Confini assenti o non dichiarati.",
        "P10": "Approvazione/adattamento automatico.",
        "P11": "O cedo o esplodo."
      },
      "I": {
        "I-P4-Comp": "Dire no assertivo.",
        "I-P4-Emo": "Dignità come innesco del limite.",
        "I-P10-Comp": "Agire senza chiedere conferma.",
        "I-P11-Emo": "Aprire a una via di mezzo."
      }
    },
    "tags": [
      "confini",
      "conformità"
    ],
    "difficulty": "easy",
    "intent": [
      "fare"
    ]
  },
  {
    "id": "S003",
    "title": "Penso e ripenso e non decido",
    "client_text": "Ho mille pensieri in testa, faccio liste, confronto opzioni… e poi non scelgo. Vorrei capire cosa conta davvero e, appena è più chiaro, decidere finalmente.",
    "subset": {
      "P": [
        "P6",
        "P11",
        "P12"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E4": 1
      },
      "P": {
        "P6": 2,
        "P11": 1,
        "P12": 1
      },
      "I": {
        "I-P6-Emo": 2,
        "I-P6-Cog": 2,
        "I-P6-Comp": 1,
        "I-P11-Emo": 1,
        "I-P12-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Preoccupazione e tensione alimentano il loop.",
        "E4": "Pressione aumenta l’overthinking."
      },
      "P": {
        "P6": "Ruminazione/loop mentale centrale.",
        "P11": "Binario blocca una scelta imperfetta.",
        "P12": "Cerco conferme, ignoro alternative."
      },
      "I": {
        "I-P6-Emo": "Rientrare nel presente quando la mente gira e si incastra.",
        "I-P6-Cog": "Valutare l’utilità del pensiero e scegliere cosa tenere vs lasciare.",
        "I-P6-Comp": "Interrompere il loop con un gesto semplice che riporta al fare.",
        "I-P11-Emo": "Aprire spazio intermedio tra i poli (non tutto-o-niente).",
        "I-P12-Emo": "Ammettere il dubbio per restare aperti a alternative credibili."
      }
    },
    "tags": [
      "ruminazione",
      "decisione"
    ],
    "difficulty": "easy",
    "intent": [
      "capire",
      "fare"
    ]
  },
  {
    "id": "S004",
    "title": "Mi sento un impostore quando va bene",
    "client_text": "Quando ottengo un risultato penso che sia fortuna. Se mi fanno un complimento mi sento scoperto. Prima di andare avanti, vorrei riuscire a sentirmi un po’ più a posto con me stesso e poi capire cosa ho fatto davvero.",
    "subset": {
      "P": [
        "P9",
        "P10"
      ]
    },
    "answer_key": {
      "E": {
        "E2": 2,
        "E1": 1
      },
      "P": {
        "P9": 2,
        "P10": 1
      },
      "I": {
        "I-P9-Emo": 2,
        "I-P9-Cog": 2,
        "I-P9-Comp": 1,
        "I-P10-Comp": 1
      }
    },
    "why": {
      "E": {
        "E2": "Allarme/ritiro: paura di essere smascherati.",
        "E1": "Tensione sul giudizio esterno."
      },
      "P": {
        "P9": "Impostura dichiarata.",
        "P10": "Giudizio esterno come amplificatore."
      },
      "I": {
        "I-P9-Emo": "Notare emozione senza giudizio.",
        "I-P9-Cog": "Attribuire merito alle azioni.",
        "I-P9-Comp": "Esporsi con contributo concreto.",
        "I-P10-Comp": "Agire senza conferma."
      }
    },
    "tags": [
      "impostura",
      "merito"
    ],
    "difficulty": "easy",
    "intent": [
      "allinearsi",
      "capire"
    ]
  },
  {
    "id": "S005",
    "title": "Non faccio mai abbastanza",
    "client_text": "Anche quando finisco qualcosa, sento che manca sempre un pezzo. Mi irrigidisco sui dettagli, ma in fondo vorrei consegnare e basta… magari chiarendo anche cosa è davvero essenziale.",
    "subset": {
      "P": [
        "P1",
        "P11"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E4": 1
      },
      "P": {
        "P1": 2,
        "P11": 1
      },
      "I": {
        "I-P1-Comp": 2,
        "I-P1-Cog": 2,
        "I-P1-Emo": 1,
        "I-P11-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione legata a standard interni.",
        "E4": "Pressione/consumo di energia."
      },
      "P": {
        "P1": "Perfezionismo/standard troppo alti.",
        "P11": "Rigidità binaria."
      },
      "I": {
        "I-P1-Comp": "Ridurre costo della perfezione.",
        "I-P1-Cog": "Buono abbastanza.",
        "I-P1-Emo": "Non invalidare la scelta quando c’è tensione.",
        "I-P11-Emo": "Aprire a un passo intermedio."
      }
    },
    "tags": [
      "perfezionismo"
    ],
    "difficulty": "easy",
    "intent": [
      "fare",
      "capire"
    ]
  }
];
