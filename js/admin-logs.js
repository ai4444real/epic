(function () {
  const els = {
    status: document.getElementById('adminStatus'),
    form: document.getElementById('logFilterForm'),
    refresh: document.getElementById('refreshLogsBtn'),
    date: document.getElementById('dateFilter'),
    path: document.getElementById('pathFilter'),
    session: document.getElementById('sessionFilter'),
    traffic: document.getElementById('trafficFilter'),
    outcome: document.getElementById('outcomeFilter'),
    statusFilter: document.getElementById('statusFilter'),
    limit: document.getElementById('limitFilter'),
    metrics: document.getElementById('metricGrid'),
    days: document.getElementById('dayCardGrid'),
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

  function formatDay(value) {
    if (!value) return '-';
    const date = new Date(value + 'T12:00:00Z');
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  function short(value, size) {
    const text = String(value || '');
    if (text.length <= size) return text;
    return text.slice(0, size - 1) + '...';
  }

  function buildUrl() {
    const params = new URLSearchParams();
    params.set('limit', els.limit?.value || '200');
    if (els.date?.value) params.set('date', els.date.value);
    if (els.path?.value.trim()) params.set('path', els.path.value.trim());
    if (els.session?.value.trim()) params.set('session_id', els.session.value.trim());
    if (els.traffic?.value) params.set('traffic', els.traffic.value);
    if (els.outcome?.value) params.set('outcome', els.outcome.value);
    if (els.statusFilter?.value) params.set('status', els.statusFilter.value);
    return '/api/admin/logs?' + params.toString();
  }

  function renderDays(rows, activeDay, summary) {
    if (!els.days) return;
    if (!rows.length) {
      els.days.innerHTML = '';
      return;
    }
    const totalSessions = summary?.sessions || 0;
    const totalHits = summary?.hits || 0;
    const totalErrors = summary?.errors || 0;
    els.days.innerHTML = rows.map(row => {
      const activeClass = row.day === activeDay ? ' active' : '';
      return '<button class="day-card' + activeClass + '" data-day="' + esc(row.day) + '">' +
        '<span class="day-label">' + esc(formatDay(row.day)) + '</span>' +
        '<strong>' + esc(row.sessions || 0) + '</strong>' +
        '<span>visitatori</span>' +
        '<small>' + esc(row.hits || 0) + ' hit' + (row.errors ? ' · ' + esc(row.errors) + ' errori' : '') + '</small>' +
      '</button>';
    }).join('') +
      '<button class="day-card day-card-total" data-clear-day="1">' +
        '<span class="day-label">3 giorni</span>' +
        '<strong>' + esc(totalSessions) + '</strong>' +
        '<span>visitatori totali</span>' +
        '<small>' + esc(totalHits) + ' hit' + (totalErrors ? ' · ' + esc(totalErrors) + ' errori' : '') + '</small>' +
      '</button>';
    els.days.querySelectorAll('[data-day]').forEach(button => {
      button.addEventListener('click', () => {
        els.date.value = button.dataset.day;
        loadLogs();
      });
    });
    els.days.querySelector('[data-clear-day]')?.addEventListener('click', () => {
      els.date.value = '';
      loadLogs();
    });
  }

  function renderMetrics(summary) {
    const metrics = [
      ['Hit', summary.total || 0],
      ['Visitatori', summary.sessions || 0],
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
      els.body.innerHTML = '<tr><td colspan="8">Nessun log.</td></tr>';
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
        '<td title="' + esc(row.user_agent) + '">' + esc(short(row.user_agent || '-', 34)) + '</td>' +
        '<td title="' + esc(row.referer) + '">' + esc(short(row.referer || '-', 34)) + '</td>' +
      '</tr>';
    }).join('');
  }

  async function loadLogs() {
    setStatus('Caricamento log...');
    try {
      const report = await adminFetch(buildUrl());
      renderDays(report.recent_days || [], report.filters?.date || '', report.recent_days_summary || {});
      renderMetrics(report.summary || {});
      renderTopPaths(report.top_paths || []);
      renderRecentSessions(report.recent_sessions || []);
      renderLogs(report.logs || []);
      setStatus('Log aggiornati.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      if (els.body) els.body.innerHTML = '<tr><td colspan="8">Impossibile caricare i log.</td></tr>';
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
