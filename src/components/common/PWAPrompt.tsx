import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Download, WifiOff, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const PWAPrompt: React.FC = () => {
  const { isInstallable, isOffline, installApp } = usePWA();
  const [dismissInstall, setDismissInstall] = React.useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500/90 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md backdrop-blur-md">
          <WifiOff className="w-4 h-4" />
          <span>Mode Offline: Anda tetap dapat melihat data yang tersimpan di memori perangkat.</span>
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
              <h4 className="text-sm font-bold text-white">Versi Baru Tersedia!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Pembaruan aplikasi telah diunduh. Muat ulang untuk mendapatkan fitur terbaru.
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
        <div className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-40 max-w-xs w-full bg-[#0D131F]/95 border border-emerald-500/30 rounded-2xl p-3.5 shadow-xl shadow-black/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-glow-emerald">
                <Download className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Install MoneyTracker</p>
                <p className="text-[10px] text-slate-400">Akses cepat & hemat kuota</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={installApp}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-sm"
              >
                Install
              </button>
              <button
                onClick={() => setDismissInstall(true)}
                className="p-1 text-slate-400 hover:text-slate-200"
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
