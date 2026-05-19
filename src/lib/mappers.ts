import type {
    TransactionGroup,
    TransactionItem,
  } from "@/types";
  
  import { COL } from "./constants";
  
  import {
    getNumber,
    getString,
    parseExcelDate,
  } from "./helpers";
  
  export function mapTransactionItem(
    row: unknown[]
  ): TransactionItem {
    return {
      namaBarang: getString(row, COL.NAMA_BARANG),
  
      qty: getNumber(row, COL.QTY),
  
      satuan: getString(row, COL.SATUAN),
  
      hargaSatuan: getNumber(
        row,
        COL.HARGA_SATUAN
      ),
  
      totalHarga: getNumber(
        row,
        COL.TOTAL_HARGA
      ),
    };
  }
  
  export function createTransactionGroup(
    row: unknown[]
  ): TransactionGroup {
    return {
      noInvoice: getString(
        row,
        COL.NO_INVOICE
      ),
  
      noSJ: getString(row, COL.NO_SJ),
  
      noNota: getString(row, COL.NO_NOTA),
  
      namaRelasi: getString(
        row,
        COL.NAMA_RELASI
      ),
  
      npwpRelasi: getString(
        row,
        COL.NPWP
      ),
  
      nikRelasi: getString(
        row,
        COL.NIK
      ),
  
      alamatRelasi: getString(
        row,
        COL.ALAMAT
      ),
  
      tanggalFakturPajak: parseExcelDate(
        row[COL.TANGGAL_FAKTUR]
      ),
  
      items: [],
  
      subtotal: 0,

      discount: 0,
    };
  }