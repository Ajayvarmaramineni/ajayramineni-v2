"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { formatBytes, isAcceptedFile, isFileTooLarge, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_MB } from "@/lib/helpers";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileAccepted, disabled = false }: DropZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      if (!isAcceptedFile(file)) {
        setError(`Unsupported file type. Please upload ${ACCEPTED_EXTENSIONS.join(", ")}.`);
        return;
      }
      if (isFileTooLarge(file)) {
        setError(`File too large. Max size is ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      setSelectedFile(file);
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
    accept: {
      "text/csv":                                                    [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel":                                    [".xls"],
      "application/json":                                            [".json"],
    },
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center
          transition-all duration-200 cursor-pointer
          ${isDragActive
            ? "border-sky-400 bg-sky-900/20"
            : selectedFile
            ? "border-green-600 bg-green-900/10"
            : "border-slate-600 bg-slate-800/40 hover:border-sky-600 hover:bg-slate-800/60"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* File selected state */
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet size={40} className="text-green-400" />
            <div>
              <p className="font-semibold text-slate-100">{selectedFile.name}</p>
              <p className="text-sm text-slate-400 mt-0.5">{formatBytes(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearFile}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors mt-1"
            >
              <X size={12} /> Remove file
            </button>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center
              ${isDragActive ? "bg-sky-900/60 border-sky-600" : "bg-slate-700 border-slate-600"}
              border-2 transition-colors`}>
              <Upload size={24} className={isDragActive ? "text-sky-400" : "text-slate-400"} />
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                {isDragActive ? "Drop it here!" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                or <span className="text-sky-400 underline underline-offset-2">browse to upload</span>
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Supports {ACCEPTED_EXTENSIONS.join(", ")} · Max {MAX_FILE_SIZE_MB} MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
