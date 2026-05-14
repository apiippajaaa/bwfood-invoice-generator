import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { TransactionGroup } from "@/types";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#fff",

    // padding diperbesar
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 52,
  },

  /* =========================
   * HEADER
   * ========================= */
  header: {
    position: "relative",
    height: 70,
    marginBottom: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  // logo pojok kiri
  logo: {
    position: "absolute",
    left: 0,
    top: 0,

    width: 62,
    height: 62,
    objectFit: "contain",
  },

  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },

  /* =========================
   * CUSTOMER
   * ========================= */
  customerSection: {
    marginBottom: 22,
    width: "58%",
  },

  kepada: {
    fontSize: 10,
    marginBottom: 4,
  },

  customerName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },

  customerAddress: {
    fontSize: 10,
    lineHeight: 1.45,
  },

  /* =========================
   * INTRO
   * ========================= */
  intro: {
    fontSize: 10,
    marginBottom: 14,
    lineHeight: 1.5,
  },

  /* =========================
   * ITEMS
   * ========================= */
  itemsWrapper: {
    marginBottom: 20,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },

  itemNo: {
    width: "6%",
    fontSize: 10,
  },

  itemName: {
    width: "58%",
    fontSize: 10,
    paddingRight: 8,
  },

  itemQty: {
    width: "14%",
    fontSize: 10,
  },

  itemSat: {
    width: "22%",
    fontSize: 10,
  },

  /* =========================
   * FOOTER TEXT
   * ========================= */
  closing: {
    fontSize: 10,
    marginBottom: 10,
  },

  // tanggal pindah kiri
  date: {
    fontSize: 10,
    marginBottom: 18,
  },

  /* =========================
   * SIGN
   * ========================= */
  signWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },

  signBox: {
    width: "28%",
    alignItems: "center",
  },

  signTitle: {
    fontSize: 10,
    marginBottom: 65,
  },

  // garis dihilangkan
  signText: {
    fontSize: 10,
    letterSpacing: 0.4,
  },
});

interface Props {
  transaction: TransactionGroup;
  logoSrc?: string;
}

export function SuratJalanPDF({ transaction, logoSrc = "/logo.png" }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* HEADER */}
        <View style={s.header}>
          <Image src={logoSrc} style={s.logo} />

          <Text style={s.title}>SURAT JALAN</Text>
        </View>

        {/* CUSTOMER */}
        <View style={s.customerSection}>
          <Text style={s.kepada}>Kepada Yth.</Text>

          <Text style={s.customerName}>{transaction.namaRelasi}</Text>

          <Text style={s.customerAddress}>{transaction.alamatRelasi}</Text>
        </View>

        {/* INTRO */}
        <Text style={s.intro}>Dengan Hormat,</Text>

        <Text style={s.intro}>Bersama ini kami kirimkan:</Text>

        {/* ITEMS */}
        <View style={s.itemsWrapper}>
          {transaction.items.map((item, idx) => (
            <View key={idx} style={s.itemRow}>
              <Text style={s.itemNo}>{idx + 1}.</Text>

              <Text style={s.itemName}>{item.namaBarang}</Text>

              <Text style={s.itemQty}>{item.qty}</Text>

              <Text style={s.itemSat}>{item.satuan}</Text>
            </View>
          ))}
        </View>

        {/* CLOSING */}
        <Text style={s.closing}>
          Atas kerjasamanya kami ucapkan banyak terimakasih
        </Text>

        {/* DATE */}
        <Text style={s.date}>Klaten, {transaction.tanggalFakturPajak}</Text>

        {/* SIGN */}
        <View style={s.signWrapper}>
          <View style={s.signBox}>
            <Text style={s.signTitle}>Gudang</Text>

            <Text style={s.signText}>
              ({"                                                  "})
            </Text>
          </View>

          <View style={s.signBox}>
            <Text style={s.signTitle}>Pengirim</Text>

            <Text style={s.signText}>
              ({"                                                  "})
            </Text>
          </View>

          <View style={s.signBox}>
            <Text style={s.signTitle}>Penerima</Text>

            <Text style={s.signText}>
              ({"                                                  "})
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
