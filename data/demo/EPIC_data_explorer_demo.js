var EPIC_DATA = {
  "E": [
    {
      "id": "E1",
      "label": "Ansia",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "agitazione",
            "tensione",
            "preoccupazione",
            "nodo allo stomaco"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Prestazionale",
            "Relazionale",
            "Anticipatoria"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "attivazione alta",
            "focus sul futuro → scenari negativi",
            "spinta a preparare molto"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "energia bassa → possibile E6",
            "nessuna anticipazione → possibile E2/P7"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P1",
            "P6"
          ],
          "medium": [
            "P2"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "red_flags": {
          "_label": "Red flags",
          "items": [
            "assenza di attivazione",
            "apatia marcata",
            "indifferenza",
            "assenza di focus sul futuro"
          ]
        },
        "hint": "attivazione alta + futuro → guarda P7",
        "porta_I": "I-P6-Emo"
      }
    },
    {
      "id": "E2",
      "label": "Paura",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "evitamento",
            "blocco",
            "allarme interno",
            "mi tiro indietro"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Esposizione",
            "Incertezza",
            "Conseguenze"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "orientamento alla minaccia",
            "evitamento forte"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "assenza di minaccia percepita → possibile E1",
            "autocritica focalizzata su sé → possibile P9"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P2",
            "P5",
            "P7"
          ],
          "medium": []
        }
      },
      "retro": {
        "_label": "Retro",
        "red_flags": {
          "_label": "Red flags",
          "items": [
            "assenza minaccia",
            "confusione diffusa",
            "apatia profonda",
            "ritiro totale"
          ]
        },
        "hint": "evitamento specifico → guarda P7",
        "porta_I": "I-P5-Emo"
      }
    }
  ],
  "P": [
    {
      "id": "P1",
      "label": "Perfezione",
      "hint_leva": "E1:Emo,E4:Comp",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "standard impossibili",
            "bisogno di controllo",
            "mai-abbastanza"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "0/100 → probabile P11"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Non è mai abbastanza",
            "Non è ancora pronto",
            "Mi manca qualcosa"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "standard irrealistici",
            "autocritica costante",
            "paura errore",
            "iper-preparazione"
          ]
        },
        "hint": "definisci 'abbastanza buono'",
        "porta_I": "I-P1-Cog",
        "why": "Blocca l’azione perché nulla sembra abbastanza buono."
      }
    },
    {
      "id": "P2",
      "label": "Sfiducia",
      "hint_leva": "E2:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "bassa autoefficacia",
            "autosvalutazione",
            "senso di inadeguatezza"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "timore di perdere → probabile P7"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Mi sento incapace",
            "Non io",
            "Cosa ho io da dare?"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "sfiducia nelle risorse",
            "minimizzazione successi",
            "auto-svalutazione",
            "dipendenza guida"
          ]
        },
        "hint": "mostra evidenza che già puoi",
        "porta_I": "I-P2-Cog",
        "why": "Riduce l’iniziativa e aumenta dipendenza da conferme esterne."
      }
    },
    {
      "id": "P5",
      "label": "Evitamento",
      "hint_leva": "E2:Emo,E6:Comp",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "status quo",
            "procrastinazione",
            "blocco decisionale"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "non fai per rischio perdita → P7"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Non adesso",
            "Ci penso",
            "Vediamo"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "procrastinazione",
            "congelamento",
            "minimizzazione rischio"
          ]
        },
        "hint": "micro → aggancio",
        "porta_I": "I-P5-Comp",
        "why": "Protegge dal rischio ma blocca crescita e cambiamento."
      }
    },
    {
      "id": "P6",
      "label": "Rimuginazione",
      "hint_leva": "E1:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "rimuginio cognitivo",
            "overthinking",
            "iper-analisi"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "tema merito/vergogna → P9"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Ci devo pensare ancora",
            "Devo capirlo bene",
            "Non sono sicuro"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "loop analitici",
            "iper-analisi",
            "blocco decisionale"
          ]
        },
        "hint": "separa: pensiero → evento mentale",
        "porta_I": "I-P6-Emo",
        "why": "Consuma energia e impedisce scelte utili."
      }
    },
    {
      "id": "P7",
      "label": "Perdita",
      "hint_leva": "E2:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "loss aversion",
            "sovraprotezione",
            "prudenza eccessiva"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "incapace → P2"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "E se poi va male?",
            "Non voglio rischiare"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "prudenza eccessiva",
            "focalizzazione perdita"
          ]
        },
        "hint": "micro-test reversibile",
        "porta_I": "I-P7-Comp",
        "why": "Mantiene abitudini sicure e frena opportunità."
      }
    }
  ],
  "I": [
    {
      "id": "I-P1-Cog",
      "label": "Scegliere il “buono abbastanza”",
      "type": "cognitive",
      "pattern": "P1",
      "fronte": {
        "principle": "Esplorare il minimo accettabile e sostenibile.",
        "why": "Aiuta a ridurre rigidità e pressione interna.",
        "serve_a": "definire uno standard minimo praticabile",
        "verbo_mentale": "RIDIMENSIONARE",
        "how_to": "definisci il requisito minimo utile → scegli l’opzione che lo soddisfa."
      },
      "retro": {
        "aka": [
          "standard sostenibili",
          "qualità sufficiente"
        ],
        "example_q": "Qual è un risultato “abbastanza buono” per te qui?",
        "example_C": "Scegli uno standard “abbastanza buono” da applicare a un compito reale.",
        "fallback": "Reframing: perfezione → “abbastanza bene”",
        "tags": [
          "perfezionismo",
          "standard",
          "soglia"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P1-Comp",
      "label": "Riduci il costo della perfezione",
      "type": "behavioral",
      "pattern": "P1",
      "fronte": {
        "principle": "Ridurre lo standard per agire.",
        "why": "Permette di procedere con risorse realistiche.",
        "serve_a": "ridurre sprechi nel perseguire la perfezione",
        "verbo_mentale": "ALLEGGERIRE",
        "how_to": "elenca cosa serve per farlo “perfetto” → tieni solo ciò che crea valore e agisci."
      },
      "retro": {
        "aka": [
          "semplificare",
          "delegare"
        ],
        "example_q": "Dove il 100% ti sta rallentando inutilmente?",
        "example_C": "Togli un singolo requisito non essenziale.",
        "fallback": "Come puoi rendere questo passo più leggero, ora?",
        "tags": [
          "micro_azione",
          "standard_minimo"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P1-Emo",
      "label": "Disaccoppiare la scelta dalla tensione",
      "type": "emotional",
      "pattern": "P1",
      "fronte": {
        "principle": "La tensione segnala uno standard interno attivo, non un divieto di agire.",
        "why": "Permette di scegliere senza aspettare che la tensione sparisca.",
        "serve_a": "ridurre la pressione interna quel tanto che basta per poter scegliere",
        "verbo_mentale": "DISACCOPPIARE",
        "how_to": "riconosci la tensione legata allo “standard ideale” e concediti di non doverla risolvere ora"
      },
      "retro": {
        "aka": [
          "tensione ≠ criterio",
          "scelta valida",
          "pressione interna"
        ],
        "example_q": "Se la tensione resta, quale scelta rimane comunque valida per te?",
        "example_C": "Nota la sensazione di “non è abbastanza” e fai comunque il passo minimo previsto",
        "fallback": "Fai un respiro lento e scegli comunque un micro-passo.",
        "tags": [
          "perfezionismo",
          "pressione",
          "scelta"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P2-Cog",
      "label": "Riconoscere competenze già dimostrate",
      "type": "cognitive",
      "pattern": "P2",
      "fronte": {
        "principle": "Riscoprire competenze già usate con successo.",
        "why": "Evidenzia capacità esistenti, facilitando la scelta.",
        "serve_a": "riconoscere risorse e capacità già presenti",
        "verbo_mentale": "RICONOSCERE CAPACITÀ",
        "how_to": "identifica un risultato già ottenuto → collegalo all’azione imminente come prova."
      },
      "retro": {
        "aka": [
          "riconoscere capacità",
          "mettere a fuoco risorse"
        ],
        "example_q": "Quando hai gestito qualcosa di simile con successo?",
        "example_C": "Riconosci una capacità già usata in situazioni simili e decidi come riattivarla.",
        "fallback": "Quale pezzo puoi riusare subito?",
        "tags": [
          "autoefficacia",
          "risorse"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P2-Comp",
      "label": "Agire subito con un passo semplice",
      "type": "behavioral",
      "pattern": "P2",
      "fronte": {
        "principle": "Scegliere un'azione a basso rischio e alta utilità.",
        "why": "Costruisce autoefficacia tramite prove rapide.",
        "serve_a": "ricostruire auto-efficacia con prove rapide",
        "verbo_mentale": "DIMOSTRARE",
        "how_to": "scegli un micro-passo che puoi fare ora → fallo subito per generare prova."
      },
      "retro": {
        "aka": [
          "prime mosse",
          "prove rapide"
        ],
        "example_q": "Qual è un’azione minima, dimostrativa, che potresti provare ora?",
        "example_C": "Prova una versione ridotta dell’azione che avevi in mente.",
        "fallback": "Come puoi fare un passo ancora più piccolo, adesso?",
        "tags": [
          "autoefficacia",
          "azione"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P2-Emo",
      "label": "Riconoscere momenti di padronanza",
      "type": "emotional",
      "pattern": "P2",
      "fronte": {
        "principle": "I piccoli successi mostrano capacità già presenti.",
        "why": "Richiama esperienze riuscite, riducendo l’incertezza e facilitando l’avvio.",
        "serve_a": "ridurre l’insicurezza richiamando esperienze riuscite",
        "verbo_mentale": "RIATTIVARE",
        "how_to": "ricorda un momento in cui hai gestito qualcosa di simile → nota cosa avevi fatto"
      },
      "retro": {
        "aka": [
          "familiarità",
          "tracce di riuscita"
        ],
        "example_q": "Quando ti sei sentito capace in qualcosa di simile?",
        "example_C": "Identifica un elemento di quel successo che puoi riusare ora",
        "fallback": "Reframing: incapace → capace-abbastanza",
        "tags": [
          "successo_passato",
          "auto_efficacia"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P5-Cog",
      "label": "Valutare il costo di non agire",
      "type": "cognitive",
      "pattern": "P5",
      "fronte": {
        "principle": "Rendere visibili le conseguenze future.",
        "why": "Avvicina il costo di “poi”, facilitando la scelta ora.",
        "serve_a": "rendere evidente il costo della non-azione",
        "verbo_mentale": "VALUTARE CONSEGUENZE",
        "how_to": "considera gli effetti futuri del non agire."
      },
      "retro": {
        "aka": [
          "costo inazione",
          "proiezione nel tempo"
        ],
        "example_q": "Quanto vale quello che stai perdendo?",
        "example_C": "Considera le conseguenze di restare fermi rispetto al tema attuale.",
        "fallback": "Reframing: inazione → costo elevato",
        "tags": [
          "costo_rimando",
          "scelta"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P5-Comp",
      "label": "Rompere il blocco con micro-azione",
      "type": "behavioral",
      "pattern": "P5",
      "fronte": {
        "principle": "Definire un micro-passo sostenibile.",
        "why": "Riduce lo stallo con passi ridicolmente piccoli.",
        "serve_a": "rimuovere blocchi con passi ridicolmente piccoli",
        "verbo_mentale": "SBLOCCARE",
        "how_to": "scegli un’azione minima che puoi fare subito e falla."
      },
      "retro": {
        "aka": [
          "micro-passo",
          "azione minima"
        ],
        "example_q": "Qual è un primo movimento semplice?",
        "example_C": "Definisci il primo passo utile per sciogliere lo stallo.",
        "fallback": "Come puoi rendere il primo passo ancora più semplice?",
        "tags": [
          "evitamento",
          "azione"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P5-Emo",
      "label": "Consentire l’avvio senza slancio",
      "type": "emotional",
      "pattern": "P5",
      "fronte": {
        "principle": "L’azione può iniziare senza motivazione.",
        "why": "Riduce l’attesa di “sentirsi pronti”.",
        "serve_a": "sentire che si può partire anche senza slancio",
        "verbo_mentale": "CONSENTIRE",
        "how_to": "nota la spinta a rimandare e consenti un primo passo minimo"
      },
      "retro": {
        "aka": [
          "partire senza voglia",
          "permesso interno"
        ],
        "example_q": "Se non servisse sentirti pronto, quale passo faresti ora?",
        "example_C": "Avvia un gesto minimo anche mentre senti resistenza.",
        "fallback": "Reframing: non pronto → posso iniziare",
        "tags": [
          "evitamento",
          "avvio",
          "permesso"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P6-Cog",
      "label": "Distinguere pensieri utili da rumore",
      "type": "cognitive",
      "pattern": "P6",
      "fronte": {
        "principle": "Valutare l'utilità reale del pensiero.",
        "why": "Riduce il rumore e allenta la presa del pensiero ripetitivo.",
        "serve_a": "distinguere pensiero utile da rumore",
        "verbo_mentale": "VALUTARE UTILITÀ",
        "how_to": "chiediti se il pensiero ti è utile per la scelta attuale."
      },
      "retro": {
        "aka": [
          "distinguere utile",
          "disinnescare rumore"
        ],
        "example_q": "Se ti vedessi da fuori, cosa penseresti di questa preoccupazione?",
        "example_C": "Se ti vedessi da fuori, cosa ti diresti di fare ora?",
        "fallback": "Reframing: pensiero → evento mentale",
        "tags": [
          "ruminazione",
          "distanza_cognitiva"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P6-Comp",
      "label": "Interrompere il loop con il corpo",
      "type": "behavioral",
      "pattern": "P6",
      "fronte": {
        "principle": "Interrompere tramite il corpo.",
        "why": "Riporta al presente, riducendo rumore mentale e aprendo spazio decisionale.",
        "serve_a": "interrompere il loop cognitivo e tornare al presente",
        "verbo_mentale": "INTERROMPERE",
        "how_to": "fai un gesto fisico semplice (respiro, movimento) per spezzare il loop."
      },
      "retro": {
        "aka": [
          "pausa corporea",
          "radicamento"
        ],
        "example_q": "Cosa potrebbe aiutare il tuo corpo a tornare presente?",
        "example_C": "Usa un gesto o respiro per riportare presenza quando serve.",
        "fallback": "Come puoi usare il corpo per tornare presente, ora?",
        "tags": [
          "ruminazione",
          "presenza"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P6-Emo",
      "label": "Accorgersi della presenza",
      "type": "emotional",
      "pattern": "P6",
      "fronte": {
        "principle": "Accorgersi del presente interrompe l’identificazione.",
        "why": "Crea spazio dal loop mentale, rendendo possibile la scelta.",
        "serve_a": "creare distanza emotiva dal pensiero",
        "verbo_mentale": "ACCORGERSI",
        "how_to": "nota il loop mentale e senti un punto del corpo"
      },
      "retro": {
        "aka": [
          "esserci",
          "contatto col qui"
        ],
        "example_q": "Dove sei adesso, proprio in questo momento?",
        "example_C": "Nota cosa stai facendo — o non facendo — mentre il pensiero gira.",
        "fallback": "Nota tre cose che vedi ora.",
        "tags": [
          "regolazione_emotiva",
          "presenza"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P7-Cog",
      "label": "Valutare rischi e benefici",
      "type": "cognitive",
      "pattern": "P7",
      "fronte": {
        "principle": "Valutare realisticamente rischi e benefici.",
        "why": "Riporta la percezione da minaccia a rischio valutabile.",
        "serve_a": "valutare realisticamente rischi e benefici",
        "verbo_mentale": "PESARE RISCHI E BENEFICI",
        "how_to": "confronta cosa rischi davvero e cosa puoi invece ottenere"
      },
      "retro": {
        "aka": [
          "valutazione rischio",
          "pro-contro"
        ],
        "example_q": "Qual è il rischio reale?",
        "example_C": "Scrivi un rischio reale e un possibile beneficio concreto.",
        "fallback": "Reframing: perdita → possibilità",
        "tags": [
          "avversione_perdita",
          "valutazione_rischio"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P7-Emo",
      "label": "Contattare ciò che conta davvero",
      "type": "emotional",
      "pattern": "P7",
      "fronte": {
        "principle": "Sentire ciò che conta riduce la paura.",
        "why": "Collega l’emozione a un valore personale.",
        "serve_a": "ricordare ciò che conta",
        "verbo_mentale": "RICONNETTERE",
        "how_to": "collega l’emozione a ciò che potresti ottenere o far crescere."
      },
      "retro": {
        "aka": [
          "valore",
          "scelta",
          "protezione"
        ],
        "example_q": "Per cosa vale la pena provarci?",
        "example_C": "Nomina il valore che rende questa scelta significativa.",
        "fallback": "Reframing: perdita → valore",
        "tags": [
          "valore",
          "priorità"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P7-Comp",
      "label": "Micro-test reversibile",
      "type": "behavioral",
      "pattern": "P7",
      "fronte": {
        "principle": "Stimolare una micro-azione reversibile.",
        "why": "Riduce incertezza e rassicura attraverso feedback reale a basso costo.",
        "serve_a": "testare possibilità riducendo il rischio",
        "verbo_mentale": "SONDARE",
        "how_to": "definisci una prova piccola e reversibile per raccogliere un primo feedback."
      },
      "retro": {
        "aka": [
          "prova minima",
          "esperimento rapido"
        ],
        "example_q": "Qual è una prova piccola e reversibile che puoi fare?",
        "example_C": "Fai una prova ridotta e osserva cosa impari.",
        "fallback": "Come puoi renderlo ancora più piccolo e reversibile?",
        "tags": [
          "micro_prova",
          "rischio_controllato"
        ],
        "note": ""
      }
    }
  ]
};
