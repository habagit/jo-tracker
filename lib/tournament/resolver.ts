import { Game } from "./types";
import { parseScore } from "./normalize";

export function getWinner(game: Game) {
  const w = parseScore(game.whiteScore);
  const d = parseScore(game.darkScore);
  if (w == null || d == null) return null;
  return w > d ? game.white : game.dark;
}

export function getLoser(game: Game) {
  const w = parseScore(game.whiteScore);
  const d = parseScore(game.darkScore);
  if (w == null || d == null) return null;
  return w > d ? game.dark : game.white;
}

/**
 * Resolve W#12 / L#15 references
 */
export function resolveRef(ref: string, gameIndex: Record<string, Game>) {
  if (!ref) return null;

  const m = ref.match(/(W|L)#(\d+)/);
  if (!m) return null;

  const game = gameIndex[m[2]];
  if (!game) return null;

  return m[1] === "W" ? getWinner(game) : getLoser(game);
}
