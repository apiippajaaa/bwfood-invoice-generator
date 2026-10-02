import * as XLSX from "xlsx";

import type { TransactionGroup } from "@/types";
import { groupTransactions } from "./groupTransactions";

const HEADER_NAMES = [
  "No Invoice",
  "Deskripsi Barang",
  "Tonase",
  "Satuan",
  "Harga",
  "Harga Jual",
  "Jumlah Dibayar",
];

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findHeaderRow(rows: unknown[][]): number {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row) continue;

    const normalized = row.map(normalizeHeader);

    const matched = HEADER_NAMES.filter((header) =>
      normalized.includes(normalizeHeader(header)),
    );

    if (matched.length >= 5) {
      return i;
    }
  }

  return -1;
}

export function parseExcel(
  file: ArrayBuffer,
): TransactionGroup[] {
  const workbook = XLSX.read(file, {
    type: "array",

    // Jangan mengubah formula menjadi string formula
    cellFormula: false,

    cellNF: false,
    cellStyles: false,
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return [];
  }

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    raw: true,
  }) as unknown[][];

  if (!rows.length) {
    return [];
  }

  const headerRowIndex = findHeaderRow(rows);

  if (headerRowIndex === -1) {
    throw new Error(
      "Header Excel tidak ditemukan. Pastikan file memiliki kolom No Invoice, Deskripsi Barang, Tonase, Harga, dan Harga Jual.",
    );
  }

  const dataRows = rows
    .slice(headerRowIndex + 1)
    .filter((row) =>
      row.some(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== "",
      ),
    );

  return groupTransactions(dataRows);
}