import * as XLSX from "xlsx";

export function getString(
  row: unknown[],
  index: number
): string {
  return String(row[index] ?? "").trim();
}

export function getNumber(
  row: unknown[],
  index: number
): number {
  return Number(row[index]) || 0;
}

export function parseExcelDate(value: unknown): string {
  if (!value) return "";

  // Excel serial number
  if (typeof value === "number") {
    const excelDate = XLSX.SSF.parse_date_code(value);

    if (!excelDate) return "";

    const dateObj = new Date(
      excelDate.y,
      excelDate.m - 1,
      excelDate.d
    );

    return formatDate(dateObj);
  }

  // JS Date
  if (value instanceof Date) {
    return formatDate(value);
  }

  // fallback string
  return String(value);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}