import { Game } from "./types";
import { resolveRef } from "./resolver";

/**
 * Build index of games
 */
function indexGames(games: Game[]) {
  const map: Record<string, Game> = {};
  for (const g of games) {
    map[g.gameId.replace(/\D/g, "")] = g;
  }
  return map;
}

/**
 * Extract possible team from placeholder text
 */
function extractTeam(value: string, gameIndex: Record<string, Game>) {
  if (!value) return null;

  // direct team
  if (!value.includes("#")) return value;

  // W#/L#
  const m = value.match(/(W|L)#(\d+)/);
  if (!m) return null;

  return resolveRef(value, gameIndex);
}

/**
 * Build full bracket graph
 */
export function buildBracketGraph(games: Game[]) {
  const gameIndex = indexGames(games);

  const enriched = games.map((g) => {
    const whiteResolved = extractTeam(g.white, gameIndex);
    const darkResolved = extractTeam(g.dark, gameIndex);

    return {
      ...g,
      whiteResolved,
      darkResolved,
    };
  });

  /**
   * Add dependency graph
   */
  const graph: Record<string, any> = {};

  for (const g of enriched) {
    graph[g.gameId] = {
      game: g,
      dependsOn: extractDependencies(g),
    };
  }

  return graph;
}

/**
 * Find dependencies like W#12, L#15, etc.
 */
function extractDependencies(game: Game) {
  const refs: string[] = [];

  const text = `${game.white} ${game.dark} ${game.comments}`;

  const matches = text.match(/(W|L)#\d+/g);

  if (matches) refs.push(...matches);

  return refs;
}
