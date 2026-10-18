# Card Update Procedure

Quando modifichi le carte nel Google Sheets e vuoi aggiornare i dati web e i
file stampabili, usa la pipeline localizzata descritta in
`cards/BUILD.md`.

## Passi

1. **Apri il Google Sheets EPiC**

2. **Menu EPIC → Export JSON** → copia tutto il JSON che appare

3. **Incolla in `EPIC_full.json`** nella cartella `EPiC model/` (sovrascrivilo)

4. **Apri un terminale** nella cartella dell'app e lancia:
   ```
   node scripts/build-cards.js it
   ```

5. **Apri `epic-all-cards.html`** nel browser e verifica

## Cosa fa il build

```
EPIC_full.json  →  scripts/build-cards.js  →  EPIC_data.js + carte stampabili
  (da Excel)          (piatto→fronte/retro)     (output rigenerabili)
```

- Il build trasforma il JSON piatto nel formato fronte/retro.
- I dati delle Energie non presenti nell'export vengono letti da
  `data/energy-retro.json`.
- I template di `cards/print-v1` vengono usati come base senza modificare lo snapshot.

## File importanti

| File | Cosa è | Modificare? |
|------|--------|-------------|
| `EPIC_full.json` | Export da Google Sheets | SI (sovrascrivere con l'export) |
| `scripts/build-cards.js` | Trasformazione e build localizzata | NO (salvo modifiche alla pipeline) |
| `data/energy-retro.json` | `hint` e `porta_I` delle Energie, per lingua | SI |
| `EPIC_data.js` | Generato dal build | NO (viene sovrascritto) |
| `epic-all-cards.html` | Generato dal build | NO (viene sovrascritto) |
| `cards/locales/it.json` | Etichette tecniche della lingua | SI, se cambiano le etichette |

## Note

- I campi `hint` e `porta_I` sulle Emozioni (E) non presenti nel Google Sheets
  sono conservati esplicitamente in `data/energy-retro.json`.
- Il template HTML non va mai modificato a mano per aggiornare i dati. Usa sempre il build.
