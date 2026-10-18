(function () {
  async function revealAdminOrdersLink() {
    const link = document.getElementById('adminOrdersLink');
    if (!link) return;

    try {
      const response = await fetch('/me', {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.authenticated && data.user?.role === 'admin') {
        link.hidden = false;
      }
    } catch (_) {
      // The admin shortcut is optional; keep it hidden if identity lookup fails.
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealAdminOrdersLink);
  } else {
    revealAdminOrdersLink();
  }
})();
