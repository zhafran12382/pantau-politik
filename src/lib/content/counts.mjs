// Aturan penghitungan tampilan. Hanya konten terbit yang dihitung;
// sumber dihitung bila benar-benar dirujuk konten terbit.
export function publishedIssues(issues) {
  return issues.filter(i => i.publication_status === 'published');
}

export function usedSourceIds(published, events) {
  const ids = new Set();
  const issueIds = new Set(published.map(i => i.id));
  for (const i of published) {
    (i.source_ids || []).forEach(s => ids.add(s));
    (i.impact || []).forEach(imp => (imp.source_ids || []).forEach(s => ids.add(s)));
  }
  for (const e of events) {
    if (issueIds.has(e.issue_id)) (e.source_ids || []).forEach(s => ids.add(s));
  }
  return ids;
}

export function primarySourceCount(sources, usedIds) {
  return sources.filter(s => usedIds.has(s.id) && ['official', 'law', 'court'].includes(s.source_type)).length;
}

export function lastChecked(published) {
  return published.map(i => i.last_checked_at).filter(Boolean).sort().at(-1) || null;
}
