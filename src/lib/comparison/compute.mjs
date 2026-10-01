import { fullCalendarYears, summarizeSeries } from '../statistics/stats.mjs';
export { chartSVG, buildChartModel } from './chart.mjs';

export function buildYearMap(observations, indicatorId) {
  const map = new Map();
  for (const observation of observations.filter(item => item.indicator_id === indicatorId)) {
    const year = Number(observation.period_start.slice(0, 4));
    if (map.has(year)) throw new Error(`Duplicate observation: ${indicatorId}/${year}`);
    if (observation.value !== null && !Number.isFinite(observation.value)) throw new Error('Invalid observation');
    map.set(year, observation.value);
  }
  return map;
}

export function comparisonFor(indicator, administrations, observations, adminAId, adminBId) {
  if (!indicator || adminAId === adminBId) throw new Error('Invalid comparison');
  const admA = administrations.find(item => item.id === adminAId);
  const admB = administrations.find(item => item.id === adminBId);
  if (!admA?.end_date || !admB?.end_date) throw new Error('Completed administrations required');
  const byYear = buildYearMap(observations, indicator.id);
  const yearsA = fullCalendarYears(admA.start_date, admA.end_date);
  const yearsB = fullCalendarYears(admB.start_date, admB.end_date);
  if (!yearsA.length || !yearsB.length) throw new Error('Empty comparison period');
  const versions = new Map(observations.filter(item => item.indicator_id === indicator.id)
    .map(item => [Number(item.period_start.slice(0, 4)), item.series_version]));
  const summarize = years => {
    const summary = summarizeSeries(years, byYear, indicator.stat_kind);
    const seriesVersions = years.map(year => versions.get(year) ?? null);
    const versionCount = new Set(seriesVersions.filter(Boolean)).size;
    const compatible = versionCount <= 1;
    return { ...summary, seriesVersions, compatible, stat: compatible ? summary.stat : null };
  };
  const sumA = summarize(yearsA), sumB = summarize(yearsB);
  return { admA, admB, yearsA, yearsB, sumA, sumB,
    blocked: indicator.audit_status !== 'approved',
    crossCompatible: new Set([...sumA.seriesVersions, ...sumB.seriesVersions].filter(Boolean)).size <= 1,
  };
}
