(function () {
  const form = document.getElementById('deckOrderForm');
  const status = document.getElementById('deckOrderStatus');
  if (!form || !status) return;

  function setStatus(message, kind) {
    status.textContent = message || '';
    status.className = 'form-status full-row' + (kind ? ' ' + kind : '');
  }

  function payloadFromForm() {
    const data = new FormData(form);
    return {
      name: data.get('name') || '',
      email: data.get('email') || '',
      location: data.get('location') || '',
      quantity: data.get('quantity') || '1',
      note: data.get('note') || '',
      company_website: data.get('company_website') || '',
      privacy_accepted: data.get('privacy_accepted') === 'on',
      terms_accepted: data.get('terms_accepted') === 'on'
    };
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    setStatus('', '');

    if (!form.reportValidity()) {
      return;
    }

    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus('Invio in corso...', '');

    try {
      const response = await fetch('/api/deck-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payloadFromForm())
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Non è stato possibile inviare la richiesta.');
      }
      form.reset();
      setStatus(result.message || 'Richiesta ricevuta. Ti ricontatteremo per i dettagli.', 'success');
    } catch (error) {
      setStatus(error.message || 'Errore durante l’invio. Riprova tra poco.', 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
