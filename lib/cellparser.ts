type ParsedCell =
  | { type: "TEAM"; value: string }
  | { type: "BRACKET_REF"; value: string }
  | { type: "GAME_REF"; value: string }
  | { type: "HYBRID_SLOT"; value: string; meta?: string };

function isBracketRef(v: string) {
  return v.startsWith("W#") || v.startsWith("L#");
}

function isGameRef(v: string) {
  return /^W#\d+$/.test(v);
}

function isHybrid(v: string) {
  return /\(.*L#\d+.*\)/.test(v) || /\(.*W#\d+.*\)/.test(v);
}

/**
 * MAIN PARSER
 */
export function parseCell(raw: string): ParsedCell | null {
  if (!raw) return null;

  const v = raw.trim();

  // 1. HYBRID SLOT (H2-2ndB (L#15))
  if (isHybrid(v)) {
    const match = v.match(/\((W#|L#)\d+\)/);
    return {
      type: "HYBRID_SLOT",
      value: v.split("(")[0].trim(),
      meta: match?.[0]?.replace(/[()]/g, "") || undefined,
    };
  }

  // 2. BRACKET REF (W#A1/A4)
  if (v.includes("W#") || v.includes("L#")) {
    if (v.includes("/")) {
      return {
        type: "BRACKET_REF",
        value: v,
      };
    }
  }

  // 3. GAME REF (W#21)
  if (isGameRef(v)) {
    return {
      type: "GAME_REF",
      value: v,
    };
  }

  // 4. DEFAULT TEAM
  return {
    type: "TEAM",
    value: v,
  };
}
