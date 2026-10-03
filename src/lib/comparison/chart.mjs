export function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
const finite = value => typeof value === 'number' && Number.isFinite(value);

export function buildChartModel({ yearsA, sumA, yearsB, sumB, mode = 'kalender' }) {
  let labels;
  if (mode === 'setara') labels = Array.from({ length: Math.max(yearsA.length, yearsB.length) }, (_, i) => i + 1);
  else {
    const start = Math.min(...yearsA, ...yearsB), end = Math.max(...yearsA, ...yearsB);
    labels = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  const series = (years, summary) => {
    const map = new Map(years.map((year, i) => [mode === 'setara' ? i + 1 : year, {
      year, value: summary.values[i] ?? null, version: summary.seriesVersions?.[i] ?? 'default',
    }]));
    return labels.map(label => map.get(label) || { year: null, value: null, version: null });
  };
  const pointsA = series(yearsA, sumA), pointsB = series(yearsB, sumB);
  return { mode, labels, pointsA, pointsB, seriesA: pointsA.map(p => p.value), seriesB: pointsB.map(p => p.value) };
}

function niceDomain(values) {
  const low = Math.min(0, ...values), high = Math.max(0, ...values);
  const span = high - low || 1;
  const magnitude = 10 ** Math.floor(Math.log10(span / 4));
  const fraction = span / 4 / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude;
  const min = Math.floor(low / step) * step, max = Math.ceil((high || step) / step) * step;
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step);
  return { min, max, ticks };
}

function shortRange(years) {
  if (!years.length) return '';
  const s = y => String(y).slice(2);
  return `${years[0]}–${s(years.at(-1))}`;
}

function footerLines(text, width) {
  const limit = Math.max(18, Math.floor((width - 24) / 8));
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > limit) { lines.push(line); line = ''; }
    line += `${line ? ' ' : ''}${word}`;
  }
  if (line) lines.push(line);
  return lines;
}

