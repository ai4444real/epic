# EPiC Live Table - Supabase setup

La Live Table usa una tabella dedicata per salvare lo stato della stanza.

## Tabella

Esegui nel SQL editor Supabase:

```sql
create table if not exists public.epic_live_rooms (
  room_id text primary key,
  owner_email text,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.epic_live_rooms enable row level security;

drop policy if exists "public read epic_live_rooms" on public.epic_live_rooms;
create policy "public read epic_live_rooms"
on public.epic_live_rooms
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated insert epic_live_rooms" on public.epic_live_rooms;
create policy "authenticated insert epic_live_rooms"
on public.epic_live_rooms
for insert
to authenticated
with check (
  owner_email is null
  or owner_email = (auth.jwt() ->> 'email')
);

drop policy if exists "owner update epic_live_rooms" on public.epic_live_rooms;
create policy "owner update epic_live_rooms"
on public.epic_live_rooms
for update
to authenticated
using (
  owner_email is null
  or owner_email = (auth.jwt() ->> 'email')
)
with check (
  owner_email is null
  or owner_email = (auth.jwt() ->> 'email')
);

drop policy if exists "owner delete epic_live_rooms" on public.epic_live_rooms;
create policy "owner delete epic_live_rooms"
on public.epic_live_rooms
for delete
to authenticated
using (
  owner_email is null
  or owner_email = (auth.jwt() ->> 'email')
);
```

## Comportamento

- `epic-live-table.html` e' la pagina presenter e resta protetta dal login.
- `epic-live-view.html?room=ROOM_ID` e' pubblica per gli studenti.
- Gli studenti hanno sola lettura.
- Il presenter salva lo stato del tavolo via sessione autenticata.
- Il presenter puo' cancellare i tavoli salvati dalla lista laterale.
- Il refresh e' polling leggero, circa ogni 1.6 secondi.

## Cancellazione tavoli

La `x` nella lista dei tavoli prova prima a cancellare davvero la riga da
`public.epic_live_rooms`.

Se la policy `delete` non e' presente, Supabase puo' cancellare zero righe senza
segnalare un errore bloccante. Per questo l'app usa un fallback: marca il tavolo
come cancellato dentro `payload.deleted_at` tramite `update`, e la lista non lo
mostra piu'.

Per una cancellazione reale del record, aggiungere anche la policy:

```sql
drop policy if exists "owner delete epic_live_rooms" on public.epic_live_rooms;
create policy "owner delete epic_live_rooms"
on public.epic_live_rooms
for delete
to authenticated
using (
  owner_email is null
  or owner_email = (auth.jwt() ->> 'email')
);
```
