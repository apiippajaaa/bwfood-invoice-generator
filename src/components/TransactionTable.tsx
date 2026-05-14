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
  const allSelected = selected.size === transactions.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      {/* Scroll wrapper */}
      <div className="max-h-[650px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
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
                Total
              </th>

              <th className="px-4 py-4 text-center font-medium text-white/50">
                Items
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.noInvoice}
                onClick={() => onToggle(t.noInvoice)}
                className={`
                  cursor-pointer border-b border-white/5 transition-all duration-200
                  ${
                    selected.has(t.noInvoice)
                      ? "bg-white/[0.07]"
                      : "hover:bg-white/[0.04]"
                  }
                  ${i === transactions.length - 1 ? "border-b-0" : ""}
                `}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.has(t.noInvoice)}
                    onChange={() => onToggle(t.noInvoice)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 accent-white"
                  />
                </td>

                <td className="px-4 py-4 font-mono text-xs text-white/90">
                  {t.noInvoice}
                </td>

                <td className="px-4 py-4 font-mono text-xs text-white/60">
                  {t.noSJ}
                </td>

                <td className="px-4 py-4 text-white/80">{t.namaRelasi}</td>

                <td className="px-4 py-4 text-xs text-white/50">
                  {t.tanggalFakturPajak}
                </td>

                <td className="px-4 py-4 text-right font-medium text-white/80">
                  Rp {formatRupiah(t.total)}
                </td>

                <td className="px-4 py-4 text-center">
                  <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-white/60">
                    {t.items.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
