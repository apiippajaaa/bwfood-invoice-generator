import * as XLSX from "xlsx";

import { groupTransactions } from "./groupTransactions";

import type { TransactionGroup } from "@/types";

export function parseExcel(
  file: ArrayBuffer
): TransactionGroup[] {
  const workbook = XLSX.read(file, {
    type: "array",
  });

  const sheetName =
    workbook.SheetNames[0];

  const sheet =
    workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(
    sheet,
    {
      header: 1,
      defval: null,
    }
  ) as unknown[][];

  // skip header
  const dataRows = rows.slice(1);

  return groupTransactions(dataRows);
}