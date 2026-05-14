"use client";

import type { TransactionGroup } from "@/types";

import { formatRupiah } from "@/lib/formatters";

interface Props {
  transactions: TransactionGroup[];

  selected: Set<string>;

  taxRate: number;

  onToggle: (id: string) => void;

  onSelectAll: () => void;
}

export function TransactionTable({
  transactions,
  selected,
  taxRate,
  onToggle,
  onSelectAll,
}: Props) {
  const allSelected = selected.size === transactions.length;

  return (
    <div
      className="
        overflow-hidden rounded-3xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
      "
    >
      {/* Scroll wrapper */}
      <div className="custom-scrollbar max-h-[650px] overflow-y-auto">
        <table className="w-full text-sm">
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

              <th className="px-4 py-4 text-left font-medium text-white/50">
                No Invoice
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50">
                No SJ
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50">
                Nama Relasi
              </th>

              <th className="px-4 py-4 text-left font-medium text-white/50">
                Tanggal
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50">
                Subtotal
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50">
                PPN {taxRate}%
              </th>

              <th className="px-4 py-4 text-right font-medium text-white/50">
                Total
              </th>

              <th className="px-4 py-4 text-center font-medium text-white/50">
                Items
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {transactions.map((t, i) => {
              const ppn = Math.round(t.subtotal * (taxRate / 100));

              const total = t.subtotal + ppn;

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

                  {/* INVOICE */}
                  <td className="px-4 py-4 font-mono text-xs text-white/90">
                    {t.noInvoice}
                  </td>

                  {/* SJ */}
                  <td className="px-4 py-4 font-mono text-xs text-white/60">
                    {t.noSJ}
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-4 py-4 text-white/80">{t.namaRelasi}</td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-xs text-white/50">
                    {t.tanggalFakturPajak}
                  </td>

                  {/* SUBTOTAL */}
                  <td className="px-4 py-4 text-right font-medium text-white/70">
                    Rp {formatRupiah(t.subtotal)}
                  </td>

                  {/* PPN */}
                  <td className="px-4 py-4 text-right text-white/60">
                    Rp {formatRupiah(ppn)}
                  </td>

                  {/* TOTAL */}
                  <td className="px-4 py-4 text-right font-semibold text-white">
                    Rp {formatRupiah(total)}
                  </td>

                  {/* ITEMS */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className="
                        rounded-full
                        border border-white/10
                        bg-white/10
                        px-2.5 py-1
                        text-xs text-white/60
                      "
                    >
                      {t.items.length}
                    </span>
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
