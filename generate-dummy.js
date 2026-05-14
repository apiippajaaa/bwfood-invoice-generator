const XLSX = require("xlsx");

const rows = [];

const namaBarang = [
  "Pasir Beton",
  "Batu Split",
  "Semen Gresik",
  "Abu Batu",
  "Besi Hollow",
];

const namaRelasi = [
  "CV Maju Jaya",
  "PT Sumber Makmur",
  "CV Berkah Abadi",
  "PT Karya Utama",
  "CV Lancar Rejeki",
];

for (let i = 1; i <= 5000; i++) {
  const qty = Math.floor(Math.random() * 20) + 1;

  const harga = Math.floor(Math.random() * 900000) + 100000;

  const total = qty * harga;

  const ppn = Math.round(total * 0.11);

  rows.push({
    No: i,

    "Nama Relasi": namaRelasi[Math.floor(Math.random() * namaRelasi.length)],

    NPWP: "12.345.678.9-123.000",

    NIK: "3310123456789012",

    Alamat: "Jl. Demak Barat I No. 3 RT 015 RW 010 Surabaya",

    "No Nota": `NOTA-${i}`,

    "No SJ": `SJ-${2026}-${i}`,

    "No Invoice": `INV-${2026}-${i}`,

    "Deskripsi Barang":
      namaBarang[Math.floor(Math.random() * namaBarang.length)],

    "No Faktur Pajak": `010.${i}`,

    "Tanggal Faktur": "18 Januari 2026",

    Qty: qty,

    Satuan: "Kg",

    "Harga Satuan": harga,

    "Total Harga": total,

    Diskon: 0,

    DPP: total,

    PPN: ppn,

    "Jumlah Dibayar": total + ppn,
  });
}

const worksheet = XLSX.utils.json_to_sheet(rows);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Dummy");

XLSX.writeFile(workbook, "dummy-data.xlsx");

console.log("dummy-data.xlsx berhasil dibuat");
