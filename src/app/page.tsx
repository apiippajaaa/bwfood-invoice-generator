"use client";

import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";

import { parseExcel } from "@/lib/parseExcel";

import type { TransactionGroup } from "@/types";

import { DropZone } from "@/components/DropZone";
import { TransactionTable } from "@/components/TransactionTable";
import { GenerateButton } from "@/components/GenerateButton";

import { InvoicePDF } from "@/templates/InvoicePDF";
import { SuratJalanPDF } from "@/templates/SuratJalanPDF";

import { Background } from "@/components/layouts/Background";

type DocType = "both" | "invoice" | "suratjalan";

const VERSION = "v2.1.0";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const sanitizeFileName = (value: string): string => {
  return value
    .replace(/\//g, "-")
    .replace(/[\\:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
};

const buildFileName = (
  documentNumber: string,
  relationName: string
): string => {
  const safeDocumentNumber = sanitizeFileName(documentNumber);
  const safeRelationName = sanitizeFileName(relationName);

  return `${safeDocumentNumber} - ${safeRelationName}.pdf`;
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function HomePage() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [fileName, setFileName] = useState("");

  const [docType] = useState<DocType>("both");

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

      setSelected(new Set(groups.map((group) => group.noInvoice)));

      setFileName(name);
    } catch (error) {
      console.error("Failed to parse Excel:", error);

      alert("Gagal membaca file Excel.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SELECTION HANDLERS
  |--------------------------------------------------------------------------
  */

  const handleToggle = useCallback((id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelected((previous) => {
      const allSelected = previous.size === transactions.length;

      return allSelected
        ? new Set()
        : new Set(transactions.map((transaction) => transaction.noInvoice));
    });
  }, [transactions]);

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const handleReset = useCallback(() => {
    setTransactions([]);
    setSelected(new Set());
    setFileName("");
    setProgress(0);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PDF GENERATION
  |--------------------------------------------------------------------------
  */

  const handleGenerate = useCallback(
    async (showSignatureAndStamp: boolean) => {
      const targets = transactions.filter((transaction) =>
        selected.has(transaction.noInvoice)
      );

      if (targets.length === 0 || isGenerating) {
        return;
      }

      setIsGenerating(true);
      setProgress(0);

      try {
        const zip = new JSZip();

        const totalFiles = targets.length * (docType === "both" ? 2 : 1);

        let completedFiles = 0;

        const updateProgress = () => {
          completedFiles++;

          setProgress(Math.round((completedFiles / totalFiles) * 100));
        };

        for (const transaction of targets) {
          /*
          |--------------------------------------------------------------------------
          | INVOICE
          |--------------------------------------------------------------------------
          */

          if (docType === "both" || docType === "invoice") {
            const invoiceBlob = await pdf(
              <InvoicePDF
                transaction={transaction}
                showSignatureAndStamp={showSignatureAndStamp}
              />
            ).toBlob();

            const invoiceFileName = buildFileName(
              transaction.noInvoice,
              transaction.namaRelasi
            );

            zip.file(`invoice/${invoiceFileName}`, invoiceBlob);

            updateProgress();
          }

          /*
          |--------------------------------------------------------------------------
          | SURAT JALAN
          |--------------------------------------------------------------------------
          */

          if (docType === "both" || docType === "suratjalan") {
            const suratJalanBlob = await pdf(
              <SuratJalanPDF transaction={transaction} />
            ).toBlob();

            const suratJalanFileName = buildFileName(
              transaction.noSJ,
              transaction.namaRelasi
            );

            zip.file(`surat-jalan/${suratJalanFileName}`, suratJalanBlob);

            updateProgress();
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

        const downloadUrl = URL.createObjectURL(zipBlob);

        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `DOKUMEN-${Date.now()}.zip`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } catch (error) {
        console.error("Failed to generate PDF:", error);

        alert("Gagal generate PDF.");
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [transactions, selected, docType, isGenerating]
  );

  /*
  |--------------------------------------------------------------------------
  | DERIVED STATE
  |--------------------------------------------------------------------------
  */

  const selectedCount = selected.size;

  const totalFiles = selectedCount * (docType === "both" ? 2 : 1);

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
              <span
                className="
                absolute inline-flex h-full w-full
                animate-ping rounded-full
                bg-sky-400 opacity-75
              "
              />

              <span
                className="
                relative inline-flex h-3 w-3
                rounded-full bg-sky-400
                shadow-[0_0_14px_rgba(56,189,248,0.9)]
              "
              />
            </div>

            <span
              className="
              text-sm font-medium uppercase
              tracking-[0.2em] text-white/40
            "
            >
              BW FOOD Document Generator
            </span>

            <span className="text-xs font-medium text-white/20">{VERSION}</span>
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
            {/* FILE INFORMATION */}
            <div
              className="
              flex flex-col gap-5
              rounded-3xl border border-white/10
              bg-white/5 p-5 backdrop-blur-xl
              lg:flex-row lg:items-center
              lg:justify-between
            "
            >
              {/* FILE INFO */}
              <div className="flex items-center gap-4">
                <div
                  className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-2xl bg-white/10
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

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/90">
                    {fileName}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {transactions.length} transaksi ditemukan
                  </p>
                </div>
              </div>

              {/* RESET BUTTON */}
              <button
                type="button"
                onClick={handleReset}
                className="
                  group relative overflow-hidden
                  rounded-2xl border border-white/10
                  bg-white/5 px-5 py-3
                  text-sm font-medium text-white/70
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:border-white/20
                  hover:bg-white/10 hover:text-white
                  active:scale-[0.98]
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

            {/* TRANSACTION TABLE */}
            <TransactionTable
              transactions={transactions}
              selected={selected}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
            />

            {/* FOOTER */}
            <div
              className="
              flex flex-col gap-5 pt-2
              lg:flex-row lg:items-center
              lg:justify-between
            "
            >
              {/* SELECTION INFORMATION */}
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

              {/* GENERATE COMPONENT */}
              <GenerateButton
                selectedCount={selectedCount}
                totalFiles={totalFiles}
                isGenerating={isGenerating}
                progress={progress}
                onGenerate={handleGenerate}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
