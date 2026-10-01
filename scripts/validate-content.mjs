import { loadAllContent } from '../src/lib/content/loader.mjs';
import { parseDateOnly } from '../src/lib/dates/dates.mjs';

const ISSUE_STATUS = ['sedang berkembang', 'menunggu keputusan', 'diterapkan', 'diarsipkan'];
const EVIDENCE = ['fakta', 'pernyataan', 'analisis'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(errors, msg) { errors.push(msg); }

async function main() {
  const data = await loadAllContent();
  const errors = [];
  const ids = (arr) => arr.map((x) => x.id);

  // Duplikasi ID
  for (const [name, arr] of Object.entries({ issues: data.issues, events: data.events, actors: data.actors, administrations: data.administrations, indicators: data.indicators, sources: data.sources, corrections: data.corrections, contextMarkers: data.contextMarkers || [] })) {
    const seen = new Set();
    for (const it of arr) {
      if (!it.id) fail(errors, `${name}: entri tanpa id`);
      else if (seen.has(it.id)) fail(errors, `${name}: ID ganda ${it.id}`);
      else seen.add(it.id);
    }
  }
  const sourceIds = new Set(ids(data.sources));
  const issueIds = new Set(ids(data.issues));
  const indicatorIds = new Set(ids(data.indicators));

  for (const issue of data.issues) {
    if (!SLUG_RE.test(issue.slug || '')) fail(errors, `issue ${issue.id}: slug tidak valid ${issue.slug}`);
    if (!ISSUE_STATUS.includes(issue.status)) fail(errors, `issue ${issue.id}: status tidak sah ${issue.status}`);
    if (!['draft', 'published'].includes(issue.publication_status)) fail(errors, `issue ${issue.id}: publication_status tidak sah`);
    if (!issue.summary || issue.summary.split(/\s+/).length < 20) fail(errors, `issue ${issue.id}: ringkasan terlalu pendek / kosong`);
    if (!Array.isArray(issue.source_ids) || issue.source_ids.length === 0) fail(errors, `issue ${issue.id}: source_ids wajib`);
    for (const s of issue.source_ids || []) if (!sourceIds.has(s)) fail(errors, `issue ${issue.id}: source_id hilang ${s}`);
    for (const imp of issue.impact || []) {
      if (!imp.text) fail(errors, `issue ${issue.id}: impact kosong`);
      for (const s of imp.source_ids || []) if (!sourceIds.has(s)) fail(errors, `issue ${issue.id}: impact source hilang ${s}`);
    }
    for (const d of ['published_at', 'updated_at', 'last_checked_at']) {
      if (!parseDateOnly(issue[d])) fail(errors, `issue ${issue.id}: ${d} tidak valid ${issue[d]}`);
    }
    for (const rel of issue.related_indicator_ids || []) if (!indicatorIds.has(rel)) fail(errors, `issue ${issue.id}: related_indicator ${rel} hilang`);
  }
  for (const ev of data.events) {
    if (!issueIds.has(ev.issue_id)) fail(errors, `event ${ev.id}: issue_id hilang ${ev.issue_id}`);
    if (!parseDateOnly(ev.occurred_at)) fail(errors, `event ${ev.id}: occurred_at tidak valid`);
    if (!EVIDENCE.includes(ev.evidence_type)) fail(errors, `event ${ev.id}: evidence_type tidak sah`);
    for (const s of ev.source_ids || []) if (!sourceIds.has(s)) fail(errors, `event ${ev.id}: source hilang ${s}`);
  }
  for (const a of data.administrations) {
    if (!parseDateOnly(a.start_date)) fail(errors, `admin ${a.id}: start_date tidak valid`);
    if (a.end_date && !parseDateOnly(a.end_date)) fail(errors, `admin ${a.id}: end_date tidak valid`);
    for (const s of a.source_ids || []) if (!sourceIds.has(s)) fail(errors, `admin ${a.id}: source hilang ${s}`);
  }
  for (const ind of data.indicators) {
    if (!ind.definition || !ind.unit || !ind.method_version) fail(errors, `indicator ${ind.id}: metadata wajib kosong`);
    for (const s of ind.source_ids || []) if (!sourceIds.has(s)) fail(errors, `indicator ${ind.id}: source hilang ${s}`);
  }
  // editorial order
  const feat = data.editorialOrder.featured_issue_id;
  if (!issueIds.has(feat)) fail(errors, `editorial-order: featured ${feat} hilang`);
  for (const id of data.editorialOrder.active_issue_ids || []) if (!issueIds.has(id)) fail(errors, `editorial-order: active ${id} hilang`);

  for (const m of data.contextMarkers || []) {
    if (!Number.isInteger(m.year) || m.year < 1900 || m.year > 2100) fail(errors, `marker ${m.id}: tahun tidak valid`);
    if (!m.label || !m.note) fail(errors, `marker ${m.id}: label/note wajib`);
    for (const s of m.source_ids || []) if (!sourceIds.has(s)) fail(errors, `marker ${m.id}: source hilang ${s}`);
  }
  const registerMap = data.registerMap || {};
  const registerCodes = Object.values(registerMap);
  if (new Set(registerCodes).size !== registerCodes.length) fail(errors, 'register-map: nomor ganda');
  for (const [issueId, code] of Object.entries(registerMap)) {
    if (!issueIds.has(issueId)) fail(errors, `register-map: issue hilang ${issueId}`);
    if (!/^PP-[0-9]{3}$/.test(code)) fail(errors, `register-map: format salah ${issueId}=${code}`);
  }
  for (const id of issueIds) {
    if (data.issues.find(i => i.id === id).publication_status === 'published' && !registerMap[id]) {
      fail(errors, `register-map: isu terbit tanpa nomor ${id}`);
    }
  }

  // URL allowlist
  for (const s of data.sources) {
    try {
      const u = new URL(s.url);
      if (!['http:', 'https:'].includes(u.protocol)) fail(errors, `source ${s.id}: protokol tidak diizinkan ${s.url}`);
    } catch { fail(errors, `source ${s.id}: URL tidak valid`); }
  }

  if (errors.length) {
    console.error('VALIDASI KONTEN GAGAL:');
    for (const e of errors) console.error(' - ' + e);
    process.exit(1);
  }
  console.log(`Validasi konten lulus: ${data.issues.length} isu, ${data.events.length} peristiwa, ${data.sources.length} sumber.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
