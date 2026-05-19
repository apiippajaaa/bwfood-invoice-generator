"use client";

import { useState, useCallback, useMemo } from "react";

import { pdf } from "@react-pdf/renderer";

import JSZip from "jszip";

import { parseExcel } from "@/lib/parseExcel";

import type { TransactionGroup } from "@/types";

import { DropZone } from "@/components/DropZone";
import { TransactionTable } from "@/components/TransactionTable";

import { InvoicePDF } from "@/templates/InvoicePDF";
import { SuratJalanPDF } from "@/templates/SuratJalanPDF";

import { Background } from "@/components/layouts/Background";

type DocType = "both" | "invoice" | "suratjalan";

const DOC_TYPES: {
  value: DocType;
  label: string;
}[] = [
  {
    value: "both",
    label: "Invoice + Surat Jalan",
  },
  {
    value: "invoice",
    label: "Invoice Saja",
  },
  {
    value: "suratjalan",
    label: "Surat Jalan Saja",
  },
];

const TAX_OPTIONS = [10, 11, 12];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const sanitizeFileName = (value: string) => {
  return value
    .replace(/\//g, "-")
    .replace(/[\\:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
};

const buildFileName = (documentNumber: string, relationName: string) => {
  const safeDocumentNumber = sanitizeFileName(documentNumber);

  const safeRelationName = sanitizeFileName(relationName);

  return `${safeDocumentNumber} - ${safeRelationName}.pdf`;
};

export default function HomePage() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [fileName, setFileName] = useState("");

  const [docType, setDocType] = useState<DocType>("both");

  const [taxRate, setTaxRate] = useState<number>(11);

  const [isLoading, setIsLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [progress, setProgress] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | FILE HANDLER
  |--------------------------------------------------------------------------
  */

  const handleFile = useCallback((buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);

    try {
      const groups = parseExcel(buffer);

      setTransactions(groups);

      setSelected(new Set(groups.map((g) => g.noInvoice)));

      setFileName(name);
    } catch (error) {
      console.error(error);

      alert("Gagal membaca file Excel.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SELECT HANDLER
  |--------------------------------------------------------------------------
  */

  const handleToggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === transactions.length
        ? new Set()
        : new Set(transactions.map((t) => t.noInvoice))
    );
  }, [transactions]);

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setTransactions([]);

    setSelected(new Set());

    setFileName("");

    setProgress(0);

    setTaxRate(11);

    setDocType("both");
  };

  /*
  |--------------------------------------------------------------------------
  | GENERATE PDF
  |--------------------------------------------------------------------------
  */

  const handleGenerate = async () => {
    const targets = transactions.filter((t) => selected.has(t.noInvoice));

    if (targets.length === 0) {
      return;
    }

    setIsGenerating(true);

    setProgress(0);

    try {
      const zip = new JSZip();

      const totalFiles = targets.length * (docType === "both" ? 2 : 1);

      let done = 0;

      for (const transaction of targets) {
        /*
        |--------------------------------------------------------------------------
        | INVOICE PDF
        |--------------------------------------------------------------------------
        */

        if (docType === "both" || docType === "invoice") {
          const blob = await pdf(
            <InvoicePDF transaction={transaction} taxRate={taxRate} />
          ).toBlob();

          const invoiceFileName = buildFileName(
            transaction.noInvoice,
            transaction.namaRelasi
          );

          zip.file(`invoice/${invoiceFileName}`, blob);

          done++;

          setProgress(Math.round((done / totalFiles) * 100));
        }

        /*
        |--------------------------------------------------------------------------
        | SURAT JALAN PDF
        |--------------------------------------------------------------------------
        */

        if (docType === "both" || docType === "suratjalan") {
          const blob = await pdf(
            <SuratJalanPDF transaction={transaction} />
          ).toBlob();

          const suratJalanFileName = buildFileName(
            transaction.noSJ,
            transaction.namaRelasi
          );

          zip.file(`surat-jalan/${suratJalanFileName}`, blob);

          done++;

          setProgress(Math.round((done / totalFiles) * 100));
        }
      }

      /*
      |--------------------------------------------------------------------------
      | EXPORT ZIP
      |--------------------------------------------------------------------------
      */

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `DOKUMEN-${Date.now()}.zip`;

      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Gagal generate PDF.");
    } finally {
      setIsGenerating(false);

      setProgress(0);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DERIVED STATE
  |--------------------------------------------------------------------------
  */

  const selectedCount = selected.size;

  const totalFiles = useMemo(() => {
    return selectedCount * (docType === "both" ? 2 : 1);
  }, [selectedCount, docType]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <Background />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* HEADER */}
        <header className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
            </div>

            <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
              BW FOOD Document Generator
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Invoice & Surat Jalan
          </h1>

          <p className="mt-2 text-base text-white/40">
            Upload Excel, pilih transaksi, lalu generate PDF otomatis.
          </p>
        </header>

        {/* EMPTY STATE */}
        {transactions.length === 0 ? (
          <DropZone onFile={handleFile} isLoading={isLoading} />
        ) : (
          <section className="space-y-6">
            {/* FILE INFO */}
            <div
              className="
                flex flex-col gap-5
                rounded-3xl
                border border-white/10
                bg-white/5
                p-5
                backdrop-blur-xl

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-white/10
                  "
                >
                  <svg
                    className="h-5 w-5 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-white/90">
                    {fileName}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {transactions.length} transaksi ditemukan
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <button
                onClick={handleReset}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-3
                  text-sm font-medium
                  text-white/70
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                  active:scale-[0.98]
                  cursor-pointer
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="
                      h-4 w-4
                      transition-transform duration-300
                      group-hover:-rotate-12
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 015.418 15m13.001 0H15"
                    />
                  </svg>
                  Ganti File
                </span>
              </button>
            </div>

            {/* CONTROLS */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* DOC TYPE */}
              <div
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-xl
                "
              >
                <p className="mb-4 text-sm font-medium text-white/50">
                  Jenis Dokumen
                </p>

                <div className="flex flex-wrap gap-2">
                  {DOC_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setDocType(type.value)}
                      className={`
                        rounded-xl px-4 py-2
                        text-sm font-medium
                        transition-all
                        cursor-pointer

                        ${
                          docType === type.value
                            ? "bg-white text-black"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                        }
                      `}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAX */}
              <div
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-xl
                "
              >
                <p className="mb-4 text-sm font-medium text-white/50">
                  Tarif PPN
                </p>

                <div className="flex flex-wrap gap-2">
                  {TAX_OPTIONS.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setTaxRate(rate)}
                      className={`
                        rounded-xl px-4 py-2
                        text-sm font-medium
                        transition-all
                        cursor-pointer

                        ${
                          taxRate === rate
                            ? "bg-white text-black"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                        }
                      `}
                    >
                      PPN {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <TransactionTable
              transactions={transactions}
              selected={selected}
              taxRate={taxRate}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
            />

            {/* FOOTER */}
            <div
              className="
                flex flex-col gap-5
                pt-2

                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* INFO */}
              <div className="space-y-1">
                <p className="text-sm text-white/50">
                  {selectedCount} dari {transactions.length} transaksi dipilih
                </p>

                {selectedCount > 0 && (
                  <p className="text-sm text-white/30">
                    → {totalFiles} file PDF akan dibuat
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={selectedCount === 0 || isGenerating}
                className={`
                  relative rounded-2xl
                  px-7 py-3
                  text-sm font-medium
                  transition-all
                  cursor-pointer

                  ${
                    selectedCount === 0 || isGenerating
                      ? "cursor-not-allowed bg-white/10 text-white/30"
                      : "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating... {progress}%
                  </span>
                ) : (
                  "Generate PDF →"
                )}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
