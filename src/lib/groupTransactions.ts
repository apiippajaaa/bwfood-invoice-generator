import type { TransactionGroup } from "@/types";

import { COL } from "./constants";

import {
  getNumber,
  getString,
} from "./helpers";

import {
  createTransactionGroup,
  mapTransactionItem,
} from "./mappers";

export function groupTransactions(
  rows: unknown[][]
): TransactionGroup[] {
  const map = new Map<
    string,
    TransactionGroup
  >();

  for (const row of rows) {
    const noInvoice = getString(
      row,
      COL.NO_INVOICE
    );

    /**
     * skip invoice kosong
     */
    if (!noInvoice) {
      continue;
    }

    /**
     * create invoice group
     */
    if (!map.has(noInvoice)) {
      map.set(
        noInvoice,
        createTransactionGroup(row)
      );
    }

    const group = map.get(noInvoice)!;

    /**
     * =========================
     * ACCUMULATE FINANCIAL DATA
     * =========================
     */

    group.discount += getNumber(
      row,
      COL.DISKON
    );

    /**
     * DPP / PPN / TOTAL
     * WAJIB accumulate dari excel
     * karena ada formula +1 / -1 random
     */
    group.dpp += getNumber(
      row,
      COL.DPP
    );

    group.ppn += getNumber(
      row,
      COL.PPN
    );

    group.total += getNumber(
      row,
      COL.JUMLAH_DIBAYAR
    );

    /**
     * =========================
     * ITEM
     * =========================
     */

    const item = mapTransactionItem(row);

    /**
     * skip item kosong
     */
    if (!item.namaBarang) {
      continue;
    }

    group.items.push(item);

    /**
     * subtotal dari total item
     */
    group.subtotal += item.totalHarga;
  }

  return Array.from(map.values());
}