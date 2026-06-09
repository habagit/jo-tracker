const fs = require("fs");

const teams = JSON.parse(fs.readFileSync("data/teams.json", "utf8"));

const divisions = {};

for (const team of teams) {
  if (!divisions[team.division]) {
    divisions[team.division] = [];
  }

  divisions[team.division].push(team.team);
}

for (const division in divisions) {
  divisions[division] = [...new Set(divisions[division])].sort((a, b) =>
    a.localeCompare(b),
  );
}

fs.writeFileSync("data/divisions.json", JSON.stringify(divisions, null, 2));

console.log("Created divisions.json");
