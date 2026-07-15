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
            "P9",
            "P4"
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
            "P5"
          ],
          "medium": [
            "P9",
            "P11",
            "P10"
          ]
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
    },
    {
      "id": "E4",
      "label": "Stress / Pressione",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "sovraccarico",
            "sfinimento",
            "pressione",
            "troppo da reggere"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Sovraccarico",
            "Recupero insufficiente",
            "Mancanza di chiarezza"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "troppe cose → nessuna chiara",
            "fatica + difficoltà a scegliere"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "segni fisici significativi / compromissione → valutare sanitario",
            "energia orientata all'esterno → possibile E5"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P4",
            "P1"
          ],
          "medium": [
            "P6",
            "P10"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "red_flags": {
          "_label": "Red flags",
          "items": [
            "assenza sovraccarico",
            "alta energia arrabbiata",
            "trance",
            "immobilità non motivata"
          ]
        },
        "hint": "troppo + poco chiaro → guarda sovraccarico",
        "porta_I": "I-P4-Emo"
      }
    },
    {
      "id": "E5",
      "label": "Rabbia / Irritazione",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "fastidio",
            "risentimento",
            "esplodo dentro",
            "mi sale"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Opposizione/resistenza",
            "Attrito interpersonale",
            "Ostacolo inatteso"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "energia alta",
            "spinta verso l'esterno"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "energia molto bassa → E6",
            "rivolta verso sé → possibile P9"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P4",
            "P12"
          ],
          "medium": [
            "P10",
            "P5"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "red_flags": {
          "_label": "Red flags",
          "items": [
            "energia bassa",
            "tristezza predominante",
            "evitamento passivo",
            "azione inesistente"
          ]
        },
        "hint": "energia alta verso fuori → guarda confine / bisogno",
        "porta_I": "I-P4-Comp"
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
      "id": "P4",
      "label": "Confini",
      "hint_leva": "E5:Emo,E3:Cog",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "compiacenza",
            "accomodamento eccessivo",
            "fusione relazionale"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "vedi cattiva intenzione → probabile P3"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Non riesco a dire no",
            "Mi adatto",
            "Faccio io"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "difficoltà dire no",
            "sovraccarico",
            "paura giudizio",
            "fusione identitaria"
          ]
        },
        "hint": "porta al bisogno → formula richiesta",
        "porta_I": "I-P4-Comp",
        "why": "Porta sovraccarico, risentimento e perdita di identità."
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
      "id": "P9",
      "label": "Impostura",
      "hint_leva": "E2:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "sindrome dell'impostore",
            "percezione di frode",
            "svalutazione competenza"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "pensiero in loop → P6"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Non me lo merito",
            "È stato solo fortuna",
            "Prima o poi mi sgamano"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "attribuzione fortuna",
            "paura di essere smascherato",
            "autosabotaggio"
          ]
        },
        "hint": "riconosci merito → normalizza",
        "porta_I": "I-P9-Cog",
        "why": "Erode sicurezza e visibilità del proprio valore."
      }
    },
    {
      "id": "P10",
      "label": "Conformità",
      "hint_leva": "E6:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "approval seeking",
            "validazione esterna",
            "dipendenza dal giudizio"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "evitare attrito → P4"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Mi serve che piaccia",
            "Dimmi se va bene",
            "Se non va bene?"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "ricerca approvazione",
            "ipersensibilità al giudizio",
            "insicurezza",
            "conformismo relazionale",
            "paura del successo"
          ]
        },
        "hint": "porta al metro interno",
        "porta_I": "I-P10-Cog",
        "why": "Porta a scelte guidate dagli altri, non da ciò che conta per sé."
      }
    },
    {
      "id": "P11",
      "label": "Rigidità",
      "hint_leva": "E6:Comp",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "pensiero tutto-o-niente",
            "polarizzazione",
            "binarismo"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "standard altissimi → P1"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "O così o niente",
            "Se non ho questo non parto nemmeno"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "rigidità binaria",
            "catastrofizzazione",
            "polarizzazione"
          ]
        },
        "hint": "trova la zona grigia",
        "porta_I": "I-P11-Cog",
        "why": "Ostacola progressi graduali."
      }
    },
    {
      "id": "P12",
      "label": "Conferma",
      "hint_leva": "E5:Emo",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "confirmation bias",
            "selezione confermativa",
            "filtro informativo"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "non agisce per paura → P2/P7"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Ho già capito",
            "Lo so già"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "resistenza alla disconferma",
            "visione parziale",
            "filtraggio informativo"
          ]
        },
        "hint": "porta 2a ipotesi",
        "porta_I": "I-P12-Cog",
        "why": "Limita apprendimento e blocca nuove possibilità."
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
      "id": "I-P4-Cog",
      "label": "Proteggere i propri valori chiave",
      "type": "cognitive",
      "pattern": "P4",
      "fronte": {
        "principle": "Riconoscere i costi nascosti protegge ciò che è importante.",
        "why": "Rende esplicite le priorità e i valori, facilitando prese di posizione autonome.",
        "serve_a": "chiarire valori e costi del dire “sì”",
        "verbo_mentale": "SELEZIONARE",
        "how_to": "identifica a cosa diresti “no” per difendere un valore chiave."
      },
      "retro": {
        "aka": [
          "valori guida",
          "priorità interne"
        ],
        "example_q": "Cosa vai a sacrificare quando dici “sì”?",
        "example_C": "Identifica un valore personale a rischio quando dici “sì”.",
        "fallback": "Reframing: No → protettivo",
        "tags": [
          "confini",
          "valori"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P4-Comp",
      "label": "Dire “no” in modo assertivo",
      "type": "behavioral",
      "pattern": "P4",
      "fronte": {
        "principle": "Dire “no” tutela valori e priorità.",
        "why": "Definisce confini chiari, proteggendo ciò che conta senza danneggiare la relazione.",
        "serve_a": "costruire comunicazioni di “no” efficaci",
        "verbo_mentale": "DEFINIRE CONFINI",
        "how_to": "allena formulazione di un “no” rispettoso"
      },
      "retro": {
        "aka": [
          "assertività",
          "negoziare confini"
        ],
        "example_q": "Come puoi dire “no” proteggendo te e la relazione?",
        "example_C": "Prepara una frase di “no” che rispetti te e l’altro.",
        "fallback": "Come puoi esprimere il tuo “no” con chiarezza e rispetto?",
        "tags": [
          "confini",
          "assertività"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P4-Emo",
      "label": "Onorare la propria dignità",
      "type": "emotional",
      "pattern": "P4",
      "fronte": {
        "principle": "La dignità precede l’adattamento.",
        "why": "Fa emergere il confine prima di spiegare.",
        "serve_a": "sentirsi autorizzati ad avere un limite",
        "verbo_mentale": "ONORARE",
        "how_to": "nota cosa stai accettando e chiediti se è ok per te"
      },
      "retro": {
        "aka": [
          "rispetto di sé",
          "limite interno"
        ],
        "example_q": "Questo, così com’è, è davvero ok per te?",
        "example_C": "Fermati un attimo prima di adattarti e verifica se stai rispettando te.",
        "fallback": "Qual è il limite minimo che tieni ora?",
        "tags": [
          "dignità",
          "confini",
          "rispetto_di_sé"
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
      "id": "I-P9-Cog",
      "label": "Riconoscere meriti",
      "type": "cognitive",
      "pattern": "P9",
      "fronte": {
        "principle": "Appropriarsi del proprio contributo ai risultati.",
        "why": "Riduce il dubbio restituendo la paternità ai propri successi.",
        "serve_a": "appropriarsi dei propri meriti",
        "verbo_mentale": "ATTRIBUIRE",
        "how_to": "identifica azioni/decisioni proprie che hanno portato al risultato"
      },
      "retro": {
        "aka": [
          "attribuzione interna",
          "riconoscimento"
        ],
        "example_q": "Quali tue scelte/azioni hanno contribuito a questo risultato?",
        "example_C": "Identifica almeno un’azione concreta che ha prodotto il risultato",
        "fallback": "Reframing: fortuna → competenza",
        "tags": [
          "responsabilità",
          "merito"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P9-Emo",
      "label": "Accogliere l’emozione senza giudizio",
      "type": "emotional",
      "pattern": "P9",
      "fronte": {
        "principle": "L’emozione è un segnale, non un verdetto.",
        "why": "Normalizza l’emozione, riconoscendola, mantenendo accesso alla scelta.",
        "serve_a": "ridurre l’auto-giudizio normalizzando l’emozione",
        "verbo_mentale": "NOTARE EMOZIONE",
        "how_to": "riconosci l’emozione senza giudicarla, poi resta un attimo con essa"
      },
      "retro": {
        "aka": [
          "accettare",
          "funzione"
        ],
        "example_q": "Cosa ti sta proteggendo questa emozione, proprio adesso?",
        "example_C": "Nomina l’emozione e concedile spazio per un attimo.",
        "fallback": "Datti il permesso di sentire questo, poi scegli un passo piccolo.",
        "tags": [
          "vergogna",
          "funzione",
          "accoglienza"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P9-Comp",
      "label": "Esporsi con contributo concreto",
      "type": "behavioral",
      "pattern": "P9",
      "fronte": {
        "principle": "Esporsi con un contributo reale.",
        "why": "Trasforma la paura di “non meritare” in azione.",
        "serve_a": "ridurre l’auto-sabotaggio",
        "verbo_mentale": "ESPORSI",
        "how_to": "condividi un contributo concreto senza giustificarlo o sminuirlo"
      },
      "retro": {
        "aka": [
          "visibilità",
          "presenza attiva"
        ],
        "example_q": "Cosa potresti portare ora, senza spiegarti?",
        "example_C": "Fai una proposta concreta senza premettere scuse o giustificazioni.",
        "fallback": "Reframing: ritiro → presenza attiva",
        "tags": [
          "impostura",
          "azione",
          "visibilità"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P10-Cog",
      "label": "Spostare la sorgente del valore",
      "type": "cognitive",
      "pattern": "P10",
      "fronte": {
        "principle": "Spostare il valore dall’esterno all’interno.",
        "why": "Riorienta il criterio di valore.",
        "serve_a": "chiarire la propria sorgente interna di valore",
        "verbo_mentale": "DISTINGUERE",
        "how_to": "separa ciò che pensi tu da ciò che pensano gli altri e nota la differenza."
      },
      "retro": {
        "aka": [
          "sorgente interna",
          "criteri propri"
        ],
        "example_q": "Qual è il tuo criterio, qui?",
        "example_C": "Definisci almeno un \"criterio interno\" per valutare il risultato dell’azione",
        "fallback": "Reframing: esterno → interno",
        "tags": [
          "valore_interno",
          "identità"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P10-Comp",
      "label": "Autorizzarsi all’azione",
      "type": "behavioral",
      "pattern": "P10",
      "fronte": {
        "principle": "Agire senza conferma rafforza l’autonomia.",
        "why": "Trasforma la dipendenza dal giudizio esterno in scelta attiva.",
        "serve_a": "ridurre la dipendenza dal giudizio esterno attraverso azione autonoma",
        "verbo_mentale": "AUTORIZZARSI",
        "how_to": "fai una scelta concreta senza chiedere conferma"
      },
      "retro": {
        "aka": [
          "iniziativa personale",
          "permesso interno"
        ],
        "example_q": "Se non dovessi chiedere a nessuno, cosa faresti ora?",
        "example_C": "Prendi una piccola decisione senza consultare altri.",
        "fallback": "Reframing: approvazione → iniziativa",
        "tags": [
          "conformità",
          "autonomia",
          "azione"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P10-Emo",
      "label": "Riconnettersi al proprio metro interno",
      "type": "emotional",
      "pattern": "P10",
      "fronte": {
        "principle": "Riconnettersi ai segnali interni.",
        "why": "Rende sicuro affidarsi a sé perché il corpo segnala quando qualcosa è giusto.",
        "serve_a": "riconnettersi ai segnali interni che guidano le scelte",
        "verbo_mentale": "VERIFICARE CONGRUENZA",
        "how_to": "identifica un segnale interno che ti indica “Ok per me”."
      },
      "retro": {
        "aka": [
          "autenticità",
          "fiducia in se stessi"
        ],
        "example_q": "Come ti accorgi nel corpo che qualcosa è davvero ‘a posto’ per te?",
        "example_C": "Nota un segnale fisico che per te significa “ok”.",
        "fallback": "Se segui il tuo sì interno, cosa fai?",
        "tags": [
          "fiducia_interna",
          "autonomia"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P11-Cog",
      "label": "Riconoscere la zona grigia",
      "type": "cognitive",
      "pattern": "P11",
      "fronte": {
        "principle": "Riconoscere progressi parziali.",
        "why": "Apre spazio per apprendere dai progressi.",
        "serve_a": "riconoscere progressi intermedi",
        "verbo_mentale": "SFUMARE",
        "how_to": "trasforma l'obiettivo da binario a scalare (0-100)"
      },
      "retro": {
        "aka": [
          "gradiente",
          "spettro intermedio"
        ],
        "example_q": "Quali risultati intermedi esistono tra il fallimento totale e il successo pieno?",
        "example_C": "Definisci almeno un criterio intermedio che ti dica che stai avanzando.",
        "fallback": "Reframing: giusto/sbagliato → utile/inutile",
        "tags": [
          "tutto_o_niente",
          "zona_grigia"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P11-Comp",
      "label": "Agire nella zona grigia",
      "type": "behavioral",
      "pattern": "P11",
      "fronte": {
        "principle": "Spostare l’azione da “tutto o nulla” a “un passo”.",
        "why": "Abbassa la soglia d’azione, permettendo il movimento anche senza perfezione.",
        "serve_a": "procedere tramite azioni non perfette",
        "verbo_mentale": "PROCEDERE",
        "how_to": "definisci una micro-azione che porti un vantaggio parziale."
      },
      "retro": {
        "aka": [
          "passo non-perfetto",
          "compromesso utile"
        ],
        "example_q": "Qual è un passo piccolo che è comunque meglio di zero?",
        "example_C": "Esegui un’azione minima che crea un avanzamento reale.",
        "fallback": "Qual è un passo utile, anche imperfetto?",
        "tags": [
          "binario",
          "zona_grigia",
          "microazione"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P11-Emo",
      "label": "Aprire uno spazio intermedio",
      "type": "emotional",
      "pattern": "P11",
      "fronte": {
        "principle": "Un minimo di apertura emotiva rende tollerabile un’opzione non estrema.",
        "why": "Riduce la rigidità emotiva davanti all’incertezza.",
        "serve_a": "rendere possibile una via di mezzo",
        "verbo_mentale": "APRIRE",
        "how_to": "nota la rigidità interna e cerca una posizione più morbida"
      },
      "retro": {
        "aka": [
          "apertura",
          "via di mezzo"
        ],
        "example_q": "Quale via di mezzo sarebbe accettabile adesso?",
        "example_C": "Scegli un passo di mezzo, anche imperfetto.",
        "fallback": "Reframing: estremo → intermedio",
        "tags": [
          "rigidità",
          "apertura",
          "via_di_mezzo"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P12-Cog",
      "label": "Raccogliere contro-evidenze",
      "type": "cognitive",
      "pattern": "P12",
      "fronte": {
        "principle": "Cercare dati contrari alla propria idea.",
        "why": "Libera nuove opzioni.",
        "serve_a": "mettere alla prova la propria idea",
        "verbo_mentale": "FALSIFICARE",
        "how_to": "formula l’ipotesi opposta e cerca dati o prospettive che la supportano."
      },
      "retro": {
        "aka": [
          "seconda ipotesi",
          "prova contraria"
        ],
        "example_q": "Quali elementi indicano che la tua idea non è completa o è errata?",
        "example_C": "Annota un dato che contraddice la tua idea.",
        "fallback": "Quale verifica concreta fai adesso?",
        "tags": [
          "bias_conferma",
          "contro_evidenza"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P12-Comp",
      "label": "Testare la realtà con piccoli esperimenti",
      "type": "behavioral",
      "pattern": "P12",
      "fronte": {
        "principle": "Testare attivamente l'ipotesi opposta.",
        "why": "Riduce la rigidità attraverso l’azione.",
        "serve_a": "testare nella realtà l’ipotesi opposta",
        "verbo_mentale": "TESTARE",
        "how_to": "esegui un test che potrebbe falsificare l’idea → osserva il risultato."
      },
      "retro": {
        "aka": [
          "mini-esperimento",
          "test realtà"
        ],
        "example_q": "Che piccolo esperimento puoi fare per verificare?",
        "example_C": "Progetta un mini-test che possa smentire la tua ipotesi.",
        "fallback": "Come puoi renderlo ancora più semplice da provare?",
        "tags": [
          "conferma",
          "esperimento"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P12-Emo",
      "label": "Ammettere il dubbio",
      "type": "emotional",
      "pattern": "P12",
      "fronte": {
        "principle": "Sostenere il dubbio per verificare.",
        "why": "Riduce la chiusura difensiva, aprendo alla verifica.",
        "serve_a": "permettere l’ingresso di un’informazione che contraddice",
        "verbo_mentale": "AMMETTERE",
        "how_to": "nota la chiusura e resta un attimo nel dubbio"
      },
      "retro": {
        "aka": [
          "tolleranza al forse",
          "apertura alla disconferma"
        ],
        "example_q": "Quale dubbio puoi sostenere per un attimo?",
        "example_C": "Lascia aperta un’ipotesi diversa per un momento.",
        "fallback": "Resta un attimo nel dubbio, poi fai una domanda.",
        "tags": [
          "dubbio",
          "apertura"
        ],
        "note": ""
      }
    }
  ]
};
