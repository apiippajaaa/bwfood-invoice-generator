export function getString(
  row: unknown[],
  index: number,
): string {
  const value = row[index];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export function getNumber(
  row: unknown[],
  index: number,
): number {
  return toNumber(row[index]);
}

export function toNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    let text = value.trim();

    if (!text) {
      return 0;
    }

    // Buang simbol mata uang
    text = text
      .replace(/rp/gi, "")
      .replace(/\s/g, "");

    // Formula tidak boleh masuk sebagai angka
    if (text.startsWith("=")) {
      return 0;
    }

    // Format Indonesia:
    // 1.234.567,89
    if (text.includes(".") && text.includes(",")) {
      text = text
        .replace(/\./g, "")
        .replace(",", ".");
    }
    // Format Indonesia tanpa desimal:
    // 1.234.567
    else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
      text = text.replace(/\./g, "");
    }
    // Format decimal biasa:
    // 1234.56
    else {
      text = text.replace(/,/g, ".");
    }

    const parsed = Number(text);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function parseExcelDate(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "number") {
    const date = new Date(
      Math.round(
        (value - 25569) * 86400 * 1000,
      ),
    );

    return date.toISOString().slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim();
}