export function formatTeam(raw?: string) {
  if (!raw) return "";

  // Example: "D4-WEST VALLEY"
  const match = raw.match(/^([A-Z0-9]+)-(.+)$/);

  if (!match) return raw;

  const seed = match[1];
  const name = match[2];

  return `${capitalize(name)} (${seed})`;
}

function capitalize(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
