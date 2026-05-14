const ONES = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
];

const TEENS = [
  "sepuluh",
  "sebelas",
  "dua belas",
  "tiga belas",
  "empat belas",
  "lima belas",
  "enam belas",
  "tujuh belas",
  "delapan belas",
  "sembilan belas",
];

const TENS = [
  "",
  "",
  "dua puluh",
  "tiga puluh",
  "empat puluh",
  "lima puluh",
  "enam puluh",
  "tujuh puluh",
  "delapan puluh",
  "sembilan puluh",
];

function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

function terbilangRatusan(n: number): string {
  if (n < 10) {
    return ONES[n];
  }

  if (n < 20) {
    return TEENS[n - 10];
  }

  if (n < 100) {
    const puluhan = Math.floor(n / 10);
    const sisa = n % 10;

    return (
      TENS[puluhan] +
      (sisa ? ` ${ONES[sisa]}` : "")
    );
  }

  const ratus = Math.floor(n / 100);
  const sisa = n % 100;

  return (
    (ratus === 1
      ? "seratus"
      : `${ONES[ratus]} ratus`) +
    (sisa ? ` ${terbilangRatusan(sisa)}` : "")
  );
}

export function terbilang(n: number): string {
  if (n === 0) {
    return "Nol Rupiah";
  }

  const parts: string[] = [];

  const triliun = Math.floor(n / 1_000_000_000_000);

  const milyar = Math.floor(
    (n % 1_000_000_000_000) / 1_000_000_000
  );

  const juta = Math.floor(
    (n % 1_000_000_000) / 1_000_000
  );

  const ribu = Math.floor(
    (n % 1_000_000) / 1_000
  );

  const sisa = n % 1_000;

  if (triliun) {
    parts.push(
      `${terbilangRatusan(triliun)} triliun`
    );
  }

  if (milyar) {
    parts.push(
      `${terbilangRatusan(milyar)} milyar`
    );
  }

  if (juta) {
    parts.push(
      `${terbilangRatusan(juta)} juta`
    );
  }

  if (ribu) {
    parts.push(
      ribu === 1
        ? "seribu"
        : `${terbilangRatusan(ribu)} ribu`
    );
  }

  if (sisa) {
    parts.push(terbilangRatusan(sisa));
  }

  const result = parts.join(" ").trim();

  return `${capitalizeWords(result)} Rupiah`;
}

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

// ,00
// export function formatRupiah(n: number): string {
//   return new Intl.NumberFormat("id-ID", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(n);
// }