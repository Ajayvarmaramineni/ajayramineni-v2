"use client";

import { X, Download, Image, FileText } from "lucide-react";

interface ExportModalProps {
  open:    boolean;
  onClose: () => void;
}

export default function ExportModal({ open, onClose }: ExportModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Download size={15} className="text-sky-400" />
              <span className="text-sm font-bold text-slate-200">Export Dashboard</span>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Options */}
          <div className="px-5 py-4 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose an export format for your dashboard.
            </p>

            {/* PNG option */}
            <button
              onClick={() => {
                alert("PNG export coming soon! The dashboard will be captured as an image.");
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-600
                         bg-slate-700/40 hover:bg-slate-700/70 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Image size={14} className="text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Export as PNG</p>
                <p className="text-xs text-slate-400">Screenshot of the dashboard</p>
              </div>
            </button>

            {/* PDF option — coming soon */}
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/50
                            bg-slate-800/30 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
                <FileText size={14} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-400">Export as PDF</p>
                  <span className="text-[10px] font-bold bg-amber-500/20 border border-amber-500/30
                                   text-amber-400 px-1.5 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-500">Multi-page PDF with branding</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-800/30">
            <p className="text-[10px] text-slate-600 text-center">
              PDF export will be available in Phase 2
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
