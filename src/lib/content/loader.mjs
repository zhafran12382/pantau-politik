import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
// src/lib/content -> root/content
export const CONTENT_ROOT = path.resolve(here, '../../../content');

async function readJSON(rel) {
  const raw = await readFile(path.join(CONTENT_ROOT, rel), 'utf-8');
  return JSON.parse(raw);
}

export async function loadAllContent() {
  const [administrations, indicators, observations, sources, issues, events, actors, corrections, contextMarkers] = await Promise.all([
    readJSON('administrations/administrations.json'),
    readJSON('indicators/indicators.json'),
    readJSON('observations/observations.json'),
    readJSON('sources/sources.json'),
    readJSON('issues/issues.json'),
    readJSON('events/events.json'),
    readJSON('actors/actors.json'),
    readJSON('corrections/corrections.json'),
    readJSON('context-markers.json'),
  ]);
  const editorialOrder = await readJSON('editorial-order.json');
  const registerMap = await readJSON('register-map.json');
  return { administrations, indicators, observations, sources, issues, events, actors, corrections, contextMarkers, editorialOrder, registerMap };
}

export function indexBy(arr, key = 'id') {
  const m = new Map();
  for (const item of arr) m.set(item[key], item);
  return m;
}

// Proyeksi publik: hanya isu published + relasinya.
export function projectPublic(data) {
  const publishedIssues = data.issues.filter((i) => i.publication_status === 'published');
  const issueIds = new Set(publishedIssues.map((i) => i.id));
  const events = data.events.filter((e) => issueIds.has(e.issue_id));
  const sourceIds = new Set();
  for (const i of publishedIssues) {
    (i.source_ids || []).forEach((s) => sourceIds.add(s));
    (i.impact || []).forEach((imp) => (imp.source_ids || []).forEach((s) => sourceIds.add(s)));
  }
  events.forEach((e) => (e.source_ids || []).forEach((s) => sourceIds.add(s)));
  data.indicators.forEach((ind) => (ind.source_ids || []).forEach((s) => sourceIds.add(s)));
  data.administrations.forEach((a) => (a.source_ids || []).forEach((s) => sourceIds.add(s)));
  data.corrections.forEach((c) => (c.source_ids || []).forEach((s) => sourceIds.add(s)));
  const sources = data.sources.filter((s) => sourceIds.has(s.id));
  return { ...data, issues: publishedIssues, events, sources };
}
