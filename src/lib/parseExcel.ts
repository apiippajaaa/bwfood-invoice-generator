import * as XLSX from "xlsx";
import type { TransactionGroup, TransactionItem } from "@/types";

export function parseExcel(file: ArrayBuffer): TransactionGroup[] {
  const workbook = XLSX.read(file, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  // skip header
  const dataRows = rows.slice(1);

  // grouping invoice
  const map = new Map<string, TransactionGroup>();

  for (const row of dataRows) {
    /**
     * Mapping kolom excel:
     *
     * 0  = No
     * 1  = Nama Relasi
     * 2  = NPWP
     * 3  = NIK
     * 4  = Alamat
     * 5  = No Nota
     * 6  = No SJ
     * 7  = No Invoice
     * 8  = Deskripsi Barang
     * 9  = No Faktur Pajak
     * 10 = Tanggal Faktur
     * 11 = Qty / Tonase
     * 12 = Satuan
     * 13 = Harga Satuan
     * 14 = Total Harga
     * 15 = Diskon
     * 16 = DPP
     * 17 = PPN
     * 18 = Jumlah Dibayar
     */

    const noInvoice = String(row[7] ?? "").trim();

    // skip jika invoice kosong
    if (!noInvoice) continue;

    // item barang
    const item: TransactionItem = {
      namaBarang: String(row[8] ?? "").trim(),
      qty: Number(row[11]) || 0,
      satuan: String(row[12] ?? "").trim(),
      hargaSatuan: Number(row[13]) || 0,
      totalHarga: Number(row[14]) || 0,
    };

    // buat transaksi baru jika invoice belum ada
    if (!map.has(noInvoice)) {
      const tanggal = row[10];

      let tanggalStr = "";
      
      if (typeof tanggal === "number") {
        // convert excel serial date -> JS Date
        const excelDate = XLSX.SSF.parse_date_code(tanggal);
      
        if (excelDate) {
          const dateObj = new Date(
            excelDate.y,
            excelDate.m - 1,
            excelDate.d
          );
      
          tanggalStr = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
      } else if (tanggal instanceof Date) {
        tanggalStr = tanggal.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } else {
        tanggalStr = String(tanggal ?? "");
      }

      map.set(noInvoice, {
        noInvoice,
        noSJ: String(row[6] ?? "").trim(),
        noNota: String(row[5] ?? "").trim(),

        namaRelasi: String(row[1] ?? "").trim(),
        npwpRelasi: String(row[2] ?? "").trim(),
        nikRelasi: String(row[3] ?? "").trim(),
        alamatRelasi: String(row[4] ?? "").trim(),

        tanggalFakturPajak: tanggalStr,

        items: [],

        subtotal: 0,
        ppn: 0,
        total: 0,
      });
    }

    // ambil transaksi existing
    const group = map.get(noInvoice)!;

    // tambahkan item
    if (item.namaBarang) {
      group.items.push(item);
    }

    // akumulasi subtotal
    group.subtotal += item.totalHarga;
  }

  // hitung total akhir
  for (const group of map.values()) {
    group.ppn = Math.round(group.subtotal * 0.11);
    group.total = group.subtotal + group.ppn;
  }

  return Array.from(map.values());
}