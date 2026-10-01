export function initUI(doc, win) {
  for (const widget of doc.querySelectorAll('[data-share-widget]')) {
    if (widget.dataset.ready) continue;
    widget.dataset.ready = 'true';
    const button = widget.querySelector('[data-share-button]');
    const status = widget.querySelector('[data-share-status]');
    const fallback = widget.querySelector('[data-share-fallback]');
    const input = widget.querySelector('[data-share-url]');
    button.hidden = false;
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      fallback.hidden = true;
      status.textContent = '';
      const url = win.location.href;
      try {
        if (win.navigator.share) {
          try { await win.navigator.share({ title: doc.title, url }); return; }
          catch (error) { if (error?.name === 'AbortError') return; }
        }
        try {
          if (!win.navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await win.navigator.clipboard.writeText(url);
          status.textContent = 'Tautan disalin.';
        } catch {
          status.textContent = 'Tautan belum dapat disalin. Salin alamat di bawah ini.';
          input.value = url;
          fallback.hidden = false;
          input.focus();
          input.select();
        }
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
      }
    });
  }
  for (const details of doc.querySelectorAll('details.glossary')) {
    if (details.dataset.ready) continue;
    details.dataset.ready = 'true';
    const summary = details.querySelector('summary');
    const close = details.querySelector('[data-glossary-close]');
    if (close) {
      close.hidden = false;
      close.addEventListener('click', () => { details.open = false; summary.focus(); });
    }
    details.addEventListener('keydown', event => {
      if (event.key === 'Escape' && details.open) {
        event.preventDefault(); details.open = false; summary.focus();
      }
    });
  }
}
