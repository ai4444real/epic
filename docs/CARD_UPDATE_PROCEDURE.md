# Card Update Procedure

Quando modifichi le carte nel Google Sheets e vuoi aggiornare il viewer HTML.

## Passi

1. **Apri il Google Sheets EPiC**

2. **Menu EPIC → Export JSON** → copia tutto il JSON che appare

3. **Incolla in `EPIC_full.json`** nella cartella `EPiC model/` (sovrascrivilo)

4. **Apri un terminale** nella cartella `EPiC model/` e lancia:
   ```
   build.bat
   ```

5. **Apri `epic-all-cards.html`** nel browser e verifica

## Cosa fa il build

```
EPIC_full.json  →  build-transform.js  →  EPIC_data.js  →  epic-all-cards.html
  (da Excel)        (piatto→fronte/retro)   (formato carte)   (viewer finale)
```

- **Step 1**: `build-transform.js` trasforma il JSON piatto in formato fronte/retro per le carte
- **Step 2**: inietta il risultato nel template (`epic-all-cards.template.html`) → produce `epic-all-cards.html`

## File importanti

| File | Cosa è | Modificare? |
|------|--------|-------------|
| `EPIC_full.json` | Export da Google Sheets | SI (sovrascrivere con l'export) |
| `build.bat` | Script di build | NO |
| `build-transform.js` | Trasformazione piatto→fronte/retro | NO (solo se cambiano i campi) |
| `epic-all-cards.template.html` | Template HTML/CSS/JS del viewer | NO (solo per modifiche al layout) |
| `EPIC_data.js` | Generato dal build | NO (viene sovrascritto) |
| `epic-all-cards.html` | Generato dal build | NO (viene sovrascritto) |
| `oldies/EPIC_data.js` | Dati vecchi (hint/porta_I per le E) | NO (riferimento storico) |

## Note

- I campi `hint` e `porta_I` sulle Emozioni (E) non sono nel Google Sheets. Vengono recuperati dal file `oldies/EPIC_data.js`. Se aggiungi nuove E o vuoi cambiare questi campi, devi aggiornare quel file.
- Il template HTML non va mai modificato a mano per aggiornare i dati. Usa sempre il build.
