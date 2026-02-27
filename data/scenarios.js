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
  },
  {
    "id": "S006",
    "title": "So cosa fare ma non parte niente",
    "client_text": "Razionalmente so cosa fare, ma non parte. È come se mi mancasse energia. Se riuscissi solo a cominciare, anche senza entusiasmo, sarebbe già tanto.",
    "subset": {
      "P": [
        "P5",
        "P8"
      ]
    },
    "answer_key": {
      "E": {
        "E6": 2,
        "E4": 1
      },
      "P": {
        "P5": 2,
        "P8": 1
      },
      "I": {
        "I-P5-Comp": 2,
        "I-P5-Emo": 2,
        "I-P8-Comp": 1,
        "I-P8-Emo": 1
      }
    },
    "why": {
      "E": {
        "E6": "Spento/vuoto: poca spinta.",
        "E4": "Pressione peggiora l’avvio."
      },
      "P": {
        "P5": "Evitamento/inerzia.",
        "P8": "Futuro poco rilevante nel presente."
      },
      "I": {
        "I-P5-Comp": "Micro-azione immediata.",
        "I-P5-Emo": "Consentire l’avvio senza slancio.",
        "I-P8-Comp": "Gesto oggi allineato.",
        "I-P8-Emo": "Ritrovarsi nel sé futuro."
      }
    },
    "tags": [
      "apatia",
      "avvio"
    ],
    "difficulty": "easy",
    "intent": [
      "fare"
    ]
  },
  {
    "id": "S007",
    "title": "Mi adeguo e poi mi perdo",
    "client_text": "Mi adeguo a quello che vogliono gli altri e poi mi sento distante da me. Vorrei capire cosa conta per me e ritrovare un minimo di allineamento.",
    "subset": {
      "P": [
        "P10",
        "P4"
      ]
    },
    "answer_key": {
      "E": {
        "E6": 1,
        "E1": 1,
        "E4": 1
      },
      "P": {
        "P10": 2,
        "P4": 1
      },
      "I": {
        "I-P10-Cog": 2,
        "I-P10-Emo": 2,
        "I-P10-Comp": 1,
        "I-P4-Emo": 1
      }
    },
    "why": {
      "E": {
        "E6": "Disconnessione da sé.",
        "E1": "Tensione da approvazione.",
        "E4": "Pressione sociale."
      },
      "P": {
        "P10": "Valore spostato all’esterno.",
        "P4": "Confini non emergono."
      },
      "I": {
        "I-P10-Cog": "Distinguere valore interno/esterno.",
        "I-P10-Emo": "Verificare congruenza interna.",
        "I-P10-Comp": "Autorizzarsi senza conferma.",
        "I-P4-Emo": "Dignità come limite."
      }
    },
    "tags": [
      "conformità",
      "autenticità"
    ],
    "difficulty": "easy",
    "intent": [
      "capire",
      "allinearsi"
    ]
  },
  {
    "id": "S008",
    "title": "O perfetto o niente",
    "client_text": "O la faccio bene o non la faccio. Quando qualcosa è imperfetto mi blocco. In realtà vorrei muovermi lo stesso, magari chiarendo cosa è abbastanza.",
    "subset": {
      "P": [
        "P11",
        "P1"
      ]
    },
    "answer_key": {
      "E": {
        "E3": 1,
        "E1": 1
      },
      "P": {
        "P11": 2,
        "P1": 1
      },
      "I": {
        "I-P11-Comp": 2,
        "I-P11-Emo": 1,
        "I-P1-Cog": 1
      }
    },
    "why": {
      "E": {
        "E3": "Frustrazione sull’imperfezione.",
        "E1": "Tensione su standard."
      },
      "P": {
        "P11": "Rigidità binaria.",
        "P1": "Perfezionismo come radice."
      },
      "I": {
        "I-P11-Comp": "Passo utile non perfetto.",
        "I-P11-Emo": "Aprire spazio intermedio.",
        "I-P1-Cog": "Buono abbastanza."
      }
    },
    "tags": [
      "rigidità",
      "tutto_o_niente"
    ],
    "difficulty": "easy",
    "intent": [
      "fare",
      "capire"
    ]
  },
  {
    "id": "S009",
    "title": "Cerco solo conferme",
    "client_text": "Quando qualcuno mi contraddice mi irrigidisco. Cerco prove che ho ragione. Mi servirebbe capire meglio cosa sto difendendo… e restare aperto.",
    "subset": {
      "P": [
        "P12",
        "P11"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 1,
        "E5": 1
      },
      "P": {
        "P12": 2,
        "P11": 1
      },
      "I": {
        "I-P12-Cog": 2,
        "I-P12-Emo": 1,
        "I-P11-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione sulla disconferma.",
        "E5": "Fastidio quando contraddetto."
      },
      "P": {
        "P12": "Bias di conferma centrale.",
        "P11": "Rigidità nel tenere posizione."
      },
      "I": {
        "I-P12-Cog": "Cercare contro-evidenze.",
        "I-P12-Emo": "Ammettere possibilità alternativa.",
        "I-P11-Emo": "Aprire spazio intermedio."
      }
    },
    "tags": [
      "bias_conferma"
    ],
    "difficulty": "easy",
    "intent": [
      "capire",
      "allinearsi"
    ]
  },
  {
    "id": "S010",
    "title": "Futuro lontano e minaccioso",
    "client_text": "Penso troppo al futuro e poi mi blocco. Vorrei rimettere i piedi nel presente, capire cosa è realistico e fare un passo concreto.",
    "subset": {
      "P": [
        "P8",
        "P6",
        "P5"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E2": 1
      },
      "P": {
        "P8": 2,
        "P6": 1,
        "P5": 1
      },
      "I": {
        "I-P8-Cog": 2,
        "I-P8-Emo": 2,
        "I-P6-Emo": 1,
        "I-P5-Comp": 1
      }
    },
    "why": {
      "E": {
        "E1": "Preoccupazione sul futuro.",
        "E2": "Allarme quando lo senti minaccioso."
      },
      "P": {
        "P8": "Futuro non integrato nel presente.",
        "P6": "Loop mentale sul futuro.",
        "P5": "Evitamento quando aumenta allarme."
      },
      "I": {
        "I-P8-Cog": "Consultare sé futuro.",
        "I-P8-Emo": "Ritrovarsi nel sé futuro.",
        "I-P6-Emo": "Rientrare nel presente.",
        "I-P5-Comp": "Definire una micro-azione immediata e verificabile per rompere l’inerzia."
      }
    },
    "tags": [
      "futuro",
      "ansia"
    ],
    "difficulty": "easy",
    "intent": [
      "capire",
      "fare"
    ]
  },
  {
    "id": "S011",
    "title": "Cambio lavoro: eccitazione e panico insieme",
    "client_text": "Ho un’offerta interessante. Una parte di me è gasata, un’altra vede solo i rischi. Se riuscissi a fare un primo passo, magari dopo aver messo ordine nei pensieri, potrei rispondere.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P6",
        "P5",
        "P8",
        "P12"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E2": 1,
        "E4": 1
      },
      "P": {
        "P6": 2,
        "P5": 1,
        "P8": 1,
        "P12": 1
      },
      "I": {
        "I-P6-Comp": 2,
        "I-P6-Emo": 1,
        "I-P5-Emo": 1,
        "I-P8-Emo": 1,
        "I-P12-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Preoccupazione e pensieri su scenari futuri.",
        "E2": "Allarme sul rischio/perdita.",
        "E4": "Pressione della decisione."
      },
      "P": {
        "P6": "Il loop mentale ‘tutto quello che può andare storto’.",
        "P5": "Rimando la risposta come evitamento.",
        "P8": "Il futuro è sentito come lontano/minaccioso: serve renderlo concreto.",
        "P12": "Cerco prove che confermino il timore."
      },
      "I": {
        "I-P6-Comp": "Interrompere il loop con un gesto semplice (es. bozza risposta).",
        "I-P6-Emo": "Rientrare nel presente per scegliere.",
        "I-P5-Emo": "Consentire un passo anche senza certezza.",
        "I-P8-Emo": "Ritrovarsi nel sé futuro e valutare coerenza.",
        "I-P12-Emo": "Ammettere il dubbio e considerare alternativa."
      }
    },
    "tags": [
      "decisione",
      "cambiamento"
    ],
    "intent": [
      "fare",
      "capire"
    ]
  },
  {
    "id": "S012",
    "title": "Cliente ‘bravo’ che poi sparisce",
    "client_text": "In sessione il cliente è d’accordo su tutto, poi non fa nulla. Io mi irrigidisco. Vorrei portarlo all’azione, ma anche capire cosa lo sta davvero fermando.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P5",
        "P10",
        "P11",
        "P4"
      ]
    },
    "answer_key": {
      "E": {
        "E3": 1,
        "E5": 1,
        "E4": 1
      },
      "P": {
        "P5": 2,
        "P10": 1,
        "P11": 1,
        "P4": 1
      },
      "I": {
        "I-P5-Comp": 2,
        "I-P5-Emo": 1,
        "I-P10-Comp": 1,
        "I-P11-Emo": 1,
        "I-P4-Comp": 1
      }
    },
    "why": {
      "E": {
        "E3": "Frustrazione per l’incoerenza tra parole e azioni.",
        "E5": "Fastidio/risentimento verso ‘sì sì’ e poi nulla.",
        "E4": "Pressione di ‘far funzionare’ la sessione."
      },
      "P": {
        "P5": "Evitamento dell’azione tra una sessione e l’altra.",
        "P10": "Conformità: dire ciò che l’altro vuole sentire.",
        "P11": "Rigidità del coach (mi irrigidisco).",
        "P4": "Serve un confine operativo (contratto d’azione)."
      },
      "I": {
        "I-P5-Comp": "Definire micro-azione verificabile entro 24h.",
        "I-P5-Emo": "Dare permesso di partire senza motivazione.",
        "I-P10-Comp": "Scelta autonoma senza cercare approvazione del coach.",
        "I-P11-Emo": "Aprire una via di mezzo (non ‘o fai tutto o niente’).",
        "I-P4-Comp": "Confine/accordo: cosa è sessione vs cosa è azione."
      }
    },
    "tags": [
      "coaching",
      "accountability"
    ],
    "intent": [
      "fare",
      "capire"
    ]
  },
  {
    "id": "S013",
    "title": "Perfezionismo travestito da qualità",
    "client_text": "Voglio farlo bene, però riscrivo mille volte e consegno tardi. In fondo vorrei chiudere e basta, magari ridimensionando un po’ gli standard.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P1",
        "P5",
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
        "P5": 1,
        "P11": 1
      },
      "I": {
        "I-P1-Comp": 2,
        "I-P1-Cog": 2,
        "I-P5-Comp": 1,
        "I-P11-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione su giudizio/standard.",
        "E4": "Pressione di consegna."
      },
      "P": {
        "P1": "Standard troppo alti mascherati da ‘qualità’.",
        "P5": "Ritardo come forma di evitamento della consegna.",
        "P11": "Binario: o perfetto o non consegno."
      },
      "I": {
        "I-P1-Comp": "Tagliare requisiti non essenziali e consegnare.",
        "I-P1-Cog": "Definire soglia ‘buono abbastanza’.",
        "I-P5-Comp": "Micro-passo di consegna (invio bozza).",
        "I-P11-Emo": "Aprire a versione intermedia (v1 non perfetta)."
      }
    },
    "tags": [
      "perfezionismo",
      "consegna"
    ],
    "intent": [
      "fare",
      "capire"
    ]
  },
  {
    "id": "S014",
    "title": "Conflitto: ho ragione e basta",
    "client_text": "Quando discuto mi sento certo. Se l’altro insiste mi sale fastidio. Vorrei capire cosa mi fa reagire così e restare più aperto nel confronto.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P12",
        "P11",
        "P4"
      ]
    },
    "answer_key": {
      "E": {
        "E5": 2,
        "E1": 1
      },
      "P": {
        "P12": 2,
        "P11": 1,
        "P4": 1
      },
      "I": {
        "I-P12-Cog": 2,
        "I-P12-Emo": 2,
        "I-P11-Emo": 1,
        "I-P4-Comp": 1
      }
    },
    "why": {
      "E": {
        "E5": "Fastidio/irritazione in contraddizione.",
        "E1": "Tensione nel perdere posizione."
      },
      "P": {
        "P12": "Ricerca di conferma e chiusura ad alternative.",
        "P11": "Rigidità della posizione.",
        "P4": "Confine comunicativo: come discutiamo senza schiacciare."
      },
      "I": {
        "I-P12-Cog": "Cercare contro-evidenza credibile.",
        "I-P12-Emo": "Ammettere per un attimo la possibilità alternativa.",
        "I-P11-Emo": "Aprire una via di mezzo (non vittoria/sconfitta).",
        "I-P4-Comp": "Regola operativa: pausa/turni/obiettivo del dialogo."
      }
    },
    "tags": [
      "conflitto",
      "bias_conferma"
    ],
    "intent": [
      "capire",
      "allinearsi"
    ]
  },
  {
    "id": "S015",
    "title": "Mi adeguo ai superiori e poi mi lamento",
    "client_text": "Con il capo dico sempre sì, poi mi lamento. Vorrei riuscire a dire la mia, ma anche sentirmi legittimato nel farlo.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P10",
        "P4",
        "P5",
        "P6"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 1,
        "E4": 1,
        "E6": 1,
        "E2": 1
      },
      "P": {
        "P10": 2,
        "P4": 2,
        "P5": 1,
        "P6": 1
      },
      "I": {
        "I-P10-Comp": 2,
        "I-P10-Cog": 2,
        "I-P4-Comp": 1,
        "I-P4-Emo": 1,
        "I-P5-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione nel dire la propria.",
        "E4": "Pressione gerarchica.",
        "E6": "Svuotamento dopo adattamento.",
        "E2": "Allarme nel rischio di conflitto."
      },
      "P": {
        "P10": "Conformità al giudizio esterno del capo.",
        "P4": "Confini non espressi con chiarezza.",
        "P5": "Evitamento della conversazione difficile.",
        "P6": "Ruminazione dopo (lamentele/loop)."
      },
      "I": {
        "I-P10-Comp": "Fare una scelta/affermazione senza chiedere conferma.",
        "I-P10-Cog": "Distinguere valore interno/esterno prima di rispondere.",
        "I-P4-Comp": "Formula di confine operativo (richiesta/limite).",
        "I-P4-Emo": "Dignità come base del confine.",
        "I-P5-Emo": "Consentire un primo passo senza sicurezza."
      }
    },
    "tags": [
      "lavoro",
      "conformità",
      "confini"
    ],
    "intent": [
      "fare",
      "allinearsi"
    ]
  },
  {
    "id": "S016",
    "title": "Mi convinco con razionalizzazioni",
    "client_text": "So che non mi fa bene, però mi convinco che stavolta è diverso. Se riuscissi a guardare davvero i fatti e poi provare qualcosa di diverso…",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P12",
        "P8",
        "P6"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 1,
        "E5": 1
      },
      "P": {
        "P12": 2,
        "P6": 1,
        "P8": 1
      },
      "I": {
        "I-P12-Cog": 2,
        "I-P12-Emo": 1,
        "I-P12-Comp": 1,
        "I-P6-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione quando compare dissonanza.",
        "E5": "Fastidio verso segnali contrari."
      },
      "P": {
        "P12": "Bias di conferma e razionalizzazione.",
        "P6": "Giro mentale a supporto.",
        "P8": "Visione di futuro filtrata: scelgo ciò che ‘voglio’ vedere."
      },
      "I": {
        "I-P12-Cog": "Cercare contro-evidenze e ipotesi opposta.",
        "I-P12-Emo": "Ammettere dubbio per aprire alternative.",
        "I-P12-Comp": "Mini test di realtà che può falsificare.",
        "I-P6-Emo": "Rientrare nel presente quando la mente gira."
      }
    },
    "tags": [
      "razionalizzazione",
      "scelte"
    ],
    "intent": [
      "capire",
      "fare"
    ]
  },
  {
    "id": "S017",
    "title": "Troppo da fare: salto tra cose e concludo poco",
    "client_text": "Inizio mille cose, cambio priorità, rispondo a tutti. La sera non ho concluso nulla. Vorrei proteggere meglio il mio tempo e chiudere almeno una cosa.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P4",
        "P6",
        "P1",
        "P5"
      ]
    },
    "answer_key": {
      "E": {
        "E4": 2,
        "E1": 1
      },
      "P": {
        "P4": 2,
        "P6": 1,
        "P1": 1,
        "P5": 1
      },
      "I": {
        "I-P4-Comp": 2,
        "I-P4-Emo": 1,
        "I-P6-Comp": 1,
        "I-P1-Cog": 1
      }
    },
    "why": {
      "E": {
        "E4": "Sovraccarico e pressione.",
        "E1": "Tensione e urgenza."
      },
      "P": {
        "P4": "Confini con richieste altrui/interrupt non gestiti.",
        "P6": "Salto mentale continuo alimenta dispersione.",
        "P1": "Standard eccessivi su ‘devo fare tutto bene’.",
        "P5": "Evitamento del compito importante via micro-task."
      },
      "I": {
        "I-P4-Comp": "Confine operativo: blocchi, no, priorità visibile.",
        "I-P4-Emo": "Dignità nel proteggere tempo/energia.",
        "I-P6-Comp": "Reset: una cosa alla volta.",
        "I-P1-Cog": "Buono abbastanza per chiudere."
      }
    },
    "tags": [
      "produttività",
      "sovraccarico"
    ],
    "intent": [
      "fare",
      "capire"
    ]
  },
  {
    "id": "S018",
    "title": "Scelta importante: cerco la scelta ‘giusta’",
    "client_text": "Devo scegliere tra due opzioni e cerco la scelta perfetta. Mi servirebbe capire cosa pesa davvero e poi decidere.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P1",
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
        "P12": 2,
        "P1": 1,
        "P6": 1,
        "P11": 1
      },
      "I": {
        "I-P12-Cog": 2,
        "I-P12-Emo": 1,
        "I-P1-Cog": 1,
        "I-P6-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Preoccupazione e indecisione.",
        "E4": "Pressione della scelta."
      },
      "P": {
        "P12": "Cerco conferme della ‘scelta giusta’, scarto alternative.",
        "P1": "Standard eccessivo sulla scelta.",
        "P6": "Overthinking.",
        "P11": "Rigidità sulla perfezione."
      },
      "I": {
        "I-P12-Cog": "Contro-evidenze e ipotesi opposta.",
        "I-P12-Emo": "Ammettere dubbio per aprire alternative.",
        "I-P1-Cog": "Soglia ‘buono abbastanza’.",
        "I-P6-Emo": "Rientrare nel presente per decidere."
      }
    },
    "tags": [
      "decisione",
      "perfezione"
    ],
    "intent": [
      "capire",
      "fare"
    ]
  },
  {
    "id": "S019",
    "title": "Dopo un errore, mi chiudo e non riprovo",
    "client_text": "Ho fatto un errore e ora mi sento stupido. Evito di riprovarci. In realtà vorrei rimettermi in movimento, senza continuare a giudicarmi.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P5",
        "P6",
        "P9"
      ]
    },
    "answer_key": {
      "E": {
        "E3": 1,
        "E1": 1,
        "E6": 1,
        "E2": 1
      },
      "P": {
        "P5": 2,
        "P6": 1,
        "P9": 1
      },
      "I": {
        "I-P5-Comp": 2,
        "I-P5-Emo": 2,
        "I-P6-Emo": 1,
        "I-P9-Emo": 1,
        "I-P5-Cog": 1
      }
    },
    "why": {
      "E": {
        "E3": "Frustrazione dopo errore.",
        "E1": "Tensione nel riprovare.",
        "E6": "Ritiro/spento.",
        "E2": "Allarme nel riprovare dopo l’errore (timore di ripetere lo sbaglio)."
      },
      "P": {
        "P5": "Evitamento del tentativo successivo.",
        "P6": "Ruminazione sull’errore.",
        "P9": "Giudizio su valore/merito (‘sono stupido’)."
      },
      "I": {
        "I-P5-Comp": "Micro-riprova controllata.",
        "I-P5-Emo": "Consentire il ritorno all’azione anche senza fiducia.",
        "I-P6-Emo": "Rientrare nel presente.",
        "I-P9-Emo": "Notare emozione senza giudizio.",
        "I-P5-Cog": "Rendere l’avvio più semplice: chiarire il prossimo micro-passo e ridurre l’attrito mentale."
      }
    },
    "tags": [
      "errore",
      "ritiro"
    ],
    "intent": [
      "fare",
      "allinearsi"
    ]
  },
  {
    "id": "S020",
    "title": "Tirato tra due lealtà",
    "client_text": "Sono tirato tra quello che voglio io e quello che si aspettano gli altri. Vorrei capire cosa è davvero mio e sentirmi più allineato nel scegliere.",
    "difficulty": "middle",
    "subset": {
      "P": [
        "P10",
        "P4",
        "P6"
      ]
    },
    "answer_key": {
      "E": {
        "E1": 1,
        "E4": 1,
        "E2": 1
      },
      "P": {
        "P10": 2,
        "P4": 1,
        "P6": 1
      },
      "I": {
        "I-P10-Cog": 2,
        "I-P10-Emo": 2,
        "I-P10-Comp": 1,
        "I-P4-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione tra criteri di valore.",
        "E4": "Pressione dell’aspettativa.",
        "E2": "Allarme sul rischio di deludere."
      },
      "P": {
        "P10": "Valore spostato all’esterno (aspettative).",
        "P4": "Confini/ruoli da ridefinire.",
        "P6": "Loop mentale ‘se faccio X allora…’."
      },
      "I": {
        "I-P10-Cog": "Distinguere sorgente del valore interna vs esterna.",
        "I-P10-Emo": "Verificare congruenza interna (‘ok per me’).",
        "I-P10-Comp": "Autorizzarsi a un’azione autonoma.",
        "I-P4-Emo": "Dignità nel proteggere scelta personale."
      }
    },
    "tags": [
      "famiglia",
      "aspettative"
    ],
    "intent": [
      "capire",
      "allinearsi"
    ]
  },
  {
    "id": "S021",
    "title": "Promozione: entusiasmo e paura insieme",
    "client_text": "Mi hanno proposto una promozione. Una parte di me è contenta, un’altra pensa subito: “non sono all’altezza, mi sgamano”. Continuo a rimuginare e a fare scenari. Vorrei capire quali criteri contano davvero per decidere… e poi dare una risposta chiara entro domani.",
    "subset": {
      "P": ["P6", "P9", "P10"]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E2": 1,
        "E4": 1
      },
      "P": {
        "P6": 2,
        "P9": 1,
        "P10": 1
      },
      "I": {
        "I-P6-Cog": 2,
        "I-P6-Comp": 2,
        "I-P9-Emo": 1,
        "I-P10-Cog": 1
      }
    },
    "why": {
      "E": {
        "E1": "Preoccupazione e pensieri che girano sulla scelta.",
        "E2": "Allarme/ritiro sul rischio di fallire o essere scoperto.",
        "E4": "Pressione della scadenza (entro domani)."
      },
      "P": {
        "P6": "Ruminazione e scenari impediscono la decisione.",
        "P9": "Etichetta personale (“non sono all’altezza”) colora la valutazione.",
        "P10": "Valore spostato all’esterno (giudizio/approvazione)."
      },
      "I": {
        "I-P6-Cog": "Valutare utilità dei pensieri e scegliere cosa tenere vs lasciare.",
        "I-P6-Comp": "Interrompere il loop con un gesto semplice che porta alla risposta.",
        "I-P9-Emo": "Notare l’emozione senza giudizio e senza identificarvisi.",
        "I-P10-Cog": "Distinguere valore interno vs valore esterno per decidere con più autonomia."
      }
    },
    "tags": ["lavoro", "decisione", "promozione"],
    "difficulty": "middle",
    "intent": ["capire", "fare"]
  },
  {
    "id": "S022",
    "title": "Discussione in coppia: o cedo o attacco",
    "client_text": "Quando discutiamo, dopo un po’ mi irrigidisco: o cedo per farla finita oppure attacco per avere ragione. Poi mi pento. Vorrei restare più centrato e capire cosa mi fa scattare… e riuscire a dire una cosa chiara senza finire nel solito schema.",
    "subset": {
      "P": ["P11", "P4", "P12"]
    },
    "answer_key": {
      "E": {
        "E5": 2,
        "E1": 1,
        "E4": 1
      },
      "P": {
        "P11": 2,
        "P4": 1,
        "P12": 1
      },
      "I": {
        "I-P11-Emo": 2,
        "I-P4-Comp": 1,
        "I-P12-Emo": 1
      }
    },
    "why": {
      "E": {
        "E5": "Fastidio/irritazione durante il conflitto.",
        "E1": "Tensione nel confronto e nel perdere posizione.",
        "E4": "Pressione emotiva che spinge al “tutto o niente”."
      },
      "P": {
        "P11": "Polarizzazione: o cedo o attacco.",
        "P4": "Confine comunicativo da esplicitare (cosa accetto / cosa chiedo).",
        "P12": "Chiusura ad alternative: cerco solo di confermare la mia posizione."
      },
      "I": {
        "I-P11-Emo": "Aprire spazio intermedio tra i poli (non tutto-o-niente).",
        "I-P4-Comp": "Mettere un confine operativo (no/limite/richiesta) in modo pratico e chiaro.",
        "I-P12-Emo": "Ammettere il dubbio per restare aperti a alternative credibili."
      }
    },
    "tags": ["coppia", "conflitto", "comunicazione"],
    "difficulty": "middle",
    "intent": ["allinearsi", "capire"]
  },
  {
    "id": "S023",
    "title": "Ricado nel vizio e poi mi racconto storie",
    "client_text": "So che mi fa male, però quando sono stanco mi dico: “solo stavolta, me lo merito”. Poi il giorno dopo mi giudico e rimando di nuovo. Vorrei smettere di raccontarmela e fare un cambiamento piccolo ma reale già questa settimana.",
    "subset": {
      "P": ["P12", "P5", "P9"]
    },
    "answer_key": {
      "E": {
        "E6": 1,
        "E1": 1,
        "E3": 1,
        "E4": 1
      },
      "P": {
        "P12": 2,
        "P5": 1,
        "P9": 1
      },
      "I": {
        "I-P12-Comp": 2,
        "I-P5-Comp": 1,
        "I-P9-Emo": 1
      }
    },
    "why": {
      "E": {
        "E6": "Stanchezza/svuotamento che abbassa la soglia.",
        "E1": "Tensione quando compare dissonanza tra ‘so’ e ‘faccio’.",
        "E3": "Frustrazione e giudizio il giorno dopo.",
        "E4": "Pressione del “devo cambiare” che può bloccare."
      },
      "P": {
        "P12": "Razionalizzazioni e selezione di prove a favore del ‘solo stavolta’.",
        "P5": "Rimando e inerzia dopo la ricaduta.",
        "P9": "Auto-etichetta e giudizio (“mi giudico”)."
      },
      "I": {
        "I-P12-Comp": "Fare un mini test/esperimento che può smentire l’ipotesi dominante.",
        "I-P5-Comp": "Definire una micro-azione immediata e verificabile per rompere l’inerzia.",
        "I-P9-Emo": "Notare l’emozione senza giudizio e senza identificarvisi."
      }
    },
    "tags": ["abitudini", "ricaduta", "autocontrollo"],
    "difficulty": "middle",
    "intent": ["fare"]
  },
  {
    "id": "S024",
    "title": "Restare o mollare tutto",
    "client_text": "Sono esausto. Da mesi penso di mollare questo progetto, ma ogni volta mi dico che sarebbe una fuga. Poi resto… e mi svuoto ancora di più. Vorrei capire se sto resistendo per valore o per paura, e riuscire a fare una scelta che sia davvero mia.",
    "subset": {
      "P": ["P10", "P6", "P5"]
    },
    "answer_key": {
      "E": {
        "E6": 2,
        "E1": 1,
        "E2": 1
      },
      "P": {
        "P10": 2,
        "P6": 1,
        "P5": 1
      },
      "I": {
        "I-P10-Cog": 2,
        "I-P10-Emo": 1,
        "I-P6-Emo": 1,
        "I-P5-Comp": 1
      }
    },
    "why": {
      "E": {
        "E6": "Svuotamento dopo mesi di resistenza.",
        "E1": "Tensione nel decidere.",
        "E2": "Allarme sull’idea di mollare."
      },
      "P": {
        "P10": "Valore spostato all’esterno (fuga vs dovere).",
        "P6": "Loop mentale tra restare e mollare.",
        "P5": "Inerzia nel non scegliere."
      },
      "I": {
        "I-P10-Cog": "Distinguere valore interno vs valore esterno per chiarire la scelta.",
        "I-P10-Emo": "Verificare congruenza interna: cosa è davvero ok per me.",
        "I-P6-Emo": "Rientrare nel presente quando la mente gira.",
        "I-P5-Comp": "Fare un micro-passo concreto verso una delle due direzioni."
      }
    },
    "tags": ["scelta", "stanchezza", "valori"],
    "difficulty": "hard",
    "intent": ["capire", "allinearsi"]
  },
  {
    "id": "S025",
    "title": "Leader sotto pressione",
    "client_text": "Tutti si aspettano che io tenga la barra dritta, ma dentro sono in dubbio. Se mostro incertezza perdo autorevolezza, se tiro dritto rischio di fare una scelta sbagliata. Vorrei restare centrato e prendere una decisione chiara, senza farmi guidare solo dall’immagine.",
    "subset": {
      "P": ["P10", "P11", "P12"]
    },
    "answer_key": {
      "E": {
        "E1": 2,
        "E4": 1,
        "E2": 1
      },
      "P": {
        "P10": 2,
        "P11": 1,
        "P12": 1
      },
      "I": {
        "I-P10-Emo": 2,
        "I-P10-Cog": 1,
        "I-P11-Emo": 1,
        "I-P12-Cog": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione nel ruolo.",
        "E4": "Pressione delle aspettative.",
        "E2": "Allarme nel rischio di perdere posizione."
      },
      "P": {
        "P10": "Identità legata allo sguardo degli altri.",
        "P11": "Rigidità: forte o debole.",
        "P12": "Ricerca di prove a sostegno della propria immagine."
      },
      "I": {
        "I-P10-Emo": "Verificare congruenza interna prima di agire.",
        "I-P10-Cog": "Separare valore personale da ruolo/immagine.",
        "I-P11-Emo": "Aprire uno spazio intermedio tra sicurezza e dubbio.",
        "I-P12-Cog": "Cercare contro-evidenze alla narrativa dominante."
      }
    },
    "tags": ["leadership", "ruolo", "decisione"],
    "difficulty": "hard",
    "intent": ["allinearsi", "capire"]
  },
  {
    "id": "S026",
    "title": "Relazione che non funziona più",
    "client_text": "So che questa relazione non mi nutre più, ma ogni volta che penso di chiudere mi sento in colpa. Razionalizzo, rimando, poi resto e mi spengo. Vorrei smettere di raccontarmela e fare un passo vero, senza farmi guidare solo dalla paura di ferire.",
    "subset": {
      "P": ["P12", "P5", "P9"]
    },
    "answer_key": {
      "E": {
        "E2": 1,
        "E6": 1,
        "E1": 1,
        "E3": 1
      },
      "P": {
        "P12": 2,
        "P5": 1,
        "P9": 1
      },
      "I": {
        "I-P12-Comp": 2,
        "I-P5-Comp": 1,
        "I-P9-Emo": 1
      }
    },
    "why": {
      "E": {
        "E2": "Allarme sul ferire l’altro.",
        "E6": "Svuotamento nel restare.",
        "E1": "Tensione sul passo da fare.",
        "E3": "Frustrazione verso se stessi."
      },
      "P": {
        "P12": "Razionalizzazioni che tengono fermo.",
        "P5": "Rimando della scelta.",
        "P9": "Giudizio personale (‘sono egoista’)."
      },
      "I": {
        "I-P12-Comp": "Fare un mini test/azione che rompe la narrativa attuale.",
        "I-P5-Comp": "Micro-passo reale verso il cambiamento.",
        "I-P9-Emo": "Notare il giudizio senza identificarvisi."
      }
    },
    "tags": ["relazione", "colpa", "scelta"],
    "difficulty": "hard",
    "intent": ["fare"]
  },
  {
    "id": "S027",
    "title": "Sempre disponibile",
    "client_text": "Ricevo messaggi a tutte le ore e rispondo quasi sempre subito. Poi mi accorgo che la mia giornata è un continuo interrompersi. Dentro sbuffo, ma continuo a esserci. Mi dico che è normale, che è il mio ruolo. Alla sera sono esausto. Vorrei sentirmi più centrato senza dover sparire dal mondo.",
    "subset": {
      "P": ["P10", "P4", "P11"]
    },
    "answer_key": {
      "E": { "E4": 2, "E6": 1, "E3": 1 },
      "P": { "P10": 2, "P4": 1, "P11": 1 },
      "I": {
        "I-P10-Emo": 2,
        "I-P4-Comp": 1,
        "I-P11-Emo": 1
      }
    },
    "why": {
      "E": {
        "E4": "Pressione costante delle richieste.",
        "E6": "Svuotamento a fine giornata.",
        "E3": "Fastidio per le continue interruzioni."
      },
      "P": {
        "P10": "Adattamento continuo agli altri.",
        "P4": "Confini poco espliciti.",
        "P11": "Oscillazione tra disponibilità e chiusura."
      },
      "I": {
        "I-P10-Emo": "Verificare cosa è davvero ok per me.",
        "I-P4-Comp": "Mettere un confine operativo concreto.",
        "I-P11-Emo": "Aprire spazio tra i poli."
      }
    },
    "tags": ["confini", "lavoro", "disponibilità"],
    "difficulty": "middle",
    "intent": ["allinearsi"]
  },
  {
    "id": "S028",
    "title": "So cosa fare, ma non parto",
    "client_text": "Ho chiaro cosa dovrei fare per migliorare la situazione, eppure continuo a rimandare. Ogni tanto ci penso, faccio un piano mentale, poi passa la giornata. Mi sento stupido per questo. Vorrei riuscire a fare almeno un primo passo.",
    "subset": {
      "P": ["P5", "P6", "P9"]
    },
    "answer_key": {
      "E": { "E1": 1, "E3": 1, "E6": 1, "E4": 1 },
      "P": { "P5": 2, "P6": 1, "P9": 1 },
      "I": {
        "I-P5-Comp": 2,
        "I-P5-Emo": 1,
        "I-P9-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione nel rimandare.",
        "E3": "Fastidio verso se stesso.",
        "E6": "Energia bassa.",
        "E4": "Pressione del ‘dovrei’."
      },
      "P": {
        "P5": "Inerzia operativa.",
        "P6": "Pensiero che gira.",
        "P9": "Giudizio personale."
      },
      "I": {
        "I-P5-Comp": "Micro-azione immediata.",
        "I-P5-Emo": "Permesso di partire anche senza slancio.",
        "I-P9-Emo": "Notare il giudizio senza identificarsi."
      }
    },
    "tags": ["procrastinazione", "avvio"],
    "difficulty": "middle",
    "intent": ["fare"]
  },
  {
    "id": "S029",
    "title": "Non so più cosa è mio",
    "client_text": "Mi trovo spesso a fare scelte che sembrano giuste, ma dentro qualcosa non torna. Poi mi metto a pensarci sopra, confronto mille opzioni e alla fine resto fermo. Ho paura di deludere qualcuno. Vorrei capire cosa conta davvero per me.",
    "subset": {
      "P": ["P10", "P6", "P12"]
    },
    "answer_key": {
      "E": { "E1": 2, "E2": 1, "E4": 1 },
      "P": { "P10": 2, "P6": 1, "P12": 1 },
      "I": {
        "I-P10-Cog": 2,
        "I-P10-Emo": 1,
        "I-P6-Emo": 1,
        "I-P12-Cog": 1
      }
    },
    "why": {
      "E": {
        "E1": "Agitazione nel decidere.",
        "E2": "Timore di deludere.",
        "E4": "Pressione interna."
      },
      "P": {
        "P10": "Valore spostato sugli altri.",
        "P6": "Loop mentale.",
        "P12": "Razionalizzazione."
      },
      "I": {
        "I-P10-Cog": "Separare valore interno ed esterno.",
        "I-P10-Emo": "Rientrare in congruenza.",
        "I-P6-Emo": "Interrompere il loop.",
        "I-P12-Cog": "Cercare contro-evidenze."
      }
    },
    "tags": ["decisione", "identità"],
    "difficulty": "hard",
    "intent": ["capire", "allinearsi"]
  },
  {
    "id": "S030",
    "title": "O perfetto o niente",
    "client_text": "Quando devo presentare qualcosa, continuo a rifinirla. Trovo sempre un dettaglio da migliorare. Alla fine o consegno in ritardo o mollo. Dentro mi dico che se non è fatta bene non vale. Vorrei riuscire a chiudere senza distruggermi.",
    "subset": {
      "P": ["P1", "P11", "P9"]
    },
    "answer_key": {
      "E": { "E1": 1, "E3": 1, "E4": 1, "E6": 1 },
      "P": { "P1": 2, "P11": 1, "P9": 1 },
      "I": {
        "I-P1-Cog": 2,
        "I-P1-Comp": 1,
        "I-P11-Emo": 1,
        "I-P9-Emo": 1
      }
    },
    "why": {
      "E": {
        "E1": "Tensione sulla consegna.",
        "E3": "Frustrazione.",
        "E4": "Pressione del risultato.",
        "E6": "Sfinimento."
      },
      "P": {
        "P1": "Standard troppo alto.",
        "P11": "Polarità perfetto/niente.",
        "P9": "Valore personale legato all’esito."
      },
      "I": {
        "I-P1-Cog": "Ridefinire il ‘sufficiente’.",
        "I-P1-Comp": "Chiudere una versione utile.",
        "I-P11-Emo": "Aprire spazio intermedio.",
        "I-P9-Emo": "Separare valore e risultato."
      }
    },
    "tags": ["perfezionismo"],
    "difficulty": "hard",
    "intent": ["fare"]
  },
  {
    "id": "S031",
    "title": "Mi racconto che va bene così",
    "client_text": "Ci sono cose che so non mi fanno bene, ma mi dico che è solo un periodo. Poi passa tempo e sono ancora lì. Ogni tanto mi arrabbio con me stesso, poi lascio perdere. Vorrei smettere di raccontarmela e muovermi davvero.",
    "subset": {
      "P": ["P12", "P5", "P9"]
    },
    "answer_key": {
      "E": { "E3": 1, "E6": 1, "E1": 1, "E4": 1 },
      "P": { "P12": 2, "P5": 1, "P9": 1 },
      "I": {
        "I-P12-Comp": 2,
        "I-P5-Comp": 1,
        "I-P9-Emo": 1
      }
    },
    "why": {
      "E": {
        "E3": "Fastidio verso se stesso.",
        "E6": "Stanchezza.",
        "E1": "Tensione.",
        "E4": "Pressione del cambiamento."
      },
      "P": {
        "P12": "Razionalizzazione.",
        "P5": "Inerzia.",
        "P9": "Giudizio personale."
      },
      "I": {
        "I-P12-Comp": "Mini-azione che rompe la narrativa.",
        "I-P5-Comp": "Primo passo concreto.",
        "I-P9-Emo": "Notare il giudizio senza identificarvisi."
      }
    },
    "tags": ["abitudini", "cambiamento"],
    "difficulty": "hard",
    "intent": ["fare"]
  }
];
