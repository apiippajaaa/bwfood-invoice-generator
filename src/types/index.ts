export interface TransactionRow {
    no: number | null;
    namaRelasi: string;
    npwpRelasi: string;
    nikRelasi: string;
    alamatRelasi: string;
    noNota: string;
    noSJ: string;
    noInvoice: string;
    deskripsiBarang: string;
    nomorFakturPajak: string;
    tanggalFakturPajak: string;
    tonase: number;
    satuan: string;
    harga: number;
    hargaJual: number;
    diskon: number;
    dasarPengenaanPajak: number;
    ppn: number;
    jumlahDibayar: number;
  }
  
  export interface TransactionGroup {
    noInvoice: string;
    noSJ: string;
    noNota: string;
    namaRelasi: string;
    npwpRelasi: string;
    nikRelasi: string;
    alamatRelasi: string;
    tanggalFakturPajak: string;
    items: TransactionItem[];
    subtotal: number;
    ppn: number;
    total: number;
  }
  
  export interface TransactionItem {
    namaBarang: string;
    qty: number;
    satuan: string;
    hargaSatuan: number;
    totalHarga: number;
  }