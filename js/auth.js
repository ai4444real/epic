(function () {
  const config = window.EPIC_APP_CONFIG || {};
  const authEnabled = !!config.authEnabled;
  const loggingEnabled = !!config.eventLoggingEnabled;
  const loginProvider = config.loginProvider || 'google';
  const loginRedirectPath = config.loginRedirectPath || 'auth-callback.html';
  const postLoginDefaultPath = config.postLoginDefaultPath || 'index.html';
  const appEventsTable = config.appEventsTable || 'app_events';

  const pageName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isLoginPage = pageName === 'login.html';
  const isCallbackPage = pageName === 'auth-callback.html';
  const isProtectedPage = !isLoginPage && !isCallbackPage;

  let supabaseClient = null;

  function getBaseUrl() {
    return window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  }

  function getRedirectUrl() {
    return getBaseUrl() + loginRedirectPath;
  }

  function getRequestedPath() {
    return window.location.pathname.split('/').pop() || postLoginDefaultPath;
  }

  function sanitizeTarget(target) {
    const fallback = postLoginDefaultPath;
    const value = (target || '').trim();
    if (!value) return fallback;

    // Only allow same-folder relative pages and never bounce back into auth pages.
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) return fallback;

    const clean = value.split('?')[0].split('#')[0] || fallback;
    if (clean === 'login.html' || clean === loginRedirectPath) return fallback;
    return clean;
  }

  function navigateTo(target) {
    const next = sanitizeTarget(target);
    const current = getRequestedPath();
    if (current === next) return;
    window.location.replace(next);
  }

  function setPostLoginTarget(target) {
    window.sessionStorage.setItem('epic_post_login_target', sanitizeTarget(target));
  }

  function consumePostLoginTarget() {
    const target = sanitizeTarget(window.sessionStorage.getItem('epic_post_login_target'));
    window.sessionStorage.removeItem('epic_post_login_target');
    return target;
  }

  function createClientOrNull() {
    if (!window.supabase || !config.supabaseUrl || !config.supabaseAnonKey) return null;
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return supabaseClient;
  }

  async function getValidatedSession(client) {
    const { data } = await client.auth.getSession();
    const session = data && data.session ? data.session : null;
    if (!session) return null;

    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData || !userData.user) {
      await client.auth.signOut();
      return null;
    }

    return session;
  }

  function getSessionEmail(session) {
    return session && session.user && session.user.email ? session.user.email : 'utente-sconosciuto';
  }

  async function logEvent(action, meta) {
    if (!loggingEnabled) return;
    try {
      const client = createClientOrNull();
      if (!client) return;
      const { data } = await client.auth.getSession();
      const session = data && data.session ? data.session : null;
      await client.from(appEventsTable).insert({
        action,
        path: pageName,
        user_email: session && session.user ? session.user.email : null,
        meta: meta || {}
      });
    } catch (error) {
      console.warn('EPiC logging skipped:', error);
    }
  }

  function createToolbarButton(label, onClick) {
    const button = document.createElement('button');
    button.className = 'btn';
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function mountLogout(session) {
    if (!authEnabled || !session || document.getElementById('epicLogoutBtn')) return;

    const target =
      document.querySelector('.toolbar-actions') ||
      document.querySelector('.controls') ||
      document.querySelector('.toolbar');

    if (!target) return;

    const logoutBtn = createToolbarButton('Esci', async () => {
      const client = createClientOrNull();
      if (!client) return;
      await logEvent('logout_click');
      await client.auth.signOut();
      window.location.href = 'login.html';
    });
    logoutBtn.id = 'epicLogoutBtn';

    const userTag = document.createElement('span');
    userTag.id = 'epicUserTag';
    userTag.style.fontSize = '12px';
    userTag.style.color = 'var(--muted, #71717a)';
    userTag.textContent = session.user && session.user.email ? session.user.email : 'Utente';

    if (target.classList && target.classList.contains('toolbar')) {
      const wrap = document.createElement('div');
      wrap.style.marginLeft = 'auto';
      wrap.style.display = 'flex';
      wrap.style.gap = '10px';
      wrap.style.alignItems = 'center';
      wrap.appendChild(userTag);
      wrap.appendChild(logoutBtn);
      target.appendChild(wrap);
    } else {
      target.appendChild(userTag);
      target.appendChild(logoutBtn);
    }
  }

  async function requireAuth() {
    if (!authEnabled) return null;

    const client = createClientOrNull();
    if (!client) throw new Error('Supabase client not available');

    const session = await getValidatedSession(client);

    if (!session) {
      console.log('[EPIC auth] Nessuna sessione valida su', pageName, '-> redirect a login.html');
      setPostLoginTarget(getRequestedPath());
      navigateTo('login.html');
      return null;
    }

    console.log('[EPIC auth] Sessione valida su', pageName, 'come', getSessionEmail(session));
    mountLogout(session);
    return session;
  }

  async function handleLoginPage() {
    const client = createClientOrNull();
    if (!client || !authEnabled) return;

    const session = await getValidatedSession(client);
    if (session) {
      const target = consumePostLoginTarget();
      console.log('[EPIC auth] Sei gia loggato come', getSessionEmail(session), '-> redirect a', target);
      navigateTo(target);
      return;
    }

    console.log('[EPIC auth] Nessuna sessione valida su login.html, mostro il pulsante Google');
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    loginBtn.disabled = false;
    loginBtn.addEventListener('click', async () => {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Reindirizzamento...';
      const requestedTarget = new URLSearchParams(window.location.search).get('redirect') || postLoginDefaultPath;
      setPostLoginTarget(requestedTarget);
      console.log('[EPIC auth] Avvio login Google, target post-login =', sanitizeTarget(requestedTarget));
      const { error } = await client.auth.signInWithOAuth({
        provider: loginProvider,
        options: {
          redirectTo: getRedirectUrl()
        }
      });
      if (error) {
        console.warn('[EPIC auth] Errore avvio login Google:', error);
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entra con Google';
        const errorBox = document.getElementById('loginError');
        if (errorBox) errorBox.textContent = error.message || 'Login non riuscito.';
      }
    });
  }

  async function handleCallbackPage() {
    const client = createClientOrNull();
    if (!client || !authEnabled) {
      console.log('[EPIC auth] Callback aperto con auth disabilitata -> redirect a', postLoginDefaultPath);
      navigateTo(postLoginDefaultPath);
      return;
    }

    const status = document.getElementById('callbackStatus');
    if (status) status.textContent = 'Verifica sessione in corso...';

    const session = await getValidatedSession(client);
    if (session) {
      const target = consumePostLoginTarget();
      console.log('[EPIC auth] Callback completato, sessione valida come', getSessionEmail(session), '-> redirect a', target);
      await logEvent('login_success');
      navigateTo(target);
      return;
    }

    console.warn('[EPIC auth] Callback senza sessione valida, torno a login.html');
    if (status) status.textContent = 'Sessione non trovata. Riprova.';
    window.setTimeout(() => {
      navigateTo('login.html');
    }, 1500);
  }

  async function bootstrap() {
    if (authEnabled && !window.supabase) {
      console.warn('EPiC auth enabled but Supabase browser library not loaded.');
      return;
    }

    if (!authEnabled) {
      const loginOnly = document.querySelectorAll('[data-auth-only]');
      loginOnly.forEach((el) => { el.style.display = 'none'; });
      return;
    }

    if (isLoginPage) {
      await handleLoginPage();
      return;
    }

    if (isCallbackPage) {
      await handleCallbackPage();
      return;
    }

    const session = await requireAuth();
    if (session) {
      await logEvent('page_view', { page: pageName });
    }
  }

  window.EPIC_AUTH = {
    logEvent
  };

  window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch((error) => {
      console.warn('EPiC auth bootstrap failed:', error);
    });
  });
})();
