# EPiC - scenari simulator locali

Gli scenari completi del simulatore sono stati esportati da Supabase e portati nel server EPiC.

## Stato

Export Supabase eseguito il 26 luglio 2026:

- sorgente legacy: `public.epic_scenarios`
- righe esportate: 45
- scenari importati: 45
- primo id esportato: `S107`
- ultimo id esportato: `S145`

Seed versionato:

```text
server/seeds/scenarios.json
```

Database runtime sul VPS:

```text
/opt/epic/app/var/content.sqlite3
```

Variabile:

```text
EPIC_CONTENT_DB=/opt/epic/app/var/content.sqlite3
```

## Comportamento

All'avvio FastAPI:

1. crea la tabella locale `scenarios` se manca
2. legge `server/seeds/scenarios.json`
3. fa upsert degli scenari nel DB locale

La versione completa del simulatore non carica piu' `data/scenarios.js` e non chiama piu' Supabase dal browser.

Endpoint:

```text
GET /api/scenarios
GET /api/scenarios/random
```

Entrambi richiedono:

- login Google valido
- ruolo `unlocked` o `admin`

La demo free continua a usare:

```text
data/demo/scenarios_demo.js
```

## Sicurezza

Il seed completo e' sotto `server/seeds/` e non viene servito come file statico.

Anche il vecchio:

```text
data/scenarios.js
```

non viene piu' servito dal server FastAPI, per evitare download diretto degli scenari completi.

## Verifica

Senza login:

```bash
curl -i https://simonegenini.com/api/scenarios/random
```

Risposta attesa:

```text
401
```

Con utente loggato ma non sbloccato:

```text
403
```

Con utente `unlocked`:

```text
200
```

## Nota legacy

Supabase non e' piu' sorgente runtime per gli scenari del simulatore.

Resta ancora da migrare la Live Table, che usa ancora `epic_live_rooms`.
