import { Game } from "./types";
import { buildBracketGraph } from "./graphBuilder";
import { parseScore } from "./normalize";

function isTeamInGame(game: Game, team: string) {
  const t = team.toUpperCase();

  return (
    game.white?.toUpperCase().includes(t) ||
    game.dark?.toUpperCase().includes(t)
  );
}

function isFinished(game: Game) {
  return (
    parseScore(game.whiteScore) !== null && parseScore(game.darkScore) !== null
  );
}

export function getTeamGames(games: Game[], division: string, team: string) {
  const teamGames = games.filter(
    (g) =>
      g.division.toUpperCase().includes(division.toUpperCase()) &&
      isTeamInGame(g, team),
  );

  return teamGames;
}

export function buildTeamStatus(games: Game[], division: string, team: string) {
  const graph = buildBracketGraph(games);

  const teamGames = getTeamGames(games, division, team);

  const completedGames = teamGames.filter(isFinished);

  const upcomingGames = teamGames.filter((g) => !isFinished(g));

  const latestGame = completedGames.length
    ? completedGames[completedGames.length - 1]
    : null;

  const nextGame = upcomingGames.length ? upcomingGames[0] : null;

  return {
    division,
    team,

    latestGame,

    nextGame,

    completedGames,
    graph,
  };
}
