import { escapeHtml as e, chartSVG, responsiveChart } from './chart.mjs';
import { formatID } from '../statistics/stats.mjs';
import { formatTanggalID } from '../dates/dates.mjs';

export function safeSourceUrl(url) {
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null; }
  catch { return null; }
}

// Jenis sumber menjelaskan dokumen, bukan otoritas atau audit situs.
// Sekunder: kompilasi pihak ketiga untuk pemeriksaan silang.
export function sourceKind(type) {
  if (['law', 'court', 'official'].includes(type)) return 'Primer';
  if (['statistics', 'method'].includes(type)) return 'Data/metode statistik';
  return 'Pembanding sekunder';
}

function sourceMarkup(ids, sources) {
  return ids.map(id => {
    const source = sources.find(item => item.id === id);
    if (!source) throw new Error(`Missing source: ${id}`);
    const href = safeSourceUrl(source.url);
    const released = source.published_at ? formatTanggalID(source.published_at) : 'tanggal rilis tidak tercatat';
    return `<li><span class="source-kind">${e(sourceKind(source.source_type))}</span> ${href ? `<a href="${e(href)}" rel="noopener">${e(source.title)} <span aria-hidden="true">↗</span></a>` : e(source.title)}<span class="meta">${e(source.publisher)} · ${e(source.locator)}</span><span class="meta">Rilis: ${e(released)} · Diambil: ${e(formatTanggalID(source.accessed_at))}.</span></li>`;
  }).join('');
}

export function modeDescription(mode) {
  return mode === 'setara'
    ? 'Tahun kalender penuh ke-1, ke-2, dan seterusnya. Ini bukan tahun tepat sejak pelantikan; tahun asli tetap tersedia di tabel.'
    : 'Tahun kalender sebenarnya. Tahun pergantian tidak masuk statistik; jeda tahun tetap tampak pada sumbu waktu.';
}

function legendLine(kind) {
  return `<svg class="legend-sample" viewBox="0 0 36 12" aria-hidden="true"><path d="M0 6H36" fill="none" stroke="var(--color-series-${kind})" stroke-width="3"${kind === 'b' ? ' stroke-dasharray="8 5"' : ''}/>${kind === 'a' ? '<circle cx="18" cy="6" r="4" fill="var(--color-series-a)"/>' : '<rect x="14" y="2" width="8" height="8" fill="var(--color-series-b)"/>'}</svg>`;
}

function chartArgs(comparison, indicator, mode, markers) {
  const inSpan = new Set([...comparison.yearsA, ...comparison.yearsB]);
  const span = [];
  for (let y = Math.min(...comparison.yearsA, ...comparison.yearsB); y <= Math.max(...comparison.yearsA, ...comparison.yearsB); y++) {
    if (!inSpan.has(y)) span.push(y);
  }
  // Flag data memilih anotasi konteks; bukan bukti audit editorial manusia.
  const forMode = mode === 'setara'
    ? []
    : markers.filter(m => m.verified && (comparison.yearsA.includes(m.year) || comparison.yearsB.includes(m.year) || span.includes(m.year)));
  return {
    ...comparison,
    unit: indicator.unit,
    precision: indicator.display_precision,
    idA: comparison.admA.label,
    idB: comparison.admB.label,
    mode,
    chartId: 'trend',
    gapYears: span,
    markers: forMode.map(m => ({ year: m.year, label: m.label, note: m.note })),
    footer: `Pantau Politik · ${indicator.source_ids.length} sumber · angka kondisi, bukan bukti sebab-akibat`,
  };
}

export function chartFor(comparison, indicator, mode, width, markers = []) {
  if (comparison.blocked || indicator.audit_status !== 'approved') return '<p class="notice">Data belum dapat dibandingkan. Pemeriksaan metode belum selesai. <a href="/metode/">Baca metode.</a></p>';
  const args = chartArgs(comparison, indicator, mode, markers);
  return width ? chartSVG({ ...args, width }) : responsiveChart(args);
}

