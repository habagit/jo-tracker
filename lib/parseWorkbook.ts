import * as XLSX from "xlsx";

export interface Game {
  division: string;

  date: string;
  time: string;
  location: string;

  gameId: string;

  whiteRaw: string;
  darkRaw: string;

  whiteTeam: string;
  darkTeam: string;

  whiteScore: number | null;
  darkScore: number | null;

  comments: string;
}

/**
 * Convert sheet names like:
 *
 * 16U BOYS 30 TEAMS 2-3 CROSS
 *
 * into:
 *
 * 16U BOYS
 */
export function normalizeDivision(sheetName: string) {
  const upper = sheetName.toUpperCase();

  if (upper.includes("16U BOYS")) return "16U BOYS";
  if (upper.includes("16U GIRLS")) return "16U GIRLS";
  if (upper.includes("18U BOYS")) return "18U BOYS";
  if (upper.includes("18U GIRLS")) return "18U GIRLS";

  return upper;
}

function isTournamentSheet(sheetName: string) {
  const upper = sheetName.toUpperCase();

  return (
    upper.includes("16U BOYS") ||
    upper.includes("16U GIRLS") ||
    upper.includes("18U BOYS") ||
    upper.includes("18U GIRLS")
  );
}

/**
 * Converts:
 *
 * A1-BERKELEY
 * B3-WEST VALLEY
 * C2-SHARKS
 *
 * into:
 *
 * BERKELEY
 * WEST VALLEY
 * SHARKS
 *
 * Leaves placeholders untouched:
 *
 * W#A1/A4
 * L#C2/C3
 */
export function cleanTeamName(value: string) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.startsWith("W#") || trimmed.startsWith("L#")) {
    return trimmed;
  }

  const match = trimmed.match(/^[A-Z]+\d-(.*)$/i);

  if (match) {
    return match[1].trim();
  }

  return trimmed;
}

export function parseWorkbook(workbook: XLSX.WorkBook): Game[] {
  const games: Game[] = [];

  for (const sheetName of workbook.SheetNames) {
    if (!isTournamentSheet(sheetName)) {
      continue;
    }

    const division = normalizeDivision(sheetName);

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
    }) as any[][];

    for (const row of rows) {
      if (!Array.isArray(row)) continue;

      const gameId = row?.[3]?.toString()?.trim() ?? "";

      /**
       * Valid examples:
       *
       * 16B01
       * 16B99
       * 18G22
       */
      if (!/^\d+[BG]\d+$/i.test(gameId)) {
        continue;
      }

      const whiteRaw = row?.[4]?.toString()?.trim() ?? "";

      const darkRaw = row?.[6]?.toString()?.trim() ?? "";

      const whiteScore =
        row?.[5] === "" || row?.[5] == null ? null : Number(row[5]);

      const darkScore =
        row?.[7] === "" || row?.[7] == null ? null : Number(row[7]);

      games.push({
        division,

        date: row?.[0]?.toString()?.trim() ?? "",

        time: row?.[1]?.toString()?.trim() ?? "",

        location: row?.[2]?.toString()?.trim() ?? "",

        gameId,

        whiteRaw,
        darkRaw,

        whiteTeam: cleanTeamName(whiteRaw),
        darkTeam: cleanTeamName(darkRaw),

        whiteScore,
        darkScore,

        comments: row?.[8]?.toString()?.trim() ?? "",
      });
    }
  }

  return games;
}
