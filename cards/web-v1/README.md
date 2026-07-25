# EPiC Cards Web v1

`web-v1` is the reusable web rendering layer derived from `cards/print-v1`.

It keeps the visual language of the physical v1 cards, but removes print-only
constraints such as A4 pages, crop marks, millimetric registration, and mirrored
back sheets.

The goal is simple: when a user sees a card online, it should feel like the same
object they can hold in their hand.

## Files

- `epic-cards-v1.css`: shared card and cross styles for online tools.
- `epic-cards-v1.js`: renderer exposed as `window.EPICCardsV1`.

## Rendered Cards

The renderer supports the front side of:

- Energy cards
- Pattern cards
- Intervention cards
- Full cross layout: Cog, Emo, Pattern, Comp

It intentionally does not render print backs. Backs belong to `print-v1`.

## Intended Use

Online tools should use this layer when they need the physical-card look:

- live table
- simulator final cross
- explorer final cross
- cross trainer
- selected card views in all-cards, if/when migrated

`print-v1` remains the frozen typography/print source. Do not edit `print-v1`
for web behavior.

## Basic Setup

From an app page:

```html
<link rel="stylesheet" href="cards/web-v1/epic-cards-v1.css">
<script src="cards/web-v1/epic-cards-v1.js"></script>
```

Then:

```js
EPICCardsV1.setData(EPIC_DATA);
container.innerHTML = EPICCardsV1.renderCrossFront(pattern);
```

Asset paths default to app-root relative paths, such as `images/P1.png` and
`images/logo/epic_logo.png`.

## API

```js
EPICCardsV1.configure({
  data: EPIC_DATA,
  assetBase: ""
});

EPICCardsV1.renderEnergyFront(energy);
EPICCardsV1.renderPatternFront(pattern);
EPICCardsV1.renderInterventionFront(intervention);
EPICCardsV1.renderCrossFront(pattern);
```

`renderCrossFront(pattern)` derives the three interventions from the configured
data, using the pattern id.

## Layout Rules

Web v1 cards keep the v1 physical aspect ratio:

- card ratio: `63 / 88`
- default width: `315px`
- default height: `440px`

Cards should normally stay fixed-ratio. If a tool needs smaller cards, prefer
setting these CSS variables instead of changing the renderer:

```css
.some-tool {
  --epic-v1-card-w: 280px;
  --epic-v1-card-h: calc(var(--epic-v1-card-w) * 88 / 63);
  --epic-v1-density: 0.9;
}
```

`--epic-v1-density` controls internal typography and spacing. It is deliberately
numeric, not computed with CSS division, because Firefox mobile had rendering
issues with calculated density values.

## Cross Layout

The cross renderer uses its own width variable:

```css
.some-tool .epic-v1-cross {
  --epic-v1-cross-card-w: 280px;
  --epic-v1-density: 0.9;
}
```

Use tool-level overrides for context-specific tuning. For example, live table
uses different density values for closed cards, open cross cards, and mobile.

## Current Tool Notes

- `epic-cross.html`: uses `web-v1` for the trainer cards and open cross.
- `epic-explorer*.html`: uses `web-v1` for the final cross.
- `epic-simulator*.html`: uses `web-v1` for the final cross.
- `epic-live-table.html` and `epic-live-view.html`: use `web-v1` for single
  cards and full crosses.
- All Cards is not yet fully migrated to `web-v1`.

## Maintenance Notes

- Keep `print-v1` frozen unless the physical printed v1 changes.
- Put web-only adjustments in `web-v1` or the consuming tool CSS.
- Avoid making cards variable-height unless there is a deliberate product reason.
- If text overflows, first tune density, spacing, or context-specific width.
- Keep commits small when tuning layout. Visual regressions are easier to revert
  when each experiment is isolated.
