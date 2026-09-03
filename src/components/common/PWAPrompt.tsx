import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, Download, WifiOff, X } from "lucide-react";
import { usePWA } from "../../hooks/usePWA";

export const PWAPrompt: React.FC = () => {
  const { isInstallable, isOffline, installApp } = usePWA();
  const [dismissInstall, setDismissInstall] = React.useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: ", r);
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
  });

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500/90 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md backdrop-blur-md">
          <WifiOff className="w-4 h-4" />
          <span>
            Mode Offline: Anda tetap dapat melihat data yang tersimpan di memori
            perangkat.
          </span>
        </div>
      )}

      {/* New Update Available Banner */}
      {needRefresh && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#131C2E]/95 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">
                Versi Baru Tersedia!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Pembaruan aplikasi telah diunduh. Muat ulang untuk mendapatkan
                fitur terbaru.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  Muat Ulang
                </button>
                <button
                  onClick={() => setNeedRefresh(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
            <button
              onClick={() => setNeedRefresh(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Install Prompt Banner (if installable and not dismissed) */}
      {isInstallable && !dismissInstall && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] bg-[#0D131F]/95 border border-emerald-500/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-glow-emerald">
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>

            <div className="min-w-0 pr-0.5">
              <p className="text-xs font-bold text-white whitespace-nowrap">
                Install App
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={installApp}
                className="px-2.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] sm:text-xs transition-transform active:scale-95 shadow-sm shadow-emerald-500/20"
              >
                Install
              </button>
              <button
                onClick={() => setDismissInstall(true)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded-full"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
