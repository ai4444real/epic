# Supabase Setup

## Scopo

Questo file descrive il setup Supabase attuale usato da EPiC per gli scenari del simulatore.

Serve a ricordare:

- quale tabella usa il client
- quale chiave usa il browser
- quale chiave usano gli strumenti locali
- quale policy RLS e' stata impostata

## Progetto attuale

Contesto verificato:

- progetto Supabase: `tools persistence`
- ambiente: `main / PRODUCTION`
- tabella usata: `public.epic_scenarios`

## Tabella usata dal simulatore

Tabella:

```text
public.epic_scenarios
```

Campi osservati:

- `id` `uuid`
- `created_at` `timestamptz`
- `payload` `jsonb`

Il simulatore legge gli scenari dal contenuto di `payload`.

## Politica RLS attuale

Obiettivo:

- rendere la tabella leggibile pubblicamente dal client
- impedire scrittura dal browser pubblico

Policy impostata:

- tabella: `public.epic_scenarios`
- tipo: `SELECT`
- ruolo: `anon`
- espressione `using`: `true`

Forma SQL equivalente:

```sql
alter table public.epic_scenarios enable row level security;

create policy "public read epic_scenarios"
on public.epic_scenarios
as permissive
for select
to anon
using (true);
```

## Chiavi

### Browser / client pubblico

Il browser usa:

- chiave `anon public`

Questa chiave e' usata in:

- `app/js/simulator.js`
- `epic-simulator.template.html`
- `epic-simulator.html`

Uso previsto:

- sola lettura degli scenari dal client pubblico

### Admin / strumenti locali

Gli strumenti locali continuano a usare:

- chiave admin / `service_role`

Questa chiave e' usata nei file:

- `scenarios-online/post.bat`
- `scenarios-online/get.bat`

Uso previsto:

- aggiungere scenari
- interrogare scenari da ambiente locale
- operazioni admin, non pubbliche

## Flusso attuale

### Lettura pubblica scenari

Il client del simulatore:

1. gira nel browser
2. usa `SUPABASE_URL`
3. usa la chiave `anon public`
4. chiama Supabase in sola lettura

### Gestione scenari

Gli script locali in `scenarios-online/`:

1. preparano il payload
2. chiamano Supabase con chiave admin
3. inseriscono o leggono scenari lato operativo

## File coinvolti

### Client

- `app/js/simulator.js`
- `epic-simulator.template.html`
- `epic-simulator.html`

### Dati / strumenti locali

- `scenarios-online/payload.json`
- `scenarios-online/post.bat`
- `scenarios-online/get.bat`
- `scenarios-online/wrap_payload.py`

## Verifica rapida

### Verifica lato browser

Controlli minimi:

1. aprire il simulatore
2. cliccare `Scarica scenari`
3. verificare che i dati arrivino
4. verificare nel `view-source` che nel client ci sia la chiave pubblica, non quella admin

### Verifica lato Supabase

Controlli minimi:

1. `public.epic_scenarios` visibile e popolata
2. RLS attivo
3. policy `SELECT` per `anon`
4. nessuna policy di scrittura pubblica indesiderata

## Distinzione da ricordare

- chiave pubblica nel browser: ok
- chiave admin nei file locali: ok
- chiave admin nella build pubblica: no

## Documenti collegati

- `DEPLOY-Cloudflare.md`
