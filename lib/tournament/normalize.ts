export function normalizeDivision(v: string) {
  return v
    .toUpperCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+\d+\s+TEAMS.*/i, "")
    .trim();
}

export function normalizeTeam(v: string) {
  return v
    .toUpperCase()
    .replace(/\s+[A-Z]$/, "") // remove trailing A/B/C team suffix
    .trim();
}

export function parseScore(v: any) {
  const n = Number(v);
  return isNaN(n) ? null : n;
}
