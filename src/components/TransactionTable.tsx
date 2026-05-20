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
  const allSelected =
    transactions.length > 0 && selected.size === transactions.length;

  return (
    <div
      className="
        overflow-hidden rounded-3xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
      "
    >
      <div className="custom-scrollbar overflow-x-auto overflow-y-auto max-h-[650px]">
        <table className="w-full min-w-[1400px] text-sm">
          {/* HEADER */}
          <thead className="sticky top-0 z-10 backdrop-blur-xl">
            <tr className="border-b border-white/10 bg-[#111111]">
              <th className="w-10 px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 accent-white"
                />
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50 whitespace-nowrap">
                No Invoice
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50 whitespace-nowrap">
                No SJ
              </th>

              <th className="min-w-[260px] px-4 py-4 text-left font-medium text-white/50 whitespace-nowrap">
                Nama Relasi
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50 whitespace-nowrap">
                Tanggal
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50 whitespace-nowrap">
                Subtotal
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50 whitespace-nowrap">
                Diskon
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50 whitespace-nowrap">
                Jumlah
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50 whitespace-nowrap">
                PPN
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50 whitespace-nowrap">
                Total
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {transactions.map((t, i) => {
              /**
               * subtotal seluruh item
               */
              const subtotal = t.subtotal;

              /**
               * total discount invoice
               */
              const discount = t.discount || 0;

              /**
               * jumlah / dpp
               */
              const jumlah = subtotal - discount;

              /**
               * gunakan hasil excel asli
               */
              const ppn = t.ppn;

              /**
               * total excel asli
               */
              const total = t.total;

              const isSelected = selected.has(t.noInvoice);

              return (
                <tr
                  key={t.noInvoice}
                  onClick={() => onToggle(t.noInvoice)}
                  className={`
                    cursor-pointer
                    border-b border-white/5
                    transition-all duration-200

                    ${isSelected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}

                    ${i === transactions.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  {/* CHECKBOX */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(t.noInvoice)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 accent-white"
                    />
                  </td>

                  {/* NO INVOICE */}
                  <td className="px-4 py-4 font-mono text-xs text-white/90 whitespace-nowrap">
                    {t.noInvoice}
                  </td>

                  {/* NO SJ */}
                  <td className="px-4 py-4 font-mono text-xs text-white/60 whitespace-nowrap">
                    {t.noSJ}
                  </td>

                  {/* NAMA RELASI */}
                  <td className="px-4 py-4 text-white/80 whitespace-nowrap">
                    {t.namaRelasi}
                  </td>

                  {/* TANGGAL */}
                  <td className="px-4 py-4 text-xs text-white/50 whitespace-nowrap">
                    {t.tanggalFakturPajak}
                  </td>

                  {/* SUBTOTAL */}
                  <td className="px-4 py-4 text-right text-white/70 whitespace-nowrap">
                    Rp {formatRupiah(subtotal)}
                  </td>

                  {/* DISKON */}
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    {discount > 0 ? (
                      <span className="text-red-300">
                        Rp {formatRupiah(discount)}
                      </span>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>

                  {/* JUMLAH */}
                  <td className="px-4 py-4 text-right font-medium text-white/70 whitespace-nowrap">
                    Rp {formatRupiah(jumlah)}
                  </td>

                  {/* PPN */}
                  <td className="px-4 py-4 text-right text-white/60 whitespace-nowrap">
                    Rp {formatRupiah(ppn)}
                  </td>

                  {/* TOTAL */}
                  <td className="px-4 py-4 text-right font-semibold text-white whitespace-nowrap">
                    Rp {formatRupiah(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
