import { Game } from "./parseWorkbook";

export function findTeamGames(games: Game[], division: string, team: string) {
  return games
    .filter(
      (g) =>
        g.division === division &&
        (g.whiteTeam === team || g.darkTeam === team),
    )
    .sort((a, b) => a.gameId.localeCompare(b.gameId));
}
