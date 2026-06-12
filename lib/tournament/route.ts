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
    const result = await getTeamData(division, decodeURIComponent(team));

    return Response.json(result);
  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        error: "api crash",
        message: err?.message,
      },
      { status: 500 },
    );
  }
}
