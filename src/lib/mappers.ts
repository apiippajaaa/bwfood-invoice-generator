import type {
  TransactionGroup,
  TransactionItem,
} from "@/types";

import { COL } from "./constants";
import {
  getNumber,
  getString,
  parseExcelDate
} from "./helpers";



export function mapTransactionItem(
  row: unknown[],
): TransactionItem {
  return {
    namaBarang: getString(
      row,
      COL.DESKRIPSI_BARANG,
    ),

    tonase: getNumber(
      row,
      COL.TONASE,
    ),

    satuan: getString(
      row,
      COL.SATUAN,
    ),

    harga: getNumber(
      row,
      COL.HARGA,
    ),

    hargaJual: getNumber(
      row,
      COL.HARGA_JUAL,
    ),

    bsAllowance: getNumber(
      row,
      COL.BS_ALLOWANCE,
    ),

    dpp: getNumber(
      row,
      COL.DPP,
    ),

    dppNilaiLain: getNumber(
      row,
      COL.DPP_NILAI_LAIN,
    ),

    ppn: getNumber(
      row,
      COL.PPN,
    ),

    jumlahDibayar: getNumber(
      row,
      COL.JUMLAH_DIBAYAR,
    ),
  };
}

export function createTransactionGroup(
  row: unknown[],
): TransactionGroup {
  return {
    noInvoice: getString(
      row,
      COL.NO_INVOICE,
    ),

    noNota: getString(
      row,
      COL.NO_NOTA,
    ),

    noPO: getString(
      row,
      COL.NO_PO,
    ),

    noSJ: getString(
      row,
      COL.NO_SJ,
    ),

    namaRelasi: getString(
      row,
      COL.NAMA_RELASI,
    ),

    npwpRelasi: getString(
      row,
      COL.NPWP_RELASI,
    ),

    nikRelasi: getString(
      row,
      COL.NIK_RELASI,
    ),

    alamatRelasi: getString(
      row,
      COL.ALAMAT_RELASI,
    ),

    tanggalNota: parseExcelDate(
      row[COL.TGL_NOTA],
    ),

    items: [],

    subtotalHargaJual: 0,
    totalBsAllowance: 0,
    totalDpp: 0,
    totalDppNilaiLain: 0,
    totalPpn: 0,
    totalJumlahDibayar: 0,
  };
}