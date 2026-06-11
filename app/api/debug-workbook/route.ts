import axios from "axios";
import * as XLSX from "xlsx";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const sheetName = url.searchParams.get("sheet");

  const response = await axios.get(XLSX_URL, {
    responseType: "arraybuffer",
  });

  const workbook = XLSX.read(response.data, {
    type: "buffer",
  });

  if (sheetName) {
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      return Response.json({
        error: "Sheet not found",
        availableSheets: workbook.SheetNames,
      });
    }

    return Response.json({
      sheet: sheetName,
      rows: XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: true,
      }),
    });
  }

  return Response.json({
    sheets: workbook.SheetNames,
  });
}
