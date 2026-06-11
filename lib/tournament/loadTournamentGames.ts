import axios from "axios";
import * as XLSX from "xlsx";

/* -- My Test Sheet
const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";
*/

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1kRf6-_hDU_ibGJw-BPTfJqJM9SxsYFUE/export?format=xlsx";

type Row = (string | number | null | undefined)[];

export async function loadTournamentGames() {
  const res = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const wb = XLSX.read(res.data, { type: "buffer" });

  const games: any[] = [];

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];

    // ✅ FORCE ROW TYPE
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, {
      header: 1,
      raw: false,
    });

    for (const row of rows) {
      if (!row || !Array.isArray(row)) continue;

      const gameId = row[3];

      if (!gameId) continue;
      if (!String(gameId).match(/^\d+[BG]\d+/)) continue;

      games.push({
        division: sheetName,
        date: row[0],
        time: row[1],
        location: row[2],
        gameId,

        white: row[4] || "",
        dark: row[6] || "",

        whiteScore: row[5],
        darkScore: row[7],

        comments: row[8] || "",
      });
    }
  }

  return games;
}
