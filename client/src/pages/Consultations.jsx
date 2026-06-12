import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ConsultationFormModal from '../components/ConsultationFormModal';
import NotesViewModal from '../components/NotesViewModal';
import { 
  Plus, Calendar, Clock, DollarSign, BookOpen, AlertCircle, RefreshCw, Edit2, Trash2, ChevronRight, CheckCircle2, XCircle, Sparkles 
} from 'lucide-react';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const fetchConsultations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/consultations');
      if (response.data.success) {
        setConsultations(response.data.data);
      }
    } catch (err) {
      console.error('Fetch consultations error:', err);
      setError('Failed to align consultation schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleRefresh = () => {
    fetchConsultations();
  };

  const handleBookClick = () => {
    setSelectedConsultation(null);
    setFormOpen(true);
  };

  const handleEditClick = (consultation) => {
    setSelectedConsultation(consultation);
    setFormOpen(true);
  };

  const handleNotesClick = (consultation) => {
    setSelectedConsultation(consultation);
    setNotesOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this consultation?')) return;
    try {
      const response = await api.delete(`/consultations/${id}`);
      if (response.data.success) {
        fetchConsultations();
      }
    } catch (err) {
      console.error('Delete consultation error:', err);
      alert('Failed to delete consultation');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await api.put(`/consultations/${id}`, { status: newStatus });
      if (response.data.success) {
        // Update item local state to avoid full reload flicker
        setConsultations(consultations.map(c => c._id === id ? response.data.data : c));
      }
    } catch (err) {
      console.error('Change status error:', err);
      alert('Failed to update consultation status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Formatting helpers
  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20';
      case 'Cancelled':
        return 'bg-rose-950/20 text-rose-400 border-rose-500/20';
      case 'Scheduled':
      default:
        return 'bg-amber-950/20 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Background glowing effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0 animate-pulse-slow"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-cosmic-900/50 pb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-slate-100 sm:text-4xl tracking-wide flex items-center gap-2">
              Consultation Schedule <Sparkles className="h-6 w-6 text-gold-400 animate-float" />
            </h1>
            <p className="mt-2 text-sm text-cosmic-300/60">
              Track active appointments, record chart readings, and log session invoices.
            </p>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4 gap-2">
            <button 
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-cosmic-800/40 text-sm font-semibold text-slate-200 bg-cosmic-950/40 hover:bg-cosmic-900/40 transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleBookClick}
              className="inline-flex items-center px-4.5 py-2.5 rounded-xl border border-transparent text-sm font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/15"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Consultation
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Calendar / Consultation List Table */}
        <div className="glass-panel rounded-2xl border border-cosmic-800/30 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-t-cosmic-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-lg">✨</div>
              </div>
              <p className="text-xs text-cosmic-400 uppercase tracking-widest animate-pulse">Checking alignments...</p>
            </div>
          ) : consultations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cosmic-900/40 text-left text-sm">
                <thead>
                  <tr className="bg-cosmic-950/40 text-cosmic-300/60 uppercase text-[10px] tracking-wider font-semibold border-b border-cosmic-900/40">
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Duration & Fee</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4">Status Alignment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-900/10">
                  {consultations.map((c) => (
                    <tr key={c._id} className="hover:bg-cosmic-900/10 transition-colors group">
                      {/* Client info */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {c.client ? (
                          <div>
                            <div className="text-sm font-semibold text-slate-200 group-hover:text-gold-200 transition-colors">
                              {c.client.name}
                            </div>
                            <div className="text-xs text-cosmic-300/50 mt-0.5">{c.client.email}</div>
                          </div>
                        ) : (
                          <span className="text-rose-400/60 italic text-xs">Unknown Client</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cosmic-400" />
                          {formatDateTime(c.date)}
                        </span>
                      </td>

                      {/* Duration & Fee */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="text-xs text-slate-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cosmic-400" /> {c.duration} Min
                          </div>
                          <div className="text-xs text-gold-300 font-semibold flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-gold-400" /> {formatCurrency(c.fee)}
                          </div>
                        </div>
                      </td>

                      {/* Notes Trigger */}
                      <td className="px-6 py-4.5">
                        <button
                          onClick={() => handleNotesClick(c)}
                          className="text-xs font-semibold text-slate-300 hover:text-gold-300 hover:underline flex items-center gap-1.5"
                          title="Open session notes"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cosmic-400" />
                          {c.notes ? 'View Notes' : 'Add Notes'}
                        </button>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="relative inline-block w-36">
                          {updatingId === c._id ? (
                            <div className="h-5 w-5 border border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <select
                              value={c.status}
                              onChange={(e) => handleStatusChange(c._id, e.target.value)}
                              className={`w-full py-1 px-2.5 rounded-lg border text-xs font-medium appearance-none bg-cosmic-950 transition-colors ${getStatusStyle(c.status)}`}
                            >
                              <option value="Scheduled" className="bg-cosmic-950 text-amber-400">Scheduled</option>
                              <option value="Completed" className="bg-cosmic-950 text-emerald-400">Completed</option>
                              <option value="Cancelled" className="bg-cosmic-950 text-rose-400">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 rounded-lg text-cosmic-400 hover:text-gold-300 hover:bg-cosmic-900/40 border border-transparent hover:border-cosmic-800/30 transition-all duration-200"
                            title="Reschedule session"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(c._id)}
                            className="p-1.5 rounded-lg text-cosmic-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/20 transition-all duration-200"
                            title="Cancel Consultation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
              <div className="p-4 rounded-full bg-cosmic-950/60 border border-cosmic-800/40 text-cosmic-400 mb-4 animate-float">
                <Calendar className="h-10 w-10 text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Empty Calendar Schedule</h3>
              <p className="text-xs text-cosmic-300/50 mt-1 leading-relaxed">
                You do not have any consultations logged under your schedule yet. Align a new booking session to begin.
              </p>
              <button
                onClick={handleBookClick}
                className="mt-5 inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Book First Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book / Edit Modal */}
      <ConsultationFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        consultationData={selectedConsultation}
        onSave={fetchConsultations}
      />

      {/* View Notes Modal */}
      <NotesViewModal
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        consultation={selectedConsultation}
        onUpdate={fetchConsultations}
      />
    </div>
  );
};

export default Consultations;
