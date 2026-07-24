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
      if (window.EPICCardsV1) {
        window.EPICCardsV1.configure({ data });
      }
      showGrid();
    }

    // ---- GRID VIEW ----
    function showGrid() {
      document.getElementById('pGrid').classList.remove('hidden');
      document.getElementById('crossView').classList.remove('active');
      document.getElementById('backBtn').style.display = 'none';

      const grid = document.getElementById('pGrid');
      grid.innerHTML = patterns.map(p => renderPatternGridCard(p)).join('');

      // Click handler: open cross view
      grid.querySelectorAll('[data-pattern-card]').forEach(card => {
        card.addEventListener('click', (e) => {
          const pid = card.getAttribute('data-card-id');
          openCross(pid);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
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
        slot.style.opacity = '';
        slot.style.pointerEvents = '';
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
      }
    }

    // ---- RENDER FUNCTIONS ----
    function renderPatternGridCard(p) {
      return '<div class="pattern-card-button" role="button" tabindex="0" data-pattern-card data-card-id="' + escapeHTML(p.id) + '">' +
        renderPatternCard(p) +
      '</div>';
    }

    function renderPatternCard(p) {
      return window.EPICCardsV1.renderPatternFront(p);
    }

    function renderInterventionCard(i) {
      return window.EPICCardsV1.renderInterventionFront(i);
    }

    function escapeHTML(str){
      return String(str ?? '')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;');
    }
