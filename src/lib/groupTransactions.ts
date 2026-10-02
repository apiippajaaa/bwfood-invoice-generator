import type { TransactionGroup } from "@/types";

import { COL } from "./constants";
import {
  getString,
} from "./helpers";

import {
  createTransactionGroup,
  mapTransactionItem,
} from "./mappers";

export function groupTransactions(
  rows: unknown[][],
): TransactionGroup[] {
  const map = new Map<
    string,
    TransactionGroup
  >();

  for (const row of rows) {
    const noInvoice = getString(
      row,
      COL.NO_INVOICE,
    );

    if (!noInvoice) {
      continue;
    }

    if (!map.has(noInvoice)) {
      map.set(
        noInvoice,
        createTransactionGroup(row),
      );
    }

    const group = map.get(noInvoice);

    if (!group) {
      continue;
    }

    const item = mapTransactionItem(row);

    // Jangan masukkan baris tanpa nama barang
    if (!item.namaBarang) {
      continue;
    }

    group.items.push(item);

    group.subtotalHargaJual +=
      item.hargaJual;

    group.totalBsAllowance +=
      item.bsAllowance;

    group.totalDpp +=
      item.dpp;

    group.totalDppNilaiLain +=
      item.dppNilaiLain;

    group.totalPpn +=
      item.ppn;

    group.totalJumlahDibayar +=
      item.jumlahDibayar;
  }

  return Array.from(map.values());
}