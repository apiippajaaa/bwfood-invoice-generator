"use client";

import type { TransactionGroup } from "@/types";
import { formatRupiah } from "@/lib/formatters";

interface Props {
  transactions: TransactionGroup[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
}

export function TransactionTable({
  transactions,
  selected,
  onToggle,
  onSelectAll,
}: Props) {
  /**
   * Semua invoice yang sedang ditampilkan
   */
  const invoiceIds = transactions.map((transaction) => transaction.noInvoice);

  /**
   * Select All dianggap aktif jika:
   * - ada transaksi
   * - seluruh invoice yang sedang ditampilkan sudah dipilih
   */
  const allSelected =
    transactions.length > 0 && invoiceIds.every((id) => selected.has(id));

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
      "
    >
      <div
        className="
          custom-scrollbar
          max-h-[650px]
          overflow-x-auto
          overflow-y-auto
        "
      >
        <table className="w-full min-w-[1500px] text-sm">
          {/* =========================================================
              HEADER
          ========================================================= */}
          <thead className="sticky top-0 z-20">
            <tr
              className="
                border-b border-white/10
                bg-[#111111]/95
                backdrop-blur-xl
              "
            >
              {/* SELECT */}
              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  aria-label={
                    allSelected
                      ? "Deselect all invoices"
                      : "Select all invoices"
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    accent-white
                  "
                />
              </th>

              {/* NO INVOICE */}
              <th
                className="
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                No Invoice
              </th>

              {/* NO NOTA */}
              <th
                className="
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                No Nota
              </th>

              {/* NO PO */}
              <th
                className="
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                No PO
              </th>

              {/* NO SJ */}
              <th
                className="
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                No SJ
              </th>

              {/* RELASI */}
              <th
                className="
                  min-w-[260px]
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                Nama Relasi
              </th>

              {/* TANGGAL */}
              <th
                className="
                  px-4 py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                Tanggal Nota
              </th>

              {/* DPP */}
              <th
                className="
                  px-4 py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                DPP
              </th>

              {/* DPP NILAI LAIN */}
              <th
                className="
                  px-4 py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                DPP Nilai Lain
              </th>

              {/* PPN */}
              <th
                className="
                  px-4 py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                PPN
              </th>

              {/* TOTAL */}
              <th
                className="
                  px-4 py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/45
                  whitespace-nowrap
                "
              >
                Jumlah Dibayar
              </th>
            </tr>
          </thead>

          {/* =========================================================
              BODY
          ========================================================= */}
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="
                    px-6
                    py-16
                    text-center
                    text-sm
                    text-white/35
                  "
                >
                  Belum ada invoice.
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => {
                const {
                  noInvoice,
                  noNota,
                  noPO,
                  noSJ,
                  namaRelasi,
                  tanggalNota,
                  totalDpp,
                  totalDppNilaiLain,
                  totalPpn,
                  totalJumlahDibayar,
                } = transaction;

                const isSelected = selected.has(noInvoice);

                const isLast = index === transactions.length - 1;

                return (
                  <tr
                    key={noInvoice}
                    onClick={() => onToggle(noInvoice)}
                    className={`
                      group
                      cursor-pointer
                      transition-colors
                      duration-200

                      ${
                        isSelected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                      }

                      ${isLast ? "" : "border-b border-white/5"}
                    `}
                  >
                    {/* =================================================
                        CHECKBOX
                    ================================================= */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(noInvoice)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Select invoice ${noInvoice}`}
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          accent-white
                        "
                      />
                    </td>

                    {/* =================================================
                        NO INVOICE
                    ================================================= */}
                    <td className="px-4 py-4">
                      <span
                        className="
                          font-mono
                          text-xs
                          font-medium
                          text-white/90
                          whitespace-nowrap
                        "
                      >
                        {noInvoice || "-"}
                      </span>
                    </td>

                    {/* =================================================
                        NO NOTA
                    ================================================= */}
                    <td className="px-4 py-4">
                      <span
                        className="
                          font-mono
                          text-xs
                          text-white/55
                          whitespace-nowrap
                        "
                      >
                        {noNota || "-"}
                      </span>
                    </td>

                    {/* =================================================
                        NO PO
                    ================================================= */}
                    <td className="px-4 py-4">
                      <span
                        className="
                          font-mono
                          text-xs
                          text-white/55
                          whitespace-nowrap
                        "
                      >
                        {noPO || "-"}
                      </span>
                    </td>

                    {/* =================================================
                        NO SJ
                    ================================================= */}
                    <td className="px-4 py-4">
                      <span
                        className="
                          font-mono
                          text-xs
                          text-white/55
                          whitespace-nowrap
                        "
                      >
                        {noSJ || "-"}
                      </span>
                    </td>

                    {/* =================================================
                        NAMA RELASI
                    ================================================= */}
                    <td className="px-4 py-4">
                      <div className="max-w-[300px]">
                        <p
                          className="
                            truncate
                            font-medium
                            text-white/85
                          "
                          title={namaRelasi}
                        >
                          {namaRelasi || "-"}
                        </p>
                      </div>
                    </td>

                    {/* =================================================
                        TANGGAL NOTA
                    ================================================= */}
                    <td className="px-4 py-4">
                      <span
                        className="
                          text-xs
                          text-white/50
                          whitespace-nowrap
                        "
                      >
                        {tanggalNota || "-"}
                      </span>
                    </td>

                    {/* =================================================
                        DPP
                    ================================================= */}
                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          whitespace-nowrap
                          text-white/65
                        "
                      >
                        Rp {formatRupiah(totalDpp)}
                      </span>
                    </td>

                    {/* =================================================
                        DPP NILAI LAIN
                    ================================================= */}
                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          whitespace-nowrap
                          text-white/65
                        "
                      >
                        Rp {formatRupiah(totalDppNilaiLain)}
                      </span>
                    </td>

                    {/* =================================================
                        PPN
                    ================================================= */}
                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          whitespace-nowrap
                          text-white/65
                        "
                      >
                        Rp {formatRupiah(totalPpn)}
                      </span>
                    </td>

                    {/* =================================================
                        JUMLAH DIBAYAR
                    ================================================= */}
                    <td className="px-4 py-4 text-right">
                      <span
                        className="
                          whitespace-nowrap
                          font-semibold
                          text-white
                        "
                      >
                        Rp {formatRupiah(totalJumlahDibayar)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =============================================================
          FOOTER / SUMMARY
      ============================================================= */}
      {transactions.length > 0 && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/10
            bg-white/[0.02]
            px-5
            py-3
          "
        >
          <span className="text-xs text-white/35">
            {transactions.length} invoice
          </span>

          <span className="text-xs text-white/35">{selected.size} dipilih</span>
        </div>
      )}
    </section>
  );
}
