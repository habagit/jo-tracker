const fs = require("fs");

const games = JSON.parse(fs.readFileSync("data/games.json", "utf8"));

const graph = JSON.parse(fs.readFileSync("data/bracketGraph.json", "utf8"));

const tournament = {};

function teamWon(game, team) {
  const whiteWon = game.whiteScore > game.darkScore;

  if (team === game.whiteTeam) {
    return whiteWon;
  }

  return !whiteWon;
}

function findTeams(game) {
  return [game.whiteTeam, game.darkTeam];
}

for (const game of games) {
  findTeams(game).forEach((team) => {
    const key = `${game.division}|${team}`;

    if (!tournament[key]) {
      tournament[key] = {
        division: game.division,
        team,

        wins: 0,
        losses: 0,

        games: [],
      };
    }

    tournament[key].games.push(game);

    if (game.whiteScore !== "" && game.darkScore !== "") {
      if (teamWon(game, team)) {
        tournament[key].wins++;
      } else {
        tournament[key].losses++;
      }
    }
  });
}

Object.values(tournament).forEach((team) => {
  team.games.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date - b.date;
    }

    return a.time - b.time;
  });

  team.latestGame = team.games[team.games.length - 1];

  const latest = team.latestGame;

  const node = graph[latest.gameId];

  if (node) {
    team.ifWin = node.winnerTo || null;

    team.ifLose = node.loserTo || null;
  }
});

fs.writeFileSync(
  "data/tournamentData.json",
  JSON.stringify(tournament, null, 2),
);

console.log("Tournament data built.");
