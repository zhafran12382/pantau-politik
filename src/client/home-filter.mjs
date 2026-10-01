// Filter register isu: pencarian teks + topik + query URL.
// Tanpa JS seluruh isu tampil; dengan JS keadaan dapat dibagikan via URL.
export function initIssueFilter(doc, win) {
  const grid = doc.getElementById('issueGrid');
  const input = doc.getElementById('issueSearch');
  const chips = doc.getElementById('categoryFilters');
  const empty = doc.getElementById('noResults');
  const reset = doc.getElementById('resetFilter');
  const count = doc.getElementById('resultCount');
  if (!grid || !input || !chips) return;
  const total = grid.querySelectorAll('.issue-card').length;
  let category = '';
  const syncUrl = () => {
    const params = new URLSearchParams();
    if (input.value.trim()) params.set('cari', input.value.trim());
    if (category) params.set('topik', category);
    const query = params.toString();
    win.history.replaceState(null, '', query ? `${win.location.pathname}?${query}` : win.location.pathname);
  };
  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    for (const card of grid.querySelectorAll('.issue-card')) {
      const matchCategory = !category || card.dataset.category === category;
      const matchQuery = !query || (card.dataset.search || '').includes(query);
      const show = matchCategory && matchQuery;
      card.hidden = !show;
      if (show) visible++;
    }
    empty.hidden = visible > 0;
    const active = query || category;
    if (reset) reset.hidden = !active;
    if (count) count.textContent = active ? `${visible} dari ${total} isu` : `${total} isu · ${chips.querySelectorAll('button[data-category]:not([data-category=""])').length} topik`;
    syncUrl();
  };
  // Pulihkan keadaan dari URL (tautan berbagi).
  try {
    const params = new URLSearchParams(win.location.search);
    if (params.get('cari')) input.value = params.get('cari');
    const topik = params.get('topik') || '';
    if (topik) {
      const button = chips.querySelector(`button[data-category="${CSS.escape(topik)}"]`);
      if (button) {
        category = topik;
        for (const chip of chips.querySelectorAll('button')) chip.setAttribute('aria-pressed', String(chip === button));
      }
    }
  } catch { /* abaikan query rusak: tampilkan semua */ }
  input.addEventListener('input', apply);
  chips.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    category = button.dataset.category || '';
    for (const chip of chips.querySelectorAll('button')) chip.setAttribute('aria-pressed', String(chip === button));
    apply();
  });
  reset?.addEventListener('click', () => {
    input.value = '';
    category = '';
    for (const chip of chips.querySelectorAll('button')) chip.setAttribute('aria-pressed', String(chip.dataset.category === ''));
    apply();
    input.focus();
  });
  apply();
}
