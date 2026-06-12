import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, clientName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="glass-panel-glow border-rose-500/20 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-slide-up">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-lg text-cosmic-400 hover:text-rose-400 hover:bg-cosmic-900/40 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon and Header */}
        <div className="flex items-center space-x-3 text-rose-400 mb-4">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Dissolve Client Connection
          </h3>
        </div>

        {/* Body Description */}
        <div className="space-y-3 text-sm text-slate-300 mb-6">
          <p>
            Are you sure you want to delete <span className="font-bold text-gold-300">{clientName}</span> from your client registry?
          </p>
          <p className="text-xs text-rose-300/60 leading-relaxed bg-rose-950/10 border border-rose-900/20 p-3 rounded-xl">
            <strong>Warning:</strong> This operation will permanently remove all historical charts and scheduled consultations associated with this client. This action cannot be reversed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl border border-cosmic-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-cosmic-900/30 transition-all"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center justify-center min-w-[90px]"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Dissolve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
