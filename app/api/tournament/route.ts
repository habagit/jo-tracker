import { NextRequest } from "next/server";
import { getTeamData } from "@/lib/tournamentEngine";
import { normalizeDivision } from "@/lib/tournament/normalize";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const divisionRaw = req.nextUrl.searchParams.get("division");
  const teamRaw = req.nextUrl.searchParams.get("team");

  if (!divisionRaw || !teamRaw) {
    return Response.json({ error: "missing params" }, { status: 400 });
  }

  const division = normalizeDivision(divisionRaw);
  const team = decodeURIComponent(teamRaw).toUpperCase().trim();

  const data = await getTeamData(division, team);

  return Response.json(data ?? { error: "not found" });
}
