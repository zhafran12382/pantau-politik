// Fungsi statistik murni — tanpa ketergantungan UI/DOM.
// Aturan PRD §07: mean aritmetika untuk PDB/inflasi; selisih poin untuk kemiskinan/TPT/Gini.

export function meanIgnoringNull(values) {
  const valid = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) return { mean: null, n: 0 };
  const sum = valid.reduce((a, b) => a + b, 0);
  return { mean: sum / valid.length, n: valid.length };
}

export function minMax(values) {
  const valid = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) return { min: null, max: null };
  return { min: Math.min(...valid), max: Math.max(...valid) };
}

export function medianIgnoringNull(values) {
  const valid = values.filter((v) => typeof v === 'number' && Number.isFinite(v)).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
}

// Nilai ekstrem beserta tahun observasinya (tahun pertama bila seri).
export function extremesByYear(years, values) {
  let min = null, max = null;
  values.forEach((v, i) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return;
    if (min === null || v < min.value) min = { value: v, year: years[i] };
    if (max === null || v > max.value) max = { value: v, year: years[i] };
  });
  return { min, max };
}

// Akhir dikurangi awal. Mengembalikan null bila batas tidak tersedia.
export function endpointDiff(first, last) {
  if (typeof first !== 'number' || typeof last !== 'number') return null;
  if (!Number.isFinite(first) || !Number.isFinite(last)) return null;
  // Preserve calculation precision; formatID handles rounding for display only.
  return last - first;
}

export function fullCalendarYears(startDateISO, endDateISO) {
  const start = new Date(startDateISO + 'T00:00:00');
  const end = new Date(endDateISO + 'T00:00:00');
  const firstFull = start.getMonth() === 0 && start.getDate() === 1 ? start.getFullYear() : start.getFullYear() + 1;
  // Tahun kalender penuh = 1 Jan–31 Des seluruhnya dalam masa jabatan.
  // Karena end eksklusif-ish: jika end tepat 1 Jan, tahun sebelumnya adalah terakhir penuh.
  let lastFull = end.getFullYear();
  const endIsJan1 = end.getMonth() === 0 && end.getDate() === 1;
  if (endIsJan1) lastFull = end.getFullYear() - 1;
  else {
    // Jika end bukan 31 Des, tahun berjalan tidak penuh.
    const isDec31 = end.getMonth() === 11 && end.getDate() === 31;
    if (!isDec31) lastFull = end.getFullYear() - 1;
  }
  const years = [];
  for (let y = firstFull; y <= lastFull; y++) years.push(y);
  return years;
}

export function formatID(value, precision = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'Tidak tersedia';
  // Hilangkan -0
  const v = Object.is(value, -0) || Math.abs(value) < 0.5 * Math.pow(10, -precision) ? 0 : value;
  return v.toLocaleString('id-ID', { minimumFractionDigits: precision, maximumFractionDigits: precision });
}

export function summarizeSeries(years, valueByYear, statKind) {
  const values = years.map((y) => valueByYear.get(y) ?? null);
  const validCount = values.filter((v) => typeof v === 'number' && Number.isFinite(v)).length;
  const missingCount = years.length - validCount;
  const { mean, n } = meanIgnoringNull(values);
  const { min, max } = minMax(values);
  const median = medianIgnoringNull(values);
  const { min: minAt, max: maxAt } = extremesByYear(years, values);
  const first = values[0] ?? null;
  const last = values[values.length - 1] ?? null;
  // Jika batas awal/akhir hilang: jangan geser diam-diam.
  const hasCompleteEndpoints =
    typeof values[0] === 'number' && Number.isFinite(values[0]) &&
    typeof values[values.length - 1] === 'number' && Number.isFinite(values[values.length - 1]);
  let stat = null;
  if (statKind === 'mean') {
    stat = mean !== null ? { kind: 'mean', mean, median, n, min, max, minAt, maxAt } : null;
  } else {
    const diff = hasCompleteEndpoints && missingCount === 0 ? endpointDiff(first, last) : null;
    stat = diff !== null ? { kind: statKind, diff, first, last, blocked: false } : { kind: statKind, diff: null, first, last, blocked: missingCount > 0 || !hasCompleteEndpoints };
  }
  return { years, values, validCount, missingCount, complete: missingCount === 0, stat, first, last, median, minAt, maxAt };
}
