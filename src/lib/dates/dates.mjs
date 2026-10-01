// Penanganan tanggal sipil + zona Asia/Jakarta tanpa menggeser hari.

export function parseDateOnly(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  if (!m) return null;
  const y = Number(m[1]); const mo = Number(m[2]); const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y, mo, d };
}

export function formatTanggalID(isoDate) {
  const p = parseDateOnly(isoDate);
  if (!p) return 'Tanggal tidak valid';
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${p.d} ${bulan[p.mo - 1]} ${p.y}`;
}

// Selisih hari kalender Jakarta antara lastChecked dan now (now = YYYY-MM-DD).
export function daysSinceJakarta(lastCheckedISO, nowISO) {
  const a = parseDateOnly(lastCheckedISO);
  const b = parseDateOnly(nowISO);
  if (!a || !b) return null;
  const au = Date.UTC(a.y, a.mo - 1, a.d);
  const bu = Date.UTC(b.y, b.mo - 1, b.d);
  return Math.floor((bu - au) / 86400000);
}

export function isStale(lastCheckedISO, nowISO, thresholdDays = 7) {
  const d = daysSinceJakarta(lastCheckedISO, nowISO);
  if (d === null) return false;
  return d > thresholdDays;
}

// Jarak bacaan cepat ("3 hari lalu"), selalu didampingi tanggal absolut di <time>.
export function relativeID(pastISO, nowISO) {
  const d = daysSinceJakarta(pastISO, nowISO);
  if (d === null) return null;
  if (d <= 0) return 'hari ini';
  if (d === 1) return 'kemarin';
  if (d < 30) return `${d} hari lalu`;
  const months = Math.floor(d / 30);
  if (months < 12) return `${months} bulan lalu`;
  const years = Math.floor(months / 12);
  return `${years} tahun lalu`;
}

export function todayJakartaISO(date = new Date()) {
  // Format YYYY-MM-DD di Asia/Jakarta.
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(date);
}
