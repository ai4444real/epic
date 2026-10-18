# Creazione delle carte localizzate

Questo e' il documento di ingresso unico per creare o aggiornare le carte EPiC
in qualsiasi lingua. Il build parte dal dataset piatto validato e produce sia i
dati per il renderer web sia gli HTML stampabili.

```text
data/EPIC_full_<locale>.json
data/energy-retro.json
cards/locales/<locale>.json
              |
              v
node scripts/build-cards.js <locale>
              |
              +-- data/EPIC_data_<locale>.js
              +-- cards/generated/<locale>/print/*.built.html
              +-- cards/generated/<locale>/debug/epic-cards-debug.html
```

L'italiano e' la lingua predefinita e mantiene i nomi storici senza suffisso:
`EPIC_full.json` e `EPIC_data.js`. Le integrazioni delle Energie sono in
`energy-retro.json` per tutte le lingue.

## Comandi

```powershell
build-cards.bat en-us
```

Il comando equivalente multipiattaforma e':

```powershell
node scripts/build-cards.js en-us
```

Il dato web generato usa il renderer condiviso `cards/web-v1`. Per una pagina
inglese va caricato `data/EPIC_data_en-us.js` al posto di
`data/EPIC_data.js`.

Gli HTML stampabili sono in `cards/generated/en-us/print/` e riutilizzano gli
asset visivi congelati di `cards/print-v1/built/`. I file `.built.html` vanno
aperti dalla cartella generata, altrimenti i path relativi agli asset non sono
validi.

## Aggiungere una lingua

Per una lingua come lo spagnolo (`es`):

1. aggiungere `data/EPIC_full_<locale>.json`, nel formato piatto completo;
2. copiare `cards/locales/en-us.json` in `cards/locales/<locale>.json` e
   tradurre le etichette tecniche web e print;
3. aggiungere una sezione `<locale>` a `data/energy-retro.json`, con `hint` e
   `porta_I` delle Energie non presenti nell'export;
4. eseguire `build-cards.bat <locale>`;
5. verificare gli output web e i quattro HTML in
   `cards/generated/<locale>/print/`, oltre alla vista editoriale in
   `cards/generated/<locale>/debug/epic-cards-debug.html`.

Sono accettati codici lingua di due o tre lettere, con un'eventuale regione di
due lettere: per esempio `it`, `es`, `en-us`.

## Regole delle sorgenti

- Non usare mai un `EPIC_data*.js` gia' generato come sorgente implicita.
- I contenuti ordinari appartengono a `EPIC_full_<locale>.json`.
- I dati delle Energie assenti dall'export appartengono alla sezione della
  lingua in `data/energy-retro.json`.
- Se `hint` o `porta_I` vengono aggiunti in futuro al JSON piatto, il build usa
  il valore del JSON originale e `energy-retro.json` rimane soltanto il
  fallback.
- `cards/print-v1` e' uno snapshot congelato: il build lo usa come base visiva
  ma non lo modifica.

## Output attesi

Per `<locale>` diverso da `it`:

```text
data/EPIC_data_<locale>.js
cards/generated/<locale>/print/epic-energy-print-allfront.built.html
cards/generated/<locale>/print/epic-energy-print-allback.built.html
cards/generated/<locale>/print/epic-cross-layout-toPrint-all.built.html
cards/generated/<locale>/print/epic-cross-layout-toPrint-allback.built.html
```

Il build valida JSON, gruppi `E/P/I`, ID duplicati e riferimenti ai Pattern. Un
errore interrompe il processo senza dichiarare la build completata. Verifica
inoltre che la localizzazione non modifichi il CSS dei template di stampa: le
dimensioni, le griglie e i segni tipografici devono restare identici a v1.