export function chartSVG({
  yearsA, sumA, yearsB, sumB, unit, idA = 'Periode A', idB = 'Periode B',
  mode = 'kalender', precision = 1, chartId = 'comparison-chart', width = 640,
  gapYears = /** @type {number[]} */ ([]),
  markers = /** @type {Array<{year:number,label:string,note:string,ordinal?:number}>} */ ([]),
  footer = '',
}) {
  const model = buildChartModel({ yearsA, sumA, yearsB, sumB, mode });
  const W = Math.max(300, Math.round(width));
  const compact = W < 640;
  const baseHeight = compact ? 320 : 420;
  const foot = footer ? footerLines(footer, W) : [];
  const footerHeight = foot.length ? foot.length * 20 + 12 : 0;
  const H = baseHeight + footerHeight;
  const left = 64, right = compact ? 28 : 96, top = 28, bottom = 64 + footerHeight;
  const values = [...model.seriesA, ...model.seriesB].filter(finite);
  if (!values.length) return '<p class="notice">Belum ada observasi untuk digambar. Periksa cakupan di tabel dan metode.</p>';
  const domain = niceDomain(values);
  const x = index => left + index / Math.max(1, model.labels.length - 1) * (W - left - right);
  const y = value => top + (domain.max - value) / (domain.max - domain.min) * (H - top - bottom);
  const tickCount = W < 640 ? 4 : 7;
  const ticks = [...new Set(Array.from({ length: tickCount }, (_, i) => Math.round(i / (tickCount - 1) * (model.labels.length - 1))))];
  const gapSet = new Set(mode === 'kalender' ? gapYears : []);
  const markerByLabel = new Map();
  for (const m of markers) {
    const idx = model.labels.indexOf(mode === 'setara' ? m.ordinal : m.year);
    if (idx >= 0) markerByLabel.set(idx, m);
  }

  // Data kosong dan perubahan metode memutus garis; hanya perubahan memakai berlian.
  function segments(points) {
    const segs = [];
    let current = null;
    for (const [index, point] of points.entries()) {
      if (!finite(point.value)) { current = null; continue; }
      if (!current || current.version !== point.version) {
        current = { version: point.version, points: [], breaks: current ? [[current.points.at(-1), point]] : [] };
        segs.push(current);
      }
      current.points.push({ index, point });
    }
    return segs;
  }

  function seriesSVG(points, kind, label) {
    let out = '';
    for (const seg of segments(points)) {
      const methodBreaks = new Set(seg.breaks.map(([, to]) => to));
      const d = seg.points.map(({ index, point }, i) => `${i ? 'L' : 'M'}${x(index).toFixed(2)},${y(point.value).toFixed(2)}`).join(' ');
      out += `<path d="${d}" stroke="var(--color-series-${kind})" stroke-width="3" fill="none" stroke-linecap="round"${kind === 'b' ? ' stroke-dasharray="8 5"' : ''}/>`;
      for (const { index, point } of seg.points) {
        const X = x(index).toFixed(2), Y = y(point.value).toFixed(2);
        const changed = methodBreaks.has(point);
        const label_text = `${label} · ${point.year}: ${point.value.toLocaleString('id-ID', { maximumFractionDigits: precision })} ${unit}${changed ? ' · versi seri berubah: definisi dapat berbeda, tidak dibandingkan lintas versi' : ''}`;
        out += changed
          ? `<polygon data-method-break="true" points="${X},${(y(point.value) - 7).toFixed(2)} ${(x(index) + 7).toFixed(2)},${Y} ${X},${(y(point.value) + 7).toFixed(2)} ${(x(index) - 7).toFixed(2)},${Y}" tabindex="0" role="img" aria-label="${escapeHtml(label_text)}" fill="var(--color-surface)" stroke="var(--color-series-${kind})" stroke-width="2"><title>${escapeHtml(label_text)}</title></polygon>`
          : kind === 'a'
          ? `<circle cx="${X}" cy="${Y}" r="4.5" tabindex="0" role="img" aria-label="${escapeHtml(label_text)}"><title>${escapeHtml(label_text)}</title></circle>`
          : `<rect x="${(x(index) - 4.5).toFixed(2)}" y="${(y(point.value) - 4.5).toFixed(2)}" width="9" height="9" tabindex="0" role="img" aria-label="${escapeHtml(label_text)}"><title>${escapeHtml(label_text)}</title></rect>`;
      }
    }
    return `<g data-series="${kind}" fill="var(--color-series-${kind})">${out}</g>`;
  }

  const lastValid = points => { for (let i = points.length - 1; i >= 0; i--) if (finite(points[i].value)) return { index: i, point: points[i] }; return null; };
  const endA = lastValid(model.pointsA), endB = lastValid(model.pointsB);
  const endLabel = (end, kind, text) => {
    if (!end) return '';
    const toLeft = x(end.index) + 12 + text.length * 8 > W - 8;
    return `<text x="${(x(end.index) + (toLeft ? -12 : 12)).toFixed(2)}" y="${(y(end.point.value) + 4).toFixed(2)}" text-anchor="${toLeft ? 'end' : 'start'}" fill="var(--color-series-${kind})" font-weight="600">${escapeHtml(text)}</text>`;
  };

  const zeroInDomain = domain.min < 0 && domain.max > 0;
  const titleId = escapeHtml(`${chartId}-title`), descriptionId = escapeHtml(`${chartId}-description`);
  const yFmt = tick => tick.toLocaleString('id-ID', { maximumFractionDigits: Math.min(3, Math.max(1, precision)) });
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" font-size="14" role="img" aria-labelledby="${titleId} ${descriptionId}">
    <title id="${titleId}">Grafik tren, satuan ${escapeHtml(unit)}</title>
    <desc id="${descriptionId}">${escapeHtml(idA)} dan ${escapeHtml(idB)}. ${mode === 'setara' ? 'Tahun kalender penuh disejajarkan; bukan tahun tepat sejak pelantikan.' : 'Posisi tahun kalender sebenarnya, termasuk jeda tahun transisi.'} Seluruh angka tersedia pada tabel.</desc>
    ${[...gapSet].map(year => { const i = model.labels.indexOf(year); return i < 0 ? '' : `<rect x="${(x(i) - (x(1) - x(0)) / 2).toFixed(2)}" y="${top}" width="${((x(1) - x(0))).toFixed(2)}" height="${H - top - bottom}" fill="var(--color-surface-muted)"/><text x="${x(i).toFixed(2)}" y="${(top + 14).toFixed(2)}" text-anchor="middle" font-size="14">transisi</text>`; }).join('')}
    ${[...markerByLabel].map(([index, m]) => `<g><line x1="${x(index)}" y1="${top}" x2="${x(index)}" y2="${H - bottom}" stroke="var(--color-text-muted)" stroke-width="1" stroke-dasharray="3 3"/><text x="${Math.max(12, Math.min(x(index) + 4, W - 12 - m.label.length * 8)).toFixed(2)}" y="${(top + 14).toFixed(2)}" font-size="14">${escapeHtml(m.label)}</text><title>${escapeHtml(m.label)}: ${escapeHtml(m.note)}</title></g>`).join('')}
    <text data-chart-unit="true" x="${left}" y="16" font-size="14">${escapeHtml(unit)}</text>
    ${domain.ticks.map(tick => `<g><line x1="${left}" x2="${W - right}" y1="${y(tick)}" y2="${y(tick)}" stroke="${tick === 0 && zeroInDomain ? 'var(--color-text)' : 'var(--color-divider)'}" stroke-width="${tick === 0 && zeroInDomain ? 1.5 : 1}"/><text x="${left - 10}" y="${(y(tick) + 5).toFixed(2)}" text-anchor="end">${escapeHtml(yFmt(tick))}</text></g>`).join('')}
    ${seriesSVG(model.pointsA, 'a', idA)}${seriesSVG(model.pointsB, 'b', idB)}
    ${endLabel(endA, 'a', shortRange(yearsA))}${endLabel(endB, 'b', shortRange(yearsB))}
    ${ticks.map(index => `<text x="${x(index).toFixed(2)}" y="${(H - bottom + 24).toFixed(2)}" text-anchor="middle">${mode === 'setara' ? `ke-${model.labels[index]}` : model.labels[index]}</text>`).join('')}
    ${foot.length ? `<text class="chart-footer" font-size="14">${foot.map((line, i) => `<tspan x="12" y="${baseHeight + 8 + i * 20}">${escapeHtml(line)}</tspan>`).join('')}</text>` : ''}
  </svg>`;
}

export function responsiveChart(args) {
  return `<div class="chart-wide">${chartSVG({ ...args, width: 640, chartId: `${args.chartId}-wide` })}</div><div class="chart-compact">${chartSVG({ ...args, width: 300, chartId: `${args.chartId}-compact` })}</div>`;
}
