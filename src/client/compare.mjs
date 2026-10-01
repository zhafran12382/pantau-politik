import { comparisonFor } from '../lib/comparison/compute.mjs';
import { comparisonView, chartFor } from '../lib/comparison/view.mjs';
import { DEFAULT_COMPARISON, parseComparisonParams, buildComparisonQuery } from '../lib/comparison/url.mjs';

export function initComparison(doc, win) {
  const form = doc.getElementById('compareForm');
  if (!form || form.dataset.ready) return;
  const notice = doc.getElementById('compareNotice');
  const announce = doc.getElementById('compareStatus');
  const plot = doc.getElementById('chartWrap');
  const fields = doc.getElementById('compareFields');
  const selectors = { a: doc.getElementById('selA'), b: doc.getElementById('selB'), indikator: doc.getElementById('selInd') };
  const radios = [...form.querySelectorAll('input[name="mode"]')];
  const table = doc.getElementById('tableWrap');
  const toggle = doc.getElementById('tableToggle');
  let state = { ...DEFAULT_COMPARISON }, currentComparison, currentIndicator, data, context;
  const message = text => { notice.textContent = text; notice.hidden = !text; };
  const selectState = next => {
    for (const key of Object.keys(selectors)) selectors[key].value = next[key];
    for (const radio of radios) radio.checked = radio.value === next.mode;
  };
  function draw() {
    if (!currentComparison || !currentIndicator) return;
    plot.innerHTML = chartFor(currentComparison, currentIndicator, state.mode, Math.round(plot.getBoundingClientRect().width) || undefined, data.contextMarkers);
  }
  function render(next) {
    const indicator = data.indicators.find(item => item.id === next.indikator);
    const comparison = comparisonFor(indicator, data.administrations, data.observations, next.a, next.b);
    // Prepare every dependent view before replacing any visible output.
    const view = comparisonView(comparison, indicator, data.sources, next.mode, data.contextMarkers);
    const chart = chartFor(comparison, indicator, next.mode, Math.round(plot.getBoundingClientRect().width) || undefined, data.contextMarkers);
    doc.getElementById('resultHeader').innerHTML = view.header;
    plot.innerHTML = chart;
    doc.getElementById('summaries').innerHTML = view.summaries;
    table.innerHTML = view.table;
    doc.getElementById('sourceBox').innerHTML = view.methodology;
    state = { ...next }; currentComparison = comparison; currentIndicator = indicator;
    selectState(state);
    announce.textContent = `${indicator.label}. ${comparison.sumA.validCount} dan ${comparison.sumB.validCount} observasi. Mode ${state.mode === 'setara' ? 'rentang setara' : 'kalender'}.`;
  }
  try {
    data = JSON.parse(doc.getElementById('compare-data').textContent);
    for (const key of ['administrations', 'indicators', 'observations', 'sources']) {
      if (!Array.isArray(data[key]) || !data[key].length) throw new Error('Comparison data unavailable');
    }
    if (!Array.isArray(data.contextMarkers)) data.contextMarkers = [];
    context = { adminIds: data.administrations.map(item => item.id), indicatorIds: data.indicators.map(item => item.id) };
    const initial = parseComparisonParams(win.location.search, context);
    render(initial.state);
    win.history.replaceState({ comparison: state }, '', `${win.location.pathname}?${initial.normalizedQuery}`);
    message(initial.notices.join(' '));
    fields.disabled = false;
    doc.getElementById('noJsNote').hidden = true;
    form.dataset.ready = 'true';
    table.hidden = false;
    toggle.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = 'Sembunyikan angka';
  } catch {
    message('Pilihan interaktif belum berhasil dimuat. Tabel bawaan masih ditampilkan. Baca metode di bawah grafik.');
    fields.disabled = true;
    table.hidden = false;
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
      win.history.pushState({ comparison: state }, '', `${win.location.pathname}?${buildComparisonQuery(state)}`);
      message('');
    } catch {
      selectState(state);
      message('Pilihan ini belum berhasil dimuat. Hasil pilihan sebelumnya tetap ditampilkan. Baca metode untuk memeriksa cakupan data.');
    }
  }
  const change = () => commit({ a: selectors.a.value, b: selectors.b.value, indikator: selectors.indikator.value, mode: radios.find(radio => radio.checked)?.value || 'kalender' });
  const reading = doc.getElementById('chartReading');
  const readPoint = target => {
    const point = target.closest('[tabindex][aria-label]');
    if (!point || !plot.contains(point)) return;
    reading.textContent = point.getAttribute('aria-label');
  };
  plot.addEventListener('click', event => readPoint(event.target));
  plot.addEventListener('focusin', event => readPoint(event.target));
  form.addEventListener('change', change);
  form.addEventListener('submit', event => { event.preventDefault(); change(); });
  doc.getElementById('swapPeriods').addEventListener('click', () => commit({ ...state, a: state.b, b: state.a }));
  toggle.addEventListener('click', () => {
    table.hidden = !table.hidden;
    toggle.setAttribute('aria-expanded', String(!table.hidden));
    toggle.textContent = table.hidden ? 'Lihat angka' : 'Sembunyikan angka';
  });
  doc.getElementById('downloadCsv')?.addEventListener('click', () => {
    if (!currentComparison || !currentIndicator) return;
    const { admA, admB, yearsA, yearsB, sumA, sumB } = currentComparison;
    const q = v => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const lines = [
      'indikator,periode_a,periode_b,mode,sumbu_waktu_catatan',
      [currentIndicator.id, state.a, state.b, state.mode, state.mode === 'setara' ? 'tahun penuh ke-n (tahun asal di kolom tahun)' : 'tahun kalender'].map(q).join(','),
      state.mode === 'kalender' ? 'tahun,periode,nilai,satuan' : 'tahun_penuh_ke,tahun_a,tahun_b,nilai_a,nilai_b,satuan',
    ];
    if (state.mode === 'kalender') {
      [[admA, yearsA, sumA], [admB, yearsB, sumB]].flatMap(([admin, years, summary]) => years.map((year, i) => ({ year, admin, value: summary.values[i] })))
        .sort((a, b) => a.year - b.year)
        .forEach(row => lines.push([row.year, row.admin.label, row.value ?? 'NA', currentIndicator.unit].map(q).join(',')));
    } else {
      Array.from({ length: Math.max(yearsA.length, yearsB.length) }, (_, i) => lines.push([i + 1, yearsA[i] ?? 'NA', yearsB[i] ?? 'NA', sumA.values[i] ?? 'NA', sumB.values[i] ?? 'NA', currentIndicator.unit].map(q).join(',')));
    }
    lines.push(q(`Sumber: ${currentIndicator.source_ids.join('; ')}`));
    lines.push(q('Angka menggambarkan kondisi selama periode, bukan bukti sebab-akibat.'));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = doc.createElement('a');
    link.href = url;
    link.download = `pantau-politik-${currentIndicator.id}-${state.a}-${state.b}-${state.mode}.csv`;
    doc.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
}
