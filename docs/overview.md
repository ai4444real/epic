# EPiC Online - Panoramica prodotto

EPiC Online e' una suite web di strumenti basati sul modello Emozioni -> Pattern -> Interventi. Supporta studio, formazione, simulazione e utilizzo operativo delle carte EPiC.

## Live Table

Tavolo virtuale per lezioni e dimostrazioni dal vivo.

Il docente prepara e controlla un tavolo condiviso, aggiunge carte, apre le croci dei Pattern e gira fronte/retro. Gli studenti accedono tramite link pubblico e vedono gli aggiornamenti quasi in tempo reale, senza login.

Funzioni principali:

- tavoli salvabili e riapribili con titolo
- carte singole e croci Pattern + Interventi
- strip delle energie sui Pattern
- zoom e ordine delle carte
- vista presenter protetta e vista studenti pubblica

## Coach Simulator

Ambiente di allenamento decisionale per coach.

Propone scenari realistici e guida l'utente nella scelta di Emozione, Pattern e Intervento. Ogni scelta riceve feedback e punteggio rispetto alla chiave dello scenario.

Funzioni principali:

- scenari per difficolta'
- percorso E -> P -> I
- scoring e soluzione commentata
- log locale, note ed export
- scenari aggiornabili da Supabase

## All Cards

Catalogo completo e navigabile delle carte EPiC.

Consente di consultare Emozioni, Pattern e Interventi con contenuti completi fronte/retro, ricerca, filtri e collegamenti tra le carte.

E' lo strumento principale per studio libero, consultazione e verifica del dataset.

## Explorer

Percorso guidato per passare da uno stato emotivo a possibili Pattern e Interventi.

L'utente seleziona un'Emozione e, facoltativamente, un intento operativo. Il sistema propone i Pattern coerenti e porta alla relativa croce di Interventi.

E' pensato per orientamento, auto-esplorazione e supporto durante l'uso pratico di EPiC.

## Cross

Vista focalizzata sulla struttura tattica di un singolo Pattern.

Mostra il Pattern al centro e i tre Interventi associati sulle ali:

- Cognitivo
- Emotivo
- Comportamentale

Serve per confrontare le leve disponibili, studiare le sinergie e allenare la scelta dell'intervento.

## Accesso e pubblicazione

La suite e' pubblicata tramite GitHub e Cloudflare Pages.

- gli strumenti principali richiedono login Google tramite Supabase Auth
- la vista studenti della Live Table e' pubblica tramite link della stanza
- Supabase gestisce scenari, stanze Live Table e autenticazione
- la versione pubblicata si trova nel repository `app/`

## Direzione prodotto

Gli strumenti coprono oggi cinque esigenze complementari:

1. insegnare EPiC dal vivo
2. allenare la lettura e la scelta tramite scenari
3. studiare il catalogo completo
4. navigare il modello in modo guidato
5. approfondire Pattern e leve attraverso la croce

La suite puo' evolvere verso formazione strutturata, supervisione, utilizzo live in sessione, percorsi personali e contenuti premium.
