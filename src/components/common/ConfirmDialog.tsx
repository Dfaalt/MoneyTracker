import React from 'react';
import { Modal } from './Modal';
import { formatRupiah } from '../../lib/utils';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemDescription?: string;
  itemAmount?: number;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete transaction?',
  itemDescription,
  itemAmount,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <p>Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus permanen.</p>
        </div>

        {(itemDescription || itemAmount !== undefined) && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            {itemDescription && (
              <p className="text-base font-semibold text-white truncate">{itemDescription}</p>
            )}
            {itemAmount !== undefined && (
              <p className="text-lg font-mono font-bold text-rose-400 mt-1">
                {formatRupiah(itemAmount)}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
