# Mapping: EPIC_full.json (piatto) → formato fronte/retro (template)

Questo documento descrive come trasformare il JSON piatto esportato da Google Sheets
nel formato fronte/retro che il template HTML sa renderizzare.

---

## E (Emozioni)

### FRONTE (carta visibile)
| Cosa si vede              | Campo piatto        | Campo fronte/retro                        |
|---------------------------|---------------------|-------------------------------------------|
| ID                        | `id`                | `id` (root)                               |
| Titolo                    | `label`             | `label` (root)                            |
| Alias (corsivo)           | `aliases`           | `fronte.aliases.items` (+`_label:"Alias"`) |
| Quando la vedi (lista)    | `quando_la_vedi`    | `fronte.quando_la_vedi.items` (+`_label`)  |
| Pattern prioritari        | `patterns_high`     | `fronte.pattern_da_esplorare.high`         |
| Altri pattern             | `patterns_medium`   | `fronte.pattern_da_esplorare.medium`       |

### RETRO (carta girata)
| Cosa si vede              | Campo piatto        | Campo fronte/retro                         |
|---------------------------|---------------------|--------------------------------------------|
| Subtypes                  | `subtypes`          | `retro.subtypes.items` (+`_label`)         |
| Non e questa se           | `non_e_questa_se`   | `retro.non_e_questa_se.items` (+`_label`)  |
| Red flags                 | `red_flags`         | `retro.red_flags.items` (+`_label`)        |
| Hint                      | `note`              | `retro.hint`                               |

### Campi persi (erano nel vecchio, NON nel nuovo JSON)
| Cosa si vedeva            | Vecchio campo            | Nuovo JSON  |
|---------------------------|--------------------------|-------------|
| Hint (es. "guarda P7")    | `retro.hint`             | MANCANTE    |
| Link diretto (es. I-P7)   | `retro.porta_I`          | MANCANTE    |

---

## P (Pattern)

### FRONTE (carta visibile)
| Cosa si vede              | Campo piatto        | Campo fronte/retro                         |
|---------------------------|---------------------|--------------------------------------------|
| ID                        | `id`                | `id` (root)                                |
| Titolo                    | `label`             | `label` (root)                             |
| Alias (corsivo)           | `aliases`           | `fronte.aliases.items` (+`_label:"Alias"`) |
| Shorts (testo)            | `shorts`            | `fronte.shorts.items` (+`_label:"Short"`)  |
| Segnali                   | `segnali`           | `fronte.segnali.items` (+`_label`)         |
| Interventi (link)         | (derivato da I)     | (calcolato dal JS nel template)            |

### RETRO (carta girata)
| Cosa si vede              | Campo piatto        | Campo fronte/retro                         |
|---------------------------|---------------------|--------------------------------------------|
| Non e questo se           | `non_e_questo_se`   | `retro.non_e_questo_se.items` (+`_label`)  |
| Hint                      | `hint`              | `retro.hint`                               |
| Why                       | `why`               | `retro.why`                                |
| Porta I                   | `porta_I`           | `retro.porta_I`                            |

### Campi nuovi (da aggiungere al retro)
| Cosa si vede              | Campo piatto        | Campo fronte/retro                         |
|---------------------------|---------------------|--------------------------------------------|
| Note                      | `note`              | `retro.note`                               |

---

## I (Interventi)

### FRONTE (carta visibile)
| Cosa si vede                        | Campo piatto     | Campo fronte/retro      |
|-------------------------------------|------------------|-------------------------|
| ID                                  | `id`             | `id` (root)             |
| Tipo (Cog/Comp/Emo)                 | `type`           | `type` (root)           |
| Titolo                              | `label`          | `label` (root)          |
| Principle → Why                     | `principle`      | `fronte.principle`      |
|                                     | `why`            | `fronte.why`            |
| VERBO: how_to                       | `verbo_mentale`  | `fronte.verbo_mentale`  |
|                                     | `how_to`         | `fronte.how_to`         |

### RETRO (carta girata)
| Cosa si vede                        | Campo piatto     | Campo fronte/retro      |
|-------------------------------------|------------------|-------------------------|
| Aka (corsivo)                       | `aka`            | `retro.aka`             |
| Domanda esempio                     | `example_q`      | `retro.example_q`       |
| Compito/Consapevolezza              | `example_C`      | `retro.example_C`       |
| Fallback                            | `fallback`       | `retro.fallback`        |
| Note                                | `note`           | `retro.note`            |

### Campi nuovi (da aggiungere)
| Cosa si vede                        | Campo piatto     | Campo fronte/retro      |
|-------------------------------------|------------------|-------------------------|
| Pattern di riferimento              | `pattern`        | `pattern` (root)        |
| Serve a                             | `serve_a`        | `fronte.serve_a`        |
| Tags                                | `tags`           | `retro.tags`            |
