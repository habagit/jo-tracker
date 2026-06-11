const XLSX = require("xlsx");
const axios = require("axios");

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1iC_pH5WQUWzOF7pZAIuSzrkGKOx_6jCg/export?format=xlsx";

async function run() {
  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  const sheet = workbook.Sheets["16U BOYS"];

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log(JSON.stringify(rows.slice(0, 40), null, 2));
}

run();
