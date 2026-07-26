(function () {
  const config = window.EPIC_APP_CONFIG || {};
  const authEnabled = !!config.authEnabled;

  const pageName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isLoginPage = pageName === 'login' || pageName === 'login.html';

  async function fetchMe() {
    const response = await fetch('/me', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data && data.authenticated ? data.user : null;
  }

  function createToolbarLink(label, href) {
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = href;
    link.textContent = label;
    return link;
  }

  function mountUser(user) {
    if (!authEnabled || !user || document.getElementById('epicLogoutBtn')) return;

    const target =
      document.querySelector('.toolbar-actions') ||
      document.querySelector('.controls') ||
      document.querySelector('.toolbar');

    if (!target) return;

    const userTag = document.createElement('span');
    userTag.id = 'epicUserTag';
    userTag.style.fontSize = '12px';
    userTag.style.color = 'var(--muted, #71717a)';
    userTag.textContent = user.email || 'Utente';

    const logout = createToolbarLink('Esci', '/logout');
    logout.id = 'epicLogoutBtn';

    if (target.classList && target.classList.contains('toolbar')) {
      const wrap = document.createElement('div');
      wrap.style.marginLeft = 'auto';
      wrap.style.display = 'flex';
      wrap.style.gap = '10px';
      wrap.style.alignItems = 'center';
      wrap.appendChild(userTag);
      wrap.appendChild(logout);
      target.appendChild(wrap);
    } else {
      target.appendChild(userTag);
      target.appendChild(logout);
    }
  }

  async function handleLoginPage() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || '/epic';
    const error = params.get('error');
    const errorBox = document.getElementById('loginError');
    if (error && errorBox) errorBox.textContent = error;

    const user = await fetchMe();
    if (user) {
      window.location.replace(next);
      return;
    }

    loginBtn.disabled = false;
    loginBtn.addEventListener('click', () => {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Reindirizzamento...';
      window.location.href = '/auth/google/start?next=' + encodeURIComponent(next);
    });
  }

  async function bootstrap() {
    if (!authEnabled) return;

    if (isLoginPage) {
      await handleLoginPage();
      return;
    }

    const user = await fetchMe();
    if (user) {
      mountUser(user);
    }
  }

  window.EPIC_AUTH = {
    fetchMe
  };

  window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch((error) => {
      console.warn('EPiC auth bootstrap failed:', error);
    });
  });
})();
