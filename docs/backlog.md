# Backlog

## Pagina Elementi EPiC

Stato: completata.

Pagina: `elementi-epic.html`.

Creare una pagina "Elementi EPiC" raggiungibile cliccando sui pallini con alone del flusso:

- Energia
- Pattern
- Intervento
- Comportamento

Il click su ciascun pallino deve aprire la pagina e portare direttamente alla sezione corrispondente.

Ogni sezione deve richiamare il colore del pallino cliccato. Il testo definitivo verra fornito dal Product Owner al momento opportuno.

## Pagina Archetipi

Nella pagina "Perche non sono uguali", il link finale attualmente punta alla stessa pagina.

Quel link dovra puntare a una nuova pagina "Archetipi", ancora da creare, nello stesso stile delle altre pagine EPiC.

Il contenuto definitivo verra fornito dal Product Owner al momento opportuno.

## Pagina Ordina il Mazzo

Nella sezione "Strumenti", sotto la card "Mazzo", aggiungere un link che porti alla pagina per ordinare o richiedere il mazzo EPiC.

La pagina non deve essere un ecommerce completo. Deve funzionare come pagina di interesse / richiesta / pre-ordine:

- presenta il mazzo e il suo valore
- chiarisce che l'ordine viene gestito manualmente
- raccoglie pochi dati essenziali
- permette di ricontattare la persona per disponibilita, pagamento e spedizione

Campi iniziali ipotizzati:

- nome
- email
- paese / citta o cantone
- quantita, con default 1
- nota opzionale
- consenso privacy essenziale

Protezione antispam:

- campo honeypot invisibile con nome plausibile, non "hidden" o "honeypot"
- eventuale rate limit leggero per IP o email

Flusso ideale:

1. L'utente invia la richiesta.
2. Il server salva la richiesta in SQLite.
3. Stato iniziale: "nuovo" o "pending_email".
4. In una fase successiva si potra aggiungere conferma email tramite token.
5. L'amministratore gestisce manualmente pagamento, spedizione e contatto.

Stati possibili:

- nuovo
- confermato
- contattato
- pagato
- spedito
- annullato

Pagamento:

- niente checkout nella prima versione
- TWINT / QR TWINT come opzione privilegiata per la Svizzera
- IBAN eventualmente come alternativa secondaria, valutando esposizione pubblica e gestione amministrativa

Il contenuto commerciale definitivo, prezzo, modalita di consegna e testi privacy verranno forniti dal Product Owner al momento opportuno.

## Pagina Privacy e Condizioni Generali

Creare le pagine legali minime necessarie prima di attivare la pagina "Ordina il Mazzo".

Pagine previste:

- Privacy
- Condizioni generali

Motivo:

- la pagina "Ordina il Mazzo" raccogliera dati personali
- nome, email, citta/cantone/paese, quantita e note possono essere dati sensibili dal punto di vista gestionale
- serve chiarire come vengono usati i dati e con quale finalita
- serve chiarire il flusso commerciale, soprattutto perche non sara un ecommerce automatico

La pagina Privacy dovra spiegare almeno:

- quali dati vengono raccolti
- perche vengono raccolti
- come vengono conservati
- per quanto tempo indicativamente
- come chiedere cancellazione o correzione
- che i dati vengono usati solo per gestire richiesta, contatto, ordine e spedizione

Le Condizioni generali dovranno spiegare almeno:

- che la richiesta del mazzo non e un acquisto automatico
- che disponibilita, pagamento e spedizione vengono confermati manualmente
- modalita indicative di pagamento
- eventuali limiti geografici di spedizione
- annullamento o mancata conferma dell'ordine

Il testo legale definitivo verra fornito o validato dal Product Owner al momento opportuno.
