
"use client";

import { useState } from "react";

type GenerateButtonProps = {
  selectedCount: number;
  totalFiles: number;
  isGenerating: boolean;
  progress: number;
  onGenerate: (showSignatureAndStamp: boolean) => void;
};

type GenerateOption = {
  value: boolean;
  title: string;
  description: string;
};

const GENERATE_OPTIONS: GenerateOption[] = [
  {
    value: true,
    title: "Dengan Tanda Tangan & Logo",
    description:
      "Dokumen dilengkapi logo perusahaan, tanda tangan, dan stempel.",
  },
  {
    value: false,
    title: "Tanpa Tanda Tangan & Logo",
    description:
      "Dokumen dibuat dalam versi kosong tanpa identitas visual dan pengesahan.",
  },
];

export function GenerateButton({
  selectedCount,
  totalFiles,
  isGenerating,
  progress,
  onGenerate,
}: GenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignatureAndStamp, setShowSignatureAndStamp] =
    useState(true);

  const isDisabled = selectedCount === 0 || isGenerating;

  const handleGenerate = () => {
    onGenerate(showSignatureAndStamp);
    setIsOpen(false);
  };

  return (
    <>
      {/* GENERATE BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        className={`
          relative rounded-2xl
          px-7 py-3
          text-sm font-medium
          transition-all duration-200

          ${
            isDisabled
              ? "cursor-not-allowed bg-white/10 text-white/30"
              : "cursor-pointer bg-white text-black hover:bg-white/90 active:scale-[0.98]"
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

      {/* GENERATE MODAL */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-modal-title"
            className="
              w-full max-w-lg
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-[#111318]
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}
            <div className="border-b border-white/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="generate-modal-title"
                    className="text-xl font-semibold text-white"
                  >
                    Generate Dokumen
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    Tentukan tampilan dokumen yang ingin dibuat.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup modal"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    text-white/40
                    transition-colors
                    hover:bg-white/10 hover:text-white
                  "
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="space-y-3 p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
                Pilihan tampilan
              </p>

              {GENERATE_OPTIONS.map((option) => {
                const isSelected =
                  showSignatureAndStamp === option.value;

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() =>
                      setShowSignatureAndStamp(option.value)
                    }
                    aria-pressed={isSelected}
                    className={`
                      flex w-full items-start gap-4
                      rounded-2xl border p-4
                      text-left
                      transition-all duration-200

                      ${
                        isSelected
                          ? "border-sky-400/50 bg-sky-400/[0.08]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    {/* RADIO INDICATOR */}
                    <div
                      className={`
                        mt-0.5 flex h-5 w-5 shrink-0
                        items-center justify-center
                        rounded-full border
                        ${
                          isSelected
                            ? "border-sky-400 bg-sky-400"
                            : "border-white/30"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-black" />
                      )}
                    </div>

                    {/* OPTION INFO */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-white"
                            : "text-white/80"
                        }`}
                      >
                        {option.title}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-white/40">
                        {option.description}
                      </p>
                    </div>

                    {/* SELECTED INDICATOR */}
                    {isSelected && (
                      <svg
                        className="h-5 w-5 shrink-0 text-sky-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12l4 4L19 6"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-white/10 p-6">
              <div className="mb-5 flex items-center justify-between text-xs">
                <span className="text-white/40">
                  Transaksi dipilih
                </span>

                <span className="font-medium text-white/80">
                  {selectedCount} transaksi · {totalFiles} PDF
                </span>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex-1 rounded-xl
                    border border-white/10
                    px-5 py-3
                    text-sm font-medium text-white/60
                    transition-colors
                    hover:bg-white/5 hover:text-white
                  "
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="
                    flex-1 rounded-xl
                    bg-white px-5 py-3
                    text-sm font-semibold text-black
                    transition-all
                    hover:bg-white/90
                    active:scale-[0.98]
                  "
                >
                  Generate PDF →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
