// ---- SIMULATOR-SPECIFIC JS ----

    // ---- Supabase ----
    const SUPABASE_URL = 'https://afbecjijvzalkycttqtj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYmVjamlqdnphbGt5Y3R0cXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkyMDU0MywiZXhwIjoyMDY4NDk2NTQzfQ.y7e4V6JUUIRAtbK6uvEthpF8zArzwqphoUhOELMceFc';

    async function fetchScenariosFromSupabase() {
      const btn = document.getElementById('fetchScenariosBtn');
      btn.disabled = true;
      btn.textContent = 'Caricamento...';
      btn.style.color = '';
      btn.style.borderColor = '';
      try {
        const resp = await fetch(
          SUPABASE_URL + '/rest/v1/rpc/get_random_epic_scenarios_fresh_first',
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Accept': 'application/json' } }
        );
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        const arr = Array.isArray(data) ? data : [data];
        const scenarios = arr.map(r => r.payload || r).filter(r => r && r.id);
        if (scenarios.length === 0) throw new Error('Nessuno scenario trovato');
        SCENARIOS = scenarios;
        renderDifficultyFilter();
        renderScenarioList();
        btn.textContent = '\u2713 ' + scenarios.length + ' scenari';
        btn.style.color = 'var(--score-high)';
        btn.style.borderColor = 'var(--score-high)';
      } catch (e) {
        btn.textContent = 'Errore';
        btn.style.color = '#dc2626';
        btn.style.borderColor = '#fca5a5';
        console.error('Supabase fetch error:', e);
      } finally {
        btn.disabled = false;
      }
    }

    // ---- State ----
    let currentStep = 0;
    let currentScenario = null;
    let chosenE1 = null, chosenE2 = null;
    let chosenP = null;
    let chosenI1 = null, chosenI2 = null;
    let scoreP = 0;

    function calcScoreE() {
      let s = 0;
      if (chosenE1) s += getScore(currentScenario.answer_key, 'E', chosenE1);
      if (chosenE2) {
        const s2 = getScore(currentScenario.answer_key, 'E', chosenE2);
        s += s2 > 0 ? s2 : -1;
      }
      return s;
    }
    function calcScoreI() {
      let s = 0;
      if (chosenI1) s += getScore(currentScenario.answer_key, 'I', chosenI1);
      if (chosenI2) {
        const s2 = getScore(currentScenario.answer_key, 'I', chosenI2);
        s += s2 > 0 ? s2 : -1;
      }
      return s;
    }

    const LOG_KEY = 'epic_sim_log_v1';
    const DETAIL_LOG_KEY = 'epic_sim_detail_log';
    let eViewMode = 'compact';

    function setEView(mode) {
      eViewMode = mode;
      const grid = document.getElementById('eGrid');
      grid.classList.toggle('compact', mode === 'compact');
      document.getElementById('btnCompact').classList.toggle('active', mode === 'compact');
      document.getElementById('btnDetail').classList.toggle('active', mode === 'detail');
      if (mode === 'detail') {
        const log = JSON.parse(localStorage.getItem(DETAIL_LOG_KEY) || '[]');
        log.push({ ts: new Date().toISOString(), scenario_id: currentScenario?.id || null, action: 'detail_view' });
        localStorage.setItem(DETAIL_LOG_KEY, JSON.stringify(log));
      }
    }

    let iViewMode = 'compact';

    function setIView(mode) {
      iViewMode = mode;
      document.getElementById('btnICompact').classList.toggle('active', mode === 'compact');
      document.getElementById('btnIDetail').classList.toggle('active', mode === 'detail');
      document.getElementById('iCompactView').style.display = mode === 'compact' ? '' : 'none';
      document.getElementById('crossContainer').style.display = mode === 'detail' ? '' : 'none';
      if (mode === 'detail') {
        requestAnimationFrame(scaleCross);
        const log = JSON.parse(localStorage.getItem(DETAIL_LOG_KEY) || '[]');
        log.push({ ts: new Date().toISOString(), scenario_id: currentScenario?.id || null, action: 'detail_cross_view' });
        localStorage.setItem(DETAIL_LOG_KEY, JSON.stringify(log));
      }
    }

    function renderICompact() {
      const p = pMap[chosenP];
      if (!p) return;
      const cog = iMap['I-' + chosenP + '-Cog'];
      const emo = iMap['I-' + chosenP + '-Emo'];
      const comp = iMap['I-' + chosenP + '-Comp'];

      const items = [
        { i: emo, type: 'Emotivo', cls: 'ic-emo', arrow: '\u2190' },
        { i: cog, type: 'Cognitivo', cls: 'ic-cog', arrow: '\u2191' },
        { i: comp, type: 'Comportamentale', cls: 'ic-comp', arrow: '\u2192' }
      ];

      const container = document.getElementById('iCompactView');
      container.innerHTML =
        '<div class="i-compact-header"><div class="ic-pid">' + esc(p.id) + ' \u2014 Pattern</div><div class="ic-label">' + esc(p.label) + '</div></div>' +
        '<div class="i-compact-list">' +
          items.map(({ i, type, cls, arrow }) => {
            if (!i) return '';
            const sel = chosenI1 === i.id ? ' selected-primary' : (chosenI2 === i.id ? ' selected-secondary' : '');
            return '<div class="i-compact-card' + sel + '" data-iid="' + esc(i.id) + '">' +
              '<div class="ic-pos ' + cls + '">' + arrow + '</div>' +
              '<div class="ic-body">' +
                '<div class="ic-type ' + cls + '">' + type + '</div>' +
                '<div class="ic-title">' + esc(i.label) + '</div>' +
                '<div class="ic-principle">' + esc(i.fronte?.principle || '') + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>';

      container.querySelectorAll('.i-compact-card').forEach(el => {
        el.addEventListener('click', () => {
          selectI(el.getAttribute('data-iid'));
        });
      });
    }

    // ---- Init ----
    window.addEventListener('DOMContentLoaded', () => {
      renderDifficultyFilter();
      renderScenarioList();
      checkResume();
    });

    window.addEventListener('resize', scaleCross);

    function renderStepBar(step) {
      const labels = ['E', 'P', 'I'];
      let html = '';
      for (let i = 0; i < 3; i++) {
        const cls = i < step ? 'done' : (i === step ? 'current' : '');
        html += '<div class="step-dot ' + cls + '"></div>';
        if (i < 2) html += '<div class="step-line"></div>';
      }
      html += '<span class="step-label">Step ' + (step + 1) + '/3 \u2014 ' + labels[step] + '</span>';
      return html;
    }

    // ---- Step 0: Scenarios ----
    let activeDifficulty = 'all';

    function renderDifficultyFilter() {
      const diffs = ['all', 'easy', 'middle', 'difficult', 'hard'];
      const labels = { all: 'Tutti', easy: 'Easy', middle: 'Middle', difficult: 'Difficult', hard: 'Hard' };
      const counts = {};
      diffs.forEach(d => counts[d] = d === 'all' ? SCENARIOS.length : SCENARIOS.filter(s => s.difficulty === d).length);
      const container = document.getElementById('diffFilter');
      container.innerHTML = diffs
        .filter(d => d === 'all' || counts[d] > 0)
        .map(d => '<button class="diff-btn' + (activeDifficulty === d ? ' active' : '') +
          '" onclick="setDifficulty(\'' + d + '\')">' + labels[d] + ' (' + counts[d] + ')</button>').join('');
    }

    function setDifficulty(d) {
      activeDifficulty = d;
      renderDifficultyFilter();
      renderScenarioList();
    }

    function renderScenarioList() {
      const filtered = activeDifficulty === 'all' ? SCENARIOS : SCENARIOS.filter(s => s.difficulty === activeDifficulty);
      const list = document.getElementById('scenarioList');
      list.innerHTML = filtered.map(s => {
        const teaser = s.client_text.length > 120 ? s.client_text.slice(0, 120) + '...' : s.client_text;
        const scenarioId = s.id ? '<span class="sc-id">ID: ' + esc(s.id) + '</span>' : '';
        const diffLabel = s.difficulty ? '<span class="sc-diff diff-' + s.difficulty + '">' + esc(s.difficulty) + '</span>' : '';
        const meta = (scenarioId || diffLabel) ? '<div class="sc-meta">' + scenarioId + diffLabel + '</div>' : '';
        return '<div class="scenario-card" onclick="selectScenario(\'' + s.id + '\')">' +
          '<div class="sc-title">' + esc(s.title) + '</div>' +
          '<div class="sc-teaser">' + esc(teaser) + '</div>' +
          meta +
        '</div>';
      }).join('');
    }

    function checkResume() {
      const saved = localStorage.getItem('epic_sim_current');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          const sc = SCENARIOS.find(s => s.id === state.scenario_id);
          if (sc) {
            const box = document.getElementById('resumeBox');
            box.style.display = 'block';
            box.innerHTML = '<div class="scenario-card" onclick="resumeSession()" style="border-color: var(--type-p);">' +
              '<div class="sc-title">Riprendi: ' + esc(sc.title) + '</div>' +
              '<div class="sc-teaser">Step ' + (state.step + 1) + '/3</div>' +
            '</div>';
          }
        } catch(e) {}
      }
    }

    function selectScenario(id) {
      currentScenario = SCENARIOS.find(s => s.id === id);
      if (!currentScenario) return;
      chosenE1 = null; chosenE2 = null; chosenP = null; chosenI1 = null; chosenI2 = null;
      scoreP = 0;
      goToStep(1);
    }

    function resumeSession() {
      try {
        const state = JSON.parse(localStorage.getItem('epic_sim_current'));
        currentScenario = SCENARIOS.find(s => s.id === state.scenario_id);
        chosenE1 = state.E1 || null;
        chosenE2 = state.E2 || null;
        chosenP = state.P || null;
        chosenI1 = state.I1 || null;
        chosenI2 = state.I2 || null;
        scoreP = state.score_P || 0;
        goToStep(state.step + 1);
      } catch(e) {
        selectScenario(SCENARIOS[0].id);
      }
    }

    function saveCurrentState() {
      localStorage.setItem('epic_sim_current', JSON.stringify({
        scenario_id: currentScenario.id,
        step: currentStep - 1,
        E1: chosenE1, E2: chosenE2, P: chosenP, I1: chosenI1, I2: chosenI2,
        score_P: scoreP
      }));
    }

    // ---- Step navigation ----
    function goToStep(step) {
      currentStep = step;
      if (step === 0) { switchView('view-scenarios'); return; }
      if (step === 1) renderStep1();
      else if (step === 2) renderStep2();
      else if (step === 3) renderStep3();
      else if (step === 4) renderResult();
    }

    function goBack() {
      if (currentStep <= 1) goToStep(0);
      else goToStep(currentStep - 1);
    }

    // ---- Step 1: Emotion ----
    function renderStep1() {
      switchView('view-emotion');
      document.getElementById('stepBar1').innerHTML = renderStepBar(0);
      document.getElementById('clientText1').innerHTML = esc(currentScenario.client_text);
      document.getElementById('feedbackE').innerHTML = '';
      document.getElementById('navE').style.display = 'none';

      const grid = document.getElementById('eGrid');
      renderEGrid(grid, { selectedPrimary: chosenE1, selectedSecondary: chosenE2 });

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

      if (chosenE1) showEFeedback();
    }

    function selectE(eid) {
      if (eid === chosenE1) { chosenE1 = chosenE2; chosenE2 = null; updateESelection(); return; }
      if (eid === chosenE2) { chosenE2 = null; updateESelection(); return; }
      if (!chosenE1) chosenE1 = eid;
      else if (!chosenE2) chosenE2 = eid;
      else chosenE2 = eid; // replace secondary
      updateESelection();
    }

    function updateESelection() {
      document.querySelectorAll('.e-btn').forEach(b => {
        b.classList.remove('selected-primary', 'selected-secondary');
      });
      if (chosenE1) document.querySelector('.e-btn[data-eid="' + chosenE1 + '"]').classList.add('selected-primary');
      if (chosenE2) document.querySelector('.e-btn[data-eid="' + chosenE2 + '"]').classList.add('selected-secondary');
      showEFeedback();
      saveCurrentState();
    }

    function showEFeedback() {
      const fb = document.getElementById('feedbackE');
      if (!chosenE1) { fb.innerHTML = ''; document.getElementById('navE').style.display = 'none'; return; }
      let html = '';
      const s1 = getScore(currentScenario.answer_key, 'E', chosenE1);
      const w1 = getWhy(currentScenario, 'E', chosenE1);
      html += '<div style="margin-bottom:4px; font-size: 11px; font-weight:600; text-transform:uppercase; color:var(--muted)">Primaria</div>';
      html += renderFeedback(s1, w1);
      if (chosenE2) {
        const s2raw = getScore(currentScenario.answer_key, 'E', chosenE2);
        const s2 = s2raw > 0 ? s2raw : -1;
        const w2 = getWhy(currentScenario, 'E', chosenE2) || (s2 === -1 ? 'Scelta non pertinente: -1 punto' : '');
        html += '<div style="margin-top:8px; margin-bottom:4px; font-size: 11px; font-weight:600; text-transform:uppercase; color:var(--muted)">Secondaria</div>';
        html += renderFeedback(s2raw, s2 === -1 ? 'Non pertinente: \u22121 punto' : w2);
      }
      fb.innerHTML = html;
      document.getElementById('navE').style.display = 'flex';
    }

    // ---- Step 2: Pattern ----
    function renderStep2() {
      switchView('view-pattern');
      document.getElementById('stepBar2').innerHTML = renderStepBar(1);
      document.getElementById('clientText2').innerHTML = esc(currentScenario.client_text);
      document.getElementById('feedbackP').innerHTML = '';
      document.getElementById('navP').style.display = 'none';

      const e1 = eMap[chosenE1];
      const e2 = chosenE2 ? eMap[chosenE2] : null;
      const allP = new Set();
      [e1, e2].filter(Boolean).forEach(e => {
        (e.fronte?.pattern_da_esplorare?.high || []).forEach(p => allP.add(p));
        (e.fronte?.pattern_da_esplorare?.medium || []).forEach(p => allP.add(p));
      });
      const subsetP = [...allP].sort(() => Math.random() - 0.5);
      const list = document.getElementById('pList');
      list.innerHTML = subsetP.map(pid => {
        const p = pMap[pid];
        if (!p) return '';
        const shorts = (p.fronte?.shorts?.items || []).map(s => esc(s)).join(' / ');
        const selected = chosenP === pid ? ' selected' : '';
        const img = pImages[pid] ? '<div class="p-img"><img src="' + pImages[pid] + '" alt="' + esc(pid) + '"></div>' : '';
        return '<div class="p-btn' + selected + '" data-pid="' + pid + '" onclick="selectP(\'' + pid + '\')">' +
          img +
          '<div class="p-body">' +
            '<div class="p-id">' + esc(pid) + '</div>' +
            '<div class="p-label">' + esc(p.label) + '</div>' +
            (shorts ? '<div class="p-shorts">' + shorts + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('');

      if (chosenP) showPFeedback(chosenP, false);
    }

    function selectP(pid) {
      chosenP = pid;
      scoreP = getScore(currentScenario.answer_key, 'P', pid);
      document.querySelectorAll('.p-btn').forEach(b => b.classList.remove('selected'));
      document.querySelector('.p-btn[data-pid="' + pid + '"]').classList.add('selected');
      showPFeedback(pid, true);
      chosenI1 = null; chosenI2 = null;
      saveCurrentState();
    }

    function showPFeedback(pid, animate) {
      const score = getScore(currentScenario.answer_key, 'P', pid);
      const why = getWhy(currentScenario, 'P', pid);
      const fb = document.getElementById('feedbackP');
      fb.innerHTML = renderFeedback(score, why);
      if (!animate) fb.querySelector('.feedback').style.animation = 'none';
      document.getElementById('navP').style.display = 'flex';
    }

    // ---- Step 3: Intervention (Cross) ----
    function renderStep3() {
      switchView('view-intervention');
      document.getElementById('stepBar3').innerHTML = renderStepBar(2);
      document.getElementById('clientText3').innerHTML = esc(currentScenario.client_text);
      document.getElementById('feedbackI').innerHTML = '';
      document.getElementById('navI').style.display = 'none';

      const p = pMap[chosenP];
      if (!p) return;

      renderICompact();

      const cog = iMap['I-' + chosenP + '-Cog'];
      const emo = iMap['I-' + chosenP + '-Emo'];
      const comp = iMap['I-' + chosenP + '-Comp'];

      const layout = document.getElementById('crossLayout');
      layout.innerHTML =
        '<div class="cross-top">' + renderISelectable(cog) + '</div>' +
        '<div class="cross-left">' + renderISelectable(emo) + '</div>' +
        '<div class="cross-center">' + renderPCard(p) + '</div>' +
        '<div class="cross-right">' + renderISelectable(comp) + '</div>';

      layout.querySelectorAll('.i-selectable').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.flip-btn')) return;
          const iid = el.getAttribute('data-iid');
          selectI(iid);
        });
      });

      document.getElementById('iCompactView').style.display = iViewMode === 'compact' ? '' : 'none';
      document.getElementById('crossContainer').style.display = iViewMode === 'detail' ? '' : 'none';
      document.getElementById('btnICompact').classList.toggle('active', iViewMode === 'compact');
      document.getElementById('btnIDetail').classList.toggle('active', iViewMode === 'detail');

      if (chosenI1) {
        if (layout.querySelector('.i-selectable[data-iid="' + chosenI1 + '"]'))
          layout.querySelector('.i-selectable[data-iid="' + chosenI1 + '"]').classList.add('selected-primary');
        if (chosenI2 && layout.querySelector('.i-selectable[data-iid="' + chosenI2 + '"]'))
          layout.querySelector('.i-selectable[data-iid="' + chosenI2 + '"]').classList.add('selected-secondary');
        showIFeedback();
      }

      if (iViewMode === 'detail') requestAnimationFrame(scaleCross);
    }

    function selectI(iid) {
      if (iid === chosenI1) { chosenI1 = chosenI2; chosenI2 = null; updateISelection(); return; }
      if (iid === chosenI2) { chosenI2 = null; updateISelection(); return; }
      if (!chosenI1) chosenI1 = iid;
      else if (!chosenI2) chosenI2 = iid;
      else chosenI2 = iid; // replace secondary
      updateISelection();
    }

    function updateISelection() {
      document.querySelectorAll('.i-selectable').forEach(el => el.classList.remove('selected-primary', 'selected-secondary'));
      if (chosenI1) { const s = document.querySelector('.i-selectable[data-iid="' + chosenI1 + '"]'); if (s) s.classList.add('selected-primary'); }
      if (chosenI2) { const s = document.querySelector('.i-selectable[data-iid="' + chosenI2 + '"]'); if (s) s.classList.add('selected-secondary'); }
      document.querySelectorAll('.i-compact-card').forEach(c => c.classList.remove('selected-primary', 'selected-secondary'));
      if (chosenI1) { const s = document.querySelector('.i-compact-card[data-iid="' + chosenI1 + '"]'); if (s) s.classList.add('selected-primary'); }
      if (chosenI2) { const s = document.querySelector('.i-compact-card[data-iid="' + chosenI2 + '"]'); if (s) s.classList.add('selected-secondary'); }
      showIFeedback();
      saveCurrentState();
    }

    function showIFeedback() {
      const fb = document.getElementById('feedbackI');
      if (!chosenI1) { fb.innerHTML = ''; document.getElementById('navI').style.display = 'none'; return; }
      let html = '';
      const s1 = getScore(currentScenario.answer_key, 'I', chosenI1);
      const w1 = getWhy(currentScenario, 'I', chosenI1);
      html += '<div style="margin-bottom:4px; font-size: 11px; font-weight:600; text-transform:uppercase; color:var(--muted)">Primario</div>';
      html += renderFeedback(s1, w1);
      if (chosenI2) {
        const s2raw = getScore(currentScenario.answer_key, 'I', chosenI2);
        const s2 = s2raw > 0 ? s2raw : -1;
        const w2 = getWhy(currentScenario, 'I', chosenI2) || (s2 === -1 ? 'Scelta non pertinente: -1 punto' : '');
        html += '<div style="margin-top:8px; margin-bottom:4px; font-size: 11px; font-weight:600; text-transform:uppercase; color:var(--muted)">Secondario</div>';
        html += renderFeedback(s2raw, s2 === -1 ? 'Non pertinente: \u22121 punto' : w2);
      }
      fb.innerHTML = html;
      document.getElementById('navI').style.display = 'flex';
    }

    // ---- Step 4: Result ----
    function saveTurn() {
      const scoreE = calcScoreE();
      const scoreI = calcScoreI();
      const total = scoreE + scoreP + scoreI;
      const entry = {
        ts: new Date().toISOString(),
        mode: 'sim',
        scenario_id: currentScenario.id,
        E1: chosenE1, E2: chosenE2,
        P: chosenP,
        I1: chosenI1, I2: chosenI2,
        score_E: scoreE,
        score_P: scoreP,
        score_I: scoreI,
        score_total: total,
        notes: ''
      };

      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      log.push(entry);
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
      localStorage.removeItem('epic_sim_current');

      goToStep(4);

      const ta = document.getElementById('turnNotes');
      ta.value = '';
      ta.oninput = () => {
        const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
        if (log.length > 0) {
          log[log.length - 1].notes = ta.value;
          localStorage.setItem(LOG_KEY, JSON.stringify(log));
        }
      };
    }

    function renderResult() {
      switchView('view-result');
      document.getElementById('clientTextResult').innerHTML = esc(currentScenario.client_text);
      document.getElementById('solutionPanel').innerHTML = '';
      document.getElementById('solutionPanel').classList.remove('open');
      document.getElementById('solToggleBtn').textContent = 'Vedi soluzione';
      const scoreE = calcScoreE();
      const scoreI = calcScoreI();
      const total = scoreE + scoreP + scoreI;
      const maxScore = 2 + (chosenE2 ? 2 : 0) + 2 + 2 + (chosenI2 ? 2 : 0);

      let scoreColor = 'var(--score-low)';
      if (total >= maxScore * 0.7) scoreColor = 'var(--score-high)';
      else if (total >= maxScore * 0.4) scoreColor = 'var(--score-mid)';

      const fillPct = Math.max(0, Math.round((total / maxScore) * 100));

      document.getElementById('totalScore').innerHTML =
        '<div class="big-score" style="color:' + scoreColor + '">' + total + '<span class="score-max"> / ' + maxScore + '</span></div>' +
        '<div class="score-label">' + esc(currentScenario.title) + '</div>' +
        '<div class="score-bar"><div class="score-bar-fill" style="width:' + fillPct + '%; background:' + scoreColor + '"></div></div>';

      const e1Label = eMap[chosenE1] ? eMap[chosenE1].label : chosenE1;
      const s1E = getScore(currentScenario.answer_key, 'E', chosenE1);
      let eHtml = renderResultRow('Emozione', chosenE1 + ' \u2014 ' + e1Label, s1E);
      if (chosenE2) {
        const e2Label = eMap[chosenE2] ? eMap[chosenE2].label : chosenE2;
        const s2raw = getScore(currentScenario.answer_key, 'E', chosenE2);
        const s2 = s2raw > 0 ? s2raw : -1;
        eHtml += renderResultRow('Emozione 2\u00aa', chosenE2 + ' \u2014 ' + e2Label, s2);
      }
      const pLabel = pMap[chosenP] ? pMap[chosenP].label : chosenP;
      const i1Obj = iMap[chosenI1];
      const i1Label = i1Obj ? i1Obj.label : chosenI1;
      const s1I = getScore(currentScenario.answer_key, 'I', chosenI1);
      let iHtml = renderResultRow('Intervento', chosenI1 + ' \u2014 ' + i1Label, s1I);
      if (chosenI2) {
        const i2Obj = iMap[chosenI2];
        const i2Label = i2Obj ? i2Obj.label : chosenI2;
        const s2raw = getScore(currentScenario.answer_key, 'I', chosenI2);
        const s2 = s2raw > 0 ? s2raw : -1;
        iHtml += renderResultRow('Intervento 2\u00b0', chosenI2 + ' \u2014 ' + i2Label, s2);
      }

      document.getElementById('resultSummary').innerHTML = eHtml +
        renderResultRow('Pattern', chosenP + ' \u2014 ' + pLabel, scoreP) +
        iHtml;
    }

    function renderResultRow(stepLabel, choice, score) {
      const cls = score < 0 ? 'penalty' : 's' + score;
      return '<div class="result-row">' +
        '<div class="result-step-label">' + stepLabel + '</div>' +
        '<div class="result-choice">' + esc(choice) + '</div>' +
        '<div class="result-pts ' + cls + '">' + score + '</div>' +
      '</div>';
    }

    function toggleSolution() {
      const panel = document.getElementById('solutionPanel');
      const btn = document.getElementById('solToggleBtn');
      if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        btn.textContent = 'Vedi soluzione';
      } else {
        if (!panel.innerHTML) panel.innerHTML = renderSolution();
        panel.classList.add('open');
        btn.textContent = 'Nascondi soluzione';
      }
    }

    function renderSolution() {
      const ak = currentScenario.answer_key;
      const why = currentScenario.why || {};
      let html = '<h3>Soluzione commentata</h3>';

      // Helper: find best choices (highest score) in a category
      function getBest(cat) {
        const entries = ak[cat] || {};
        const maxS = Math.max(0, ...Object.values(entries));
        if (maxS === 0) return [];
        return Object.entries(entries).filter(([, s]) => s === maxS).map(([id]) => ({ id, score: maxS }));
      }

      // Helper: render one solution section
      function renderSolSection(title, cat, chosenIds, labelFn) {
        let h = '<div class="sol-section"><div class="sol-section-title">' + title + '</div>';
        const best = getBest(cat);
        const bestIds = best.map(b => b.id);

        // Show best choices
        best.forEach(({ id, score }) => {
          const label = labelFn(id);
          const w = getWhy(currentScenario, cat, id);
          const isChosen = chosenIds.includes(id);
          h += '<div class="sol-item sol-best">' +
            '<div class="sol-label best">' + (isChosen ? '\u2713 Migliore (' + score + ' pt) \u2014 Hai scelto bene!' : '\u2713 Migliore (' + score + ' pt)') + '</div>' +
            '<div><span class="sol-id">' + esc(id) + '</span> \u2014 ' + esc(label) + '</div>' +
            (w ? '<div class="sol-why">' + esc(w) + '</div>' : '') +
          '</div>';
        });

        // Show your choices if not already shown as best
        chosenIds.forEach(id => {
          if (bestIds.includes(id)) return;
          const label = labelFn(id);
          const s = (ak[cat] && ak[cat][id]) || 0;
          const w = getWhy(currentScenario, cat, id);
          let cls, tag;
          if (s === 1) { cls = 'sol-yours-partial'; tag = 'Tu \u2014 Parziale (1 pt)'; }
          else if (s === 0) { cls = 'sol-yours-wrong'; tag = 'Tu \u2014 Non rilevante (0 pt)'; }
          else { cls = 'sol-yours-penalty'; tag = 'Tu \u2014 Non pertinente (\u22121 pt)'; }
          h += '<div class="sol-item ' + cls + '">' +
            '<div class="sol-label you">' + tag + '</div>' +
            '<div><span class="sol-id">' + esc(id) + '</span> \u2014 ' + esc(label) + '</div>' +
            (w ? '<div class="sol-why">' + esc(w) + '</div>' : '') +
          '</div>';
        });

        // Show other relevant (score 1) not chosen and not already shown as best
        Object.entries(ak[cat] || {}).forEach(([id, s]) => {
          if (s !== 1 || chosenIds.includes(id) || bestIds.includes(id)) return;
          const label = labelFn(id);
          const w = getWhy(currentScenario, cat, id);
          h += '<div class="sol-item" style="background:rgba(202,138,4,0.04); border-left:2px dashed var(--score-mid); opacity:0.7">' +
            '<div class="sol-label" style="color:var(--score-mid)">Anche rilevante (1 pt)</div>' +
            '<div><span class="sol-id">' + esc(id) + '</span> \u2014 ' + esc(label) + '</div>' +
            (w ? '<div class="sol-why">' + esc(w) + '</div>' : '') +
          '</div>';
        });

        h += '</div>';
        return h;
      }

      // E section
      const chosenEs = [chosenE1, chosenE2].filter(Boolean);
      html += renderSolSection('Emozione', 'E', chosenEs, id => eMap[id] ? eMap[id].label : id);

      // P section
      html += renderSolSection('Pattern', 'P', [chosenP].filter(Boolean), id => pMap[id] ? pMap[id].label : id);

      // I section
      const chosenIs = [chosenI1, chosenI2].filter(Boolean);
      html += renderSolSection('Intervento', 'I', chosenIs, id => iMap[id] ? iMap[id].label : id);

      return html;
    }

    function tryAlternatives() { goToStep(1); }

    function newScenario() {
      currentScenario = null;
      chosenE1 = null; chosenE2 = null; chosenP = null; chosenI1 = null; chosenI2 = null;
      scoreP = 0;
      goToStep(0);
    }

    // ---- Log ----
    function showLog() {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      const content = document.getElementById('logContent');

      if (log.length === 0) {
        content.innerHTML = '<p style="color: var(--muted)">Nessuna sessione registrata.</p>';
      } else {
        content.innerHTML = log.slice().reverse().map(e => {
          const d = new Date(e.ts);
          const dateStr = d.toLocaleDateString('it-IT') + ' ' + d.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});
          const sc = SCENARIOS.find(s => s.id === e.scenario_id);
          const scTitle = sc ? sc.title : e.scenario_id;
          const noteHtml = e.notes ? '<div class="log-entry-note">' + esc(e.notes) + '</div>' : '';
          return '<div class="log-entry">' +
            '<div class="log-entry-header">' +
              '<div class="log-entry-title">' + esc(scTitle) + '</div>' +
              '<div class="log-entry-date">' + dateStr + '</div>' +
            '</div>' +
            '<div class="log-entry-scores">' +
              '<span>E: <strong>' + e.score_E + '</strong></span>' +
              '<span>P: <strong>' + e.score_P + '</strong></span>' +
              '<span>I: <strong>' + e.score_I + '</strong></span>' +
              '<span>Tot: <strong>' + e.score_total + '/6</strong></span>' +
            '</div>' +
            noteHtml +
          '</div>';
        }).join('');
      }

      document.getElementById('logOverlay').classList.add('active');
    }

    function closeLog() { document.getElementById('logOverlay').classList.remove('active'); }

    function clearLog() {
      if (confirm('Cancellare tutto il log?')) {
        localStorage.removeItem(LOG_KEY);
        showLog();
      }
    }

    function exportJSON() {
      const log = localStorage.getItem(LOG_KEY) || '[]';
      download('epic_sim_log.json', log, 'application/json');
    }

    function exportCSV() {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      let csv = 'ts,mode,scenario_id,E,P,I,score_E,score_P,score_I,score_total,notes\n';
      log.forEach(e => {
        const notes = '"' + (e.notes || '').replace(/"/g, '""') + '"';
        csv += [e.ts, e.mode, e.scenario_id, e.E, e.P, e.I, e.score_E, e.score_P, e.score_I, e.score_total, notes].join(',') + '\n';
      });
      download('epic_sim_log.csv', csv, 'text/csv');
    }

    function download(filename, content, mime) {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    }
