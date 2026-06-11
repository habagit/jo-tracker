const fs = require("fs-extra");
const path = require("path");
const xlsx = require("xlsx");

// 🔧 CHANGE THIS to your Excel file location
const EXCEL_FILE = path.join(__dirname, "../data/JO2026.xlsx");

// 🔧 OUTPUT JSON (your Next.js file)
const OUTPUT_JSON = path.join(__dirname, "../public/data/tournamentData.json");

// Read Excel
const workbook = xlsx.readFile(EXCEL_FILE);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const raw = xlsx.utils.sheet_to_json(sheet, { defval: "" });

// Transform into your lookup format: "DIVISION|TEAM"
const output = {};

for (const row of raw) {
  const division = (row.division || "").toString().trim().toUpperCase();
  const team = (row.team || "").toString().trim().toUpperCase();

  if (!division || !team) continue;

  const key = `${division}|${team}`;

  output[key] = {
    team: row.team,
    division: row.division,
    wins: row.wins || 0,
    losses: row.losses || 0,
    latestGame: {
      gameId: row.latestGameId || "",
      location: row.latestGameLocation || "",
    },
    ifWin: row.ifWin || "",
    ifLose: row.ifLose || "",
  };
}

// Write JSON
fs.ensureDirSync(path.dirname(OUTPUT_JSON));
fs.writeJsonSync(OUTPUT_JSON, output, { spaces: 2 });

console.log("✅ Tournament data synced successfully!");
console.log("📦 Records:", Object.keys(output).length);
