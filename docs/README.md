# Docs

Questa cartella raccoglie la documentazione da cui ripartire per capire rapidamente come funziona l'app EPiC oggi.

## Punto di ingresso consigliato

Ordine di lettura consigliato:

1. `EPIC_playground.md`
2. `EPIC_simulator_spec.md`
3. `VPS_INFOMANIAK_ACCESS.md`
4. `AUTH_ACCESS.md`
5. `SCENARIOS_LOCAL_DB.md`
6. `LIVE_TABLE_LOCAL_DB.md`

## Documenti principali

- `EPIC_playground.md`
  visione del playground e delle modalita' d'uso

- `EPIC_simulator_spec.md`
  spec del Coach Simulator con scoring

- `EPIC_game_design_note.md`
  nota di design e roadmap concettuale

- `EPIC_DOCUMENTATION.md`
  documentazione piu' ampia su dati, viewer, build e struttura

- `VPS_INFOMANIAK_ACCESS.md`
  accesso VPS, chiavi, Caddy, systemd e deploy manuale

- `SCENARIOS_LOCAL_DB.md`
  scenari completi migrati sul DB locale del server

- `LIVE_TABLE_LOCAL_DB.md`
  stanze Live Table sul DB locale del server

- `AUTH_ACCESS.md`
  accesso utenti, login Google, pagine pubbliche/protette e rischi signup

## Documenti operativi ufficializzati

- `CARD_UPDATE_PROCEDURE.md`
  procedura rapida per aggiornare le carte dal foglio/export

- `MAPPING.md`
  mapping tra formato piatto ed oggetti fronte/retro usati dal renderer

## Nota pratica

La documentazione qui dentro serve per orientarsi.

I file di lavoro applicativo restano nella root del progetto, in particolare:

- build script
- template HTML
- dataset
- cartella `app/`
- cartella `workspace/` per materiali non deployati o legacy
