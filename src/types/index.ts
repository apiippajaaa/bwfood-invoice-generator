export interface TransactionItem {
  namaBarang: string;

  tonase: number;

  satuan: string;

  harga: number;

  hargaJual: number;

  bsAllowance: number;

  dpp: number;

  dppNilaiLain: number;

  ppn: number;

  jumlahDibayar: number;
}

export interface TransactionGroup {
  noInvoice: string;

  noNota: string;

  noPO: string;

  noSJ: string;

  namaRelasi: string;

  npwpRelasi: string;

  nikRelasi: string;

  alamatRelasi: string;

  tanggalNota: string;

  items: TransactionItem[];

  subtotalHargaJual: number;

  totalBsAllowance: number;

  totalDpp: number;

  totalDppNilaiLain: number;

  totalPpn: number;

  totalJumlahDibayar: number;
}