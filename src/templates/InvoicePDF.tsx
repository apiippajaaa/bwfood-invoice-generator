import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import type { TransactionGroup } from "@/types";
import { formatRupiah, terbilang } from "@/lib/formatters";

const s = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 22,
    paddingHorizontal: 22,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
    backgroundColor: "#fff",
  },

  /* =========================
   * TITLE
   * ========================= */
  title: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
    letterSpacing: 1,
  },

  /* =========================
   * HEADER
   * ========================= */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  leftHeader: {
    width: "42%",
  },

  logo: {
    width: 72,
    height: 72,
    objectFit: "contain",
    marginBottom: 4,
  },

  companyText: {
    fontSize: 8,
    lineHeight: 1.4,
  },

  /* =========================
   * HEADER RIGHT
   * ========================= */
  rightHeader: {
    width: "50%",

    // geser agar sejajar kolom SATUAN
    paddingLeft: 44,
  },

  customerBlock: {
    marginBottom: 8,
  },

  kepada: {
    fontSize: 8,
    marginBottom: 2,
  },

  customerName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },

  customerAddress: {
    fontSize: 8,
    lineHeight: 1.45,
  },

  metaSection: {
    width: "100%",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },

  metaLabel: {
    width: 54,
    fontSize: 8,
  },

  metaColon: {
    width: 10,
    fontSize: 8,
  },

  metaValue: {
    flex: 1,
    fontSize: 8,
  },

  /* =========================
   * TABLE
   * ========================= */
  table: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  headerText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 24,
  },

  cell: {
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  colNo: {
    width: "7%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },

  colBarang: {
    width: "41%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },

  colQty: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },

  // patokan garis total
  colSat: {
    width: "12%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },

  colHarga: {
    width: "14%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "right",
  },

  colTotal: {
    width: "16%",
    textAlign: "right",
  },

  /* =========================
   * TOTAL + TERBILANG
   * ========================= */

  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 0,
  },

  terbilangWrap: {
    width: "54%",
    paddingTop: 8,
    paddingRight: 12,
  },

  terbilangLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },

  terbilangText: {
    fontSize: 8,
    lineHeight: 1.5,
  },

  /*
|--------------------------------------------------------------------------
| TOTALS
|--------------------------------------------------------------------------
| dibuat full tabel continuation:
| - garis kiri nyambung dari colHarga
| - garis kanan nyambung dari colTotal
| - garis horizontal antar row
| - label tidak ada border
| - value full bordered
*/

  totalsBox: {
    width: "30%",
    marginTop: -1, // nyatu dengan border tabel atas
  },

  totalRow: {
    flexDirection: "row",
    minHeight: 22,
  },

  totalLabel: {
    width: "46%",
    fontSize: 8,
    paddingTop: 5,
    paddingBottom: 4,
    paddingRight: 8,
    textAlign: "right",
  },

  totalValue: {
    width: "54%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingTop: 5,
    paddingBottom: 4,
    paddingHorizontal: 6,

    fontSize: 8,

    // continuation tabel
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,

    borderColor: "#000",
  },

  rpText: {
    fontSize: 8,
  },

  totalNumber: {
    fontSize: 8,
    textAlign: "right",
  },

  // row pertama jangan double border
  totalFirst: {
    borderTopWidth: 0,
  },

  // row terakhir penutup tabel
  totalLast: {
    borderBottomWidth: 1,
  },

  /* =========================
   * FOOTER
   * ========================= */
  footer: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bankSection: {
    width: "48%",
  },

  footerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 6,
  },

  bankRow: {
    flexDirection: "row",
    marginBottom: 2,
  },

  bankLabel: {
    width: 110,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  bankColon: {
    width: 8,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  bankValue: {
    flex: 1,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  signSection: {
    width: "24%",
    alignItems: "center",
  },

  signTitle: {
    fontSize: 8,
    marginBottom: 55,
  },

  signLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
});

interface Props {
  transaction: TransactionGroup;
  logoSrc?: string;
}

export function InvoicePDF({ transaction, logoSrc = "/logo.png" }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* TITLE */}
        <Text style={s.title}>INVOICE</Text>

        {/* HEADER */}
        <View style={s.header}>
          {/* LEFT */}
          <View style={s.leftHeader}>
            <Image src={logoSrc} style={s.logo} />

            <Text style={s.companyText}>
              Jl. Candisari No. 02 Karanganom, Klaten Utara, Klaten
            </Text>

            <Text style={s.companyText}>
              Telp. (0272) 325919, 320665, 320666
            </Text>
          </View>

          {/* RIGHT */}
          <View style={s.rightHeader}>
            <View style={s.customerBlock}>
              <Text style={s.kepada}>Kepada Yth :</Text>

              <Text style={s.customerName}>{transaction.namaRelasi}</Text>

              <Text style={s.customerAddress}>{transaction.alamatRelasi}</Text>
            </View>

            <View style={s.metaSection}>
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>No Invoice</Text>

                <Text style={s.metaColon}>:</Text>

                <Text style={s.metaValue}>{transaction.noInvoice}</Text>
              </View>

              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Tgl Invoice</Text>

                <Text style={s.metaColon}>:</Text>

                <Text style={s.metaValue}>
                  {transaction.tanggalFakturPajak}
                </Text>
              </View>

              <View style={s.metaRow}>
                <Text style={s.metaLabel}>No PO</Text>

                <Text style={s.metaColon}>:</Text>

                <Text style={s.metaValue}>-</Text>
              </View>

              <View style={s.metaRow}>
                <Text style={s.metaLabel}>No SJ</Text>

                <Text style={s.metaColon}>:</Text>

                <Text style={s.metaValue}>{transaction.noSJ}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={s.table}>
          {/* HEADER */}
          <View style={s.tableHeader}>
            <Text style={[s.headerText, s.colNo]}>No</Text>

            <Text style={[s.headerText, s.colBarang]}>Nama Barang</Text>

            <Text style={[s.headerText, s.colQty]}>Qty</Text>

            <Text style={[s.headerText, s.colSat]}>Satuan</Text>

            <Text style={[s.headerText, s.colHarga]}>Harga Satuan</Text>

            <Text style={[s.headerText, s.colTotal]}>Total Harga</Text>
          </View>

          {/* ROWS */}
          {transaction.items.map((item, idx) => (
            <View key={idx} style={s.row}>
              <Text style={[s.cell, s.colNo]}>{idx + 1}</Text>

              <Text style={[s.cell, s.colBarang]}>{item.namaBarang}</Text>

              <Text style={[s.cell, s.colQty]}>{item.qty}</Text>

              <Text style={[s.cell, s.colSat]}>{item.satuan}</Text>

              <Text style={[s.cell, s.colHarga]}>
                Rp {formatRupiah(item.hargaSatuan)}
              </Text>

              <Text style={[s.cell, s.colTotal]}>
                Rp {formatRupiah(item.totalHarga)}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTALS + TERBILANG */}
        <View style={s.totalsWrapper}>
          {/* TERBILANG */}
          <View style={s.terbilangWrap}>
            <Text style={s.terbilangLabel}>Terbilang :</Text>

            <Text style={s.terbilangText}>{terbilang(transaction.total)}</Text>
          </View>

          {/* TOTAL */}
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Jumlah</Text>

              <Text style={s.totalValue}>
                Rp {formatRupiah(transaction.subtotal)}
              </Text>
            </View>

            <View style={s.totalRow}>
              <Text style={s.totalLabel}>PPN 10%</Text>

              <Text style={s.totalValue}>
                Rp {formatRupiah(transaction.ppn)}
              </Text>
            </View>

            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total</Text>

              <Text style={[s.totalValue, s.totalLast]}>
                Rp {formatRupiah(transaction.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          {/* LEFT */}
          <View style={s.bankSection}>
            <Text style={s.footerTitle}>
              Pembayaran mohon dapat ditransfer ke :
            </Text>

            <View style={s.bankRow}>
              <Text style={s.bankLabel}>NOMOR REKENING</Text>

              <Text style={s.bankColon}>:</Text>

              <Text style={s.bankValue}>0300951724</Text>
            </View>

            <View style={s.bankRow}>
              <Text style={s.bankLabel}>NAMA REKENING</Text>

              <Text style={s.bankColon}>:</Text>

              <Text style={s.bankValue}>CV BINTANG WALET</Text>
            </View>

            <View style={s.bankRow}>
              <Text style={s.bankLabel}>BANK</Text>

              <Text style={s.bankColon}>:</Text>

              <Text style={s.bankValue}>BANK CENTRAL ASIA (BCA) KLATEN</Text>
            </View>
          </View>

          {/* RIGHT */}
          <View style={s.signSection}>
            <Text style={s.signTitle}>Hormat Kami,</Text>

            <View style={s.signLine} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
