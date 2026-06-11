import axios from "axios";
import * as XLSX from "xlsx";

import { parseWorkbook } from "@/lib/parseWorkbook";
import { findTeamGames } from "@/lib/findTeamGames";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const division = url.searchParams.get("division") || "";

  const team = url.searchParams.get("team") || "";

  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  const games = parseWorkbook(workbook);

  const teamGames = findTeamGames(games, division, team);

  return Response.json({
    count: teamGames.length,
    games: teamGames,
  });
}
