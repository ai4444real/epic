(function () {
  const statuses = ['nuovo', 'contattato', 'pagato', 'spedito', 'annullato'];
  const els = {
    status: document.getElementById('adminStatus'),
    form: document.getElementById('ordersFilterForm'),
    refresh: document.getElementById('refreshOrdersBtn'),
    email: document.getElementById('emailFilter'),
    statusFilter: document.getElementById('statusFilter'),
    limit: document.getElementById('limitFilter'),
    metrics: document.getElementById('metricGrid'),
    body: document.getElementById('ordersBody')
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

  async function adminFetch(url, options) {
    const response = await fetch(url, {
      ...(options || {}),
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options?.headers || {})
      }
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
    return date.toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
  }

  function short(value, size) {
    const text = String(value || '');
    if (text.length <= size) return text;
    return text.slice(0, size - 1) + '...';
  }

  function buildUrl() {
    const params = new URLSearchParams();
    params.set('limit', els.limit?.value || '200');
    if (els.email?.value.trim()) params.set('email', els.email.value.trim());
    if (els.statusFilter?.value) params.set('status', els.statusFilter.value);
    return '/api/admin/deck-orders?' + params.toString();
  }

  function renderMetrics(summary) {
    const metrics = [
      ['Totale', summary.total || 0],
      ['Nuovi', summary.nuovi || 0],
      ['Contattati', summary.contattati || 0],
      ['Pagati', summary.pagati || 0],
      ['Spediti', summary.spediti || 0],
      ['Annullati', summary.annullati || 0]
    ];
    els.metrics.innerHTML = metrics.map(([label, value]) =>
      '<div class="metric-card"><div class="metric-label">' + esc(label) + '</div><div class="metric-value">' + esc(value) + '</div></div>'
    ).join('');
  }

  function statusOptions(activeStatus) {
    return statuses.map(status =>
      '<option value="' + status + '"' + (status === activeStatus ? ' selected' : '') + '>' + status + '</option>'
    ).join('');
  }

  function renderOrders(rows) {
    if (!els.body) return;
    if (!rows.length) {
      els.body.innerHTML = '<tr><td colspan="6">Nessun ordine.</td></tr>';
      return;
    }
    els.body.innerHTML = rows.map(order => {
      const email = esc(order.email);
      const note = order.note || '';
      return '<tr data-order="' + esc(order.public_id) + '">' +
        '<td>' +
          '<div>' + esc(formatDate(order.created_at)) + '</div>' +
          '<div class="muted-line" title="' + esc(order.public_id) + '">' + esc(short(order.public_id, 10)) + '</div>' +
        '</td>' +
        '<td>' +
          '<div class="user-email">' + esc(order.name) + '</div>' +
          '<a class="admin-mail-link" href="mailto:' + email + '">' + email + '</a>' +
        '</td>' +
        '<td>' + esc(order.location || '-') + '</td>' +
        '<td>' + esc(order.quantity || 1) + '</td>' +
        '<td class="order-note" title="' + esc(note) + '">' + esc(note || '-') + '</td>' +
        '<td><select class="input order-status-select" data-order-id="' + esc(order.public_id) + '">' + statusOptions(order.status) + '</select></td>' +
      '</tr>';
    }).join('');

    els.body.querySelectorAll('[data-order-id]').forEach(select => {
      select.addEventListener('change', () => updateOrderStatus(select.dataset.orderId, select.value));
    });
  }

  async function loadOrders() {
    setStatus('Caricamento ordini...');
    try {
      const report = await adminFetch(buildUrl());
      renderMetrics(report.summary || {});
      renderOrders(report.orders || []);
      setStatus('Ordini aggiornati.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      if (els.body) els.body.innerHTML = '<tr><td colspan="6">Impossibile caricare gli ordini.</td></tr>';
    }
  }

  async function updateOrderStatus(orderId, status) {
    if (!orderId) return;
    setStatus('Aggiornamento ordine...');
    try {
      await adminFetch('/api/admin/deck-orders/' + encodeURIComponent(orderId), {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      await loadOrders();
      setStatus('Stato ordine aggiornato.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      await loadOrders();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    els.form?.addEventListener('submit', event => {
      event.preventDefault();
      loadOrders();
    });
    els.refresh?.addEventListener('click', loadOrders);
    loadOrders();
  });
})();
