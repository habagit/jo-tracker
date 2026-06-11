import axios from "axios";
import * as XLSX from "xlsx";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = url.searchParams.get("gameId");

  if (!gameId) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  const matches: any[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
    });

    rows.forEach((row: any[], idx) => {
      if (row.some((cell) => String(cell || "").includes(gameId))) {
        matches.push({
          sheetName,
          rowNumber: idx + 1,
          row,
        });
      }
    });
  }

  return Response.json(matches);
}
