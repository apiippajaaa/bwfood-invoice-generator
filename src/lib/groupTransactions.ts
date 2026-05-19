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

    // skip invoice kosong
    if (!noInvoice) {
      continue;
    }

    // create invoice group
    if (!map.has(noInvoice)) {
      map.set(
        noInvoice,
        createTransactionGroup(row)
      );
    }

    const group = map.get(noInvoice)!;

    /**
     * accumulate discount per row
     * because one invoice can have
     * multiple rows with discounts
     */
    group.discount += getNumber(
      row,
      COL.DISKON
    );

    const item = mapTransactionItem(row);

    // skip item kosong
    if (!item.namaBarang) {
      continue;
    }

    group.items.push(item);

    // accumulate subtotal from items only
    group.subtotal += item.totalHarga;
  }

  return Array.from(map.values());
}