const fs = require("fs");

const games = JSON.parse(fs.readFileSync("data/games.json", "utf8"));

const graph = {};

for (const game of games) {
  graph[game.gameId] = {
    winnerTo: null,
    loserTo: null,
    game,
  };
}

function extractReferences(text) {
  if (!text) return [];

  return text.match(/[WL]#\d+/g) || [];
}

for (const game of games) {
  const refs = [
    ...extractReferences(game.whiteRaw),
    ...extractReferences(game.darkRaw),
  ];

  refs.forEach((ref) => {
    const type = ref.startsWith("W") ? "winnerTo" : "loserTo";

    const sourceNumber = ref.replace("W#", "").replace("L#", "");

    const prefix = game.gameId.substring(0, 3);

    const sourceGame = prefix + sourceNumber.padStart(2, "0");

    if (!graph[sourceGame]) {
      return;
    }

    graph[sourceGame][type] = game.gameId;
  });
}

fs.writeFileSync("data/bracketGraph.json", JSON.stringify(graph, null, 2));

console.log("Bracket graph created.");