export function comparisonPreviewView(comparison, indicator) {
  const chart = chartFor(comparison, indicator, 'kalender');
  if (comparison.blocked || indicator.audit_status !== 'approved') return { chart, numbers: '' };
  const numbers = [comparison.sumA, comparison.sumB].map((sum, i) => {
    const years = i === 0 ? comparison.yearsA : comparison.yearsB;
    const isMean = indicator.stat_kind === 'mean';
    const raw = sum.compatible ? (isMean ? sum.stat?.mean ?? null : sum.stat?.diff ?? null) : null;
    const unit = isMean ? indicator.unit : indicator.id === 'gini' ? 'poin indeks' : 'poin persentase';
    const label = isMean ? (sum.complete ? 'rata-rata tahunan' : 'rata-rata data yang ada') : 'perubahan awal–akhir';
    return `<p><strong class="display-number numeric">${raw === null ? 'Tidak tersedia' : `${e(formatID(raw, indicator.display_precision))} ${e(unit)}`}</strong><small>${years[0]}–${years.at(-1)} · ${e(label)}${!sum.compatible ? ' · versi seri tidak kompatibel' : ''}</small></p>`;
  }).join('');
  return { chart, numbers };
}

function summaryMarkup(administration, summary, indicator, blocked) {
  const years = summary.years, precision = indicator.display_precision;
  const unitSuffix = indicator.unit === '%' ? ' %' : '';
  const value = raw => raw === null ? 'Tidak tersedia' : `${formatID(raw, precision)}${unitSuffix}`;
  const row = (label, number) => `<div><dt>${e(label)}</dt><dd>${e(number)}</dd></div>`;
  const coverage = `${summary.validCount} dari ${years.length} tahun tersedia`;
  let rows = '';
  if (!blocked) {
    rows += row(`Awal rentang (${years[0]})`, value(summary.first));
    rows += row(`Akhir rentang (${years.at(-1)})`, value(summary.last));
    if (summary.stat?.kind === 'mean') {
      rows += row(summary.complete ? 'Rata-rata tahunan' : 'Rata-rata data yang ada', value(summary.stat.mean));
      if (summary.stat.median !== null && summary.stat.median !== undefined) rows += row('Median tahunan', value(summary.stat.median));
      if (summary.minAt && summary.maxAt) rows += row('Rentang (min–maks)', `${value(summary.minAt.value)} (${summary.minAt.year}) – ${value(summary.maxAt.value)} (${summary.maxAt.year})`);
    } else if (summary.stat?.diff !== null && summary.stat?.diff !== undefined) {
      rows += row('Perubahan awal–akhir', `${formatID(summary.stat.diff, precision)} ${indicator.id === 'gini' ? 'poin indeks' : 'poin persentase'}`);
    }
    if (summary.compatible && summary.median !== null && summary.median !== undefined && summary.stat?.kind !== 'mean') rows += row('Median', value(summary.median));
  }
  const explanation = blocked ? 'Menunggu pemeriksaan metode.' : !summary.compatible ? 'Versi seri berubah atau belum diketahui. Statistik lintas segmen tidak dihitung.' : !summary.complete ? 'Rentang belum lengkap. Perubahan awal–akhir diblokir.' : '';
  return `<section class="period-summary" aria-label="Ringkasan ${e(administration.label)}"><h3>${e(administration.label)}</h3><p class="meta">Data ${years[0]}–${years.at(-1)} · ${e(coverage)}</p><dl>${rows}</dl>${explanation ? `<p class="meta">${e(explanation)}</p>` : ''}<details class="method-tip"><summary>Cara membaca angka ini</summary><p>${e(indicator.id === 'gini' ? 'Selisih dinyatakan dalam poin indeks skala 0–1, bukan persen.' : indicator.stat_kind === 'mean' ? 'Rata-rata adalah rata-rata aritmetika laju tahunan, bukan total pertumbuhan. Nilai awal–akhir mengacu pada batas rentang data.' : 'Selisih dinyatakan dalam poin persentase (akhir dikurangi awal), bukan persen. Nilai awal–akhir mengacu pada batas rentang data.')}</p></details></section>`;
}

function deltaMarkup(comparison, indicator) {
  if (comparison.blocked || indicator.audit_status !== 'approved' || !comparison.crossCompatible) return '';
  const unitWord = indicator.id === 'gini' ? 'poin indeks'
    : indicator.stat_kind === 'mean'
      ? (indicator.unit === '%' ? 'poin persentase' : indicator.unit)
      : 'poin persentase';
  const left = comparison.sumA.stat, right = comparison.sumB.stat;
  let text = '';
  if (indicator.stat_kind === 'mean' && left?.mean != null && right?.mean != null) {
    const d = right.mean - left.mean;
    text = `Selisih rata-rata (B dikurangi A): ${formatID(d, indicator.display_precision)} ${unitWord}. Deskriptif; bukan bukti sebab-akibat.`;
  } else if (left?.diff != null && right?.diff != null) {
    const d = right.diff - left.diff;
    text = `Selisih perubahan (B dikurangi A): ${formatID(d, indicator.display_precision)} ${unitWord}. Deskriptif; bukan bukti sebab-akibat.`;
  } else return '';
  return `<p class="delta-line" role="note">${e(text)}</p>`;
}

