"use client";

import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";

import { parseExcel } from "@/lib/parseExcel";

import { DropZone } from "@/components/DropZone";
import { TransactionTable } from "@/components/TransactionTable";

import { InvoicePDF } from "@/templates/InvoicePDF";
import { SuratJalanPDF } from "@/templates/SuratJalanPDF";

import type { TransactionGroup } from "@/types";
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

export default function HomePage() {
  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [fileName, setFileName] = useState("");
  const [docType, setDocType] = useState<DocType>("both");

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [progress, setProgress] = useState(0);

  const handleFile = useCallback((buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);

    try {
      const groups = parseExcel(buffer);

      setTransactions(groups);
      setSelected(new Set(groups.map((g) => g.noInvoice)));
      setFileName(name);
    } catch {
      alert("Gagal membaca file. Pastikan format sesuai dengan template.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const handleReset = () => {
    setTransactions([]);
    setSelected(new Set());
    setFileName("");
    setProgress(0);
  };

  const handleGenerate = async () => {
    const targets = transactions.filter((t) => selected.has(t.noInvoice));

    if (targets.length === 0) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const zip = new JSZip();

      const total = targets.length * (docType === "both" ? 2 : 1);

      let done = 0;

      for (const transaction of targets) {
        if (docType === "both" || docType === "invoice") {
          const blob = await pdf(
            <InvoicePDF transaction={transaction} />
          ).toBlob();

          zip.file(
            `invoice/${transaction.noInvoice.replace(/\//g, "-")}.pdf`,
            blob
          );

          done++;

          setProgress(Math.round((done / total) * 100));
        }

        if (docType === "both" || docType === "suratjalan") {
          const blob = await pdf(
            <SuratJalanPDF transaction={transaction} />
          ).toBlob();

          zip.file(
            `surat-jalan/${transaction.noSJ.replace(/\//g, "-")}.pdf`,
            blob
          );

          done++;

          setProgress(Math.round((done / total) * 100));
        }
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `dokumen-${Date.now()}.zip`;

      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const selectedCount = selected.size;

  const totalFiles = selectedCount * (docType === "both" ? 2 : 1);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <Background />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            {/* Animated Dot */}
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
            </div>

            <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
              Document Generator
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Invoice & Surat Jalan
          </h1>

          <p className="mt-2 text-base text-white/40">
            Upload data Excel, pilih transaksi, generate PDF dalam 1 klik.
          </p>
        </header>

        {/* Upload */}
        {transactions.length === 0 ? (
          <DropZone onFile={handleFile} isLoading={isLoading} />
        ) : (
          <section className="space-y-6">
            {/* File Info */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
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
                  <p className="text-sm font-medium text-white/80">
                    {fileName}
                  </p>

                  <p className="text-xs text-white/40">
                    {transactions.length} transaksi ditemukan
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="
    group relative overflow-hidden rounded-2xl
    border border-white/10 bg-white/[0.04]
    px-5 py-2.5
    text-sm font-medium text-white/70
    backdrop-blur-xl
    transition-all duration-300
    hover:border-white/20
    hover:bg-white/[0.08]
    hover:text-white
    hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]
    active:scale-[0.98]
    cursor-pointer
  "
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-12deg]"
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

                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </div>

            {/* Document Type */}
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDocType(type.value)}
                  className={`
                    rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer
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

            {/* Table */}
            <TransactionTable
              transactions={transactions}
              selected={selected}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
            />

            {/* Footer Action */}
            <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/40">
                {selectedCount} dari {transactions.length} transaksi dipilih
                {selectedCount > 0 && (
                  <span className="ml-2 text-white/30">
                    → {totalFiles} file PDF
                  </span>
                )}
              </p>

              <button
                onClick={handleGenerate}
                disabled={selectedCount === 0 || isGenerating}
                className={`
                  relative rounded-2xl px-7 py-3 text-sm font-medium transition-all cursor-pointer
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
