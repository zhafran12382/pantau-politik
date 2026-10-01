import { loadAllContent } from '../src/lib/content/loader.mjs';
import { parseDateOnly } from '../src/lib/dates/dates.mjs';
import { fullCalendarYears } from '../src/lib/statistics/stats.mjs';

function yearOf(period_start) {
  return Number((period_start || '').slice(0, 4));
}

async function main() {
  const data = await loadAllContent();
  const errors = [];
  const indicatorById = new Map(data.indicators.map((i) => [i.id, i]));
  const sourceIds = new Set(data.sources.map((s) => s.id));
  const adminById = new Map(data.administrations.map((a) => [a.id, a]));

  // Unit check
  for (const o of data.observations) {
    if (!indicatorById.has(o.indicator_id)) { errors.push(`observasi: indicator ${o.indicator_id} hilang`); continue; }
    if (!sourceIds.has(o.source_id)) errors.push(`observasi ${o.indicator_id} ${o.period_start}: source ${o.source_id} hilang`);
    if (!parseDateOnly(o.period_start) || !parseDateOnly(o.period_end)) errors.push(`observasi ${o.indicator_id}: tanggal tidak valid`);
    if (!['provisional', 'revised', 'final', 'missing'].includes(o.status)) errors.push(`observasi ${o.indicator_id} ${o.period_start}: status ${o.status}`);
    if (o.value === null) {
      if (o.status !== 'missing') errors.push(`observasi ${o.indicator_id} ${o.period_start}: null harus missing`);
    } else {
      if (typeof o.value !== 'number' || !Number.isFinite(o.value)) errors.push(`observasi ${o.indicator_id} ${o.period_start}: value tidak finite`);
      if (o.status === 'missing') errors.push(`observasi ${o.indicator_id} ${o.period_start}: missing tetapi value terisi`);
    }
    if (o.indicator_id === 'gini' && typeof o.value === 'number' && (o.value < 0 || o.value > 1)) errors.push(`gini di luar 0–1: ${o.value}`);
    if ((o.indicator_id === 'kemiskinan' || o.indicator_id === 'tpt') && typeof o.value === 'number' && (o.value < 0 || o.value > 100)) errors.push(`${o.indicator_id} di luar 0–100`);
  }

  // Kelengkapan 9 slot per periode untuk 2004–2014 & 2014–2024
  const expectedByAdmin = {};
  for (const [id, adm] of adminById) {
    expectedByAdmin[id] = fullCalendarYears(adm.start_date, adm.end_date);
  }
  // Harus 2005–2013 & 2015–2023
  for (const ind of data.indicators) {
    for (const [adminId, years] of Object.entries(expectedByAdmin)) {
      const obsYears = new Set(data.observations.filter((o) => o.indicator_id === ind.id).map((o) => yearOf(o.period_start)));
      for (const y of years) {
        if (!obsYears.has(y)) errors.push(`kelengkapan: ${ind.id} / ${adminId} kehilangan tahun ${y}`);
      }
    }
    // Konsistensi bulan rujukan
    const months = new Set(data.observations.filter((o) => o.indicator_id === ind.id).map((o) => o.reference_month || '-'));
    if (months.size > 1) errors.push(`inkonsistensi reference_month ${ind.id}: ${[...months].join(', ')}`);
  }

  // Duplikasi observasi
  const seen = new Set();
  for (const o of data.observations) {
    const k = `${o.indicator_id}|${o.period_start}`;
    if (seen.has(k)) errors.push(`observasi ganda ${k}`);
    seen.add(k);
  }

  if (errors.length) {
    console.error('VALIDASI DATA GAGAL:');
    for (const e of errors) console.error(' - ' + e);
    process.exit(1);
  }
  console.log(`Validasi data lulus: ${data.observations.length} observasi, ${data.indicators.length} indikator.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
