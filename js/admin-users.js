(function () {
  const roles = ['public', 'unlocked', 'admin'];
  const els = {
    body: document.getElementById('usersBody'),
    status: document.getElementById('adminStatus'),
    form: document.getElementById('createUserForm'),
    email: document.getElementById('newUserEmail'),
    role: document.getElementById('newUserRole'),
    refresh: document.getElementById('refreshUsersBtn')
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

  function roleOptions(activeRole) {
    return roles.map(role =>
      '<option value="' + role + '"' + (role === activeRole ? ' selected' : '') + '>' + role + '</option>'
    ).join('');
  }

  function renderUsers(users) {
    if (!els.body) return;
    if (!users.length) {
      els.body.innerHTML = '<tr><td colspan="5">Nessun utente.</td></tr>';
      return;
    }
    els.body.innerHTML = users.map(user => {
      const email = esc(user.email);
      return '<tr data-email="' + email + '">' +
        '<td><span class="user-email">' + email + '</span>' + (user.pending ? '<span class="user-pending">pending</span>' : '') + '</td>' +
        '<td>' + esc(user.name || '-') + '</td>' +
        '<td><select class="input role-select" data-role-email="' + email + '">' + roleOptions(user.role) + '</select></td>' +
        '<td>' + esc(formatDate(user.last_login_at)) + '</td>' +
        '<td><div class="user-actions"><button class="btn danger" data-delete-email="' + email + '">Elimina</button></div></td>' +
      '</tr>';
    }).join('');

    els.body.querySelectorAll('[data-role-email]').forEach(select => {
      select.addEventListener('change', () => updateRole(select.dataset.roleEmail, select.value));
    });
    els.body.querySelectorAll('[data-delete-email]').forEach(button => {
      button.addEventListener('click', () => deleteUser(button.dataset.deleteEmail));
    });
  }

  async function loadUsers() {
    setStatus('Caricamento utenti...');
    try {
      const users = await adminFetch('/api/admin/users');
      renderUsers(Array.isArray(users) ? users : []);
      setStatus('Utenti aggiornati.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      if (els.body) els.body.innerHTML = '<tr><td colspan="5">Impossibile caricare gli utenti.</td></tr>';
    }
  }

  async function createUser(event) {
    event.preventDefault();
    const email = (els.email?.value || '').trim();
    const role = els.role?.value || 'public';
    if (!email) return;
    setStatus('Aggiunta utente...');
    try {
      await adminFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, role })
      });
      if (els.email) els.email.value = '';
      await loadUsers();
      setStatus('Utente aggiunto.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      await loadUsers();
    }
  }

  async function updateRole(email, role) {
    setStatus('Aggiornamento ruolo...');
    try {
      await adminFetch('/api/admin/users/' + encodeURIComponent(email), {
        method: 'PUT',
        body: JSON.stringify({ role })
      });
      await loadUsers();
      setStatus('Ruolo aggiornato.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      await loadUsers();
    }
  }

  async function deleteUser(email) {
    if (!confirm('Eliminare ' + email + '?')) return;
    setStatus('Eliminazione utente...');
    try {
      await adminFetch('/api/admin/users/' + encodeURIComponent(email), { method: 'DELETE' });
      await loadUsers();
      setStatus('Utente eliminato.', 'ok');
    } catch (error) {
      setStatus('Errore: ' + error.message, 'error');
      await loadUsers();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    els.form?.addEventListener('submit', createUser);
    els.refresh?.addEventListener('click', loadUsers);
    loadUsers();
  });
})();
