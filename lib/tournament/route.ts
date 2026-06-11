import { NextRequest } from "next/server";
import { getTeamData } from "@/lib/tournamentEngine";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const division = req.nextUrl.searchParams.get("division");
  const team = req.nextUrl.searchParams.get("team");

  if (!division || !team) {
    return Response.json({ error: "missing params" }, { status: 400 });
  }

  try {
    // ✅ STEP 1: ALWAYS LOAD GAMES FIRST
    const games = await loadTournamentGames();

    console.log("games loaded:", Array.isArray(games), games?.length);

    // ❗ SAFETY CHECK
    if (!Array.isArray(games)) {
      return Response.json(
        { error: "games not array", value: games },
        { status: 500 },
      );
    }

    // ✅ STEP 2: PASS GAMES INTO ENGINE
    const result = getTeamData(games, division, team);

    return Response.json(result);
  } catch (err: any) {
    console.error("API ERROR:", err);

    return Response.json(
      {
        error: "api crash",
        message: err?.message,
      },
      { status: 500 },
    );
  }
}
