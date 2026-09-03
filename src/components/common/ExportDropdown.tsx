import React, { useState, useRef, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { exportToExcel, exportToPDF } from "../../lib/exportService";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";

interface ExportDropdownProps {
  label?: string;
  align?: "left" | "right" | "auto";
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  label = "Export Report",
  align = "auto",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    monthlyTransactions,
    summary,
    categorySummaries,
    selectedMonth,
    showToast,
  } = useFinance();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportExcel = async () => {
    setIsExporting("excel");
    try {
      exportToExcel({
        transactions: monthlyTransactions,
        summary,
        categorySummaries,
        month: selectedMonth,
        userName: user?.name || "User",
      });
      showToast({
        title: "Export Excel Berhasil!",
        message: `File Excel periode ${selectedMonth} berhasil diunduh.`,
        type: "success",
      });
      setIsOpen(false);
    } catch (err: any) {
      showToast({
        title: "Export Excel Gagal",
        message: err.message || "Terjadi kesalahan saat membuat file Excel.",
        type: "error",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting("pdf");
    try {
      exportToPDF({
        transactions: monthlyTransactions,
        summary,
        categorySummaries,
        month: selectedMonth,
        userName: user?.name || "User",
      });
      showToast({
        title: "Export PDF Berhasil!",
        message: `File PDF periode ${selectedMonth} berhasil diunduh.`,
        type: "success",
      });
      setIsOpen(false);
    } catch (err: any) {
      showToast({
        title: "Export PDF Gagal",
        message: err.message || "Terjadi kesalahan saat membuat file PDF.",
        type: "error",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const alignClass =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-0 sm:left-auto sm:right-0";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={Boolean(isExporting)}
        className={`px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
          isOpen ? "ring-2 ring-emerald-500/40 border-emerald-500/50" : ""
        }`}
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span>{isExporting ? "Generating..." : label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${alignClass} mt-2 w-64 sm:w-72 max-w-[calc(100vw-32px)] rounded-2xl glass-modal border border-slate-700/80 shadow-2xl p-1.5 z-40 animate-scale-in`}
        >
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pilihan Format Export
            </p>
            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
              Periode: {selectedMonth}
            </p>
          </div>

          <div className="space-y-1">
            {/* Excel Option */}
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={Boolean(isExporting)}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                    Microsoft Excel (.xlsx)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  Lengkap 3 Sheet (Transaksi, Kategori, Summary)
                </p>
              </div>
            </button>

            {/* PDF Option */}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={Boolean(isExporting)}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-rose-300">
                    Dokumen PDF (.pdf)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  Format cetak rapi & tabel analitik berwarna
                </p>
              </div>
            </button>
          </div>

          <div className="pt-2 mt-1 border-t border-slate-800/60 px-2 pb-1 text-center">
            <span className="text-[10px] text-slate-400">
              Total {monthlyTransactions.length} transaksi akan diexport
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