export function comparisonView(comparison, indicator, sources, mode = 'kalender', markers = []) {
  const { admA, admB, yearsA, yearsB, sumA, sumB } = comparison;
  const blocked = comparison.blocked || indicator.audit_status !== 'approved';
  const fmt = raw => raw === null || raw === undefined ? 'Tidak tersedia' : formatID(raw, indicator.display_precision);
  let tableRows;
  if (blocked) tableRows = '<tr><td colspan="3">Data belum disetujui untuk perbandingan.</td></tr>';
  else if (mode === 'kalender') {
    tableRows = [[admA, yearsA, sumA], [admB, yearsB, sumB]].flatMap(([admin, years, summary]) => years.map((year, i) => ({ year, admin, value: summary.values[i] })))
      .sort((a, b) => a.year - b.year)
      .map(row => `<tr><th scope="row">${row.year}</th><td>${e(row.admin.label)}</td><td class="numeric">${e(fmt(row.value))}</td></tr>`).join('');
  } else {
    tableRows = Array.from({ length: Math.max(yearsA.length, yearsB.length) }, (_, i) => `<tr><th scope="row">Ke-${i + 1}</th><td class="numeric">${e(fmt(sumA.values[i]))}<br><span class="meta">${yearsA[i] ?? '—'}</span></td><td class="numeric">${e(fmt(sumB.values[i]))}<br><span class="meta">${yearsB[i] ?? '—'}</span></td></tr>`).join('');
  }
  const heads = mode === 'kalender' ? ['Tahun', 'Periode', `Nilai (${indicator.unit})`] : ['Tahun penuh ke-', admA.label, admB.label];
  const table = `<table class="data" id="dataTable"><caption>${e(indicator.label)} · ${e(indicator.unit)} · ${mode === 'kalender' ? 'tahun kalender' : 'rentang setara (tahun asal di bawah nilai)'}</caption><thead><tr>${heads.map(head => `<th scope="col">${e(head)}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table>`;
  const legend = `<div class="chart-legend"><span class="legend-item">${legendLine('a')}${e(admA.label)}</span><span class="legend-item">${legendLine('b')}${e(admB.label)}</span></div>`;
  const header = `<div class="result-header"><h2 id="resultTitle">${e(indicator.label)}</h2><p class="meta" id="resultMeta">${e(indicator.unit)} · ${yearsA[0]}–${yearsA.at(-1)} dan ${yearsB[0]}–${yearsB.at(-1)} · ${sumA.validCount} dari ${yearsA.length} dan ${sumB.validCount} dari ${yearsB.length} tahun tersedia</p></div>${legend}<p class="meta" id="modeNote">${e(modeDescription(mode))}</p>${!comparison.crossCompatible ? '<p class="notice notice--warning">Versi metode kedua periode berbeda. Tidak ada selisih lintas periode yang dihitung.</p>' : ''}`;
  const summaries = `<div class="comparison-summaries">${summaryMarkup(admA, sumA, indicator, blocked)}${summaryMarkup(admB, sumB, indicator, blocked)}</div>${deltaMarkup(comparison, indicator)}`;
  const versions = [...new Set([...sumA.seriesVersions || [], ...sumB.seriesVersions || []].filter(Boolean))].join(', ');
  const methodology = `<h2 id="metode-data">Definisi dan sumber</h2><dl class="definition-list"><div><dt>Definisi</dt><dd id="sourceDefinition">${e(indicator.definition)}</dd></div><div><dt>Periode rujukan dan frekuensi</dt><dd id="sourceReference">${e(indicator.reference_period)} · satu observasi per tahun</dd></div><div><dt>Metode dan versi seri</dt><dd id="sourceMethod">${e(indicator.method_version)}${versions ? ` · seri: ${e(versions)}` : ''}</dd></div><div><dt>Batas interpretasi</dt><dd id="sourceComparability">${e(indicator.comparability_notes)}</dd></div></dl><ul class="source-list source-cards" id="indicatorSources">${sourceMarkup(indicator.source_ids, sources)}</ul><p class="meta">Masa jabatan ${e(admA.label)}: ${e(formatTanggalID(admA.start_date))}–${e(formatTanggalID(admA.end_date))}. ${e(admB.label)}: ${e(formatTanggalID(admB.start_date))}–${e(formatTanggalID(admB.end_date))}. Awal–akhir angka mengacu pada rentang data, bukan saat pelantikan.</p>`;
  return { header, summaries, table, methodology };
}
