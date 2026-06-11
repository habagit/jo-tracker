import axios from "axios";
import * as XLSX from "xlsx";
import { parseWorkbook } from "@/lib/parseWorkbook";

/* -- My Test Sheet
const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";
*/

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1kRf6-_hDU_ibGJw-BPTfJqJM9SxsYFUE/export?format=xlsx";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const division = searchParams.get("division");
  const team = searchParams.get("team");
  const gameId = searchParams.get("gameId");

  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  let games = parseWorkbook(workbook);

  if (division) {
    games = games.filter(
      (g) => g.division.toUpperCase() === division.toUpperCase(),
    );
  }

  if (team) {
    const t = team.toUpperCase();

    games = games.filter(
      (g) =>
        g.whiteTeam.toUpperCase().includes(t) ||
        g.darkTeam.toUpperCase().includes(t),
    );
  }

  if (gameId) {
    games = games.filter(
      (g) => g.gameId.toUpperCase() === gameId.toUpperCase(),
    );
  }

  return Response.json({
    count: games.length,
    games,
  });
}
