export const VALID_MODES = ['kalender', 'setara'];
export const DEFAULT_COMPARISON = { a: 'admin-2004-2014', b: 'admin-2014-2024', indikator: 'pdb-growth', mode: 'kalender' };
export function buildComparisonQuery(state) {
  return new URLSearchParams({ a: state.a, b: state.b, indikator: state.indikator, mode: state.mode || 'kalender' }).toString();
}
export function buildComparisonUrl(location, state) {
  return `${location.pathname}?${buildComparisonQuery(state)}${location.hash || ''}`;
}

export function parseComparisonParams(queryString, { adminIds, indicatorIds, defaults = DEFAULT_COMPARISON }) {
  const params = new URLSearchParams(queryString || '');
  const notices = [];
  let state = { ...defaults };
  const allowed = { a: adminIds, b: adminIds, indikator: indicatorIds, mode: VALID_MODES };
  let invalid = (queryString || '').length > 500;
  for (const key of Object.keys(allowed)) {
    const values = params.getAll(key);
    if (values.length > 1 || (values.length === 1 && !allowed[key].includes(values[0]))) invalid = true;
    else if (values.length === 1) state[key] = values[0];
  }
  if (state.a === state.b) invalid = true;
  if (invalid) {
    state = { ...defaults };
    notices.push('Pilihan pada tautan tidak dikenali atau periodenya sama. Pilihan bawaan ditampilkan.');
  }
  return { state, notices, hadInvalid: invalid, normalizedQuery: buildComparisonQuery(state) };
}
