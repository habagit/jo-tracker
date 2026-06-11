const fs = require("fs");

const games = JSON.parse(fs.readFileSync("data/games.json", "utf8"));

function cleanTeam(teamString) {
  if (!teamString) return "";

  const dash = teamString.indexOf("-");

  if (dash === -1) {
    return teamString.trim();
  }

  return teamString.substring(dash + 1).trim();
}

const schedules = {};

for (const game of games) {
  const white = cleanTeam(game.white);
  const dark = cleanTeam(game.dark);

  const whiteKey = `${game.division}|${white}`;

  const darkKey = `${game.division}|${dark}`;

  if (!schedules[whiteKey]) {
    schedules[whiteKey] = [];
  }

  if (!schedules[darkKey]) {
    schedules[darkKey] = [];
  }

  schedules[whiteKey].push({
    gameId: game.gameId,
    opponent: dark,
    location: game.location,
    date: game.date,
    time: game.time,
    side: "WHITE",
    whiteScore: game.whiteScore,
    darkScore: game.darkScore,
  });

  schedules[darkKey].push({
    gameId: game.gameId,
    opponent: white,
    location: game.location,
    date: game.date,
    time: game.time,
    side: "DARK",
    whiteScore: game.whiteScore,
    darkScore: game.darkScore,
  });
}

fs.writeFileSync("data/teamSchedules.json", JSON.stringify(schedules, null, 2));

console.log(`Created schedules for ${Object.keys(schedules).length} teams`);
