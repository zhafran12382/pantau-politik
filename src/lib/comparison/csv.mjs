const finite = value => typeof value === 'number' && Number.isFinite(value);
const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const row = values => values.map(quote).join(',');

export function csvEligibility(comparison, indicator) {
  if (!comparison || !indicator || comparison.blocked || indicator.audit_status !== 'approved') {
    return { allowed: false, partial: false, reason: 'CSV tidak tersedia: pemeriksaan metode indikator belum selesai.' };
  }
  if (!comparison.sumA.compatible || !comparison.sumB.compatible) {
    return { allowed: false, partial: false, reason: 'CSV gabungan tidak tersedia: versi seri berubah atau belum diketahui dalam salah satu periode.' };
  }
  if (!comparison.crossCompatible) {
    return { allowed: false, partial: false, reason: 'CSV gabungan tidak tersedia: versi metode kedua periode tidak kompatibel.' };
  }
  if (![...comparison.sumA.values, ...comparison.sumB.values].some(finite)) {
    return { allowed: false, partial: false, reason: 'CSV tidak tersedia: belum ada observasi bernilai.' };
  }
  const partial = !comparison.sumA.complete || !comparison.sumB.complete;
  return { allowed: true, partial, reason: partial
    ? 'CSV parsial: versi seri kompatibel. Data kosong ditulis NA, bukan nol; cakupan tidak lengkap dan perubahan awal–akhir tidak dihitung.'
    : 'CSV berisi dua periode dengan versi seri kompatibel. Dataset tetap pratinjau, belum audit editorial.' };
}

export function comparisonCsv(comparison, indicator, mode = 'kalender') {
  const eligibility = csvEligibility(comparison, indicator);
  if (!eligibility.allowed) throw new Error(eligibility.reason);
  if (!['kalender', 'setara'].includes(mode)) throw new Error('Mode CSV tidak dikenali.');
  const { admA, admB, yearsA, yearsB, sumA, sumB } = comparison;
  const lines = [
    'indikator,periode_a,periode_b,mode,sumbu_waktu_catatan,status_dataset,cakupan',
    row([indicator.id, admA.id, admB.id, mode, mode === 'setara' ? 'tahun penuh ke-n (tahun asal di kolom tahun)' : 'tahun kalender', 'DRAF PRATINJAU — BELUM AUDIT', eligibility.partial ? 'parsial; data kosong = NA' : 'lengkap']),
  ];
  if (mode === 'kalender') {
    lines.push('tahun,periode,nilai,satuan,versi_seri');
    [[admA, yearsA, sumA], [admB, yearsB, sumB]]
      .flatMap(([admin, years, summary]) => years.map((year, i) => ({ year, admin, value: summary.values[i], version: summary.seriesVersions[i] })))
      .sort((a, b) => a.year - b.year)
      .forEach(item => lines.push(row([item.year, item.admin.label, item.value ?? 'NA', indicator.unit, item.version ?? 'NA'])));
  } else {
    lines.push('tahun_penuh_ke,tahun_a,tahun_b,nilai_a,nilai_b,satuan,versi_a,versi_b');
    for (let i = 0; i < Math.max(yearsA.length, yearsB.length); i++) {
      lines.push(row([i + 1, yearsA[i] ?? 'NA', yearsB[i] ?? 'NA', sumA.values[i] ?? 'NA', sumB.values[i] ?? 'NA', indicator.unit, sumA.seriesVersions[i] ?? 'NA', sumB.seriesVersions[i] ?? 'NA']));
    }
  }
  lines.push(quote(`Sumber: ${indicator.source_ids.join('; ')}`));
  lines.push(quote(`Metode: ${indicator.method_version}`));
  lines.push(quote(eligibility.reason));
  lines.push(quote('Angka menggambarkan kondisi selama periode, bukan bukti sebab-akibat.'));
  return lines.join('\n');
}
