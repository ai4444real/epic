# EPiC Online - Modello public/demo e unlocked

Questo documento raccoglie la decisione di prodotto/architettura per esporre gli strumenti EPiC in modo pubblico senza distribuire tutto il contenuto.

## Obiettivo

Mostrare il valore degli strumenti online EPiC, incuriosire e far capire la qualita' del modello, senza rendere disponibile gratuitamente l'intero mazzo, tutti gli scenari o tutte le croci.

L'utente pubblico deve poter pensare: "questo e' bello e utile". Non deve poter ricostruire tutto il sistema dai file caricati nel browser.

## Principio guida

Il limite migliore non e' nascondere contenuti gia' inviati al browser.

Il limite migliore e': **non spedire al browser pubblico i dati completi**.

Quindi gli strumenti pubblici usano dataset ridotti, curati e autonomi. Gli strumenti unlocked usano dataset completi.

## Due edizioni, una sola codebase

Non vogliamo mantenere due strumenti diversi.

Vogliamo mantenere una sola UI/logica per ogni strumento, configurata con seed diversi:

- edizione `demo/public`
- edizione `unlocked/full`

Esempio concettuale:

```js
createSimulatorApp({
  mode: 'demo',
  data,
  scenarios,
  features
});
```

```js
createSimulatorApp({
  mode: 'unlocked',
  data,
  scenarios,
  features
});
```

La UI, il rendering, lo scoring e le interazioni restano condivisi. Cambiano dati e feature flags.

## Public edition

La public edition e' un assaggio finito, non una versione piena con lucchetti ovunque.

Caratteristiche:

- dataset piccolo
- contenuto scelto con cura
- nessun dato completo nel bundle pubblico
- poche funzioni, ma complete e belle
- niente esperienza frustrante piena di "non puoi"

Esempi:

- Simulator pubblico con 5 scenari scelti
- Explorer pubblico con pochi percorsi coerenti
- All Cards pubblico con una mini-selezione/croce demo
- Cross pubblico con una sola croce demo

## Unlocked edition

La unlocked edition e' l'esperienza completa.

Caratteristiche:

- dataset completo
- login richiesto
- utenti approvati/sbloccati
- scenari completi
- croci complete
- eventuali funzioni extra: aggiornamento scenari, storico, export, materiali corso

Per ora `unlocked` corrisponde sostanzialmente allo stato attuale degli strumenti completi.

## Strumenti

### All Cards

Public:

- mini-set demo
- possibilmente una sequenza coerente Energia -> Pattern -> Interventi
- non contiene l'intero mazzo

Unlocked:

- mazzo completo
- fronte/retro completi
- ricerca, filtri, collegamenti

### Simulator

Public:

- pochi scenari demo, per esempio 5
- dataset minimo necessario a quegli scenari
- nessun download/aggiornamento scenari

Unlocked:

- tutti gli scenari
- eventuale scaricamento/aggiornamento scenari
- funzioni avanzate se utili

### Explorer

Public:

- percorsi demo limitati
- meglio un seed piccolo e coerente rispetto a un limite giornaliero complesso

Unlocked:

- navigazione completa del modello

### Cross

Public:

- una croce demo completa

Unlocked:

- tutte le croci

### Live Table

Resta un caso separato.

- presenter protetto
- viewer pubblico via link
- non fa parte del modello demo/unlocked del catalogo contenuti
- si controlla tramite link/stanza e gestione manuale del tavolo

## Accesso

Ruoli minimi:

- `public`: non autenticato o non sbloccato
- `unlocked`: utente autorizzato
- `admin/presenter`: gestione, live table, eventuale promozione utenti

Implementazione attuale:

- Google OAuth diretto sul server FastAPI
- utenti e ruoli in SQLite locale
- promozione manuale utente tramite email nel DB locale

Google OAuth e approvazione accesso restano un tema burocratico Google, ma non passano piu' da Supabase.

## Regola tecnica

Ogni tool dovrebbe poter ricevere una configurazione:

```js
{
  mode: 'demo' | 'unlocked',
  dataSource: 'demo' | 'full',
  scenarioSource: 'demo' | 'full',
  features: {}
}
```

Il codice comune carica e renderizza cio' che riceve.

Il bundle pubblico deve contenere solo i seed demo.

## Decisione

La direzione preferita e':

**uno strumento da mantenere, due configurazioni da pubblicare.**

Dal punto di vista prodotto possono esistere URL/entry point diversi, ma dal punto di vista tecnico devono condividere quanto piu' possibile codice, rendering e logica.
