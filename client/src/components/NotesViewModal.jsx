import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, BookOpen, Check, Edit2 } from 'lucide-react';

const NotesViewModal = ({ isOpen, onClose, consultation, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (consultation) {
      setNotes(consultation.notes || '');
    }
    setIsEditing(false);
    setError('');
  }, [consultation, isOpen]);

  if (!isOpen || !consultation) return null;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.put(`/consultations/${consultation._id}`, {
        notes: notes
      });
      if (response.data.success) {
        onUpdate();
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update notes error:', err);
      setError('Failed to update session notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="glass-panel-glow border-cosmic-800/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-slide-up">
        {/* Close */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-lg text-cosmic-400 hover:text-rose-400 hover:bg-cosmic-900/40 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 text-gold-400 mb-4 border-b border-cosmic-900/30 pb-3">
          <BookOpen className="h-5 w-5 shrink-0" />
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-sans">
            Session Notes
          </h3>
        </div>

        {/* Client details context */}
        <div className="text-xs text-cosmic-300/60 mb-4">
          Client: <span className="font-semibold text-slate-200">{consultation.client?.name}</span>
        </div>

        {error && (
          <p className="text-xs text-rose-400 mb-3 bg-rose-950/10 border border-rose-900/20 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Content */}
        <div className="space-y-4">
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="6"
              className="glass-input block w-full p-3.5 rounded-xl text-sm placeholder-cosmic-400/30"
              placeholder="Record details of Kundali charts, card alignments, or client history..."
            />
          ) : (
            <div className="glass-panel border-cosmic-800/10 bg-cosmic-950/40 rounded-xl p-4 min-h-[120px] text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {notes || (
                <span className="text-cosmic-300/35 italic">No session notes recorded. Click edit to add notes.</span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end pt-2">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNotes(consultation.notes || '');
                  }}
                  className="px-4.5 py-2 rounded-xl border border-cosmic-800/40 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-cosmic-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Save Notes
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-cosmic-900/60 hover:bg-cosmic-900/80 border border-cosmic-800/40 transition-all flex items-center gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Notes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesViewModal;
