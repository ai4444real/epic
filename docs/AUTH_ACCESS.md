# EPiC - accesso utenti

Questo documento descrive il modello di login della suite EPiC servita dal VPS.

## Stato attuale

Produzione:

```text
https://simonegenini.com
```

Il login e' gestito direttamente dal server FastAPI con Google OAuth.

Supabase resta usato dove serve per dati applicativi, per esempio scenari online e Live Table, ma non gestisce piu' l'autenticazione utenti.

## Flusso login

1. L'utente apre `/login`.
2. Clicca `Entra con Google`.
3. Il server manda l'utente a Google OAuth.
4. Google richiama:

```text
https://simonegenini.com/auth/google/callback
```

5. Il server crea/aggiorna l'utente nel database locale.
6. Il server crea una sessione HTTP-only nel cookie `epic_auth`.
7. L'utente viene rimandato alla pagina richiesta.

Il browser non vede il client secret Google e non gestisce token OAuth.

## Ruoli

Gli utenti sono salvati in SQLite:

```text
/opt/epic/app/var/auth.sqlite3
```

Ruoli previsti:

- `public`: utente loggato ma non sbloccato
- `unlocked`: accesso agli strumenti completi
- `admin`: accesso agli strumenti completi, riservato a gestione futura

I nuovi utenti Google entrano come `public`.

Per sbloccare manualmente un utente sul server:

```bash
sqlite3 /opt/epic/app/var/auth.sqlite3 \
  "UPDATE users SET role = 'unlocked' WHERE email = 'utente@example.com';"
```

Per vedere gli utenti:

```bash
sqlite3 /opt/epic/app/var/auth.sqlite3 \
  "SELECT email, role, last_login_at FROM users ORDER BY last_login_at DESC;"
```

## Configurazione Google

Nel progetto Google Cloud creare un OAuth Client di tipo `Web application`.

Origine JavaScript autorizzata:

```text
https://simonegenini.com
```

Redirect URI autorizzato:

```text
https://simonegenini.com/auth/google/callback
```

Scope richiesti:

```text
openid
email
profile
```

## Variabili server

Sul VPS il file non versionato e':

```text
/opt/epic/app/.env
```

Template versionato:

```text
.env.example
```

Valori necessari:

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://simonegenini.com/auth/google/callback
SESSION_SECRET=...
EPIC_COOKIE_SECURE=true
EPIC_ACCESS_DB=/opt/epic/app/var/access_log.sqlite3
EPIC_AUTH_DB=/opt/epic/app/var/auth.sqlite3
```

Generare `SESSION_SECRET` sul server:

```bash
openssl rand -hex 32
```

Dopo modifiche a `.env`:

```bash
sudo systemctl restart epic-web
```

## Pagine pubbliche

Sono pubbliche senza login:

- `/`
- `/epic`
- `/epic/simulator`
- `/epic/explorer`
- `/epic/cards`
- `/epic-live-view.html?room=...`

Le prime tre pagine strumenti sono le demo free.

## Pagine protette

Richiedono login e ruolo `unlocked` o `admin`:

- `/epic/cross`
- `/epic/live-table`
- `/epic/simulator/full`
- `/epic/explorer/full`
- `/epic/cards/full`
- le vecchie pagine HTML complete equivalenti

La Live View studenti resta pubblica: chi riceve il link puo' vedere il tavolo senza account.

## Verifica rapida

Da server:

```bash
curl -I https://simonegenini.com/login
curl -I https://simonegenini.com/epic/cross
```

Senza sessione, `/epic/cross` deve rispondere con redirect a `/login`.

Controllare configurazione OAuth:

```bash
sudo systemctl show epic-web --property=Environment
journalctl -u epic-web -n 100 --no-pager
```
