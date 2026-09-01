import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah } from '../../lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';
        let borderColor = 'border-emerald-500/30';
        let bgGradient = 'from-emerald-950/90 to-slate-900/95';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
          borderColor = 'border-rose-500/30';
          bgGradient = 'from-rose-950/90 to-slate-900/95';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
          borderColor = 'border-amber-500/30';
          bgGradient = 'from-amber-950/90 to-slate-900/95';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-cyan-400';
          borderColor = 'border-cyan-500/30';
          bgGradient = 'from-cyan-950/90 to-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} bg-gradient-to-r ${bgGradient} backdrop-blur-xl shadow-2xl animate-slide-up text-slate-100 transition-all`}
          >
            <div className={`mt-0.5 p-1 rounded-lg bg-slate-900/60 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight text-white">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
              {toast.details && toast.details.amount !== undefined && (
                <div className="mt-2 text-xs flex items-center justify-between font-mono bg-slate-900/70 py-1 px-2 rounded-md border border-slate-700/50">
                  <span className="truncate text-slate-300">{toast.details.description || 'Transaksi'}</span>
                  <span
                    className={`font-semibold ${
                      toast.details.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {toast.details.type === 'income' ? '+' : '-'}
                    {formatRupiah(toast.details.amount)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
