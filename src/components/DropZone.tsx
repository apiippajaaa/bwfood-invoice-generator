import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFile: (buffer: ArrayBuffer, name: string) => void;
  isLoading: boolean;
}

export function DropZone({ onFile, isLoading }: Props) {
  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          onFile(e.target.result, file.name);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-300 group
        ${
          isDragActive
            ? "border-white/60 bg-white/5"
            : "border-white/20 hover:border-white/40 hover:bg-white/5"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <svg
            className="w-7 h-7 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-white/80 font-medium">
            {isDragActive
              ? "Lepaskan file di sini..."
              : "Drop file Excel atau klik untuk pilih"}
          </p>
          <p className="text-white/40 text-sm mt-1">
            Format: .xlsx · Sheet 1 sebagai data utama
          </p>
        </div>
      </div>
    </div>
  );
}
