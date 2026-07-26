(function () {
  const els = {
    status: document.getElementById('adminStatus'),
    form: document.getElementById('logFilterForm'),
    refresh: document.getElementById('refreshLogsBtn'),
    path: document.getElementById('pathFilter'),
    session: document.getElementById('sessionFilter'),
    statusFilter: document.getElementById('statusFilter'),
    limit: document.getElementById('limitFilter'),
    metrics: document.getElementById('metricGrid'),
    topPaths: document.getElementById('topPaths'),
    recentSessions: document.getElementById('recentSessions'),
    body: document.getElementById('logsBody')
  };

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function setStatus(text, kind) {
    if (!els.status) return;
    els.status.textContent = text || '';
    els.status.className = 'admin-status' + (kind ? ' ' + kind : '');
  }

  async function adminFetch(url) {
    const response = await fetch(url, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error(data?.error || 'HTTP ' + response.status);
    }
    return data;
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'medium' });
  }

  function short(value, size) {
    const text = String(value || '');
    if (text.length <= size) return text;
    return text.slice(0, size - 1) + '...';
  }

  function buildUrl() {
    const params = new URLSearchParams();
    params.set('limit', els.limit?.value || '200');
    if (els.path?.value.trim()) params.set('path', els.path.value.trim());
    if (els.session?.value.trim()) params.set('session_id', els.session.value.trim());
    if (els.statusFilter?.value) params.set('status', els.statusFilter.value);
    return '/api/admin/logs?' + params.toString();
  }

  function renderMetrics(summary) {
    const metrics = [
      ['Hit', summary.total || 0],
      ['Sessioni', summary.sessions || 0],
      ['Errori', summary.errors || 0],
      ['Media ms', summary.avg_duration_ms || 0],
      ['Primo', formatDate(summary.first_seen)],
      ['Ultimo', formatDate(summary.last_seen)]
    ];
    els.metrics.innerHTML = metrics.map(([label, value]) =>
      '<div class="metric-card"><div class="metric-label">' + esc(label) + '</div><div class="metric-value">' + esc(value) + '</div></div>'
    ).join('');
  }

  function renderList(target, rows, renderRow) {
    if (!rows.length) {
      target.innerHTML = '<div class="muted-line">Nessun dato.</div>';
      return;
    }
    target.innerHTML = '<div class="compact-list">' + rows.map(renderRow).join('') + '</div>';
  }

  function renderTopPaths(rows) {
    renderList(els.topPaths, rows, row =>
      '<button class="compact-row" data-path="' + esc(row.path) + '">' +
        '<span>' + esc(row.path) + '</span>' +
        '<strong>' + esc(row.hits) + '</strong>' +
      '</button>'
    );
    els.topPaths.querySelectorAll('[data-path]').forEach(button => {
      button.addEventListener('click', () => {
        els.path.value = button.dataset.path;
        loadLogs();
      });
    });
  }

  function renderRecentSessions(rows) {
    renderList(els.recentSessions, rows, row =>
      '<button class="compact-row" data-session="' + esc(row.session_id) + '">' +
        '<span title="' + esc(row.session_id) + '">' + esc(short(row.session_id, 18)) + '</span>' +
        '<strong>' + esc(row.hits) + '</strong>' +
      '</button>'
    );
    els.recentSessions.querySelectorAll('[data-session]').forEach(button => {
      button.addEventListener('click', () => {
        els.session.value = button.dataset.session;
        loadLogs();
      });
    });
  }

  function renderLogs(rows) {
    if (!rows.length) {
      els.body.innerHTML = '<tr><td colspan="7">Nessun log.</td></tr>';
      return;
    }
    els.body.innerHTML = rows.map(row => {
      const fullPath = row.path + (row.query_string ? '?' + row.query_string : '');
      return '<tr>' +
        '<td>' + esc(formatDate(row.created_at)) + '</td>' +
        '<td class="path-cell" title="' + esc(fullPath) + '">' + esc(short(fullPath, 56)) + '</td>' +
        '<td><span class="status-pill status-' + esc(row.status_code) + '">' + esc(row.status_code) + '</span></td>' +
        '<td>' + esc(row.duration_ms) + '</td>' +
        '<td title="' + esc(row.session_id) + '">' + esc(short(row.session_id, 14)) + '</td>' +
        '<td title="' + esc(row.forwarded_for || row.client_ip) + '">' + esc(short(row.client_ip || row.forwarded_for, 18)) + '</td>' +
        '<td title="' + esc(row.referer) + '">' + esc(short(row.referer || '-', 34)) + '</td>' +
      '</tr>';
    }).join('');
  }

  async function loadLogs() {
    setStatus('Caricamento log...');
    try {
      const report = await adminFetch(buildUrl());
      renderMetrics(report.summary || {});
      renderTopPaths(report.top_paths || []);
      renderRecentSessions(report.recent_sessions || []);
      renderLogs(report.logs || []);
      setStatus('Log aggiornati.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      if (els.body) els.body.innerHTML = '<tr><td colspan="7">Impossibile caricare i log.</td></tr>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    els.form?.addEventListener('submit', event => {
      event.preventDefault();
      loadLogs();
    });
    els.refresh?.addEventListener('click', loadLogs);
    loadLogs();
  });
})();
