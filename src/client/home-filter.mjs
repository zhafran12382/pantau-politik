// Tanpa JS, seluruh register tetap terbaca; kontrol baru aktif setelah inisialisasi.
export function initIssueFilter(doc, win) {
  const grid = doc.getElementById('issueGrid');
  const input = doc.getElementById('issueSearch');
  const chips = doc.getElementById('categoryFilters');
  const empty = doc.getElementById('noResults');
  const reset = doc.getElementById('resetFilter');
  const count = doc.getElementById('resultCount');
  const controls = doc.getElementById('issueFilterControls');
  const fallback = doc.getElementById('filterFallback');
  if (!grid || !input || !chips || !empty) return false;
  if (grid.dataset.filterReady === 'true') return true;
  const buttons = [...chips.querySelectorAll('button[data-category]')];
  const entries = [...grid.querySelectorAll('.register-entry')];
  const cards = [...grid.querySelectorAll('.issue-card')];
  const items = [...cards, ...entries];
  const counted = entries.length ? entries : cards;
  const total = counted.length;
  const topics = buttons.filter(button => button.dataset.category).length;
  let category = '';

  const syncUrl = () => {
    const url = new URL(win.location.href);
    url.searchParams.delete('cari');
    url.searchParams.delete('topik');
    if (input.value.trim()) url.searchParams.set('cari', input.value.trim());
    if (category) url.searchParams.set('topik', category);
    // Hash dan parameter lain tidak dimiliki filter register.
    win.history.replaceState(win.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const apply = ({ sync = true } = {}) => {
    const query = input.value.trim().toLowerCase();
    for (const item of items) {
      item.hidden = !((!category || item.dataset.category === category) && (!query || (item.dataset.search || '').includes(query)));
    }
    const visible = counted.filter(item => !item.hidden).length;
    for (const group of grid.querySelectorAll('.supporting-issues, .issue-grid')) {
      group.hidden = !group.querySelector('.issue-card:not([hidden])');
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String((button.dataset.category || '') === category));
    empty.hidden = visible > 0;
    const active = Boolean(query || category);
    if (reset) reset.hidden = !active;
    if (count) count.textContent = active ? `${visible} dari ${total} isu` : `${total} isu · ${topics} topik`;
    if (sync) syncUrl();
  };
  const restore = () => {
    const params = new URLSearchParams(win.location.search);
    input.value = params.get('cari') || '';
    const topic = params.get('topik') || '';
    category = buttons.some(button => button.dataset.category === topic) ? topic : '';
  };
  restore();
  apply();
  input.addEventListener('input', () => apply());
  chips.addEventListener('click', event => {
    const button = event.target?.closest?.('button[data-category]');
    if (!button || !buttons.includes(button)) return;
    category = button.dataset.category || '';
    apply();
  });
  reset?.addEventListener('click', () => {
    input.value = '';
    category = '';
    apply();
    input.focus();
  });
  win.addEventListener('popstate', () => { restore(); apply({ sync: false }); });
  for (const control of [input, ...buttons, reset]) if (control) control.disabled = false;
  if (controls) controls.hidden = false;
  if (fallback) fallback.hidden = true;
  grid.dataset.filterReady = 'true';
  return true;
}
