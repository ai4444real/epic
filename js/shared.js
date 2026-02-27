/* ---- EPiC SHARED JS ---- */
/* Condiviso tra simulator, explorer e future viste */

// ---- Data maps ----
const patterns = EPIC_DATA.P || [];
const interventions = EPIC_DATA.I || [];
const emotions = EPIC_DATA.E || [];

// Mapping alternativo con nomi semantici (tenuto per riferimento)
// const eImagesNamed = {
//   E1: 'images/ansia.png', E2: 'images/paura.png',
//   E3: 'images/frustrazione.png', E4: 'images/stress.png',
//   E5: 'images/rabbia.png', E6: 'images/tristezza.png'
// };

const eImages = {
  E1: 'images/E1.png', E2: 'images/E2.png', E3: 'images/E3.png',
  E4: 'images/E4.png', E5: 'images/E5.png', E6: 'images/E6.png'
};

const pImages = {
  P1: 'images/P1.png', P2: 'images/P2.png', P3: 'images/P3.png',
  P4: 'images/P4.png', P5: 'images/P5.png', P6: 'images/P6.png',
  P7: 'images/P7.png', P8: 'images/P8.png', P9: 'images/P9.png',
  P10: 'images/P10.png', P11: 'images/P11.png', P12: 'images/P12.png'
};

const eFunc = {
  E1: 'agitazione', E2: 'allarme', E3: 'attrito',
  E4: 'pressione', E5: 'attacco', E6: 'vuoto'
};

const pMap = Object.fromEntries(patterns.map(p => [p.id, p]));
const iMap = Object.fromEntries(interventions.map(i => [i.id, i]));
const eMap = Object.fromEntries(emotions.map(e => [e.id, e]));

// E order: cold (top row) then warm (bottom row)
const eOrder = ['E2','E1','E6','E3','E5','E4'];

