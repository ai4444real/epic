// ---- LIVE-TABLE JS ----
    const LIVE_TABLE_NAME = 'epic_live_rooms';
    const POLL_MS = 1600;
    const LIVE_MODE = document.body.dataset.liveMode || 'presenter';
    const IS_PRESENTER = LIVE_MODE === 'presenter';

    const liveEls = {
      roomCode: document.getElementById('roomCode'),
      roomMeta: document.getElementById('roomMeta'),
      viewerLink: document.getElementById('viewerLink'),
      syncStatus: document.getElementById('syncStatus'),
      setupWarning: document.getElementById('setupWarning'),
      liveTable: document.getElementById('liveTable'),
      librarySearch: document.getElementById('librarySearch'),
      libraryTabs: document.getElementById('libraryTabs'),
      libraryList: document.getElementById('libraryList')
    };

    const liveConfig = window.EPIC_APP_CONFIG || {};
    let liveClient = null;
    let roomId = new URLSearchParams(window.location.search).get('room') || '';
    let libraryFilter = 'all';
    let lastRemoteStamp = '';
    let pollTimer = null;
    let tableState = createEmptyState(roomId || createRoomId());

    function createEmptyState(id) {
      return {
        room_id: id,
        title: 'Lezione EPiC',
        zoom: 'medium',
        items: [],
        updated_at: new Date().toISOString()
      };
    }

    function createRoomId() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let out = '';
      for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    }

    function getLiveClient() {
      if (!window.supabase || !liveConfig.supabaseUrl || !liveConfig.supabaseAnonKey) return null;
      if (!liveClient) liveClient = window.supabase.createClient(liveConfig.supabaseUrl, liveConfig.supabaseAnonKey);
      return liveClient;
    }

    function allCards() {
      return [
        ...emotions.map(card => ({ kind: 'E', card })),
        ...patterns.map(card => ({ kind: 'P', card })),
        ...interventions.map(card => ({ kind: 'I', card }))
      ];
    }

    function cardLabel(kind, id) {
      const card = getCard(kind, id);
      return card ? card.label : id;
    }

    function getCard(kind, id) {
      if (kind === 'E') return eMap[id];
      if (kind === 'P') return pMap[id];
      return iMap[id];
    }

    function interventionType(i) {
      const map = { cognitive: 'Cog', behavioral: 'Comp', emotional: 'Emo' };
      return map[(i?.type || '').toLowerCase()] || i?.type || 'I';
    }

    function interventionForPattern(pid, type) {
      return iMap['I-' + pid + '-' + type] || null;
    }

    function uid() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function viewerUrl() {
      const url = new URL('epic-live-view.html', window.location.href);
      url.searchParams.set('room', roomId);
      return url.toString();
    }

    function setStatus(text) {
      if (liveEls.syncStatus) liveEls.syncStatus.textContent = text || '';
    }

    function showSetupWarning(error) {
      if (!liveEls.setupWarning) return;
      liveEls.setupWarning.classList.add('active');
      liveEls.setupWarning.innerHTML =
        'Live sync non disponibile. Verifica la tabella Supabase <strong>epic_live_rooms</strong>. ' +
        'Dettaglio: ' + esc(error?.message || error || 'errore sconosciuto');
    }

    function clearSetupWarning() {
      if (!liveEls.setupWarning) return;
      liveEls.setupWarning.classList.remove('active');
      liveEls.setupWarning.innerHTML = '';
    }

    async function saveRoom() {
      if (!IS_PRESENTER) return;
      const client = getLiveClient();
      if (!client) {
        showSetupWarning('Supabase client non disponibile');
        return;
      }
      tableState.updated_at = new Date().toISOString();
      renderTable();
      try {
        const { data: authData } = await client.auth.getSession();
        const email = authData?.session?.user?.email || null;
        const { error } = await client
          .from(LIVE_TABLE_NAME)
          .upsert({
            room_id: roomId,
            owner_email: email,
            payload: tableState,
            updated_at: tableState.updated_at
          }, { onConflict: 'room_id' });
        if (error) throw error;
        lastRemoteStamp = tableState.updated_at;
        clearSetupWarning();
        setStatus('Sincronizzato ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (error) {
        console.warn('Live table save failed:', error);
        showSetupWarning(error);
        setStatus('Non sincronizzato');
      }
    }

    async function loadRoom() {
      if (!roomId) return;
      const client = getLiveClient();
      if (!client) {
        showSetupWarning('Supabase client non disponibile');
        return;
      }
      try {
        const { data, error } = await client
          .from(LIVE_TABLE_NAME)
          .select('payload,updated_at')
          .eq('room_id', roomId)
          .maybeSingle();
        if (error) throw error;
        if (data?.payload) {
          const stamp = data.updated_at || data.payload.updated_at || '';
          if (stamp !== lastRemoteStamp) {
            tableState = normalizeState(data.payload);
            lastRemoteStamp = stamp;
            renderAll();
          }
          clearSetupWarning();
          if (!IS_PRESENTER) setStatus('Aggiornato ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } else if (IS_PRESENTER) {
          await saveRoom();
        } else {
          setStatus('Stanza non trovata.');
        }
      } catch (error) {
        console.warn('Live table load failed:', error);
        showSetupWarning(error);
        setStatus('Sync non disponibile');
      }
    }

    function normalizeState(raw) {
      const next = raw && typeof raw === 'object' ? raw : createEmptyState(roomId);
      next.room_id = next.room_id || roomId;
      next.zoom = ['fit', 'medium', 'large'].includes(next.zoom) ? next.zoom : 'medium';
      next.items = Array.isArray(next.items) ? next.items.filter(item => item && item.id && item.kind) : [];
      return next;
    }

    function startPolling() {
      if (pollTimer) window.clearInterval(pollTimer);
      pollTimer = window.setInterval(loadRoom, POLL_MS);
    }

    function addCard(kind, id) {
      tableState.items.push({ uid: uid(), kind, id, flipped: false, crossOpen: false });
      saveRoom();
    }

    function removeItem(itemUid) {
      tableState.items = tableState.items.filter(item => item.uid !== itemUid);
      saveRoom();
    }

    function moveItem(itemUid, delta) {
      const idx = tableState.items.findIndex(item => item.uid === itemUid);
      if (idx < 0) return;
      const next = idx + delta;
      if (next < 0 || next >= tableState.items.length) return;
      const [item] = tableState.items.splice(idx, 1);
      tableState.items.splice(next, 0, item);
      saveRoom();
    }

    function toggleFlip(itemUid) {
      const item = tableState.items.find(item => item.uid === itemUid);
      if (!item) return;
      item.flipped = !item.flipped;
      saveRoom();
    }

    function toggleCrossFlip(itemUid, slot) {
      const item = tableState.items.find(item => item.uid === itemUid);
      if (!item || item.kind !== 'P') return;
      if (!item.crossFlipped || typeof item.crossFlipped !== 'object') {
        item.crossFlipped = { P: false, Cog: false, Emo: false, Comp: false };
      }
      item.crossFlipped[slot] = !item.crossFlipped[slot];
      saveRoom();
    }

    function toggleCross(itemUid) {
      const item = tableState.items.find(item => item.uid === itemUid);
      if (!item || item.kind !== 'P') return;
      item.crossOpen = !item.crossOpen;
      if (item.crossOpen && (!item.crossFlipped || typeof item.crossFlipped !== 'object')) {
        item.crossFlipped = { P: false, Cog: false, Emo: false, Comp: false };
      }
      saveRoom();
    }

    function setZoom(zoom) {
      tableState.zoom = zoom;
      saveRoom();
    }

    function clearTable() {
      if (!confirm('Svuotare il tavolo live?')) return;
      tableState.items = [];
      saveRoom();
    }

    function renderAll() {
      roomId = tableState.room_id || roomId;
      renderRoom();
      renderLibrary();
      renderTable();
      renderZoomButtons();
    }

    function renderRoom() {
      if (liveEls.roomCode) liveEls.roomCode.textContent = roomId || '...';
      if (liveEls.roomMeta) {
        liveEls.roomMeta.textContent = IS_PRESENTER
          ? 'Presenter: modifica il tavolo, gli studenti vedono via link.'
          : 'Viewer: il tavolo si aggiorna automaticamente.';
      }
      if (liveEls.viewerLink) liveEls.viewerLink.value = viewerUrl();
    }

    function renderLibrary() {
      if (!IS_PRESENTER || !liveEls.libraryList) return;
      const q = (liveEls.librarySearch?.value || '').trim().toLowerCase();
      const cards = allCards()
        .filter(({ kind }) => libraryFilter === 'all' || kind === libraryFilter)
        .filter(({ kind, card }) => {
          const hay = [kind, card.id, card.label, JSON.stringify(card)].join(' ').toLowerCase();
          return !q || hay.includes(q);
        })
        .slice(0, 80);
      liveEls.libraryList.innerHTML = cards.map(({ kind, card }) =>
        '<div class="library-card" data-kind="' + esc(kind) + '" data-id="' + esc(card.id) + '">' +
          '<div class="library-id">' + esc(card.id) + '</div>' +
          '<div class="library-label">' + esc(card.label) + '</div>' +
          '<div class="library-kind">' + kindName(kind, card) + '</div>' +
        '</div>'
      ).join('');
      liveEls.libraryList.querySelectorAll('.library-card').forEach(el => {
        el.addEventListener('click', () => addCard(el.dataset.kind, el.dataset.id));
      });
    }

    function kindName(kind, card) {
      if (kind === 'E') return 'Emozione';
      if (kind === 'P') return 'Pattern, apribile come croce';
      return 'Intervento ' + interventionType(card);
    }

    function renderTable() {
      if (!liveEls.liveTable) return;
      liveEls.liveTable.className = 'live-table zoom-' + tableState.zoom;
      if (!tableState.items.length) {
        liveEls.liveTable.innerHTML = '<div class="empty-table">' + (IS_PRESENTER ? 'Aggiungi la prima carta dalla libreria.' : 'Il tavolo e vuoto. Aspetta il docente.') + '</div>';
        return;
      }
      liveEls.liveTable.innerHTML = '<div class="table-grid">' + tableState.items.map(renderTableItem).join('') + '</div>';
      if (!IS_PRESENTER) return;
      liveEls.liveTable.querySelectorAll('[data-card-flip]').forEach(card => {
        card.addEventListener('click', () => toggleFlip(card.dataset.cardFlip));
      });
      liveEls.liveTable.querySelectorAll('[data-cross-flip]').forEach(card => {
        card.addEventListener('click', () => toggleCrossFlip(card.dataset.uid, card.dataset.crossFlip));
      });
      liveEls.liveTable.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const id = btn.dataset.uid;
          if (action === 'remove') removeItem(id);
          if (action === 'up') moveItem(id, -1);
          if (action === 'down') moveItem(id, 1);
          if (action === 'cross') toggleCross(id);
        });
      });
    }

    function renderTableItem(item) {
      const card = getCard(item.kind, item.id);
      if (!card) return '';
      if (item.kind === 'P' && item.crossOpen) return renderCrossItem(item, card);
      return renderSingleCard(item, card);
    }

    function renderSingleCard(item, card) {
      return '<article class="live-card-wrap">' +
        renderFixedCard(item.kind, card, item.flipped, 'data-card-flip="' + esc(item.uid) + '"') +
        renderItemActions(item) +
      '</article>';
    }

    function renderCrossItem(item, p) {
      const cog = interventionForPattern(item.id, 'Cog');
      const emo = interventionForPattern(item.id, 'Emo');
      const comp = interventionForPattern(item.id, 'Comp');
      const flipped = item.crossFlipped && typeof item.crossFlipped === 'object' ? item.crossFlipped : {};
      return '<article class="live-cross">' +
        '<div class="cross-mini-grid">' +
          '<div class="cross-cell pat">' + renderFixedCard('P', p, !!flipped.P, 'data-cross-flip="P" data-uid="' + esc(item.uid) + '"') + '</div>' +
          '<div class="cross-cell cog">' + (cog ? renderFixedCard('I', cog, !!flipped.Cog, 'data-cross-flip="Cog" data-uid="' + esc(item.uid) + '"') : '<div class="empty-slot">n/a</div>') + '</div>' +
          '<div class="cross-cell emo">' + (emo ? renderFixedCard('I', emo, !!flipped.Emo, 'data-cross-flip="Emo" data-uid="' + esc(item.uid) + '"') : '<div class="empty-slot">n/a</div>') + '</div>' +
          '<div class="cross-cell comp">' + (comp ? renderFixedCard('I', comp, !!flipped.Comp, 'data-cross-flip="Comp" data-uid="' + esc(item.uid) + '"') : '<div class="empty-slot">n/a</div>') + '</div>' +
        '</div>' +
        renderItemActions(item) +
      '</article>';
    }

    function renderItemActions(item) {
      if (!IS_PRESENTER) return '';
      return '<div class="live-card-actions">' +
        '<button class="mini-btn" data-action="up" data-uid="' + item.uid + '">Su</button>' +
        '<button class="mini-btn" data-action="down" data-uid="' + item.uid + '">Giu</button>' +
        (item.kind === 'P' ? '<button class="mini-btn" data-action="cross" data-uid="' + item.uid + '">' + (item.crossOpen ? 'Chiudi croce' : 'Apri croce') + '</button>' : '') +
        '<button class="mini-btn danger" data-action="remove" data-uid="' + item.uid + '">Togli</button>' +
      '</div>';
    }

    function patternShort(p) {
      return (p.fronte?.shorts?.items || p.fronte?.segnali?.items || []).slice(0, 4).join(' · ');
    }

    function renderFixedCard(kind, card, flipped, attrs) {
      const type = kind === 'I' ? interventionType(card) : (kind === 'E' ? 'Emozione' : 'Pattern');
      const cls = kind === 'I' ? 'kind-' + interventionType(card) : 'kind-' + kind;
      return '<div class="live-epic-card ' + cls + (flipped ? ' flipped' : '') + '" ' + (attrs || '') + '>' +
        '<div class="epic-card-inner">' +
          '<div class="epic-face front">' + renderFixedCardFront(kind, card, type) + '</div>' +
          '<div class="epic-face back">' + renderFixedCardBack(kind, card, type) + '</div>' +
        '</div>' +
      '</div>';
    }

    function renderFixedCardFront(kind, card, type) {
      let html = renderEpicHead(card.id, type) + '<div class="epic-title">' + esc(card.label) + '</div>';

      if (kind === 'E') {
        html += renderAliases(card.fronte?.aliases?.items);
        html += renderEpicSection('Quando la vedi', card.fronte?.quando_la_vedi?.items);
        html += renderEpicSection('Pattern prioritari', card.fronte?.pattern_da_esplorare?.high);
        html += renderEpicSection('Altri pattern', card.fronte?.pattern_da_esplorare?.medium);
        html += renderEpicFooter('EPiC', 'Emozione');
        return html;
      }

      if (kind === 'P') {
        const linkedI = interventions.filter(i => i.id.startsWith('I-' + card.id + '-')).map(i => i.id);
        html += renderAliases(card.fronte?.aliases?.items);
        html += renderEpicSection('', card.fronte?.shorts?.items, 'muted');
        html += renderEpicSection('Segnali', card.fronte?.segnali?.items);
        html += renderEpicSection('Interventi', linkedI);
        html += renderEpicFooter('EPiC', 'Pattern');
        return html;
      }

      html += renderEpicSection('Principle', card.fronte?.principle);
      html += renderEpicSection('Why', card.fronte?.why, 'muted');
      html += renderEpicSection(card.fronte?.verbo_mentale || 'How to', card.fronte?.how_to);
      html += renderEpicSection('Serve a', card.fronte?.serve_a, 'muted');
      html += renderEpicFooter('EPiC', 'Intervento');
      return html;
    }

    function renderFixedCardBack(kind, card, type) {
      let html = renderEpicHead(card.id, type);
      html += '<div class="epic-back-content">';

      if (kind === 'E') {
        html += renderEpicSection('Subtypes', card.fronte?.subtypes?.items);
        html += renderEpicSection('Non e questa se', card.fronte?.non_e_questa_se?.items || card.retro?.non_e_questa_se?.items);
        html += renderEpicSection('Red flags', card.retro?.red_flags?.items);
        html += renderEpicSection('Hint', card.retro?.hint);
      } else if (kind === 'P') {
        html += renderEpicSection('Non e questo se', card.fronte?.non_e_questo_se?.items);
        html += renderEpicSection('Hint', card.retro?.hint);
        html += renderEpicSection('Why', card.retro?.why);
        html += renderEpicSection('Porta I', card.retro?.porta_I);
        html += renderEpicSection('Note', card.retro?.note);
      } else {
        html += renderAliases(card.retro?.aka);
        html += renderEpicSection('Domanda esempio', card.retro?.example_q);
        html += renderEpicSection('Compito / Consapevolezza', card.retro?.example_C);
        html += renderEpicSection('Fallback', card.retro?.fallback);
        html += renderEpicSection('Tags', card.retro?.tags);
        html += renderEpicSection('Note', card.retro?.note);
      }

      html += '</div>' + renderEpicFooter('EPiC', kind === 'I' ? 'Retro intervento' : 'Retro');
      return html;
    }

    function renderEpicHead(id, type) {
      return '<header class="epic-card-head"><div class="epic-card-id">' + esc(id) + '</div><div class="epic-type-pill">' + esc(type) + '</div></header>';
    }

    function renderAliases(items) {
      if (!Array.isArray(items) || !items.length) return '';
      return '<div class="epic-aliases">' + items.map(esc).join(', ') + '</div>';
    }

    function renderEpicSection(title, value, extraClass) {
      if (value == null) return '';
      let arr = Array.isArray(value) ? value.filter(v => v != null && String(v).trim()) : [value].filter(v => String(v).trim());
      if (!arr.length) return '';
      const content = arr.map(v => esc(v)).join(' · ');
      return '<section class="epic-section">' +
        (title ? '<div class="epic-section-title">' + esc(title) + '</div>' : '') +
        '<div class="epic-section-content ' + (extraClass || '') + '">' + content + '</div>' +
      '</section>';
    }

    function renderEpicFooter(left, right) {
      return '<footer class="epic-footer"><span>' + esc(left) + '</span><span>' + esc(right) + '</span></footer>';
    }

    function renderZoomButtons() {
      document.querySelectorAll('[data-zoom]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.zoom === tableState.zoom);
      });
    }

    function copyViewerLink() {
      const link = viewerUrl();
      navigator.clipboard?.writeText(link).then(() => setStatus('Link studenti copiato')).catch(() => {
        if (liveEls.viewerLink) {
          liveEls.viewerLink.focus();
          liveEls.viewerLink.select();
        }
        setStatus('Copia manuale dal campo link');
      });
    }

    async function initLiveTable() {
      if (!roomId) {
        roomId = tableState.room_id;
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        window.history.replaceState(null, '', url.toString());
      } else {
        tableState.room_id = roomId;
      }

      if (!IS_PRESENTER) {
        document.querySelector('.live-sidebar')?.remove();
        document.querySelector('.live-shell')?.classList.add('viewer-only');
        document.querySelector('.table-head .tool-row')?.remove();
        const subtitle = document.querySelector('.table-head .room-meta');
        if (subtitle) subtitle.textContent = 'Il tavolo si aggiorna automaticamente durante la lezione.';
      }

      renderAll();
      await loadRoom();
      startPolling();
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('newRoomBtn')?.addEventListener('click', () => {
        roomId = createRoomId();
        tableState = createEmptyState(roomId);
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        window.history.replaceState(null, '', url.toString());
        renderAll();
        saveRoom();
      });
      document.getElementById('copyViewerBtn')?.addEventListener('click', copyViewerLink);
      document.getElementById('copyViewerBtn2')?.addEventListener('click', copyViewerLink);
      document.getElementById('clearTableBtn')?.addEventListener('click', clearTable);
      liveEls.librarySearch?.addEventListener('input', renderLibrary);
      liveEls.libraryTabs?.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          libraryFilter = btn.dataset.filter;
          liveEls.libraryTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderLibrary();
        });
      });
      document.querySelectorAll('[data-zoom]').forEach(btn => {
        btn.addEventListener('click', () => setZoom(btn.dataset.zoom));
      });
      initLiveTable();
    });
