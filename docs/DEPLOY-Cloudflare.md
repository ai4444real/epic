# Deploy Cloudflare

## Rilascio rapido

1. Lavora nella root `EPiC model/`
2. Rigenera tutto con:

```powershell
.\build.bat
```

3. Controlla le modifiche nel repo pubblicato:

```powershell
git -C app status --short --branch
```

4. Fai commit e push del repo `app/`:

```powershell
git -C app add .
git -C app commit -m "Messaggio chiaro"
git -C app push origin main
```

5. Verifica il deploy su:

```text
https://epic-f58.pages.dev
```

## Stato attuale verificato

- La cartella di lavoro principale e' `EPiC model/`.
- Il repository Git collegato alla versione pubblicata **non** e' la root del progetto.
- Il repository Git e' la sottocartella `app/`.
- In `app/.git/config` il remote `origin` punta a:

```text
https://github.com/ai4444real/epic.git
```

- Branch collegato localmente: `main`
- Stato verificato al momento del controllo:

```text
git -C app status --short --branch
## main...origin/main
```

- Ultimi commit verificati in `app/`:

```text
d9a4189 Make scenario ID display more discreet in Step 1
44e8983 Show scenario ID next to difficulty in Step 1 list
55c57c8 Initial app version (non-embedded epic simulator)
```

## Struttura reale del progetto

Ci sono due livelli distinti:

1. `EPiC model/`
   - contiene sorgenti, build script, template, dati, immagini
   - qui si sviluppa davvero l'app

2. `EPiC model/app/`
   - contiene la versione servita/pubblicata
   - ha un repository Git separato
   - e' il contenuto che va su GitHub e poi, con alta probabilita', su Cloudflare Pages

## Build attuale

Il file chiave per la versione deployabile non embedded e':

- `build-app-simulator.js`

Questo script genera dentro `app/`:

- `epic-simulator.html`
- `css/`
- `js/`
- `data/`
- `images/`

La build completa Windows passa da:

- `build.bat`

Dentro `build.bat`, lo step finale rilevante e':

```text
node build-app-simulator.js
```

## Embedded vs non-embedded

Stato attuale deciso:

- per ora si mantiene anche la versione embedded/single-file per uso mobile/offline
- la versione pubblicata via repo `app/` e' invece la variante non embedded

Quindi:

- `epic-simulator.html` nella root = build embedded/monolitica
- `app/epic-simulator.html` = build pubblicata/non embedded

## Supabase attuale

Assetto corrente:

- la tabella usata dal simulatore e' `public.epic_scenarios`
- la lettura pubblica e' consentita
- il client pubblico usa una chiave `anon public`
- gli strumenti locali/admin continuano a usare la chiave admin nei file batch

Policy applicata:

- tabella: `public.epic_scenarios`
- comando: `SELECT`
- ruolo: `anon`
- espressione `using`: `true`

In pratica:

- browser / Cloudflare Pages: sola lettura scenari
- strumenti locali `scenarios-online/*.bat`: gestione admin degli scenari

File client interessati:

- `app/js/simulator.js`
- `epic-simulator.template.html`
- `epic-simulator.html`

File admin locali interessati:

- `scenarios-online/post.bat`
- `scenarios-online/get.bat`

Nota operativa:

- la chiave pubblica nel browser e' intenzionale
- la chiave admin non va nella build pubblicata

## Cloudflare Pages

Quello che e' stato verificato localmente:

- esiste il repo GitHub pubblico `ai4444real/epic`
- il repo locale `app/` punta a quel repository

Quello che e' stato confermato dal dashboard Cloudflare:

- Progetto Workers & Pages: `epic`
- Repository collegato: `ai4444real/epic`
- Automatic deployments: **enabled**
- Branch di produzione: `main`
- Dominio di produzione:

```text
epic-f58.pages.dev
```

- URL di preview/deploy osservato nello screenshot:

```text
bfb9a240.epic-f58.pages.dev
```

- Commit di produzione visibile nello screenshot:

```text
d9a4189
```

Quindi, allo stato attuale, il deploy avviene davvero tramite Cloudflare Pages collegato al repository GitHub `ai4444real/epic`, con pubblicazione automatica dei push su `main`.

## Procedura operativa minima

### Caso normale: pubblichiamo una nuova versione

1. Lavora nella root:

```text
EPiC model/
```

2. Aggiorna sorgenti, template, JS, CSS, dati o scenari.

3. Rigenera gli output:

```powershell
.\build.bat
```

4. Verifica che `app/` sia stato aggiornato:

```powershell
git -C app status --short
```

5. Entra nel repo pubblicato e fai commit:

```powershell
git -C app add .
git -C app commit -m "Messaggio chiaro"
```

6. Pusha su GitHub:

```powershell
git -C app push origin main
```

7. Attendi il deploy automatico di Cloudflare Pages.

8. Verifica la pubblicazione su:

```text
https://epic-f58.pages.dev
```

Se necessario, controlla anche il deployment specifico dal dashboard Cloudflare o tramite URL preview.

## Procedura minima di verifica prima del push

Controlli consigliati:

1. Apri localmente `app/epic-simulator.html`
2. Verifica che il simulatore parta
3. Verifica almeno:
   - lista scenari
   - step E
   - step P
   - step I
   - risultato finale
   - log/export se toccati

## Comandi utili

Verificare remote del repo pubblicato:

```powershell
git -C app remote -v
```

Verificare branch:

```powershell
git -C app branch --show-current
```

Verificare stato:

```powershell
git -C app status --short --branch
```

Vedere ultimi commit:

```powershell
git -C app log --oneline --decorate -n 10
```

## Mappa rapida

- Sorgenti reali: `EPiC model/`
- Repo pubblicato: `EPiC model/app/`
- GitHub: `https://github.com/ai4444real/epic`
- Cloudflare Pages project: `epic`
- Produzione: `https://epic-f58.pages.dev`
- Branch di produzione: `main`
- Supabase public table: `public.epic_scenarios`
- Browser key: `anon public`
- Admin locale: `scenarios-online/*.bat`

## Nota importante

Se una modifica viene fatta nella root ma **non** viene rigenerata/coperta dentro `app/`, il deploy Cloudflare non vedra' nulla.

In pratica:

- sviluppi nella root
- pubblichi dal repo `app/`

Questa e' la distinzione da ricordare.