// ---- Utility ----
function esc(str) {
  return String(str ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.style.display = viewId === 'view-scenarios' ? 'none' : '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function flipCard(btn, e) {
  e.stopPropagation();
  const card = btn.closest('.card');
  if (card) card.classList.toggle('flipped');
}

// ---- Mobile cross scaling ----
function scaleCross() {
  const layout = document.getElementById('crossLayout');
  const container = document.getElementById('crossContainer');
  if (!layout || !container) return;

  layout.style.transform = '';
  container.style.height = '';

  requestAnimationFrame(() => {
    const layoutW = layout.scrollWidth;
    const availW = container.clientWidth;
    if (layoutW > availW) {
      const scale = availW / layoutW;
      layout.style.transform = 'scale(' + scale + ')';
      container.style.height = (layout.scrollHeight * scale) + 'px';
    }
  });
}

// ---- Lookup ----
function getScore(answerKey, category, id) {
  return (answerKey[category] && answerKey[category][id]) || 0;
}

function getWhy(scenario, category, id) {
  return (scenario.why && scenario.why[category] && scenario.why[category][id]) || '';
}

function scoreLevelLabel(s) {
  if (s === 2) return 'Molto rilevante';
  if (s === 1) return 'Rilevante';
  return 'Poco rilevante';
}

// ---- Rendering ----
function renderFeedback(score, why) {
  return '<div class="feedback score-' + score + '">' +
    '<div class="feedback-score">' + score + '</div>' +
    '<div class="feedback-text">' +
      '<div class="feedback-level">' + scoreLevelLabel(score) + '</div>' +
      (why ? '<div class="feedback-why">' + esc(why) + '</div>' : '') +
    '</div>' +
  '</div>';
}

function renderBackBlock(label, value) {
  if (!value) return '';
  if (Array.isArray(value) && value.length === 0) return '';
  let content;
  if (Array.isArray(value)) {
    content = value.map(v => esc(v)).join(' &middot; ');
  } else {
    content = esc(value);
  }
  return '<div class="back-block"><div class="back-label">' + label + '</div><div class="back-text">' + content + '</div></div>';
}

function renderPCard(p) {
  const aliases = (p.fronte?.aliases?.items || []).map(a => esc(a)).join(', ');
  const shorts = (p.fronte?.shorts?.items || []).map(s => esc(s)).join(', ');

  let backHtml = '';
  backHtml += '<header class="card-head"><div class="card-id">' + esc(p.id) + ' (retro)</div><div class="type-pill">Pattern</div></header>';
  backHtml += renderBackBlock('Segnali', (p.retro?.segnali?.items || []).slice(0, 4));
  backHtml += renderBackBlock('Non \u00e8 questo se', p.fronte?.non_e_questo_se?.items);
  backHtml += renderBackBlock('Hint', p.retro?.hint);
  backHtml += renderBackBlock('Why', p.retro?.why);

  return '<div class="card P">' +
    '<div class="card-inner">' +
      '<div class="face front">' +
        '<div>' +
          '<header class="card-head"><div class="card-id">' + esc(p.id) + '</div><div class="type-pill">Pattern</div></header>' +
          '<div class="title">' + esc(p.label) + '</div>' +
          (aliases ? '<div class="aliases-line">' + aliases + '</div>' : '') +
          (shorts ? '<div class="shorts-line">' + shorts + '</div>' : '') +
        '</div>' +
        '<footer class="footer"><span>EPiC</span><span>Pattern</span></footer>' +
        '<button class="flip-btn" onclick="flipCard(this,event)" title="Gira carta">&#x21bb;</button>' +
      '</div>' +
      '<div class="face back">' +
        backHtml +
        '<button class="flip-btn" onclick="flipCard(this,event)" title="Gira carta">&#x21bb;</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderISelectable(i, extraClass) {
  if (!i) return '<div class="empty-slot">n/a</div>';
  const typeMap = { cognitive: 'Cog', behavioral: 'Comp', emotional: 'Emo' };
  const t = typeMap[(i.type || '').toLowerCase()] || i.type;
  const extra = extraClass ? ' ' + extraClass : '';

  const aka = (Array.isArray(i.retro?.aka) && i.retro.aka.length > 0)
    ? '<div class="aka-line">' + i.retro.aka.map(v => esc(v)).join(' &middot; ') + '</div>' : '';

  let backHtml = '';
  backHtml += '<header class="card-head"><div class="card-id">' + esc(i.id) + ' (retro)</div><div class="type-pill">' + esc(t) + '</div></header>';
  backHtml += aka;
  backHtml += renderBackBlock('Domanda', i.retro?.example_q);
  backHtml += renderBackBlock('Compito', i.retro?.example_C);
  backHtml += renderBackBlock('Fallback', i.retro?.fallback);
  if (i.retro?.note) backHtml += renderBackBlock('Note', i.retro.note);

  return '<div class="i-selectable' + extra + '" data-iid="' + esc(i.id) + '">' +
    '<div class="card ' + t + '">' +
      '<div class="card-inner">' +
        '<div class="face front">' +
          '<div>' +
            '<header class="card-head"><div class="card-id">' + esc(i.id) + '</div><div class="type-pill">' + esc(t) + '</div></header>' +
            '<div class="title">' + esc(i.label) + '</div>' +
            '<div class="principle-line">' + esc(i.fronte?.principle) + '</div>' +
            '<div class="howto-line"><strong>' + esc(i.fronte?.verbo_mentale) + '</strong>: ' + esc(i.fronte?.how_to) + '</div>' +
          '</div>' +
          '<footer class="footer"><span>EPiC</span><span>Intervento</span></footer>' +
          '<button class="flip-btn" onclick="flipCard(this,event)" title="Gira carta">&#x21bb;</button>' +
        '</div>' +
        '<div class="face back">' +
          backHtml +
          '<button class="flip-btn" onclick="flipCard(this,event)" title="Gira carta">&#x21bb;</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ---- E grid rendering (shared between views) ----
function renderEGrid(gridEl, opts) {
  opts = opts || {};
  const selectedPrimary = opts.selectedPrimary || null;
  const selectedSecondary = opts.selectedSecondary || null;

  const orderedEmotions = eOrder.map(id => emotions.find(e => e.id === id)).filter(Boolean);
  gridEl.innerHTML = orderedEmotions.map((e, idx) => {
    const subs = (e.fronte?.subtypes?.items || []).slice(0, 3).join(', ');
    const aliases = (e.fronte?.aliases?.items || []).slice(0, 4).join(', ');
    const selected = selectedPrimary === e.id ? ' selected-primary' : (selectedSecondary === e.id ? ' selected-secondary' : '');

    const quando = (e.fronte?.quando_la_vedi?.items || []).map(v => esc(v)).join(', ');
    const nonE = (e.fronte?.non_e_questa_se?.items || []).map(v => esc(v)).join('; ');
    const redFlags = (e.retro?.red_flags?.items || []).map(v => esc(v)).join(', ');

    let backContent = '<div class="e-back-title"><span class="e-icon-sm"><img src="' + eImages[e.id] + '"></span>' + esc(e.label) + '</div>';
    if (quando) backContent += '<div class="back-block"><div class="back-label">Quando la vedi</div><div class="back-text" style="font-size:10px">' + quando + '</div></div>';
    if (nonE) backContent += '<div class="back-block"><div class="back-label">Non \u00e8 questa se</div><div class="back-text" style="font-size:10px">' + nonE + '</div></div>';
    if (redFlags) backContent += '<div class="back-block"><div class="back-label">Red flags</div><div class="back-text" style="font-size:10px">' + redFlags + '</div></div>';

    const temp = idx < 3 ? ' e-cold' : ' e-warm';
    return '<div class="e-btn e-with-bg' + temp + selected + '" data-eid="' + e.id + '">' +
      '<div class="e-inner">' +
        '<div class="e-face e-front">' +
          '<div class="e-label">' + esc(e.label) + '</div>' +
          '<div class="e-bottom">' +
            (eImages[e.id] ? '<img class="e-img" src="' + eImages[e.id] + '" alt="' + esc(e.label) + '">' : '') +
            (eFunc[e.id] ? '<div class="e-func">' + esc(eFunc[e.id]) + '</div>' : '') +
          '</div>' +
          '<div class="e-sub">' + esc(subs) + '</div>' +
          (aliases ? '<div class="e-aliases">' + esc(aliases) + '</div>' : '') +
        '</div>' +
        '<div class="e-face e-back">' + backContent + '</div>' +
      '</div>' +
      '<button class="e-flip-btn" title="Gira carta">&#x21bb;</button>' +
    '</div>';
  }).join('');
}
