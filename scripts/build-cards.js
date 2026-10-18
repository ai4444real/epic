const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const locale = String(process.argv[2] || '').toLowerCase();

if (!/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(locale)) {
  fail('Usage: node scripts/build-cards.js <locale>\nExample: node scripts/build-cards.js en-us');
}

const suffix = locale === 'it' ? '' : `_${locale}`;
const sourcePath = path.join(appRoot, 'data', `EPIC_full${suffix}.json`);
const outputPath = path.join(appRoot, 'data', `EPIC_data${suffix}.js`);
const energyRetroPath = path.join(appRoot, 'data', 'energy-retro.json');
const localePath = path.join(appRoot, 'cards', 'locales', `${locale}.json`);
const printRoot = path.join(appRoot, 'cards', 'generated', locale, 'print');
const debugRoot = path.join(appRoot, 'cards', 'generated', locale, 'debug');
const printV1 = path.join(appRoot, 'cards', 'print-v1');

for (const required of [sourcePath, localePath]) {
  if (!fs.existsSync(required)) fail(`Required file not found: ${relative(required)}`);
}

const source = readJson(sourcePath);
const labels = readJson(localePath);
const energyRetro = fs.existsSync(energyRetroPath) ? readJson(energyRetroPath) : {};

validateSource(source);
const transformed = transform(source, energyRetro[locale] || {}, labels.dataLabels);
writeText(outputPath,
  `var EPIC_DATA = ${JSON.stringify(transformed, null, 2)};\n` +
  `var EPIC_CARD_I18N = ${JSON.stringify(labels.web, null, 2)};\n`
);

buildPrint(transformed, labels.print);
buildDebug(transformed, labels.debug);

console.log(`Built ${locale}: E:${transformed.E.length} P:${transformed.P.length} I:${transformed.I.length}`);
console.log(`Web data: ${relative(outputPath)}`);
console.log(`Print: ${relative(printRoot)}`);
console.log(`Debug: ${relative(path.join(debugRoot, 'epic-cards-debug.html'))}`);

function transform(src, energyOverrides, text) {

  const E = src.E.map(e => {
    const patch = energyOverrides[e.id] || {};
    return copyEditorialFields(e, {
      id: e.id,
      label: e.label,
      fronte: {
        aliases: section(text.aliases, e.aliases),
        subtypes: section(text.subtypes, e.subtypes),
        quando_la_vedi: section(text.whenSeen, e.quando_la_vedi),
        non_e_questa_se: section(text.notThisEnergy, e.non_e_questa_se),
        pattern_da_esplorare: {
          _label: text.patternsToExplore,
          high: toArray(e.patterns_high),
          medium: toArray(e.patterns_medium)
        }
      },
      retro: {
        _label: text.back,
        red_flags: section(text.redFlags, e.red_flags),
        hint: firstText(e.hint, e.note, patch.hint),
        porta_I: firstText(e.porta_I, patch.porta_I)
      }
    });
  });

  const P = src.P.map(p => {
    return copyEditorialFields(p, {
      id: p.id,
      label: p.label,
      hint_leva: firstText(p.hint_leva),
      fronte: {
        aliases: section(text.aliases, p.aliases),
        non_e_questo_se: section(text.notThisPattern, p.non_e_questo_se),
        shorts: section(text.short, p.shorts)
      },
      retro: {
        _label: text.back,
        segnali: section(text.signals, p.segnali),
        hint: firstText(p.hint),
        porta_I: firstText(p.porta_I),
        why: firstText(p.why)
      }
    });
  });

  const I = src.I.map(i => copyEditorialFields(i, {
    id: i.id,
    label: i.label,
    type: i.type,
    pattern: firstText(i.pattern),
    fronte: {
      principle: firstText(i.principle),
      why: firstText(i.why),
      serve_a: firstText(i.serve_a),
      verbo_mentale: firstText(i.verbo_mentale),
      how_to: firstText(i.how_to)
    },
    retro: {
      aka: toArray(i.aka),
      example_q: firstText(i.example_q),
      example_C: firstText(i.example_C),
      fallback: firstText(i.fallback),
      tags: toArray(i.tags),
      note: firstText(i.note)
    }
  }));

  return { E, P, I };
}

