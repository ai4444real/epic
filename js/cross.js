let patterns = [];
    let interventions = [];

    window.addEventListener('DOMContentLoaded', () => {
      if (typeof EPIC_DATA !== 'undefined' && EPIC_DATA) {
        loadData(EPIC_DATA);
      }
    });

    function loadData(data) {
      patterns = (data.P || []).map(p => ({...p, cardType: 'P'}));
      interventions = (data.I || []).map(i => ({...i, cardType: 'I'}));
      showGrid();
    }

    // ---- GRID VIEW ----
    function showGrid() {
      document.getElementById('pGrid').classList.remove('hidden');
      document.getElementById('crossView').classList.remove('active');
      document.getElementById('backBtn').style.display = 'none';

      const grid = document.getElementById('pGrid');
      grid.innerHTML = patterns.map(p => renderPatternCard(p)).join('');

      // Click handler: open cross view
      grid.querySelectorAll('.card.P').forEach(card => {
        card.addEventListener('click', (e) => {
          const pid = card.getAttribute('data-card-id');
          openCross(pid);
        });
      });
    }

    // ---- CROSS VIEW ----
    function openCross(patternId) {
      const p = patterns.find(x => x.id === patternId);
      if (!p) return;

      document.getElementById('pGrid').classList.add('hidden');
      document.getElementById('crossView').classList.add('active');
      document.getElementById('backBtn').style.display = 'block';

      // Render P in center
      document.getElementById('crossCenter').innerHTML = renderPatternCard(p);

      // Flip handler for center P
      const centerCard = document.getElementById('crossCenter').querySelector('.card');
      if (centerCard) {
        centerCard.addEventListener('click', (e) => {
          if (e.target.classList.contains('card-link')) return;
          centerCard.classList.toggle('flipped');
        });
      }

      // Find interventions
      const cog = interventions.find(i => i.id === 'I-' + patternId + '-Cog');
      const emo = interventions.find(i => i.id === 'I-' + patternId + '-Emo');
      const comp = interventions.find(i => i.id === 'I-' + patternId + '-Comp');

      // Populate wings
      setupWing('wing-cog', cog, 'top');
      setupWing('wing-emo', emo, 'left');
      setupWing('wing-comp', comp, 'right');
    }

    function setupWing(containerId, intervention, position) {
      const container = document.getElementById(containerId);
      const slot = container.parentElement;

      // Reset state
      slot.classList.remove('open');

      if (intervention) {
        container.innerHTML = renderInterventionCard(intervention);
        slot.style.display = '';
        slot.querySelector('.wing-tab').textContent =
          position === 'top' ? 'Cognitivo' :
          position === 'left' ? 'Emotivo' : 'Comportamentale';
      } else {
        container.innerHTML = '';
        slot.querySelector('.wing-tab').textContent =
          (position === 'top' ? 'Cognitivo' :
           position === 'left' ? 'Emotivo' : 'Comportamentale') + ' (n/a)';
        slot.style.opacity = '0.4';
        slot.style.pointerEvents = 'none';
      }
    }

    function toggleWing(slot) {
      const isOpen = slot.classList.contains('open');

      if (isOpen) {
        slot.classList.remove('open');
      } else {
        slot.classList.add('open');

        // Attach flip handler to the card inside
        const card = slot.querySelector('.card');
        if (card && !card.dataset.flipReady) {
          card.dataset.flipReady = 'true';
          card.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't close wing
            if (e.target.classList.contains('card-link')) return;
            card.classList.toggle('flipped');
          });
        }
      }
    }

    // ---- RENDER FUNCTIONS ----
    function renderPatternCard(p) {
      const aliases = p.fronte?.aliases?.items || [];
      const aliasesStr = aliases.length > 0
        ? '<div class="aliases-line">' + aliases.map(a => escapeHTML(a)).join(', ') + '</div>'
        : '';

      const shorts = p.fronte?.shorts?.items || [];
      const shortsStr = shorts.length > 0
        ? '<div class="section-content" style="margin-top: 10px; font-size: var(--fs-sm); color: var(--muted); line-height: 1.4;">' + shorts.map(s => escapeHTML(s)).join(', ') + '</div>'
        : '';

      return '<article class="card P" data-type="P" data-card-id="' + escapeHTML(p.id) + '">' +
        '<div class="card-inner">' +
          '<div class="face front">' +
            '<div>' +
              '<header class="card-head">' +
                '<div class="card-id">' + escapeHTML(p.id) + '</div>' +
                '<div class="type-pill">Pattern</div>' +
              '</header>' +
              '<div class="title">' + escapeHTML(p.label) + '</div>' +
              aliasesStr +
              shortsStr +
            '</div>' +
            '<footer class="footer">' +
              '<span class="hint">EPiC</span>' +
              '<span class="hint">Pattern</span>' +
            '</footer>' +
          '</div>' +
          '<div class="face back">' +
            '<header class="back-header">' +
              '<div class="card-head">' +
                '<div class="card-id">' + escapeHTML(p.id) + '</div>' +
                '<div class="type-pill">Pattern</div>' +
              '</div>' +
            '</header>' +
            '<div class="back-content small">' +
              renderBackSection('Segnali', (p.retro?.segnali?.items || []).slice(0, 3)) +
              renderBackSection('Non è questo se', p.fronte?.non_e_questo_se?.items) +
              renderBackSection('Hint', p.retro?.hint) +
            '</div>' +
            '<footer class="back-footer">' +
              '<div class="hint">EPiC · Pattern</div>' +
            '</footer>' +
          '</div>' +
        '</div>' +
      '</article>';
    }

    function renderInterventionCard(i) {
      const type = (i.type || '').replace(/Intervento\s*/i,'').trim();
      const typeMap = { 'cognitive': 'Cog', 'behavioral': 'Comp', 'emotional': 'Emo' };
      const mappedType = typeMap[type.toLowerCase()] || type;

      const akaLine = (Array.isArray(i.retro.aka) && i.retro.aka.length > 0)
        ? '<div class="aka-line">' + i.retro.aka.map(v => escapeHTML(v)).join(' · ') + '</div>'
        : '';

      return '<article class="card ' + mappedType + '" data-type="I" data-card-id="' + escapeHTML(i.id) + '">' +
        '<div class="card-inner">' +
          '<div class="face front">' +
            '<div>' +
              '<header class="card-head">' +
                '<div class="card-id">' + escapeHTML(i.id) + '</div>' +
                '<div class="type-pill">' + escapeHTML(mappedType) + '</div>' +
              '</header>' +
              '<div class="title">' + escapeHTML(i.label) + '</div>' +
              '<div class="principle-line">' + escapeHTML(i.fronte.principle) + ' → <span style="font-weight: normal">' + escapeHTML(i.fronte.why) + '</span></div>' +
              '<div class="howto-line"><strong>' + escapeHTML(i.fronte.verbo_mentale) + '</strong>: ' + escapeHTML(i.fronte.how_to) + '</div>' +
            '</div>' +
            '<footer class="footer">' +
              '<span class="hint">EPiC</span>' +
              '<span class="hint">Intervento</span>' +
            '</footer>' +
          '</div>' +
          '<div class="face back">' +
            '<header class="back-header">' +
              '<div class="card-head">' +
                '<div class="card-id">' + escapeHTML(i.id) + '</div>' +
                '<div class="type-pill">' + escapeHTML(mappedType) + '</div>' +
              '</div>' +
              akaLine +
            '</header>' +
            '<div class="back-content small">' +
              renderBackSection('Domanda esempio', i.retro.example_q) +
              renderBackSection('Compito/Consapevolezza', i.retro.example_C) +
              renderBackSection('Fallback', i.retro.fallback) +
              renderBackSection('Note', i.retro.note) +
            '</div>' +
            '<footer class="back-footer">' +
              '<div class="hint">EPiC · Intervento</div>' +
            '</footer>' +
          '</div>' +
        '</div>' +
      '</article>';
    }

    function renderBackSection(label, value) {
      if (!value) return '';
      if (Array.isArray(value) && value.length === 0) return '';
      let content;
      if (Array.isArray(value)) {
        content = value.map(v => escapeHTML(v)).join(' · ');
      } else {
        content = escapeHTML(value);
      }
      return '<div class="block"><div class="label">' + label + '</div><div>' + content + '</div></div>';
    }

    function escapeHTML(str){
      return String(str ?? '')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;');
    }
