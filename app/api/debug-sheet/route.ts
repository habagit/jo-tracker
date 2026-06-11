import axios from "axios";
import * as XLSX from "xlsx";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1Trm6UmZ_HA-4ZYWFRHIeM5J5n2dKYpg4/export?format=xlsx";

export async function GET() {
  try {
    const response = await axios.get(XLSX_URL, {
      responseType: "arraybuffer",
    });

    const workbook = XLSX.read(response.data, {
      type: "buffer",
    });

    const output: Record<string, any> = {};

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
      });

      output[sheetName] = {
        rowCount: rows.length,
        rows: rows.slice(0, 150),
      };
    }

    return Response.json(output);
  } catch (error: any) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
