import { comparisonFor } from '../lib/comparison/compute.mjs';
import { comparisonView, chartFor } from '../lib/comparison/view.mjs';
import { comparisonCsv, csvEligibility } from '../lib/comparison/csv.mjs';
import { DEFAULT_COMPARISON, parseComparisonParams, buildComparisonQuery, buildComparisonUrl } from '../lib/comparison/url.mjs';

export function initComparison(doc, win) {
  const form = doc.getElementById('compareForm');
  if (!form || form.dataset.ready) return;
  const notice = doc.getElementById('compareNotice');
  const announce = doc.getElementById('compareStatus');
  const plot = doc.getElementById('chartWrap');
  const reading = doc.getElementById('chartReading');
  const fields = doc.getElementById('compareFields');
  const selectors = { a: doc.getElementById('selA'), b: doc.getElementById('selB'), indikator: doc.getElementById('selInd') };
  const radios = [...form.querySelectorAll('input[name="mode"]')];
  const table = doc.getElementById('tableWrap');
  const toggle = doc.getElementById('tableToggle');
  const download = doc.getElementById('downloadCsv');
  const csvNote = doc.getElementById('csvNote');
  const header = doc.getElementById('resultHeader');
  const summaries = doc.getElementById('summaries');
  const sourceBox = doc.getElementById('sourceBox');
  let state = { ...DEFAULT_COMPARISON }, currentComparison, currentIndicator, data, context;
  const message = text => { if (notice) { notice.textContent = text; notice.hidden = !text; } };
  const selectState = next => {
    for (const key of Object.keys(selectors)) selectors[key].value = next[key];
    for (const radio of radios) radio.checked = radio.value === next.mode;
  };
  const resetReading = () => {
    if (reading) reading.textContent = plot.querySelector('[tabindex][aria-label]')
      ? 'Ketuk atau fokus pada titik untuk membaca nilainya.'
      : 'Grafik belum menyediakan titik bernilai. Periksa cakupan pada tabel dan metode.';
  };
  const updateCsv = eligibility => {
    if (download) {
      download.disabled = !eligibility.allowed;
      download.textContent = eligibility.partial ? 'Unduh CSV parsial' : 'Unduh CSV';
      download.title = eligibility.reason;
    }
    if (csvNote) csvNote.textContent = eligibility.reason;
  };
  function draw() {
    if (!currentComparison || !currentIndicator) return;
    try {
      const chart = chartFor(currentComparison, currentIndicator, state.mode, Math.round(plot.getBoundingClientRect().width) || undefined, data.contextMarkers);
      plot.innerHTML = chart;
      resetReading();
    } catch { message('Grafik belum berhasil digambar ulang. Tabel dan hasil sebelumnya tetap tersedia.'); }
  }
  function render(next) {
    const indicator = data.indicators.find(item => item.id === next.indikator);
    const comparison = comparisonFor(indicator, data.administrations, data.observations, next.a, next.b);
    // Prepare every dependent view before replacing any visible output.
    const view = comparisonView(comparison, indicator, data.sources, next.mode, data.contextMarkers);
    const chart = chartFor(comparison, indicator, next.mode, Math.round(plot.getBoundingClientRect().width) || undefined, data.contextMarkers);
    const eligibility = csvEligibility(comparison, indicator);
    header.innerHTML = view.header;
    plot.innerHTML = chart;
    summaries.innerHTML = view.summaries;
    table.innerHTML = view.table;
    sourceBox.innerHTML = view.methodology;
    const code = doc.getElementById('exhibitCode');
    if (code) code.textContent = `Indikator / ${indicator.id}`;
    state = { ...next }; currentComparison = comparison; currentIndicator = indicator;
    selectState(state);
    resetReading();
    updateCsv(eligibility);
    announce.textContent = comparison.blocked
      ? `${indicator.label}. Data belum dapat dibandingkan. Pemeriksaan metode belum selesai.`
      : `${indicator.label}. ${comparison.sumA.validCount} dan ${comparison.sumB.validCount} observasi. Mode ${state.mode === 'setara' ? 'rentang setara' : 'kalender'}.`;
  }
  if (toggle) { toggle.hidden = true; toggle.disabled = true; }
  if (download) { download.hidden = true; download.disabled = true; }
  try {
    if (!fields || !plot || !reading || !announce || !table || !toggle || !download || !header || !summaries || !sourceBox || Object.values(selectors).some(item => !item)) throw new Error('Comparison UI unavailable');
    data = JSON.parse(doc.getElementById('compare-data').textContent);
    for (const key of ['administrations', 'indicators', 'observations', 'sources']) {
      if (!Array.isArray(data[key]) || !data[key].length) throw new Error('Comparison data unavailable');
    }
    if (!Array.isArray(data.contextMarkers)) data.contextMarkers = [];
    context = { adminIds: data.administrations.map(item => item.id), indicatorIds: data.indicators.map(item => item.id) };
    const initial = parseComparisonParams(win.location.search, context);
    render(initial.state);
    win.history.replaceState({ comparison: state }, '', buildComparisonUrl(win.location, state));
    message(initial.notices.join(' '));
  } catch {
    message('Pilihan interaktif belum berhasil dimuat. Tabel bawaan masih ditampilkan. Baca metode di bawah grafik.');
    if (fields) fields.disabled = true;
    if (table) table.hidden = false;
    return;
  }
  function commit(next) {
    if (next.a === next.b) {
      selectState(state);
      message('Pilih dua pemerintahan yang berbeda. Pilihan sebelumnya tetap digunakan.');
      return;
    }
    try {
      const parsed = parseComparisonParams(buildComparisonQuery(next), context);
      if (parsed.hadInvalid) { selectState(state); message(parsed.notices.join(' ')); return; }
      if (buildComparisonQuery(next) === buildComparisonQuery(state)) return;
      render(next);
      win.history.pushState({ comparison: state }, '', buildComparisonUrl(win.location, state));
      message('');
    } catch {
      selectState(state);
      message('Pilihan ini belum berhasil dimuat. Hasil pilihan sebelumnya tetap ditampilkan. Baca metode untuk memeriksa cakupan data.');
    }
  }
  const change = () => commit({ a: selectors.a.value, b: selectors.b.value, indikator: selectors.indikator.value, mode: radios.find(radio => radio.checked)?.value || 'kalender' });
  const readPoint = target => {
    const point = target.closest?.('[tabindex][aria-label]');
    if (!point || !plot.contains(point)) return;
    reading.textContent = point.getAttribute('aria-label');
  };
  plot.addEventListener('click', event => readPoint(event.target));
  plot.addEventListener('focusin', event => readPoint(event.target));
  form.addEventListener('change', change);
  form.addEventListener('submit', event => { event.preventDefault(); change(); });
  doc.getElementById('swapPeriods')?.addEventListener('click', () => commit({ ...state, a: state.b, b: state.a }));
  toggle.addEventListener('click', () => {
    table.hidden = !table.hidden;
    toggle.setAttribute('aria-expanded', String(!table.hidden));
    toggle.textContent = table.hidden ? 'Lihat angka' : 'Sembunyikan angka';
  });
  download.addEventListener('click', () => {
    const eligibility = csvEligibility(currentComparison, currentIndicator);
    updateCsv(eligibility);
    if (!eligibility.allowed) { message(eligibility.reason); return; }
    try {
      const csv = comparisonCsv(currentComparison, currentIndicator, state.mode);
      const blob = new win.Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = win.URL.createObjectURL(blob);
      const link = doc.createElement('a');
      link.href = url;
      link.download = `pantau-politik-${currentIndicator.id}-${state.a}-${state.b}-${state.mode}.csv`;
      doc.body.append(link);
      link.click();
      link.remove();
      win.setTimeout(() => win.URL.revokeObjectURL(url), 1000);
    } catch { message('CSV belum berhasil diunduh. Tabel tetap tersedia untuk memeriksa angka dan metode.'); }
  });
  win.addEventListener('popstate', () => {
    const parsed = parseComparisonParams(win.location.search, context);
    try { render(parsed.state); message(parsed.notices.join(' ')); }
    catch { selectState(state); message('Pilihan pada riwayat belum berhasil dimuat. Hasil sebelumnya tetap ditampilkan.'); }
  });
  if (win.ResizeObserver) {
    let previousWidth = 0;
    const observer = new win.ResizeObserver(entries => {
      const width = Math.round(entries[0].contentRect.width);
      if (width && width !== previousWidth) { previousWidth = width; draw(); }
    });
    observer.observe(plot);
  } else {
    let frame;
    win.addEventListener('resize', () => { win.cancelAnimationFrame(frame); frame = win.requestAnimationFrame(draw); }, { passive: true });
  }
  fields.disabled = false;
  const noJsNote = doc.getElementById('noJsNote');
  if (noJsNote) noJsNote.hidden = true;
  form.dataset.ready = 'true';
  table.hidden = false;
  toggle.hidden = false;
  toggle.disabled = false;
  toggle.setAttribute('aria-expanded', 'true');
  toggle.textContent = 'Sembunyikan angka';
  download.hidden = false;
}
