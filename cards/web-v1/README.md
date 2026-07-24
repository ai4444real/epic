# EPiC Cards Web v1

`web-v1` is the reusable web rendering layer derived from `cards/print-v1`.

It keeps the visual language of the physical v1 cards, but removes print-only
constraints such as A4 pages, crop marks, millimetric registration, and mirrored
back sheets.

## Files

- `epic-cards-v1.css`: shared card and cross styles for online tools.
- `epic-cards-v1.js`: renderer exposed as `window.EPICCardsV1`.

## Intended Use

Online tools should use this layer when they need the physical-card look:

- live table
- simulator final cross
- explorer final cross
- cross trainer
- selected card views in all-cards

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
