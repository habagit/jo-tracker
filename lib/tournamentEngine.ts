import { loadTournamentGames } from "./tournament/loadTournamentGames";
import { buildTeamStatus } from "./tournament/teamEngine";

export async function getTeamData(division: string, team: string) {
  const games = await loadTournamentGames();

  return buildTeamStatus(games, division, team);
}
