const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// ✅ LOCAL EXCEL FILE (your new source of truth)
const XLSX_FILE = path.join(__dirname, "../data/JO2026.xlsx");

// Divisions to parse
const VALID_DIVISIONS = ["16U BOYS", "16U GIRLS", "18U BOYS", "18U GIRLS"];

async function run() {
  // Read local Excel file
  const workbook = XLSX.readFile(XLSX_FILE);

  const games = [];

  for (const division of VALID_DIVISIONS) {
    const sheetName = workbook.SheetNames.find((name) =>
      name.startsWith(division),
    );

    const sheet = sheetName ? workbook.Sheets[sheetName] : null;

    if (!sheet) {
      console.log(`⚠️ No sheet found for division: ${division}`);
      continue;
    }

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    // Find schedule header row
    let scheduleStart = -1;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row[0] === "DATE" && row[1] === "TIME" && row[2] === "LOCATION") {
        scheduleStart = i + 1;
        break;
      }
    }

    if (scheduleStart === -1) {
      console.log(`⚠️ No schedule found in ${division}`);
      continue;
    }

    // Parse games
    for (let i = scheduleStart; i < rows.length; i++) {
      const row = rows[i];

      if (!row || row.length < 8) continue;

      const gameId = row[3];

      if (typeof gameId !== "string" || !gameId.match(/^\d+[BG]\d+/)) {
        continue;
      }

      function cleanTeam(value) {
        if (!value) return "";

        const idx = value.lastIndexOf("-");

        if (idx === -1) return value.trim();

        return value.substring(idx + 1).trim();
      }

      games.push({
        division,
        date: row[0],
        time: row[1],
        location: row[2],
        gameId: row[3],

        whiteRaw: row[4] || "",
        whiteScore: row[5] || "",

        darkRaw: row[6] || "",
        darkScore: row[7] || "",

        whiteTeam: cleanTeam(row[4]),
        darkTeam: cleanTeam(row[6]),

        comments: row[8] || "",
      });
    }
  }

  // Write output file
  const outputPath = path.join(__dirname, "../data/games.json");

  fs.writeFileSync(outputPath, JSON.stringify(games, null, 2));

  console.log("✅ Games extracted successfully");
  console.log(`📦 Total games: ${games.length}`);
  console.log(`📁 Output: ${outputPath}`);
}

run();
