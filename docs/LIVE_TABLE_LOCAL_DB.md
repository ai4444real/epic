# EPiC - Live Table locale

La Live Table non usa piu' Supabase. Il presenter salva le stanze tramite API del server EPiC e gli studenti leggono lo stato tramite link pubblico.

## Database

Runtime sul VPS:

```text
/opt/epic/app/var/content.sqlite3
```

Variabile:

```text
EPIC_CONTENT_DB=/opt/epic/app/var/content.sqlite3
```

Tabella:

```text
live_rooms
```

Campi principali:

- `room_id`: codice stanza
- `owner_email`: email del primo presenter che salva la stanza
- `payload`: stato completo del tavolo in JSON
- `updated_at`: timestamp usato da lista e polling
- `deleted_at`: soft delete

## API

Presenter, con login Google e ruolo `unlocked` o `admin`:

```text
GET /api/live/rooms
PUT /api/live/rooms/{room_id}
DELETE /api/live/rooms/{room_id}
```

Vista studenti, pubblica via link:

```text
GET /api/live/rooms/{room_id}
```

## Comportamento

- `epic-live-table.html` e' protetta.
- `epic-live-view.html?room=ROOM_ID` resta pubblica.
- Il refresh usa polling leggero, circa ogni 1.6 secondi.
- La cancellazione e' soft delete: la stanza non compare piu' nella lista e la view pubblica risponde `404`.

## Nota migrazione

Le nuove stanze finiscono nel DB locale.

Le eventuali stanze storiche rimaste in Supabase non vengono importate automaticamente nel repository, per evitare di committare contenuti di lezioni o dati non revisionati.