function copyEditorialFields(sourceItem, result) {
  for (const key of ['original_label', 'clinical_flag']) {
    if (sourceItem[key] != null && sourceItem[key] !== '') result[key] = sourceItem[key];
  }
  return result;
}

function buildPrint(data, text) {
  fs.mkdirSync(printRoot, { recursive: true });

  const jobs = [
    ['epic-energy-print-allfront.template.html', 'front', text.front, 'epic-energy-print-allfront.built.html'],
    ['epic-energy-print-allfront.template.html', 'back', text.back, 'epic-energy-print-allback.built.html'],
    ['epic-cross-layout-toPrint-all.template.html', 'front', text.front, 'epic-cross-layout-toPrint-all.built.html'],
    ['epic-cross-layout-toPrint-all.template.html', 'back', text.back, 'epic-cross-layout-toPrint-allback.built.html']
  ];

  for (const [templateName, side, sideLabel, outputName] of jobs) {
    const templatePath = path.join(printV1, 'templates', templateName);
    const template = fs.readFileSync(templatePath, 'utf8');
    let built = template
      .replaceAll('__PRINT_SIDE__', side)
      .replaceAll('__PRINT_SIDE_LABEL__', sideLabel);

    for (const [from, to] of Object.entries(text.replacements || {})) {
      built = built.replaceAll(from, to);
    }
    if (styleBlock(built) !== styleBlock(template)) {
      fail(`Locale ${locale} changes print geometry in ${templateName}`);
    }
    built = built
      .replace('__EPIC_DATA__', JSON.stringify(data))
      .replaceAll('app/images/', '../../../print-v1/built/app/images/')
      .replace(/(?<!app\/)images\//g, '../../../print-v1/built/images/');
    writeText(path.join(printRoot, outputName), built);
  }
}

function buildDebug(data, text) {
  if (!text) fail(`Missing debug labels in ${relative(localePath)}`);
  fs.mkdirSync(debugRoot, { recursive: true });
  const energyOrder = ['E1', 'E2', 'E6', 'E4', 'E3', 'E5'];
  const lowEnergies = new Set(['E1', 'E2', 'E6']);
  const interventions = new Map(data.I.map(item => [item.id, item]));
  const energyLevels = {};

  for (const energy of data.E) {
    for (const patternId of energy.fronte.pattern_da_esplorare.high) {
      energyLevels[patternId] ||= {};
      energyLevels[patternId][energy.id] = 'high';
    }
    for (const patternId of energy.fronte.pattern_da_esplorare.medium) {
      energyLevels[patternId] ||= {};
      energyLevels[patternId][energy.id] ||= 'medium';
    }
  }

  const energyMap = new Map(data.E.map(item => [item.id, item]));
  const patternSections = data.P.map(pattern => {
    const levels = energyLevels[pattern.id] || {};
    const energies = energyOrder.map(id => {
      const energy = energyMap.get(id);
      const level = levels[id] || 'off';
      const temperature = lowEnergies.has(id) ? 'low' : 'high-temp';
      return `<div class="energy ${level} ${temperature}" title="${escapeHtml(energy?.label || id)} · ${escapeHtml(text[level])}">
        <img src="../../../print-v1/built/images/${id}b.png" alt="">
        <span>${id}</span><small>${escapeHtml(energy?.label || '')}</small>
      </div>`;
    }).join('');

    const facts = [
      [text.signals, pattern.retro?.segnali?.items],
      [text.shorts, pattern.fronte?.shorts?.items],
      [text.why, pattern.retro?.why]
    ].map(([label, value]) => debugRow(label, value)).join('');

    const interventionCards = ['Cog', 'Emo', 'Comp'].map(type => {
      const item = interventions.get(`I-${pattern.id}-${type}`);
      if (!item) return `<article class="intervention ${type}"><h3>${type}</h3><p class="missing">${escapeHtml(text.missing)}</p></article>`;
      return `<article class="intervention ${type}">
        <header><span>${type}</span><h3>${escapeHtml(item.fronte.verbo_mentale)}: ${escapeHtml(item.label)}</h3></header>
        <div class="how-to">${escapeHtml(item.fronte.how_to)}</div>
        <div class="intervention-fields">
          ${debugRow(text.principle, item.fronte.principle, 'strong')}
          ${debugRow(text.interventionWhy, item.fronte.why, 'em')}
          ${debugRow(text.exampleC, item.retro.example_C)}
        </div>
        <div class="rescues">
          ${debugRow(text.exampleQ, item.retro.example_q)}
          ${debugRow(text.fallback, item.retro.fallback)}
        </div>
      </article>`;
    }).join('');

    return `<section class="pattern" id="${pattern.id}">
      <div class="pattern-head"><div class="pattern-id">${pattern.id}</div><h2>${escapeHtml(pattern.label)}</h2></div>
      <div class="energies">${energies}</div>
      <div class="legend"><span class="legend-high">${escapeHtml(text.high)}</span><span class="legend-medium">${escapeHtml(text.medium)}</span><span class="legend-off">${escapeHtml(text.off)}</span></div>
      <div class="pattern-fields">${facts}</div>
      <div class="interventions">${interventionCards}</div>
    </section>`;
  }).join('\n');

  const navigation = data.P.map(pattern => `<a href="#${pattern.id}">${pattern.id}</a>`).join('');
  const html = `<!doctype html>
<html lang="${escapeHtml(locale)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>EPiC · ${escapeHtml(text.title)}</title>
  <style>
    :root{--ink:#17202a;--muted:#667085;--line:#d8dee8;--paper:#fff;--bg:#eef1f5;--cog:#2878d0;--emo:#e76f2e;--comp:#15956f;--low:#d8ecff;--hot:#ffe39b}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.42 system-ui,-apple-system,"Segoe UI",sans-serif}
    nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:7px;padding:10px 18px;background:rgba(23,32,42,.94);color:#fff;box-shadow:0 2px 10px #0003}
    nav strong{margin-right:auto}nav a{color:#fff;text-decoration:none;border:1px solid #ffffff55;border-radius:5px;padding:3px 7px;font-size:12px}nav a:hover{background:#fff;color:#111}
    main{max-width:1500px;margin:auto;padding:22px}.pattern{scroll-margin-top:58px;background:var(--paper);border:1px solid var(--line);border-radius:12px;margin:0 0 28px;padding:22px;box-shadow:0 4px 16px #1d29391a}
    .pattern-head{display:flex;align-items:baseline;gap:12px}.pattern-id{font:800 22px/1 ui-monospace,monospace;color:var(--muted)}h2{font-size:30px;margin:0 0 12px}
    .energies{display:flex;gap:10px;flex-wrap:wrap;border-block:1px solid var(--line);padding:12px 0}.energy{width:128px;display:grid;grid-template-columns:34px 24px 1fr;align-items:center;gap:5px;border-radius:8px;padding:5px 7px;border:1px solid var(--line)}
    .energy img{width:32px;height:32px;object-fit:contain}.energy span{font-weight:800}.energy small{font-size:11px;line-height:1.1}.energy.low.high{background:var(--low)}.energy.high-temp.high{background:var(--hot)}.energy.medium{filter:grayscale(1);background:#edf0f3}.energy.off{opacity:.25}
    .legend{display:flex;gap:16px;justify-content:flex-end;color:var(--muted);font-size:11px;margin:5px 0 13px}.legend span:before{content:"";display:inline-block;width:9px;height:9px;margin-right:5px;border-radius:50%;background:#333}.legend-medium:before{opacity:.45}.legend-off:before{opacity:.15}
    .pattern-fields,.intervention-fields,.rescues{display:grid;grid-template-columns:minmax(125px,180px) 1fr;border-top:1px solid var(--line)}.field-label,.field-value{padding:8px 10px;border-bottom:1px solid var(--line)}.field-label{color:var(--muted);font:700 11px/1.3 ui-monospace,monospace;background:#f7f8fa}.field-value{white-space:pre-line}.empty{color:#b42318;background:#fff2f0;font-style:italic}
    .interventions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}.intervention{border:1px solid var(--line);border-top:6px solid;border-radius:8px;overflow:hidden}.intervention.Cog{border-top-color:var(--cog)}.intervention.Emo{border-top-color:var(--emo)}.intervention.Comp{border-top-color:var(--comp)}
    .intervention header{padding:12px 14px 8px}.intervention header span{font-weight:800;font-size:12px}.intervention.Cog header span{color:var(--cog)}.intervention.Emo header span{color:var(--emo)}.intervention.Comp header span{color:var(--comp)}h3{font-size:19px;line-height:1.15;margin:4px 0;text-transform:none}.how-to{min-height:66px;padding:0 14px 12px;font-size:16px;font-weight:650}.intervention-fields,.rescues{grid-template-columns:112px 1fr}.rescues{margin-top:12px;border-top:3px solid #344054}.missing{padding:14px;color:#b42318}
    @media(max-width:1100px){main{padding:12px}.pattern{padding:15px}.interventions{gap:7px}.intervention header{padding:9px 9px 6px}h3{font-size:15px}.how-to{min-height:58px;padding:0 9px 9px;font-size:13px}.intervention-fields,.rescues{grid-template-columns:82px 1fr}.field-label,.field-value{padding:6px;font-size:12px}.field-label{font-size:10px}}
    @media(max-width:650px){main{padding:6px}.pattern{padding:9px}.interventions{gap:4px}.pattern-fields{grid-template-columns:1fr}.intervention-fields,.rescues{grid-template-columns:1fr}.field-label{padding-bottom:2px}.field-value{padding-top:2px}.intervention header{padding:6px}.intervention header span{font-size:10px}h3{font-size:12px}.how-to{min-height:0;padding:0 6px 7px;font-size:11px}.intervention-fields .field-value,.rescues .field-value{font-size:10px}nav a{display:none}}
    @media print{body{background:#fff}nav{display:none}main{max-width:none;padding:0}.pattern{box-shadow:none;break-before:page;border:0;margin:0;padding:10mm}.pattern:first-child{break-before:auto}.interventions{gap:8px}.field-label,.field-value{padding:5px 7px}}
  </style>
</head>
<body>
  <nav><strong>EPiC · ${escapeHtml(text.title)}</strong>${navigation}</nav>
  <main>${patternSections}</main>
</body>
</html>\n`;
  writeText(path.join(debugRoot, 'epic-cards-debug.html'), html);
}

function debugRow(label, value, tag) {
  const values = Array.isArray(value) ? value.filter(Boolean) : (value ? [value] : []);
  const content = values.length ? values.map(escapeHtml).join('\n') : '—';
  const klass = values.length ? '' : ' empty';
  const wrapped = tag && values.length ? `<${tag}>${content}</${tag}>` : content;
  return `<div class="field-label">${escapeHtml(label)}</div><div class="field-value${klass}">${wrapped}</div>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function styleBlock(html) {
  const match = html.match(/<style>[\s\S]*?<\/style>/);
  if (!match) fail('Print template has no style block');
  return match[0];
}

function validateSource(src) {
  for (const group of ['E', 'P', 'I']) {
    if (!Array.isArray(src[group])) fail(`Source field ${group} must be an array`);
    const ids = src[group].map(item => item && item.id);
    if (ids.some(id => typeof id !== 'string' || !id)) fail(`${group} contains an invalid id`);
    if (new Set(ids).size !== ids.length) fail(`${group} contains duplicate ids`);
  }

  const patternIds = new Set(src.P.map(p => p.id));
  for (const energy of src.E) {
    for (const field of ['patterns_high', 'patterns_medium']) {
      for (const id of toArray(energy[field])) {
        if (!patternIds.has(id)) fail(`${energy.id}.${field} references missing pattern ${id}`);
      }
    }
  }
  for (const intervention of src.I) {
    if (!patternIds.has(intervention.pattern)) {
      fail(`${intervention.id}.pattern references missing pattern ${intervention.pattern}`);
    }
  }
}

function section(label, value) {
  return { _label: label, items: toArray(value) };
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

function firstText(...values) {
  const found = values.find(value => typeof value === 'string' && value.trim());
  return found || '';
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${relative(filePath)}: ${error.message}`);
  }
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function relative(filePath) {
  return path.relative(appRoot, filePath).replaceAll('\\', '/');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
