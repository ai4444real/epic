// ---- LIVE-TABLE JS ----
    const LIVE_TABLE_NAME = 'epic_live_rooms';
    const POLL_MS = 1600;
    const LIVE_MODE = document.body.dataset.liveMode || 'presenter';
    const IS_PRESENTER = LIVE_MODE === 'presenter';

    const liveEls = {
      roomCode: document.getElementById('roomCode'),
      roomMeta: document.getElementById('roomMeta'),
      roomTitleInput: document.getElementById('roomTitleInput'),
      openRoomInput: document.getElementById('openRoomInput'),
      savedRoomList: document.getElementById('savedRoomList'),
      viewerLink: document.getElementById('viewerLink'),
      syncStatus: document.getElementById('syncStatus'),
      setupWarning: document.getElementById('setupWarning'),
      liveTable: document.getElementById('liveTable'),
      librarySearch: document.getElementById('librarySearch'),
      libraryTabs: document.getElementById('libraryTabs'),
      libraryList: document.getElementById('libraryList')
    };

    const liveConfig = window.EPIC_APP_CONFIG || {};
    const liveEmotionOrder = ['E1', 'E2', 'E6', 'E4', 'E3', 'E5'];
    const liveEmotionImages = {
      E1: 'images/E1b.png',
      E2: 'images/E2b.png',
      E3: 'images/E3b.png',
      E4: 'images/E4b.png',
      E5: 'images/E5b.png',
      E6: 'images/E6b.png'
    };
    let liveClient = null;
    let roomId = new URLSearchParams(window.location.search).get('room') || '';
    let libraryFilter = 'all';
    let lastRemoteStamp = '';
    let pollTimer = null;
    let savedRooms = [];
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
      const orderedEmotions = liveEmotionOrder.map(id => eMap[id]).filter(Boolean);
      return [
        ...orderedEmotions.map(card => ({ kind: 'E', card })),
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

    function escAttr(value) {
      return esc(value).replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    }

    function viewerUrl() {
      const url = new URL('epic-live-view.html', window.location.href);
      url.searchParams.set('room', roomId);
      return url.toString();
    }

    function ensureRoomId() {
      if (roomId) return;
      roomId = createRoomId();
      tableState.room_id = roomId;
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      window.history.replaceState(null, '', url.toString());
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
      ensureRoomId();
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

    async function loadSavedRooms() {
      if (!IS_PRESENTER) return;
      const client = getLiveClient();
      if (!client) return;
      try {
        const { data, error } = await client
          .from(LIVE_TABLE_NAME)
          .select('room_id,payload,updated_at')
          .order('updated_at', { ascending: false })
          .limit(30);
        if (error) throw error;
        savedRooms = Array.isArray(data) ? data : [];
        renderSavedRooms();
        clearSetupWarning();
      } catch (error) {
        console.warn('Saved rooms load failed:', error);
        showSetupWarning(error);
      }
    }

    async function deleteRoom(deleteRoomId) {
      if (!IS_PRESENTER) return;
      const target = (deleteRoomId || '').trim().toUpperCase();
      if (!target) return;
      const row = savedRooms.find(item => item.room_id === target);
      const title = row?.payload?.title || target;
      if (!confirm('Cancellare il tavolo "' + title + '"?')) return;
      const client = getLiveClient();
      if (!client) {
        showSetupWarning('Supabase client non disponibile');
        return;
      }
      try {
        const { error } = await client
          .from(LIVE_TABLE_NAME)
          .delete()
          .eq('room_id', target);
        if (error) throw error;
        savedRooms = savedRooms.filter(item => item.room_id !== target);
        if (target === roomId) {
          const fallbackRoomId = savedRooms[0]?.room_id || '';
          if (fallbackRoomId) {
            await openRoom(fallbackRoomId);
          } else {
            roomId = '';
            tableState = createEmptyState('');
            lastRemoteStamp = '';
            const url = new URL(window.location.href);
            url.searchParams.delete('room');
            window.history.replaceState(null, '', url.toString());
            renderAll();
          }
        } else {
          renderSavedRooms();
        }
        clearSetupWarning();
        setStatus('Tavolo cancellato');
      } catch (error) {
        console.warn('Live table delete failed:', error);
        showSetupWarning(error);
        setStatus('Cancellazione non riuscita');
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
      renderSavedRooms();
    }

    function renderRoom() {
      if (liveEls.roomCode) liveEls.roomCode.textContent = roomId || '...';
      if (liveEls.roomMeta) {
        liveEls.roomMeta.textContent = IS_PRESENTER
          ? 'Presenter: modifica il tavolo, gli studenti vedono via link.'
          : 'Viewer: il tavolo si aggiorna automaticamente.';
      }
      if (liveEls.viewerLink) liveEls.viewerLink.value = viewerUrl();
      if (liveEls.roomTitleInput && document.activeElement !== liveEls.roomTitleInput) {
        liveEls.roomTitleInput.value = tableState.title || '';
      }
      const titleEl = document.querySelector('.table-title');
      if (titleEl) titleEl.textContent = tableState.title || 'Tavolo lezione';
    }

    function renderSavedRooms() {
      if (!IS_PRESENTER || !liveEls.savedRoomList) return;
      if (!savedRooms.length) {
        liveEls.savedRoomList.innerHTML = '<div class="room-meta">Nessun tavolo salvato trovato.</div>';
        return;
      }
      liveEls.savedRoomList.innerHTML = savedRooms.map(row => {
        const payload = row.payload || {};
        const title = payload.title || 'Lezione EPiC';
        const count = Array.isArray(payload.items) ? payload.items.length : 0;
        const date = row.updated_at ? new Date(row.updated_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : '';
        return '<div class="saved-room-row' + (row.room_id === roomId ? ' active' : '') + '">' +
          '<button class="saved-room" data-room="' + escAttr(row.room_id) + '">' +
            '<div class="saved-room-title">' + esc(title) + '</div>' +
            '<div class="saved-room-meta">' + esc(row.room_id) + ' · ' + count + ' elementi · ' + esc(date) + '</div>' +
          '</button>' +
          '<button class="saved-room-delete" data-delete-room="' + escAttr(row.room_id) + '" title="Cancella tavolo" aria-label="Cancella tavolo ' + escAttr(title) + '">×</button>' +
        '</div>';
      }).join('');
      liveEls.savedRoomList.querySelectorAll('[data-room]').forEach(btn => {
        btn.addEventListener('click', () => openRoom(btn.dataset.room));
      });
      liveEls.savedRoomList.querySelectorAll('[data-delete-room]').forEach(btn => {
        btn.addEventListener('click', event => {
          event.stopPropagation();
          deleteRoom(btn.dataset.deleteRoom);
        });
      });
    }

    async function openRoom(nextRoomId) {
      const next = (nextRoomId || '').trim().toUpperCase();
      if (!next) return;
      roomId = next;
      tableState = createEmptyState(roomId);
      lastRemoteStamp = '';
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      window.history.replaceState(null, '', url.toString());
      renderAll();
      await loadRoom();
      await loadSavedRooms();
    }

    async function saveTitle() {
      if (!IS_PRESENTER) return;
      const value = (liveEls.roomTitleInput?.value || '').trim();
      tableState.title = value || 'Lezione EPiC';
      await saveRoom();
      await loadSavedRooms();
      renderRoom();
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
      liveEls.libraryList.innerHTML = cards.map(({ kind, card }) => renderLibraryCard(kind, card)).join('');
      liveEls.libraryList.querySelectorAll('.library-card').forEach(el => {
        el.addEventListener('click', () => addCard(el.dataset.kind, el.dataset.id));
      });
    }

    function renderLibraryCard(kind, card) {
      const thumb = kind === 'E' && liveEmotionImages[card.id]
        ? '<div class="library-thumb"><img src="' + liveEmotionImages[card.id] + '" alt="' + esc(card.id) + '"></div>'
        : '';
      return '<div class="library-card' + (thumb ? ' has-thumb' : '') + '" data-kind="' + esc(kind) + '" data-id="' + esc(card.id) + '">' +
        thumb +
        '<div>' +
          '<div class="library-id">' + esc(card.id) + '</div>' +
          '<div class="library-label">' + esc(card.label) + '</div>' +
          '<div class="library-kind">' + kindName(kind, card) + '</div>' +
        '</div>' +
      '</div>';
    }

    function kindName(kind, card) {
      if (kind === 'E') return 'Energia';
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
        renderLiveV1Card(item.kind, card) +
        renderItemActions(item) +
      '</article>';
    }

    function renderCrossItem(item, p) {
      return '<article class="live-cross">' +
        window.EPICCardsV1.renderCrossFront(p) +
        renderItemActions(item) +
      '</article>';
    }

    function renderLiveV1Card(kind, card) {
      if (!window.EPICCardsV1) return '';
      if (kind === 'E') return window.EPICCardsV1.renderEnergyFront(card);
      if (kind === 'P') return window.EPICCardsV1.renderPatternFront(card);
      return window.EPICCardsV1.renderInterventionFront(card);
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
      await loadSavedRooms();
      startPolling();
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (window.EPICCardsV1) {
        window.EPICCardsV1.configure({ data: EPIC_DATA });
      }
      document.getElementById('newRoomBtn')?.addEventListener('click', () => {
        roomId = createRoomId();
        tableState = createEmptyState(roomId);
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomId);
        window.history.replaceState(null, '', url.toString());
        renderAll();
        saveRoom().then(loadSavedRooms);
      });
      document.getElementById('copyViewerBtn')?.addEventListener('click', copyViewerLink);
      document.getElementById('copyViewerBtn2')?.addEventListener('click', copyViewerLink);
      document.getElementById('clearTableBtn')?.addEventListener('click', clearTable);
      document.getElementById('saveTitleBtn')?.addEventListener('click', saveTitle);
      document.getElementById('openRoomBtn')?.addEventListener('click', () => openRoom(liveEls.openRoomInput?.value || ''));
      document.getElementById('refreshRoomsBtn')?.addEventListener('click', loadSavedRooms);
      liveEls.openRoomInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') openRoom(liveEls.openRoomInput.value);
      });
      liveEls.roomTitleInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') saveTitle();
      });
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
