# EPiC Cards Print v1

Questa cartella congela la versione 1.0 delle carte fisiche EPiC per stampa.

## Stato

`print-v1` e' uno snapshot della versione validata per tipografia:

- Energy front
- Energy back
- Cross front
- Cross back

La geometria di stampa e' parte del formato: A4, griglie, dimensioni carta, segni di taglio e registri non vanno modificati qui salvo bug reali di stampa.

## File da stampare

I file pronti per stampa sono in `built/`:

- `epic-energy-print-allfront.built.html`
- `epic-energy-print-allback.built.html`
- `epic-cross-layout-toPrint-all.built.html`
- `epic-cross-layout-toPrint-allback.built.html`

Aprirli da `cards/print-v1/built/`, cosi' i path relativi agli asset restano validi.

## Contenuto

- `built/`: HTML validati e asset necessari per aprirli dalla cartella snapshot.
- `templates/`: copie dei template sorgente usati per generare la v1.
- `builders/`: copie dei builder usati al momento del congelamento.
- `data/`: copia dei dati `EPIC_data.js` usati al momento del congelamento.
- `MANIFEST.sha256`: hash di tutti i file nello snapshot.

## Regola operativa

Non usare questa cartella come area di lavoro ordinaria.

Per una futura v2:

1. copiare `print-v1` in una nuova cartella, ad esempio `print-v2`;
2. modificare la nuova versione;
3. lasciare `print-v1` come riferimento storico stabile.

## Verifica hash

Da PowerShell, dalla root del progetto:

```powershell
$base = Resolve-Path 'cards\print-v1'
Get-Content 'cards\print-v1\MANIFEST.sha256' | ForEach-Object {
  $hash, $rel = $_ -split '\s+', 2
  $file = Join-Path $base $rel
  $actual = (Get-FileHash -Algorithm SHA256 $file).Hash.ToLowerInvariant()
  if ($actual -ne $hash) { throw "Hash mismatch: $rel" }
}
"print-v1 OK"
```

