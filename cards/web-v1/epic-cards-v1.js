(function (global) {
  'use strict';

  const ENERGY_ORDER = ['E1', 'E2', 'E6', 'E4', 'E3', 'E5'];
  const LOW_ENERGIES = new Set(['E1', 'E2', 'E6']);
  const TYPE_MAP = { cognitive: 'Cog', behavioral: 'Comp', emotional: 'Emo' };
  const WATERMARK_MAP = { Cog: 'cog.png', Emo: 'emo.png', Comp: 'comp.png' };

  let data = global.EPIC_DATA || { E: [], P: [], I: [] };
  let assetBase = '';

  function setData(nextData) {
    data = nextData || { E: [], P: [], I: [] };
    return api;
  }

  function configure(options) {
    options = options || {};
    if (options.data) setData(options.data);
    if (options.assetBase != null) assetBase = String(options.assetBase).replace(/\/+$/, '');
    return api;
  }

  function asset(path) {
    return (assetBase ? assetBase + '/' : '') + path;
  }

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function list(value) {
    if (Array.isArray(value)) return value.filter(v => v != null && String(v).trim());
    if (value == null || !String(value).trim()) return [];
    return [value];
  }

  function join(value, sep) {
    return list(value).map(esc).join(sep || ' · ');
  }

  function titleCaseItalian(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const lower = text.toLocaleLowerCase('it-IT');
    return lower.charAt(0).toLocaleUpperCase('it-IT') + lower.slice(1);
  }

  function avoidWidow(value) {
    const safe = esc(value).trim().replace(/(\d)-(\d)/g, '$1&#8209;$2');
    return safe.replace(/\s+(\S+)\s+(\S+)$/, '&nbsp;$1&nbsp;$2');
  }

  function interventionType(intervention) {
    return TYPE_MAP[String(intervention?.type || '').toLowerCase()] || intervention?.type || '';
  }

  function interventionForPattern(patternId, type) {
    return (data.I || []).find(i => i.id === 'I-' + patternId + '-' + type);
  }

  function buildEnergyPatternMap() {
    const map = {};
    (data.E || []).forEach(e => {
      const high = e.fronte?.pattern_da_esplorare?.high || [];
      const medium = e.fronte?.pattern_da_esplorare?.medium || [];
      high.forEach(pid => {
        if (!map[pid]) map[pid] = {};
        map[pid][e.id] = 'high';
      });
      medium.forEach(pid => {
        if (!map[pid]) map[pid] = {};
        if (!map[pid][e.id]) map[pid][e.id] = 'medium';
      });
    });
    return map;
  }

  function parseLeverHints(value) {
    const hints = {};
    String(value || '').split(',').forEach(part => {
      const pieces = part.split(':').map(v => String(v || '').trim());
      const eid = pieces[0];
      const type = { Cog: 'Cog', Emo: 'Emo', Comp: 'Comp' }[pieces[1]];
      if (!/^E[1-6]$/.test(eid) || !type) return;
      if (!hints[eid]) hints[eid] = [];
      hints[eid].push(type);
    });
    return hints;
  }

  function renderLeverHints(types) {
    return (types || []).map(type =>
      '<span class="epic-v1-lever-hint ' + esc(type) + '" style="background-image:url(' + esc(asset('images/goccia.svg')) + ')"></span>'
    ).join('');
  }

  function renderEnergyStrip(pattern) {
    const epMap = buildEnergyPatternMap();
    const levels = epMap[pattern.id] || {};
    const hints = parseLeverHints(pattern.hint_leva);
    const icons = ENERGY_ORDER.map(eid => {
      const level = levels[eid] || 'none';
      const temp = LOW_ENERGIES.has(eid) ? 'energy-low' : 'energy-high';
      return '<span class="epic-v1-energy-dot ' + level + ' ' + temp + '">' +
        renderLeverHints(hints[eid]) +
        '<img src="' + esc(asset('images/' + eid + 'b.png')) + '" alt="' + esc(eid) + '">' +
      '</span>';
    }).join('');
    return '<div class="epic-v1-energy-strip" aria-label="Energie del pattern">' + icons + '</div>';
  }

  function renderPatternNote(position, intervention) {
    const label = intervention?.label || '';
    const verb = intervention?.fronte?.verbo_mentale || '';
    return '<div class="epic-v1-pattern-note ' + esc(position) + '">' +
      '<span>' + esc(label) + '</span>' +
      '<strong>' + esc(verb) + '</strong>' +
    '</div>';
  }

  function renderPatternFront(pattern, options) {
    options = options || {};
    const cog = options.cog || interventionForPattern(pattern.id, 'Cog');
    const emo = options.emo || interventionForPattern(pattern.id, 'Emo');
    const comp = options.comp || interventionForPattern(pattern.id, 'Comp');
    const signals = join(pattern.retro?.segnali?.items, ', ');
    const shorts = join(pattern.fronte?.shorts?.items, ', ');
    const why = pattern.retro?.why ? esc(pattern.retro.why) : '';

    return '<article class="epic-v1-card epic-v1-pattern">' +
      renderPatternNote('top', cog) +
      renderPatternNote('left', emo) +
      renderPatternNote('right', comp) +
      '<div></div>' +
      '<div class="epic-v1-pattern-main">' +
        '<div class="epic-v1-pattern-art"><img src="' + esc(asset('images/' + pattern.id + '.png')) + '" alt="' + esc(pattern.id) + '"></div>' +
        '<div class="epic-v1-text-area">' +
          '<img class="epic-v1-pattern-watermark" src="' + esc(asset('images/pattern.png')) + '" alt="">' +
          '<div class="epic-v1-pattern-title">' + esc(pattern.id) + ': ' + esc(pattern.label) + '</div>' +
          (signals ? '<div class="epic-v1-pattern-signals">' + signals + '</div>' : '') +
          (shorts ? '<div class="epic-v1-pattern-copy">' + shorts + '</div>' : '') +
          (why ? '<div class="epic-v1-pattern-copy">' + why + '</div>' : '') +
        '</div>' +
      '</div>' +
      renderEnergyStrip(pattern) +
    '</article>';
  }

  function renderIcon(kind) {
    if (kind === 'question') {
      return '<svg class="epic-v1-rescue-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9a2.7 2.7 0 0 1 5 1.4c0 2-2.5 2.2-2.5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>';
    }
    return '<svg class="epic-v1-rescue-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7H5v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12c2-4 5-6 9-5 3.5.8 5.5 3.3 5.5 6.2 0 3.6-2.8 6.3-6.7 6.3-2.2 0-4.1-.8-5.3-2.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function renderRescue(intervention) {
    const question = intervention.retro?.example_q;
    const fallback = intervention.retro?.fallback;
    if (!question && !fallback) return '';
    return '<div class="epic-v1-rescue">' +
      '<div class="epic-v1-rescue-item">' + renderIcon('question') + avoidWidow(question || '') + '</div>' +
      '<div class="epic-v1-rescue-item">' + renderIcon('fallback') + avoidWidow(fallback || '') + '</div>' +
    '</div>';
  }

  function renderInterventionFront(intervention) {
    if (!intervention) return '<div class="epic-v1-card epic-v1-intervention"><div>n/a</div></div>';
    const type = interventionType(intervention);
    const watermark = WATERMARK_MAP[type] || 'cog.png';
    const why = intervention.fronte?.why ||
      (Array.isArray(intervention.retro?.aka) ? intervention.retro.aka.join(' · ') : '');

    return '<article class="epic-v1-card epic-v1-intervention ' + esc(type) + '">' +
      '<div class="epic-v1-type-pill">' + esc(type) + '</div>' +
      '<div class="epic-v1-intervention-main">' +
        '<div class="epic-v1-principle">' + esc(intervention.fronte?.principle) + '</div>' +
        (why ? '<div class="epic-v1-why">' + avoidWidow(why) + '</div>' : '') +
        '<div class="epic-v1-example">' + avoidWidow(intervention.retro?.example_C || '') + '</div>' +
      '</div>' +
      '<div class="epic-v1-lever">' +
        '<img class="epic-v1-lever-watermark" src="' + esc(asset('images/' + watermark)) + '" alt="">' +
        '<div class="epic-v1-verb">' + esc(titleCaseItalian(intervention.fronte?.verbo_mentale)) + '</div>' +
        '<div class="epic-v1-task">' + avoidWidow(intervention.fronte?.how_to || '') + '</div>' +
      '</div>' +
      renderRescue(intervention) +
    '</article>';
  }

  function renderEnergyFront(energy) {
    const klass = LOW_ENERGIES.has(energy.id) ? 'energy-low' : 'energy-high';
    const aliases = join((energy.fronte?.aliases?.items || []).slice(0, 4), ', ');
    const subtypes = join((energy.fronte?.subtypes?.items || []).map(v => String(v).toLowerCase()), ', ');
    const seen = list(energy.fronte?.quando_la_vedi?.items).slice(0, 3);
    const notThis = list(energy.fronte?.non_e_questa_se?.items).slice(0, 2);

    return '<article class="epic-v1-card epic-v1-energy ' + klass + '">' +
      '<div>' +
        '<div class="epic-v1-energy-title">' + esc(energy.label) + '</div>' +
        (subtypes ? '<div class="epic-v1-energy-subtypes">' + subtypes + '</div>' : '') +
      '</div>' +
      '<div class="epic-v1-energy-art"><img src="' + esc(asset('images/' + energy.id + '.png')) + '" alt="' + esc(energy.label) + '"></div>' +
      '<div class="epic-v1-energy-text">' +
        '<img class="epic-v1-energy-watermark" src="' + esc(asset('images/logo/epic_logo.png')) + '" alt="">' +
        (aliases ? '<div class="epic-v1-energy-aliases">' + aliases + '</div>' : '') +
        renderEnergyList('Quando la vedi', seen) +
        renderEnergyList('Non è questa se', notThis) +
      '</div>' +
    '</article>';
  }

  function renderEnergyList(title, items) {
    const safe = list(items);
    if (!safe.length) return '';
    return '<section><div class="epic-v1-energy-section-title">' + esc(title) + '</div>' +
      '<ul class="epic-v1-energy-list">' + safe.map(v => '<li>' + esc(v) + '</li>').join('') + '</ul></section>';
  }

  function renderCrossFront(pattern) {
    const cog = interventionForPattern(pattern.id, 'Cog');
    const emo = interventionForPattern(pattern.id, 'Emo');
    const comp = interventionForPattern(pattern.id, 'Comp');
    return '<div class="epic-v1-cross">' +
      '<div class="epic-v1-cross-cog">' + renderInterventionFront(cog) + '</div>' +
      '<div class="epic-v1-cross-emo">' + renderInterventionFront(emo) + '</div>' +
      '<div class="epic-v1-cross-pattern">' + renderPatternFront(pattern, { cog, emo, comp }) + '</div>' +
      '<div class="epic-v1-cross-comp">' + renderInterventionFront(comp) + '</div>' +
    '</div>';
  }

  const api = {
    ENERGY_ORDER,
    configure,
    setData,
    renderEnergyFront,
    renderPatternFront,
    renderInterventionFront,
    renderCrossFront,
    interventionForPattern
  };

  global.EPICCardsV1 = api;
})(window);
