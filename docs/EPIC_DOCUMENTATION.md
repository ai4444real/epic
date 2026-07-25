# EPiC - Documentazione Completa

> **Versione:** 2.0
> **Data:** 2025-11-09
> **Stato:** Stabile - Feature complete

---

## 📚 Indice

1. [Teoria EPiC](#teoria-epic)
2. [Struttura Dati](#struttura-dati)
3. [Design System](#design-system)
4. [Implementazioni](#implementazioni)
5. [Pattern di Navigazione](#pattern-di-navigazione)

---

## 🧠 Teoria EPiC

### Concetto Base

**EPiC** è un sistema di carte per la relazione d'aiuto (in particolare coaching) strutturato in 3 livelli:

```
E (Emozioni) → P (Pattern) → I (Interventi)
```

### Filosofia delle Carte

**Fronte**: Operativo - Cosa fare, come riconoscere
**Retro**: Aiutino - Approfondimenti, alternative, note

### I Tre Livelli

#### E - Emozioni (6 carte)
- **Scopo**: Punto di ingresso, riconoscimento emotivo
- **Contenuto fronte**: Aliases, Quando la vedi, Pattern da esplorare
- **Contenuto retro**: Subtypes, Non è questa se, Hint, Link diretto porta_I
- **Totale**: 6 emozioni base

**Lista completa:**
1. E1 - Ansia
2. E2 - Paura
3. E3 - Frustrazione
4. E4 - Stress / Sfinimento
5. E5 - Rabbia / Irritazione
6. E6 - Apatia / Tristezza

#### P - Pattern (12 carte)
- **Scopo**: Identificazione pattern cognitivi/comportamentali
- **Contenuto fronte**: Aliases, Segnali, Shorts (frasi tipiche)
- **Contenuto retro**: Non è questo se, Hint, Link porta_I
- **Totale**: 12 pattern cognitivi

**Lista completa:**
1. P1 - Perfezione
2. P2 - Bassa autoefficacia
3. P3 - Attribuzione ostile
4. P4 - Compiacere
5. P5 - Evitamento
6. P6 - Ruminazione
7. P7 - Avversione alla perdita
8. P8 - Sconto futuro
9. P9 - Vergogna / Impostore
10. P10 - Metro esterno
11. P11 - Tutto-o-niente
12. P12 - Conferma (bias)

#### I - Interventi (27 carte)
- **Scopo**: Interventi pratici applicabili
- **Contenuto fronte**: Principle, Why, Verbo mentale, How-to
- **Contenuto retro**: Varianti (aka), Domanda esempio, Compito/Consapevolezza, Fallback, Note
- **Totale**: 27 interventi (suddivisi in Cognitivi, Comportamentali, Emotivi)

**Tipologie:**
- **Cognitivi (Cog)**: Interventi sul pensiero
- **Comportamentali (Comp)**: Interventi sull'azione
- **Emotivi (Emo)**: Interventi sull'emozione

### Collegamenti

```
E1 (Ansia)
  └─ pattern_da_esplorare:
      ├─ high: [P1, P6]        ← Priorità alta
      └─ medium: [P2, P9, P4, P7]  ← Priorità media

P1 (Perfezione)
  └─ porta_I: I-P1-Cog         ← Link diretto

Mapping completo: 27 collegamenti E↔P↔I
```

---

## 📊 Struttura Dati

### Build System & Source Files

**Source of Truth** (editare questi):
```
data/
  ├─ E.json        → 6 Emozioni
  ├─ P.json        → 12 Pattern
  ├─ I.json        → 27 Interventi
  └─ mapping.json  → Collegamenti E↔P↔I
```

**File Generati** (NON editare manualmente):
- `EPIC_full.json` - Combinazione dei 4 source
- `epic-all-cards.html` - Viewer con JSON embedded

**Workflow di modifica**:
```bash
1. Edita data/P.json (o E.json, I.json, mapping.json)
2. Run ./build.sh
3. Testa epic-all-cards.html
```

### File JSON (formato)

**EPIC_full.json** - File unificato generato:
```json
{
  "E": [6 emozioni],
  "P": [12 pattern],
  "I": [27 interventi],
  "mapping": [27 collegamenti E↔P↔I]
}
```

### Struttura Emozione (E)

```json
{
  "id": "E1",
  "label": "Ansia",
  "fronte": {
    "aliases": {
      "_label": "Alias",
      "items": ["preoccupazione", "nervosismo", ...]
    },
    "subtypes": {
      "_label": "Subtipi",
      "items": ["Prestazionale", "Relazionale", ...]
    },
    "quando_la_vedi": {
      "_label": "Quando la vedi",
      "items": ["attivazione alta", ...]
    },
    "non_e_questa_se": {
      "_label": "Non è questa se",
      "items": ["energia bassa → possibile E6", ...]
    },
    "pattern_da_esplorare": {
      "_label": "Pattern da esplorare",
      "high": ["P1", "P6"],
      "medium": ["P2", "P9", "P4", "P7"]
    }
  },
  "retro": {
    "_label": "Retro",
    "hint": "...",
    "porta_I": "I-P7"
  }
}
```

### Struttura Pattern (P)

```json
{
  "id": "P1",
  "label": "Perfezione",
  "fronte": {
    "aliases": {
      "_label": "Alias",
      "items": ["standard impossibili", "mai abbastanza", ...]
    },
    "segnali": {
      "_label": "Segnali",
      "items": ["standard irrealistici", ...]
    },
    "non_e_questo_se": {
      "_label": "Non è questo se",
      "items": ["0/100 → probabile P11"]
    },
    "shorts": {
      "_label": "Short",
      "items": ["non basta mai", "rifaccio", ...]
    }
  },
  "retro": {
    "_label": "Retro",
    "hint": "definisci 'abbastanza buono'",
    "porta_I": "I-P1-Cog"
  }
}
```

### Struttura Intervento (I)

```json
{
  "id": "I-P1-Cog",
  "label": "Scegliere il "buono abbastanza"",
  "type": "cognitive",
  "fronte": {
    "principle": "Esplorare il minimo accettabile e sostenibile.",
    "why": "Aiuta a ridurre rigidità e pressione interna",
    "verbo_mentale": "ridimensionare",
    "how_to": "Definisci il requisito minimo utile → scegli l'opzione che lo soddisfa."
  },
  "retro": {
    "aka": ["standard sostenibili", "qualità sufficiente"],
    "example_q": "Qual è un risultato "abbastanza buono" per te qui?",
    "example_C": "Scegli uno standard "abbastanza buono" da applicare a un compito reale.",
    "fallback": "Reframing: perfezione → "abbastanza bene"",
    "note": ""
  }
}
```

### Convenzioni `_label`

Nei dati JSON, `_label` indica il nome da visualizzare per un campo:
- Se presente `_label`, mostrarlo al posto del nome del campo
- Se presente `_label` + `items`, mostrare solo items (nascondere la label)
- Usato per rendere i nomi dei campi human-friendly

---

## 🎨 Design System

### Brief Estetico

**Keyword**: Minimalismo + Carattere + Professionale
**NO**: Estetica esoterica, coaching emotivo, gradienti psichedelici
**Riferimenti**: Linear, Notion, Arc Browser, Pitch, Superhuman

### Palette Colori

```css
/* Base */
--bg: #fafafa;
--fg: #0a0a0a;
--muted: #71717a;
--muted-light: #a1a1aa;
--border: #e4e4e7;
--border-light: #f4f4f5;

/* Accenti */
--accent-primary: #334155;   /* blu-grigio profondo */
--accent-secondary: #64748b; /* blu-grigio medio */

/* Type colors - toni pastello smorzati */
--type-cog: #3b82f6;   /* blu - Cognitivi */
--type-comp: #10b981;  /* verde - Comportamentali */
--type-emo: #f97316;   /* terracotta - Emotivi */
```

### Tipografia

```css
font-family: "Inter", "Source Sans 3", "IBM Plex Sans", system-ui, sans-serif;

/* Scale */
--fs-xxs: 10px;
--fs-xs: 11px;
--fs-sm: 13px;
--fs-md: 15px;
--fs-lg: 17px;
--fs-xl: 19px;

/* Line height generosa */
line-height: 1.6 (base)
line-height: 1.35 (compact)
```

### Dimensioni Carte

```css
/* Standard poker */
--card-w: 63mm;
--card-h: 88mm;
--radius: 8px;
--pad: 16px;
```

### Elementi Carta

#### Bordino Laterale (Type Indicator)
- **Larghezza**: 3px a sinistra
- **Colore**: Dipende dal tipo (Cog/Comp/Emo per I, custom per E/P)
- **Stile**: Pitch-inspired

#### Type Pill (Badge)
- **Formato**: Uppercase, 10px, bold
- **Background**: rgba(color, 0.1) - pastello
- **Border-radius**: 4px
- **Padding**: 3px 8px

#### Aliases
- **Posizione**: Sotto label principale
- **Stile**: Italico, grigio chiaro, 10-11px
- **Separatore**: virgola + spazio

#### Flip Animation
- **Duration**: 0.4s
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **NO bounce**: Professionale, non giocoso

#### Retro Layout
- **Header**: Sticky (ID + Type)
- **Content**: Scrollable con padding
- **Footer**: Sticky con branding
- **Scrollbar**: 4px, subtle, solo hover

#### Micro-elementi
- **Dot before label**: 3px, opacity 0.4
- **Divider**: 1px solid var(--border-light)
- **Shadow**: Leggera (Notion-style)
  - Default: `0 1px 3px rgba(0,0,0,0.04)`
  - Hover: `0 4px 6px rgba(0,0,0,0.06)`

### White Space

- **Gap tra carte**: 8mm
- **Padding interno carta**: 16px
- **Margin tra blocchi**: 10-12px
- **Margin label-content**: 3-4px

**Filosofia**: "Vuoto come componente estetica principale"

---

## 💻 Implementazioni

### epic-all-cards.html ⭐ (Viewer Principale)

**Scopo**: Viewer completo con navigazione intelligente E→P→I

**Layout**: Griglia responsive con tutte le 45 carte (6E + 12P + 27I)

**Features Core**:
- ✅ **Auto-load**: JSON embedded, funziona ovunque (desktop + mobile + offline)
- ✅ **Smart Filter Pattern**: Click P6 → mostra E (tutte) + P6 + I-P6-*
- ✅ **Smart Links**: Parser intelligente per E\d, P\d+, I-P\d+
- ✅ **Navigazione differenziata**:
  - Click E → scroll + flash (NO filtro, E sempre visibili)
  - Click P → filtro smart + scroll + flash
  - Click I → scroll + flash
- ✅ **Flash animation**: Ambra doppio-pulse per target visibility
- ✅ **Reset button**: Torna a vista completa
- ✅ **Search**: Filtra per ID o contenuto
- ✅ **Flip cards**: 3D flip animation

**Layout Carte Pattern (P) - Fronte**:
1. Title + Aliases
2. SHORTS (senza label, inline grigio)
3. SEGNALI (con label, inline)
4. **INTERVENTI** (link cliccabili I-PX-*)

**Mobile UX (≤768px)**:
- Toolbar ultra-compatta (~10% schermo)
- Stats bar nascosta
- Dropdown filtro nascosto
- File input mini e discreto
- Search full-width
- Scroll dinamico con offset toolbar

**Problemi risolti**:
- ✅ CORS: JSON embedded inline
- ✅ Scroll mobile: Offset dinamico toolbar height
- ✅ Link incompleti: Parser I-P7 → P7
- ✅ Target visibility: Flash animation doppio pulse

**File**:
- `epic-all-cards.html` - Unica versione (desktop + mobile, tutto embedded)

### epic-cards.css

**Scopo**: Design system condiviso

**Contenuto**:
- CSS variables (colori, dimensioni, tipografia)
- Card layout (fronte/retro, flip 3D)
- Type-specific styles (E/P/I colors)
- Micro-elementi (pills, shadows, borders)

**Nota**: Embedded inline in epic-all-cards.html per mobile compatibility

### epic.html (legacy)

**Scopo**: Viewer solo Interventi (I) con stampa

**Status**: Mantenuto per stampa carte fisiche

### epic-generic-renderer.html (utility)

**Scopo**: Debug tool per JSON con struttura _label/items

**Features**:
- Carica qualsiasi file (P0.2.json, E0.2.json, ecc.)
- Interpreta automaticamente _label
- Layout carta generico

### epic-navigator.html (obsoleto)

**Status**: ❌ Spostato in /oldies

**Motivo**: epic-all-cards.html offre funzionalità superiori:
- Confronto interventi affiancati
- Filtro smart automatico
- Link ovunque cliccabili
- Contesto completo visibile

---

## 🧭 Pattern di Navigazione

### Flow Principale (epic-all-cards.html)

**Filosofia**: Mazzo intelligente che si auto-organizza

**Modalità 1: Esplorazione libera**
1. Apri epic-all-cards.html → Auto-load
2. Vedi tutte le 45 carte in griglia
3. Flip, esplora, cerca liberamente

**Modalità 2: Flusso guidato E→P→I**
1. **Identifica emozione**: Click su carta E (es. E1)
   - Link "Pattern prioritari" o "Altri pattern" sul fronte
   - Click P6 → **Smart filter attivo**

2. **Filtra pattern + interventi**:
   - Vista: E1-E6 (sempre visibili) + P6 + I-P6-Cog + I-P6-Comp + I-P6-Emo
   - Le E restano in cima come riferimento
   - Gli interventi I-P6-* appaiono affiancati sotto P6

3. **Confronta interventi**:
   - Vedi Cog vs Comp vs Emo in griglia
   - Click intervento → scroll + flash
   - Flip per dettagli retro

4. **Reset o pivot**:
   - Click "Reset" → vista completa
   - Click altra E → riparti
   - Click P nel retro ("Non è questo se") → cambia pattern

### Comportamenti Link Intelligenti

**Parser attivo su**:
- Carte E: "possibile E6" → link E6
- Carte P: "probabile P11" → link P11
- Tutti: I-P7, I-P7-Cog → funzionano

**Comportamenti click**:
```javascript
Click E6  → scroll + flash (NO filtro - E sempre visibili)
Click P7  → filtro smart (E + P7 + I-P7-*) + scroll + flash + Reset button
Click I-* → scroll + flash
```

**Smart parsing**:
- `I-P7` (incompleto) → `P7` (pattern)
- `P\d+` → Attiva filtro pattern
- `E\d` → Solo navigazione visuale

### Flash Animation

**Scopo**: Rendere visibile la carta target dopo lo scroll

**Design**:
- Colore: Ambra (#f59e0b) - brand EPiC
- Effetto: Doppio pulse + scale(1.02)
- Durata: 1.2s
- Trigger: Dopo scroll (300ms delay)

### Mappatura E↔P↔I

Collegamenti embedded in EPIC_full.json:
- E → P: `pattern_da_esplorare.high/medium`
- P → I: Automatico via ID (I-P6-*)
- Reverse: `mapping` array per analytics

---

## 📝 Naming Conventions

### File
- `EPIC_full.json` - Dataset completo unified
- `EPIC_I_full_v9.json` - Solo interventi (legacy)
- `E0.2.json` - Solo emozioni
- `P0.2.json` - Solo pattern
- `EPIC_mapping_EPI.json` - Collegamenti

### ID Format
- Emozioni: `E1`, `E2`, ..., `E6`
- Pattern: `P1`, `P2`, ..., `P12`
- Interventi: `I-P{n}-{Type}` (es. `I-P1-Cog`, `I-P7-Comp`)

### CSS Classes
- Tipo carta: `.Cog`, `.Comp`, `.Emo`
- Stati: `.active`, `.flipped`
- Layout: `.card`, `.card-inner`, `.face`, `.front`, `.back`

---

## 🚀 Roadmap / TODO

### ✅ Completato (v2.0)
- [x] Estrarre CSS condiviso (epic-cards.css)
- [x] epic-all-cards.html (viewer completo)
- [x] Smart links tra carte (E/P parser + navigazione)
- [x] Smart filter P→I
- [x] Flash animation per target visibility
- [x] Mobile UX ottimizzato
- [x] Auto-load embedded data
- [x] Link cliccabili con comportamenti differenziati

### Futuro (nice-to-have)
- [ ] Modalità "session" (salva percorso E→P→I in localStorage)
- [ ] Export PDF personalizzato (subset di carte)
- [ ] Dark mode
- [ ] Icone SVG per tipi (Cog/Comp/Emo)
- [ ] Gesture swipe su mobile per flip
- [ ] Analytics: pattern più usati
- [ ] Shortcut keyboard (/ per search, R per reset)

---

## 🐛 Issue Known

### Status: Nessun issue noto ✅

**Issue risolti**:
- ✅ Scroll Android Chrome (fix: offset dinamico toolbar)
- ✅ CORS su mobile (fix: JSON embedded)
- ✅ Link incompleti I-P7 (fix: smart parser)
- ✅ Target card difficile da trovare (fix: flash animation)
- ✅ Toolbar mobile troppo grande (fix: CSS responsive compatto)
- ✅ Stats bar inutile su mobile (fix: display: none @media)

---

## 📐 Principi di Design (Ripasso)

1. **Minimal ma con carattere** - No fuffa, solo essenziale
2. **Professionale** - Tool di lavoro, non poster motivazionale
3. **Consistenza totale** - Template unico, nessuna creatività individuale
4. **White space generoso** - Respiro visivo
5. **Tipografia gerarchica** - Peso per importanza, non ornamento
6. **Colore mirato** - Tocchi strategici, non arcobaleni
7. **Motion sobrio** - Fluido ma non giocoso
8. **Zero rumore** - Ogni elemento ha una funzione

---

---

## 🎯 Quick Start

1. Apri `epic-all-cards.html`
2. Auto-load → Vedi 45 carte
3. Click su carta E → Esplora pattern
4. Click su pattern P → Filtra interventi
5. Confronta Cog/Comp/Emo in griglia
6. Reset → Riparti

**File necessari**:
- `epic-all-cards.html` (tutto embedded)

**Opzionale**:
- `EPIC_full.json` (se vuoi caricare versione diversa)

---

**Fine documentazione v2.0**

_Mantenuto da: Claude Code_
_Ultimo aggiornamento: 2025-11-09_
_Feature complete: epic-all-cards.html è production-ready_
