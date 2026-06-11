import axios from "axios";
import * as XLSX from "xlsx";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";

function normalize(str: string) {
  return (str || "")
    .toString()
    .replace(/\u00A0/g, " ")
    .replace(/[-–—]/g, " ")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A1-TEAM NAME → TEAM NAME
 * Removes first 2 characters + dash rule as requested
 */
function extractTeam(value: string) {
  if (!value) return "";

  const idx = value.indexOf("-");
  if (idx === -1) return value.trim();

  return value.substring(idx + 1).trim();
}

/**
 * Valid team filter (removes junk like #W37, blanks, headers)
 */
function isValidTeam(name: string) {
  if (!name) return false;

  const n = normalize(name);

  if (n.length < 3) return false;
  if (n.startsWith("#")) return false;
  if (/^\d+$/.test(n)) return false;

  return true;
}

/**
 * Map divisions → Excel cell ranges
 */
const DIVISION_RANGES: Record<string, string[]> = {
  "16U GIRLS": ["A11:F14"],
  "16U BOYS": ["A13:H15"],
  "18U GIRLS": ["A5:D8"],
  "18U BOYS": ["A4:F7"],
};

/**
 * Convert A1 range → grid scan
 */
function getRangeCells(range: string) {
  const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (!match) return null;

  const [, startCol, startRow, endCol, endRow] = match;

  return {
    startCol,
    startRow: parseInt(startRow),
    endCol,
    endRow: parseInt(endRow),
  };
}

/**
 * Convert column letter → index (A=0, B=1...)
 */
function colToIndex(col: string) {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const division = (searchParams.get("division") || "").toUpperCase();

  if (!division) {
    return Response.json({ teams: [] });
  }

  const res = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(res.data, { type: "buffer" });

  const sheetName = workbook.SheetNames.find((s) =>
    normalize(s).includes(normalize(division)),
  );

  if (!sheetName) {
    return Response.json({ teams: [] });
  }

  const sheet = workbook.Sheets[sheetName];

  const grid = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  const ranges = DIVISION_RANGES[division];

  if (!ranges) {
    return Response.json({
      error: "No range defined for division",
      teams: [],
    });
  }

  const teamSet = new Set<string>();

  for (const range of ranges) {
    const parsed = getRangeCells(range);
    if (!parsed) continue;

    const { startCol, startRow, endCol, endRow } = parsed;

    const sc = colToIndex(startCol);
    const ec = colToIndex(endCol);

    for (let r = startRow - 1; r <= endRow - 1; r++) {
      const row = grid[r];
      if (!row) continue;

      for (let c = sc; c <= ec; c++) {
        const cell = row[c];
        if (!cell || typeof cell !== "string") continue;

        const team = extractTeam(cell);

        if (isValidTeam(team)) {
          teamSet.add(normalize(team));
        }
      }
    }
  }

  return Response.json({
    division,
    teams: Array.from(teamSet).sort(),
  });
}
