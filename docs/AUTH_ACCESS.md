# EPiC - Accesso utenti

Questo documento descrive lo stato attuale dell'accesso alla suite EPiC pubblicata su Cloudflare Pages.

## Stato attuale

La suite pubblicata e' in:

```text
https://epic-f58.pages.dev
```

L'accesso e' gestito da Supabase Auth con provider Google.

Configurazione client:

- `_app_config.js`
- `app/js/app-config.js`

Valori attuali rilevanti:

```js
authEnabled: true
loginProvider: 'google'
loginRedirectPath: 'auth-callback'
publicPages: ['epic-live-view', 'epic-live-view.html']
```

In pratica:

- tutte le pagine principali richiedono login
- la pagina studenti della Live Table e' pubblica
- il login avviene via Google

## Pagine protette

Richiedono sessione Supabase valida:

- `index.html`
- `epic-simulator.html`
- `epic-live-table.html`
- `epic-all-cards.html`
- `epic-explorer.html`
- `epic-cross.html`

## Pagine pubbliche

Non richiedono login:

- `epic-live-view.html?room=ROOM_ID`

Questa pagina e' pubblica per permettere agli studenti di vedere un tavolo live senza account.

Gli studenti possono leggere il tavolo via link, ma non hanno i controlli presenter.

## Come dare accesso a un utente

Nel progetto Supabase:

1. Apri Supabase.
2. Entra nel progetto `tools persistence`.
3. Vai in `Authentication` -> `Users`.
4. Aggiungi o invita l'utente con la sua email Google.
5. Comunica all'utente l'URL:

Sbagliato!
si fa su google cloude console
https://console.cloud.google.com/auth/audience?project=step-app-460213

progetto step-app, poi (a sinistra) api e servizi, oauth consent screen, audience, add user (almeno finché è in test)

```text
https://epic-f58.pages.dev/login
```

6. L'utente clicca `Entra con Google`.

Se la sessione viene creata correttamente, l'app lo rimanda alla home o alla pagina richiesta.

## Punto di attenzione: signup Google aperta

Il codice client EPiC oggi verifica solo:

```text
esiste una sessione Supabase valida?
```

Non contiene una whitelist email nel JavaScript.

Quindi la restrizione reale dipende dalla configurazione Supabase Auth.

Da verificare nel dashboard Supabase:

- se Google OAuth consente signup pubblica
- se gli utenti possono auto-registrarsi
- se l'accesso e' limitato agli utenti invitati/creati manualmente

Se la signup Google e' aperta, chiunque riesca a completare il login Google potrebbe ottenere una sessione valida.

## Opzione consigliata per accesso chiuso

Per una suite privata, usare uno di questi assetti:

### Opzione A - Signup disabilitata

Nel dashboard Supabase disabilitare la registrazione pubblica e aggiungere manualmente gli utenti autorizzati.

Questa e' la soluzione piu' semplice se il gruppo e' piccolo.

### Opzione B - Whitelist applicativa

Aggiungere una tabella Supabase, per esempio:

```text
public.epic_allowed_users
```

con email autorizzate.

Poi il client, dopo il login Google, verifica che `session.user.email` sia nella whitelist.

Questa soluzione e' piu' esplicita e controllabile, ma richiede una piccola modifica al codice.

## Live Table

La Live Table usa due pagine:

- `epic-live-table.html`: presenter, protetta
- `epic-live-view.html?room=ROOM_ID`: studenti, pubblica

Il presenter deve avere login.

Gli studenti ricevono il link della room e non devono fare login.

## File coinvolti

Sorgenti root:

- `_app_config.js`
- `_app_auth.js`
- `build-app-simulator.js`

Output pubblicato in `app/`:

- `app/js/app-config.js`
- `app/js/auth.js`
- `app/login.html`
- `app/auth-callback.html`

Nota: `app/` e' il repository pubblicato su GitHub/Cloudflare. La root contiene i sorgenti e la build.

## Verifica rapida

Controllare che auth sia attiva:

```powershell
Get-Content app\js\app-config.js
```

Deve contenere:

```js
authEnabled: true
```

Controllare che la pagina studenti resti pubblica:

```js
publicPages: ['epic-live-view', 'epic-live-view.html']
```

## Da fare se si vuole una whitelist

1. Creare tabella `epic_allowed_users`.
2. Aggiungere policy di lettura o RPC dedicata.
3. Modificare `_app_auth.js`.
4. Rigenerare con:

```powershell
.\build.bat
```

5. Committare e pushare `app/`.
