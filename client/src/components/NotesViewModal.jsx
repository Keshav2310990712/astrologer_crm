import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';
import { X, BookOpen, Check, Edit2 } from 'lucide-react';

const NotesViewModal = ({ isOpen, onClose, consultation, onUpdate }) => {
  const { showToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (consultation) {
      setNotes(consultation.notes || '');
    }
    setIsEditing(false);
  }, [consultation, isOpen]);

  if (!isOpen || !consultation) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/consultations/${consultation._id}`, {
        notes: notes
      });
      if (response.data.success) {
        showToast('Session notes updated successfully.', 'success');
        onUpdate();
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update notes error:', err);
      showToast(err.response?.data?.message || 'Failed to update session notes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="glass-panel-glow border-cosmic-800/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-slide-up font-sans">
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
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
            Session Notes
          </h3>
        </div>

        {/* Client details context */}
        <div className="text-xs text-cosmic-300/60 mb-4">
          Client: <span className="font-semibold text-slate-200">{consultation.client?.name}</span>
        </div>

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
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setNotes(consultation.notes || '');
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={loading}
                  size="sm"
                  className="gap-1.5"
                >
                  <Check className="h-4 w-4" /> Save Notes
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                size="sm"
                className="gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Notes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesViewModal;
