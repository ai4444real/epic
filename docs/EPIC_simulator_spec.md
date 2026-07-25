# EPiC – Coach Simulator (Scoring) – Spec per LLM-sviluppatore (v0.1)

Contesto
- Esiste già un progetto HTML/JS/CSS che renderizza le carte “Croce” (Pattern al centro + 3 ali I-Cog/I-Emo/I-Comp).
- Questa richiesta è per aggiungere **una nuova vista**: “Coach Simulator – Scoring”.
- Nessun server. Stand-alone. Mobile-first. Offline.
- Dati EPiC: già disponibili (es. `EPIC_data.js` o equivalente) con E/P/I e metadati (ids, label, etc.).

Obiettivo della vista
Allenare la competenza del coach su scenari predefiniti:
Scenario → scelta E → scelta P → scelta I
Con feedback immediato e punteggio basato su “answer key” dello scenario.

---

## 1) UX / Flusso

### Home (nuova voce)
- Bottone: “Coach Simulator”
- Sub: “Scoring (Scenario → E → P → I)”
- Bottoni secondari:
  - “Riprendi ultima partita” (se esiste)
  - “Esporta log”

### Step 0 – Selezione scenario
- Lista scenari (cards o list)
  - titolo + 1 riga teaser + tag facoltativi
- Click scenario → apre Step 1

### Step 1 – Scelta Emozione (E)
- Mostra testo scenario (cliente “dice bla bla”).
- UI: 6 bottoni E1..E6 (con icone già esistenti).
- Selezione E → mostra feedback:
  - esito: Molto rilevante / Rilevante / Poco rilevante
  - punti: 2 / 1 / 0
  - 1 riga “perché” (presa dallo scenario, non generata)
- CTA: “Avanti” → Step 2
- Back: torna a scenario list

### Step 2 – Scelta Pattern (P)
- Il sistema mostra SOLO i Pattern previsti dallo scenario (subset).
- Selezione P → feedback (2/1/0 + why)
- CTA: “Apri Croce” → Step 3
- Back: torna a Step 1 (mantiene scelta E)

### Step 3 – Scelta Intervento (I)
- Render della croce già esistente per quel P:
  - centro = P
  - ali = I-Cog / I-Emo / I-Comp (ids dal dataset EPiC)
- Scelta I → feedback (2/1/0 + why)
- CTA: “Salva turno”
- Back: torna a Step 2

### Step 4 – Risultato turno
- Mostra riepilogo e score totale (0–6)
- Bottone: “Prova alternative” (backtracking libero)
- Bottone: “Nuovo scenario”

---

## 2) Scoring (definizione)

Per ogni step: score ∈ {0,1,2}
- 0 = poco rilevante
- 1 = rilevante
- 2 = molto rilevante

Totale: score_total = score_E + score_P + score_I (0–6)

Il punteggio NON misura “quanto ha funzionato” sul cliente.
Misura “qualità della lettura/scelta” rispetto alla chiave scenario.

---

## 3) Scenario data model (JSON)

File: `scenarios.json`.

Schema minimo:
```json
{
  "id": "S001",
  "title": "Rimando sempre",
  "client_text": "…",
  "subset": {
    "P": ["P5","P1","P9"]
  },
  "answer_key": {
    "E": {"E1":2,"E2":1},
    "P": {"P5":2,"P1":1},
    "I": {"I-P5-Emo":2,"I-P5-Comp":2}
  },
  "why": {
    "E": {"E1":"…"},
    "P": {"P5":"…"},
    "I": {"I-P5-Emo":"…"}
  },
  "tags": ["procrastinazione"]
}
```

Note:
- `subset.P` = lista Pattern presentati (solo quelli).
- `answer_key` contiene SOLO gli elementi che vuoi valutare (gli altri default a 0).
- `why` deve essere corto (1 riga).

---

## 4) Integrazione con dataset EPiC esistente

Assunzioni minime:
- Catalogo E, P, I con id e label
- Per P: modo per risalire ai 3 I (Cog/Emo/Comp)
- La vista nuova usa id + label (grafica croce già esistente).

---

## 5) Log & Export (offline)

Storage:
- `localStorage["epic_sim_log_v1"]` = array JSON

Evento log (1 turno):
```json
{
  "ts": "2026-02-21T10:30:00.000Z",
  "mode": "sim",
  "scenario_id": "S001",
  "E": "E1",
  "P": "P5",
  "I": "I-P5-Emo",
  "score_E": 2,
  "score_P": 2,
  "score_I": 2,
  "score_total": 6
}
```

Export:
- JSON + CSV offline.

CSV header:
ts,mode,scenario_id,E,P,I,score_E,score_P,score_I,score_total

---

## 6) Acceptance criteria
- scenario → E → P → I con feedback e punteggio
- backtracking libero
- log persistente
- export JSON/CSV
- tutto offline, mobile-first
