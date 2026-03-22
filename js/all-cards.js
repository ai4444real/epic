const state = {
      allCards: [],
      filterType: 'all',
      searchQuery: '',
      patternFilter: null  // es. "P6" - filtra P6 + I-P6-*
    };

    // Auto-load on init - prova prima inline poi esterno
    window.addEventListener('DOMContentLoaded', async () => {
      // Check if EPIC_DATA is available (embedded inline or loaded from EPIC_data.js)
      if (typeof EPIC_DATA !== 'undefined' && EPIC_DATA) {
        console.log('Auto-loading embedded data...');
        loadData(EPIC_DATA);
        document.querySelector('label').style.opacity = '0.5';
        return;
      }

      // Try loading from external file (fallback)
      try {
        const response = await fetch('data/EPIC_full.json');
        if (response.ok) {
          const data = await response.json();
          console.log('Auto-loading from EPIC_full.json...');
          loadData(data);
          document.querySelector('label').style.opacity = '0.5';
        }
      } catch (err) {
        console.log('No auto-load available - use file input');
      }
    });

    // File input handler (manual load or override)
    document.getElementById('fileInput').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        loadData(data);
      } catch(err) {
        console.error('Errore nel parsing del JSON:', err);
        alert('Errore nel caricamento del file JSON.');
      }
    });

    // Load and prepare all cards
    function loadData(data) {
      const emotions = (data.E || []).map(e => ({...e, cardType: 'E'}));
      const patterns = (data.P || []).map(p => ({...p, cardType: 'P'}));
      const interventions = (data.I || []).map(i => ({...i, cardType: 'I'}));

      state.allCards = [...emotions, ...patterns, ...interventions];

      updateStats();
      render();
    }

    // Update stats bar
    function updateStats() {
      const eCount = state.allCards.filter(c => c.cardType === 'E').length;
      const pCount = state.allCards.filter(c => c.cardType === 'P').length;
      const iCount = state.allCards.filter(c => c.cardType === 'I').length;

      document.getElementById('stats').innerHTML = `
        Totale: <span>${state.allCards.length} carte</span>
        | Emozioni: <span>${eCount}</span>
        | Pattern: <span>${pCount}</span>
        | Interventi: <span>${iCount}</span>
      `;
    }

    // Filter and render
    function render() {
      const filtered = state.allCards.filter(card => {
        // Pattern filter (smart filter: E sempre visibili + P specifico + I-P*-*)
        if (state.patternFilter) {
          // E sempre visibili
          if (card.cardType === 'E') return true;

          // P specifico (es. P6)
          if (card.cardType === 'P' && card.id === state.patternFilter) return true;

          // I-P6-* (tutti gli interventi del pattern)
          if (card.cardType === 'I' && card.id.startsWith('I-' + state.patternFilter + '-')) return true;

          // Tutto il resto nascosto
          return false;
        }

        // Type filter
        if (state.filterType !== 'all' && card.cardType !== state.filterType) {
          return false;
        }

        // Search filter
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          const searchText = JSON.stringify(card).toLowerCase();
          if (!searchText.includes(q)) {
            return false;
          }
        }

        return true;
      });

      const container = document.getElementById('grid');

      if (filtered.length === 0) {
        container.innerHTML = '<div class="placeholder"><strong>Nessuna carta trovata</strong>Prova a modificare i filtri</div>';
        return;
      }

      container.innerHTML = filtered.map(card => renderCard(card)).join('');

      // Attach link click handlers
      attachLinkHandlers();
    }

    // Render single card
    function renderCard(card) {
      if (card.cardType === 'E') return renderEmotionCard(card);
      if (card.cardType === 'P') return renderPatternCard(card);
      if (card.cardType === 'I') return renderInterventionCard(card);
    }

    // Render Emotion card (E)
    function renderEmotionCard(e) {
      const aliases = e.fronte?.aliases?.items || [];
      const aliasesStr = aliases.length > 0
        ? `<div class="aliases-line">${aliases.map(a => escapeHTML(a)).join(', ')}</div>`
        : '';

      const quandoLaVedi = e.fronte?.quando_la_vedi?.items || [];
      const patternHigh = e.fronte?.pattern_da_esplorare?.high || [];
      const patternMedium = e.fronte?.pattern_da_esplorare?.medium || [];

      return `
        <article class="card E" id="${escapeHTML(e.id)}" data-type="E" data-card-id="${escapeHTML(e.id)}" onclick="flipCard(event, this)">
          <div class="card-inner">
            <div class="face front">
              <div>
                <header class="card-head">
                  <div class="card-id">${escapeHTML(e.id)}</div>
                  <div class="type-pill">Emozione</div>
                </header>
                <div class="title">${escapeHTML(e.label)}</div>
                ${aliasesStr}
                ${renderSection('Quando la vedi', quandoLaVedi)}
                ${patternHigh.length > 0 ? `
                  <div class="section">
                    <div class="section-title">Pattern prioritari</div>
                    <div class="section-content">${patternHigh.map(p => `<span class="card-link">${p}</span>`).join(', ')}</div>
                  </div>
                ` : ''}
                ${patternMedium.length > 0 ? `
                  <div class="section">
                    <div class="section-title">Altri pattern</div>
                    <div class="section-content">${patternMedium.map(p => `<span class="card-link">${p}</span>`).join(', ')}</div>
                  </div>
                ` : ''}
              </div>
              <footer class="footer">
                <span class="hint">EPiC</span>
                <span class="hint">Emozione</span>
              </footer>
            </div>
            <div class="face back">
              <header class="back-header">
                <div class="card-head">
                  <div class="card-id">${escapeHTML(e.id)}</div>
                  <div class="type-pill">Emozione</div>
                </div>
              </header>
              <div class="back-content small">
                ${renderBackSection('Subtypes', e.fronte?.subtypes?.items)}
                ${renderBackSection('Non è questa se', e.fronte?.non_e_questa_se?.items)}
                ${renderBackSection('Hint', e.retro?.hint)}
                ${e.retro?.porta_I ? `<div class="block"><div class="label">Link diretto</div><div><span class="card-link">${escapeHTML(e.retro.porta_I)}</span></div></div>` : ''}
              </div>
              <footer class="back-footer">
                <div class="hint">EPiC · Emozione</div>
              </footer>
            </div>
          </div>
        </article>
      `;
    }

    // Render Pattern card (P)
    function renderPatternCard(p) {
      const aliases = p.fronte?.aliases?.items || [];
      const aliasesStr = aliases.length > 0
        ? `<div class="aliases-line">${aliases.map(a => escapeHTML(a)).join(', ')}</div>`
        : '';

      const shorts = p.fronte?.shorts?.items || [];

      // Find associated interventions (I-PX-*)
      const associatedInterventions = state.allCards.filter(c =>
        c.cardType === 'I' && c.id.startsWith('I-' + p.id + '-')
      );

      // SHORTS senza titolo (solo testo inline)
      const shortsStr = shorts.length > 0
        ? `<div class="section-content" style="margin-top: 10px; font-size: var(--fs-sm); color: var(--muted); line-height: 1.4;">${shorts.map(s => escapeHTML(s)).join(', ')}</div>`
        : '';

      return `
        <article class="card P" id="${escapeHTML(p.id)}" data-type="P" data-card-id="${escapeHTML(p.id)}" onclick="flipCard(event, this)">
          <div class="card-inner">
            <div class="face front">
              <div>
                <header class="card-head">
                  <div class="card-id">${escapeHTML(p.id)}</div>
                  <div class="type-pill">Pattern</div>
                </header>
                <div class="title">${escapeHTML(p.label)}</div>
                ${aliasesStr}
                ${shortsStr}
                ${associatedInterventions.length > 0 ? `
                  <div class="section" style="margin-top: 10px;">
                    <div class="section-title">Interventi</div>
                    <div class="section-content">${associatedInterventions.map(i => `<span class="card-link">${escapeHTML(i.id)}</span>`).join(' · ')}</div>
                  </div>
                ` : ''}
              </div>
              <footer class="footer">
                <span class="hint">EPiC</span>
                <span class="hint">Pattern</span>
              </footer>
            </div>
            <div class="face back">
              <header class="back-header">
                <div class="card-head">
                  <div class="card-id">${escapeHTML(p.id)}</div>
                  <div class="type-pill">Pattern</div>
                </div>
              </header>
              <div class="back-content small">
                ${renderBackSection('Segnali', (p.retro?.segnali?.items || []).slice(0, 3))}
                ${renderBackSection('Non è questo se', p.fronte?.non_e_questo_se?.items)}
                ${renderBackSection('Hint', p.retro?.hint)}
              </div>
              <footer class="back-footer">
                <div class="hint">EPiC · Pattern</div>
              </footer>
            </div>
          </div>
        </article>
      `;
    }

    // Render Intervention card (I)
    function renderInterventionCard(i) {
      const type = (i.type || '').replace(/Intervento\s*/i,'').trim();
      const typeMap = { 'cognitive': 'Cog', 'behavioral': 'Comp', 'emotional': 'Emo' };
      const mappedType = typeMap[type.toLowerCase()] || type;

      const akaLine = (Array.isArray(i.retro.aka) && i.retro.aka.length > 0)
        ? `<div class="aka-line">${i.retro.aka.map(v => escapeHTML(v)).join(' · ')}</div>`
        : '';

      return `
        <article class="card ${mappedType}" id="${escapeHTML(i.id)}" data-type="I" data-card-id="${escapeHTML(i.id)}" onclick="flipCard(event, this)">
          <div class="card-inner">
            <div class="face front">
              <div>
                <header class="card-head">
                  <div class="card-id">${escapeHTML(i.id)}</div>
                  <div class="type-pill">${escapeHTML(mappedType)}</div>
                </header>
                <div class="title">${escapeHTML(i.label)}</div>
                <div class="principle-line">${escapeHTML(i.fronte.principle)} → <span style="font-weight: normal">${escapeHTML(i.fronte.why)}</span></div>
                <div class="howto-line"><strong>${escapeHTML(i.fronte.verbo_mentale)}</strong>: ${escapeHTML(i.fronte.how_to)}</div>
              </div>
              <footer class="footer">
                <span class="hint">EPiC</span>
                <span class="hint">Intervento</span>
              </footer>
            </div>
            <div class="face back">
              <header class="back-header">
                <div class="card-head">
                  <div class="card-id">${escapeHTML(i.id)}</div>
                  <div class="type-pill">${escapeHTML(mappedType)}</div>
                </div>
                ${akaLine}
              </header>
              <div class="back-content small">
                ${renderBackSection('Domanda esempio', i.retro.example_q)}
                ${renderBackSection('Compito/Consapevolezza', i.retro.example_C)}
                ${renderBackSection('Fallback', i.retro.fallback)}
                ${renderBackSection('Note', i.retro.note)}
              </div>
              <footer class="back-footer">
                <div class="hint">EPiC · Intervento</div>
              </footer>
            </div>
          </div>
        </article>
      `;
    }

    // Helper: render front section
    function renderSection(title, items) {
      if (!items || (Array.isArray(items) && items.length === 0)) return '';

      const content = Array.isArray(items)
        ? `<ul>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
        : escapeHTML(items);

      return `
        <div class="section">
          <div class="section-title">${escapeHTML(title)}</div>
          <div class="section-content">${content}</div>
        </div>
      `;
    }

    // Helper: render front section inline (comma-separated)
    function renderSectionInline(title, items) {
      if (!items || (Array.isArray(items) && items.length === 0)) return '';

      const content = Array.isArray(items)
        ? items.map(item => escapeHTML(item)).join(', ')
        : escapeHTML(items);

      return `
        <div class="section">
          <div class="section-title">${escapeHTML(title)}</div>
          <div class="section-content">${content}</div>
        </div>
      `;
    }

    // Helper: render back section
    function renderBackSection(label, value) {
      if (!value) return '';
      if (Array.isArray(value) && value.length === 0) return '';

      let content;
      if (Array.isArray(value)) {
        content = value.map(v => parsePatternLinks(escapeHTML(v))).join(' · ');
      } else {
        content = parsePatternLinks(escapeHTML(value));
      }

      return `<div class="block"><div class="label">${label}</div><div>${content}</div></div>`;
    }

    // Parse and linkify pattern and emotion references (P1, E6, etc.)
    function parsePatternLinks(text) {
      // Match P followed by 1-2 digits (P1 to P99)
      let result = text.replace(/\b(P\d{1,2})\b/g, '<span class="card-link">$1</span>');
      // Match E followed by 1 digit (E1 to E9)
      result = result.replace(/\b(E\d)\b/g, '<span class="card-link">$1</span>');
      return result;
    }

    function escapeHTML(str){
      return String(str ?? '')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;');
    }

    // Event listeners
    document.getElementById('filterType').addEventListener('change', (e) => {
      state.filterType = e.target.value;
      render();
    });

    document.getElementById('search').addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      render();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      state.filterType = 'all';
      state.searchQuery = '';
      state.patternFilter = null;
      document.getElementById('filterType').value = 'all';
      document.getElementById('search').value = '';
      document.getElementById('resetBtn').style.display = 'none';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smart card flip (prevent flip when clicking links)
    function flipCard(event, card) {
      // Don't flip if clicking a link
      if (event.target.classList.contains('card-link')) {
        return;
      }
      card.classList.toggle('flipped');
    }

    // Attach handlers to card links
    function attachLinkHandlers() {
      document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent card flip
          const targetId = link.textContent.trim();
          navigateToCard(targetId);
        });
      });
    }

    // Navigate to target card
    function navigateToCard(cardId) {
      // Smart parsing: I-P7 → P7 (se non ha tipo Cog/Comp/Emo)
      let targetId = cardId;

      // Check if it's an incomplete intervention link (I-P7 instead of I-P7-Cog)
      if (targetId.match(/^I-P\d+$/)) {
        // Extract just the pattern ID (P7)
        targetId = targetId.replace(/^I-/, '');
      }

      // Comportamento speciale per Emozioni (E): SOLO scroll+flash (NO filtro)
      // Le E sono sempre visibili, non serve filtrarle
      if (targetId.match(/^E\d$/)) {
        const card = document.getElementById(targetId);
        if (card) {
          scrollAndHighlight(card);
        } else {
          // Se non visibile (caso raro), resetta filtri e riprova
          state.filterType = 'all';
          state.searchQuery = '';
          state.patternFilter = null;
          document.getElementById('filterType').value = 'all';
          document.getElementById('search').value = '';
          document.getElementById('resetBtn').style.display = 'none';
          render();
          setTimeout(() => {
            const c = document.getElementById(targetId);
            if (c) scrollAndHighlight(c);
          }, 100);
        }
        return;
      }

      // Smart filter: Se clicco su un Pattern (P6), attiva filtro pattern
      if (targetId.match(/^P\d+$/)) {
        state.patternFilter = targetId;
        state.filterType = 'all';
        state.searchQuery = '';
        document.getElementById('filterType').value = 'all';
        document.getElementById('search').value = '';
        document.getElementById('resetBtn').style.display = 'block';
        render();

        // Scroll to pattern after render
        setTimeout(() => {
          const card = document.getElementById(targetId);
          if (card) {
            scrollAndHighlight(card);
          }
        }, 100);
        return;
      }

      const targetCard = document.getElementById(targetId);

      if (!targetCard) {
        // Card not in current view - try to show it
        const cardExists = state.allCards.find(c => c.id === targetId);
        if (cardExists) {
          // Reset filters to show the card
          state.filterType = 'all';
          state.searchQuery = '';
          state.patternFilter = null;
          document.getElementById('filterType').value = 'all';
          document.getElementById('search').value = '';
          document.getElementById('resetBtn').style.display = 'none';
          render();

          // Try again after render
          setTimeout(() => {
            const card = document.getElementById(targetId);
            if (card) {
              scrollAndHighlight(card);
            }
          }, 100);
        } else {
          alert(`Carta ${targetId} non trovata nel dataset.`);
        }
        return;
      }

      scrollAndHighlight(targetCard);
    }

    // Scroll to card and highlight
    function scrollAndHighlight(card) {
      // Calcolo dinamico offset basato su toolbar height + stats bar
      const toolbar = document.querySelector('.toolbar');
      const stats = document.querySelector('.stats');
      const toolbarHeight = toolbar ? toolbar.offsetHeight : 0;
      const statsHeight = stats ? stats.offsetHeight : 0;
      const yOffset = -(toolbarHeight + statsHeight + 20); // +20px breathing room

      const y = card.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Remove previous highlights
      document.querySelectorAll('.card.highlighted').forEach(c => {
        c.classList.remove('highlighted');
      });

      // Add highlight after scroll completes
      setTimeout(() => {
        card.classList.add('highlighted');

        // Flip to front if currently on back
        if (card.classList.contains('flipped')) {
          card.classList.remove('flipped');
        }

        // Remove highlight after animation (1.2s animation + 0.5s extra)
        setTimeout(() => card.classList.remove('highlighted'), 1700);
      }, 300);
    }
