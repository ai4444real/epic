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
            "P2",
            "P9",
            "P4",
            "P7"
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
      "id": "E3",
      "label": "Frustrazione",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "impotenza",
            "irritazione",
            "stallo",
            "non va avanti"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Blocco",
            "Ingiustizia percepita",
            "Attesa prolungata"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "tentativi senza progresso",
            "sensazione di 'non è giusto'"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "molta energia verso fuori → possibile E5",
            "energia molto bassa → possibile E6"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P3",
            "P4",
            "P11"
          ],
          "medium": [
            "P12",
            "P7",
            "P10"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "red_flags": {
          "_label": "Red flags",
          "items": [
            "assenza tensione",
            "assenza obiettivo",
            "stanchezza marcata"
          ]
        },
        "hint": "'non va / non è giusto' → guarda interpretazione vs richiesta",
        "porta_I": "I-P3-Comp"
      }
    },
    {
      "id": "E4",
      "label": "Stress / Sfinimento",
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
            "P2",
            "P7",
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
            "P3",
            "P4",
            "P12"
          ],
          "medium": [
            "P7",
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
    },
    {
      "id": "E6",
      "label": "Apatia / Tristezza",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "vuoto",
            "disconnessione",
            "spento",
            "senza energia"
          ]
        },
        "subtypes": {
          "_label": "Subtipi",
          "items": [
            "Demotivazione",
            "Ritiro",
            "Sfiducia"
          ]
        },
        "quando_la_vedi": {
          "_label": "Quando la vedi",
          "items": [
            "energia bassa",
            "perdita di spinta → 'tanto non serve'"
          ]
        },
        "non_e_questa_se": {
          "_label": "Non è questa se",
          "items": [
            "attivazione alta → E3/E5"
          ]
        },
        "pattern_da_esplorare": {
          "_label": "Pattern da esplorare",
          "high": [
            "P5",
            "P8",
            "P11"
          ],
          "medium": [
            "P2",
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
            "alta energia",
            "agitazione",
            "lotta",
            "tentativi ripetuti senza ritiro"
          ]
        },
        "hint": "energia bassa → guarda evitamento + senso",
        "porta_I": "I-P8-Emo"
      }
    }
  ],
  "P": [
    {
      "id": "P1",
      "label": "Perfezione",
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
      "id": "P3",
      "label": "Attribuzione",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "bias relazionale",
            "lettura della mente",
            "attribuzione ostile"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "eviti per piacere → probabile P4"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Lo fa contro di me",
            "Pensa che io...",
            "Lo fa apposta",
            "So già cosa pensa"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "attribuzione intenzioni",
            "rigidità percettiva",
            "lettura della mente",
            "giudizio rapido"
          ]
        },
        "hint": "cerca bisogno → riduci attribuzione",
        "porta_I": "I-P3-Comp",
        "why": "Complica relazioni e genera conflitti evitabili."
      }
    },
    {
      "id": "P4",
      "label": "Confini",
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
      "label": "Ruminazione",
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
    },
    {
      "id": "P8",
      "label": "Miopia",
      "fronte": {
        "aliases": {
          "_label": "Alias",
          "items": [
            "sconto del futuro",
            "separato dal sé futuro",
            "breve termine"
          ]
        },
        "non_e_questo_se": {
          "_label": "Non è questo se",
          "items": [
            "tema identità/metro esterno → P10"
          ]
        },
        "shorts": {
          "_label": "Short",
          "items": [
            "Ci penserò",
            "Viviamo oggi",
            "Si vive una volta sola"
          ]
        }
      },
      "retro": {
        "_label": "Retro",
        "segnali": {
          "_label": "Segnali",
          "items": [
            "scarsa visione",
            "difficoltà investimento"
          ]
        },
        "hint": "allinea al sé del futuro",
        "porta_I": "I-P8-Cog",
        "why": "Compromette scelte strategiche e disciplina utile."
      }
    },
    {
      "id": "P9",
      "label": "Impostura",
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
        "verbo_mentale": "ALLEGERIRE",
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
      "id": "I-P3-Cog",
      "label": "Vedere l’altra prospettiva",
      "type": "cognitive",
      "pattern": "P3",
      "fronte": {
        "principle": "Rileggere le intenzioni altrui.",
        "why": "Riduce attribuzioni negative automatiche.",
        "serve_a": "vedere intenzioni e prospettive alternative",
        "verbo_mentale": "CONSIDERARE ALTERNATIVE",
        "how_to": "formula almeno una seconda possibile interpretazione dell’intenzione altrui."
      },
      "retro": {
        "aka": [
          "metaposizione",
          "seconda lettura",
          "occhi dell’altro"
        ],
        "example_q": "Che altra intenzione potresti ipotizzare?",
        "example_C": "Formula e annota un’interpretazione alternativa plausibile.",
        "fallback": "Quale intenzione alternativa potresti ipotizzare?",
        "tags": [
          "relazione",
          "prospettiva"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P3-Comp",
      "label": "Chiarire il punto di vista altrui",
      "type": "behavioral",
      "pattern": "P3",
      "fronte": {
        "principle": "Comprendere strategicamente la posizione altrui.",
        "why": "Chiarisce interessi e limiti, permettendo passi utili anche nel disaccordo.",
        "serve_a": "agire comprendendo meglio il punto di vista altrui",
        "verbo_mentale": "COINVOLGERE",
        "how_to": "formula una domanda che esplori il significato o l’intenzione dietro la loro azione."
      },
      "retro": {
        "aka": [
          "domande di chiarimento",
          "empatia strategica"
        ],
        "example_q": "Cosa ti serve capire meglio della loro prospettiva?",
        "example_C": "Poni una domanda genuina per chiarire la loro intenzione.",
        "fallback": "Come puoi fare una domanda che chiarisca la loro intenzione?",
        "tags": [
          "relazione",
          "empatia"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P3-Emo",
      "label": "Riconosci il bisogno alla base",
      "type": "emotional",
      "pattern": "P3",
      "fronte": {
        "principle": "Riconoscere il bisogno dietro l’emozione protettiva.",
        "why": "Sposta l'attenzione da \"colpa loro\" a \"cosa mi serve\".",
        "serve_a": "riconoscere il bisogno emotivo coinvolto per ridurre la reattività",
        "verbo_mentale": "RICONOSCERE",
        "how_to": "nomina l’emozione → identifica il bisogno correlato."
      },
      "retro": {
        "aka": [
          "bisogno",
          "legittimare"
        ],
        "example_q": "Quale tuo bisogno importante senti toccato qui?",
        "example_C": "Riconosci e formula il tuo bisogno legittimo.",
        "fallback": "Reframing: colpa loro → bisogno mio",
        "tags": [
          "bisogno",
          "legittimazione"
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
    },
    {
      "id": "I-P8-Cog",
      "label": "Consultare il proprio Sé futuro",
      "type": "cognitive",
      "pattern": "P8",
      "fronte": {
        "principle": "Immaginare il sé futuro.",
        "why": "Amplia la prospettiva temporale.",
        "serve_a": "guarda questa scelta dal punto di vista del tuo sé futuro",
        "verbo_mentale": "COLLEGARE FUTURO",
        "how_to": "proietta la tua vita dopo aver agito e nota cosa cambia."
      },
      "retro": {
        "aka": [
          "Io futuro",
          "retro-proiezione"
        ],
        "example_q": "Che consiglio ti darebbe il tuo “io futuro”?",
        "example_C": "Guarda questa scelta come il tuo sé futuro e scrivi cosa faresti.",
        "fallback": "Se fossi il tuo sé futuro, cosa sceglieresti ora?",
        "tags": [
          "sé_futuro",
          "prospettiva"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P8-Comp",
      "label": "Agire oggi per l’obiettivo futuro",
      "type": "behavioral",
      "pattern": "P8",
      "fronte": {
        "principle": "Agire in coerenza con il sé futuro.",
        "why": "Rende il futuro rilevante nel presente.",
        "serve_a": "agire come il proprio sé futuro",
        "verbo_mentale": "ALLINEARE",
        "how_to": "guida la scelta di un gesto allineato al tuo futuro"
      },
      "retro": {
        "aka": [
          "azione quotidiana",
          "allineamento"
        ],
        "example_q": "Qual è il gesto più piccolo che puoi fare ora?",
        "example_C": "Scegli un’azione che ti permetta di avvicinarti, anche poco, al tuo futuro.",
        "fallback": "Qual è l’azione più semplice, allineata?",
        "tags": [
          "sé_futuro",
          "allineamento"
        ],
        "note": ""
      }
    },
    {
      "id": "I-P8-Emo",
      "label": "Ritrovarsi nel sé futuro",
      "type": "emotional",
      "pattern": "P8",
      "fronte": {
        "principle": "Sentire continuità con il sé futuro.",
        "why": "Rafforza il legame emotivo con il proprio futuro.",
        "serve_a": "rendere emotivamente rilevante una scelta che oggi sembra lontana",
        "verbo_mentale": "RITROVARSI",
        "how_to": "richiama il tuo sé futuro e nota se questa scelta ti rappresenta"
      },
      "retro": {
        "aka": [
          "continuità personale",
          "identità nel tempo"
        ],
        "example_q": "Questo passo è qualcosa in cui ti ritrovi davvero?",
        "example_C": "Porta alla mente il tuo sé futuro e verifica se questa scelta ti somiglia.",
        "fallback": "Che scelta fai oggi che ti semplifica il futuro?",
        "tags": [
          "futuro",
          "identità",
          "continuità"
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
