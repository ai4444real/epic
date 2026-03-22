// ---- EXPLORER-SPECIFIC JS ----

    // Intent → Intervention type mapping
    const INTENT_MAP = {
      fare: 'Comp',
      capire: 'Cog',
      allinearsi: 'Emo'
    };

    // ---- State ----
    let currentStep = 1;
    let chosenE = null;
    let chosenP = null;
    let selectedIntents = new Set();
    let eViewMode = 'compact';
    let iViewMode = 'compact';

    // ---- Init ----
    window.addEventListener('DOMContentLoaded', () => {
      renderStep1();
    });

    window.addEventListener('resize', scaleCross);

    function renderStepBar(step) {
      const labels = ['E + Intent', 'P', 'I'];
      const steps = 3;
      let html = '';
      for (let i = 0; i < steps; i++) {
        const cls = i < step ? 'done' : (i === step ? 'current' : '');
        html += '<div class="step-dot ' + cls + '"></div>';
        if (i < steps - 1) html += '<div class="step-line"></div>';
      }
      html += '<span class="step-label">Step ' + (step + 1) + '/3 \u2014 ' + labels[step] + '</span>';
      return html;
    }

    // ---- View toggle ----
    function setEView(mode) {
      eViewMode = mode;
      const grid = document.getElementById('eGrid');
      grid.classList.toggle('compact', mode === 'compact');
      document.getElementById('btnCompact').classList.toggle('active', mode === 'compact');
      document.getElementById('btnDetail').classList.toggle('active', mode === 'detail');
    }

    function setIView(mode) {
      iViewMode = mode;
      document.getElementById('btnICompact').classList.toggle('active', mode === 'compact');
      document.getElementById('btnIDetail').classList.toggle('active', mode === 'detail');
      document.getElementById('iCompactView').style.display = mode === 'compact' ? '' : 'none';
      document.getElementById('crossContainer').style.display = mode === 'detail' ? '' : 'none';
      if (mode === 'detail') requestAnimationFrame(scaleCross);
    }

    // ---- Intent ----
    function toggleIntent(intent) {
      if (selectedIntents.has(intent)) {
        selectedIntents.delete(intent);
      } else {
        selectedIntents.add(intent);
      }
      updateIntentChips();
    }

    function updateIntentChips() {
      document.querySelectorAll('.intent-chip').forEach(chip => {
        const intent = chip.getAttribute('data-intent');
        chip.classList.remove('active-fare', 'active-capire', 'active-allinearsi');
        if (selectedIntents.has(intent)) {
          chip.classList.add('active-' + intent);
        }
      });
    }

    // ---- Navigation ----
    function goToStep(step) {
      currentStep = step;
      if (step === 1) renderStep1();
      else if (step === 2) renderStep2();
      else if (step === 3) renderStep3();
    }

    function goBack() {
      if (currentStep <= 1) return;
      goToStep(currentStep - 1);
    }

    function newExploration() {
      chosenE = null;
      chosenP = null;
      selectedIntents.clear();
      goToStep(1);
    }

    // ---- Step 1: E + Intent ----
    function renderStep1() {
      switchView('view-emotion');
      document.getElementById('stepBar1').innerHTML = renderStepBar(0);
      document.getElementById('navE').style.display = chosenE ? 'flex' : 'none';

      const grid = document.getElementById('eGrid');
      renderEGrid(grid, { selectedPrimary: chosenE });

      grid.querySelectorAll('.e-btn').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          if (ev.target.closest('.e-flip-btn')) {
            ev.stopPropagation();
            btn.classList.toggle('flipped');
            return;
          }
          selectE(btn.getAttribute('data-eid'));
        });
      });

      updateIntentChips();
    }

    function selectE(eid) {
      if (eid === chosenE) {
        chosenE = null;
      } else {
        chosenE = eid;
      }
      updateESelection();
    }

    function updateESelection() {
      document.querySelectorAll('.e-btn').forEach(b => {
        b.classList.remove('selected-primary');
      });
      if (chosenE) {
        document.querySelector('.e-btn[data-eid="' + chosenE + '"]').classList.add('selected-primary');
      }
      document.getElementById('navE').style.display = chosenE ? 'flex' : 'none';
    }

    // ---- Step 2: Pattern ----
    function renderStep2() {
      switchView('view-pattern');
      document.getElementById('stepBar2').innerHTML = renderStepBar(1);

      const e = eMap[chosenE];
      if (!e) return;

      const allP = new Set();
      (e.fronte?.pattern_da_esplorare?.high || []).forEach(p => allP.add(p));
      (e.fronte?.pattern_da_esplorare?.medium || []).forEach(p => allP.add(p));
      const pIds = [...allP];

      const list = document.getElementById('pList');
      list.innerHTML = pIds.map(pid => {
        const p = pMap[pid];
        if (!p) return '';
        const shorts = (p.fronte?.shorts?.items || []).map(s => esc(s)).join(' / ');
        const selected = chosenP === pid ? ' selected' : '';
        return '<div class="p-btn' + selected + '" data-pid="' + pid + '">' +
          '<div class="p-id">' + esc(pid) + '</div>' +
          '<div class="p-label">' + esc(p.label) + '</div>' +
          (shorts ? '<div class="p-shorts">' + shorts + '</div>' : '') +
        '</div>';
      }).join('');

      list.querySelectorAll('.p-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-pid');
          chosenP = pid;
          list.querySelectorAll('.p-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          goToStep(3);
        });
      });
    }

    // ---- Step 3: Interventions ----
    function renderStep3() {
      switchView('view-intervention');
      document.getElementById('stepBar3').innerHTML = renderStepBar(2);

      const p = pMap[chosenP];
      if (!p) return;

      const cog = iMap['I-' + chosenP + '-Cog'];
      const emo = iMap['I-' + chosenP + '-Emo'];
      const comp = iMap['I-' + chosenP + '-Comp'];

      // Determine which types are highlighted by intent
      const highlightTypes = new Set();
      selectedIntents.forEach(intent => {
        if (INTENT_MAP[intent]) highlightTypes.add(INTENT_MAP[intent]);
      });

      // Compact view
      renderICompactExplorer(p, cog, emo, comp, highlightTypes);

      // Cross view
      const layout = document.getElementById('crossLayout');
      const cogExtra = highlightTypes.has('Cog') ? 'intent-match' : '';
      const emoExtra = highlightTypes.has('Emo') ? 'intent-match' : '';
      const compExtra = highlightTypes.has('Comp') ? 'intent-match' : '';

      layout.innerHTML =
        '<div class="cross-top">' + renderISelectable(cog, cogExtra) + '</div>' +
        '<div class="cross-left">' + renderISelectable(emo, emoExtra) + '</div>' +
        '<div class="cross-center">' + renderPCard(p) + '</div>' +
        '<div class="cross-right">' + renderISelectable(comp, compExtra) + '</div>';

      // Show correct view
      document.getElementById('iCompactView').style.display = iViewMode === 'compact' ? '' : 'none';
      document.getElementById('crossContainer').style.display = iViewMode === 'detail' ? '' : 'none';
      document.getElementById('btnICompact').classList.toggle('active', iViewMode === 'compact');
      document.getElementById('btnIDetail').classList.toggle('active', iViewMode === 'detail');

      if (iViewMode === 'detail') requestAnimationFrame(scaleCross);
    }

    function renderICompactExplorer(p, cog, emo, comp, highlightTypes) {
      const items = [
        { i: cog, type: 'Cognitivo', cls: 'ic-cog', arrow: '\u2191', iType: 'Cog', intent: 'capire' },
        { i: emo, type: 'Emotivo', cls: 'ic-emo', arrow: '\u2190', iType: 'Emo', intent: 'allinearsi' },
        { i: comp, type: 'Comportamentale', cls: 'ic-comp', arrow: '\u2192', iType: 'Comp', intent: 'fare' }
      ];

      const container = document.getElementById('iCompactView');
      container.innerHTML =
        '<div class="i-compact-header"><div class="ic-pid">' + esc(p.id) + ' \u2014 Pattern</div><div class="ic-label">' + esc(p.label) + '</div></div>' +
        '<div class="i-compact-list">' +
          items.map(({ i, type, cls, arrow, iType, intent }) => {
            if (!i) return '';
            const match = highlightTypes.has(iType);
            const matchCls = match ? ' intent-match' : '';
            const badgeCls = 'badge-' + intent;
            const intentLabels = { fare: 'Fare', capire: 'Capire', allinearsi: 'Allinearsi' };
            return '<div class="i-compact-card' + matchCls + '" data-iid="' + esc(i.id) + '">' +
              '<div class="ic-pos ' + cls + '">' + arrow + '</div>' +
              '<div class="ic-body">' +
                '<div class="ic-type ' + cls + '">' + type + '</div>' +
                '<div class="ic-title">' + esc(i.label) + '</div>' +
                '<div class="ic-principle">' + esc(i.fronte?.principle || '') + '</div>' +
              '</div>' +
              '<span class="intent-badge ' + badgeCls + '">' + intentLabels[intent] + '</span>' +
            '</div>';
          }).join('') +
        '</div>';
    }
