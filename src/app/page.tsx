"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip"; // npm install jszip
import { parseExcel } from "@/lib/parseExcel";
import { DropZone } from "@/components/DropZone";
import { TransactionTable } from "@/components/TransactionTable";
import { InvoicePDF } from "@/templates/InvoicePDF";
import { SuratJalanPDF } from "@/templates/SuratJalanPDF";
import type { TransactionGroup } from "@/types";

type DocType = "both" | "invoice" | "suratjalan";

export default function HomePage() {
  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [docType, setDocType] = useState<DocType>("both");

  const handleFile = useCallback((buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);
    try {
      const groups = parseExcel(buffer);
      setTransactions(groups);
      setSelected(new Set(groups.map((g) => g.noInvoice)));
      setFileName(name);
    } catch (e) {
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

  const handleGenerate = async () => {
    const targets = transactions.filter((t) => selected.has(t.noInvoice));
    if (targets.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    const zip = new JSZip();
    const total = targets.length * (docType === "both" ? 2 : 1);
    let done = 0;

    for (const t of targets) {
      if (docType === "both" || docType === "invoice") {
        const blob = await pdf(<InvoicePDF transaction={t} />).toBlob();
        zip.file(`invoice/${t.noInvoice.replace(/\//g, "-")}.pdf`, blob);
        done++;
        setProgress(Math.round((done / total) * 100));
      }
      if (docType === "both" || docType === "suratjalan") {
        const blob = await pdf(<SuratJalanPDF transaction={t} />).toBlob();
        zip.file(`surat-jalan/${t.noSJ.replace(/\//g, "-")}.pdf`, blob);
        done++;
        setProgress(Math.round((done / total) * 100));
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dokumen-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setIsGenerating(false);
    setProgress(0);
  };

  const selectedCount = selected.size;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <span className="text-white/40 text-sm tracking-widest uppercase font-medium">
              Document Generator
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Invoice & Surat Jalan
          </h1>
          <p className="text-white/40 mt-2 text-base">
            Upload data Excel, pilih transaksi, generate PDF dalam 1 klik.
          </p>
        </div>

        {/* Upload */}
        {transactions.length === 0 ? (
          <DropZone onFile={handleFile} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            {/* File info + reset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white/70"
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
                  <p className="text-white/80 text-sm font-medium">
                    {fileName}
                  </p>
                  <p className="text-white/40 text-xs">
                    {transactions.length} transaksi ditemukan
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTransactions([]);
                  setSelected(new Set());
                  setFileName("");
                }}
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Ganti file
              </button>
            </div>

            {/* Doc type selector */}
            <div className="flex gap-2">
              {(["both", "invoice", "suratjalan"] as DocType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      docType === type
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                >
                  {type === "both"
                    ? "Invoice + Surat Jalan"
                    : type === "invoice"
                    ? "Invoice Saja"
                    : "Surat Jalan Saja"}
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

            {/* Generate */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-white/40 text-sm">
                {selectedCount} dari {transactions.length} transaksi dipilih
                {selectedCount > 0 && (
                  <span className="ml-2 text-white/30">
                    → {selectedCount * (docType === "both" ? 2 : 1)} file PDF
                  </span>
                )}
              </p>
              <button
                onClick={handleGenerate}
                disabled={selectedCount === 0 || isGenerating}
                className={`
                  relative px-7 py-2.5 rounded-xl font-medium text-sm transition-all
                  ${
                    selectedCount === 0 || isGenerating
                      ? "bg-white/10 text-white/30 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90 active:scale-95"
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
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
          </div>
        )}
      </div>
    </main>
  );
}
