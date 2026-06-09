const XLSX = require("xlsx");
const axios = require("axios");
const fs = require("fs");

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1LBDyDWHtmmEghhyGH0hslI49ZbQ0ppXW/export?format=xlsx";

const VALID_DIVISIONS = ["16U BOYS", "16U GIRLS", "18U BOYS", "18U GIRLS"];

async function run() {
  console.log("Downloading workbook...");

  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  const teams = [];

  for (const sheetName of workbook.SheetNames) {
    // Skip sheets we don't care about
    if (!VALID_DIVISIONS.includes(sheetName)) {
      continue;
    }

    console.log(`Processing ${sheetName}`);

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    for (const row of rows) {
      for (const cell of row) {
        if (typeof cell !== "string") {
          continue;
        }

        // Match team entries like:
        // A1-CC UNITED A
        // B3-WEST VALLEY
        // H4-SAN JOSE/ALMADEN
        if (/^[A-H][1-4]-/.test(cell)) {
          const firstDash = cell.indexOf("-");

          const seed = cell.substring(0, firstDash);
          const team = cell.substring(firstDash + 1).trim();

          teams.push({
            division: sheetName,
            seed,
            team,
          });
        }
      }
    }
  }

  // Remove duplicates
  const uniqueTeams = [];
  const seen = new Set();

  for (const team of teams) {
    const key = `${team.division}|${team.seed}|${team.team}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueTeams.push(team);
    }
  }

  fs.writeFileSync("data/teams.json", JSON.stringify(uniqueTeams, null, 2));

  console.log(`Extracted ${uniqueTeams.length} teams`);

  console.log("Saved to data/teams.json");
}

run().catch((err) => {
  console.error(err);
});
