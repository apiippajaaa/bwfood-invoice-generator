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
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="w-10 py-3 px-4">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="accent-white w-4 h-4"
              />
            </th>
            <th className="text-left py-3 px-4 text-white/50 font-medium">
              No Invoice
            </th>
            <th className="text-left py-3 px-4 text-white/50 font-medium">
              No SJ
            </th>
            <th className="text-left py-3 px-4 text-white/50 font-medium">
              Nama Relasi
            </th>
            <th className="text-left py-3 px-4 text-white/50 font-medium">
              Tanggal
            </th>
            <th className="text-right py-3 px-4 text-white/50 font-medium">
              Total
            </th>
            <th className="text-center py-3 px-4 text-white/50 font-medium">
              Items
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr
              key={t.noInvoice}
              onClick={() => onToggle(t.noInvoice)}
              className={`border-b border-white/5 cursor-pointer transition-colors
                ${selected.has(t.noInvoice) ? "bg-white/8" : "hover:bg-white/5"}
                ${i === transactions.length - 1 ? "border-b-0" : ""}
              `}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selected.has(t.noInvoice)}
                  onChange={() => onToggle(t.noInvoice)}
                  onClick={(e) => e.stopPropagation()}
                  className="accent-white w-4 h-4"
                />
              </td>
              <td className="py-3 px-4 text-white/90 font-mono text-xs">
                {t.noInvoice}
              </td>
              <td className="py-3 px-4 text-white/60 font-mono text-xs">
                {t.noSJ}
              </td>
              <td className="py-3 px-4 text-white/80">{t.namaRelasi}</td>
              <td className="py-3 px-4 text-white/50 text-xs">
                {t.tanggalFakturPajak}
              </td>
              <td className="py-3 px-4 text-right text-white/80 font-medium">
                Rp {formatRupiah(t.total)}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                  {t.items.length}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
