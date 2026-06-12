import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConsultationFormModal from '../components/ConsultationFormModal';
import NotesViewModal from '../components/NotesViewModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { 
  Plus, Calendar, Clock, DollarSign, BookOpen, RefreshCw, Edit2, Trash2, ChevronRight, Sparkles 
} from 'lucide-react';

const Consultations = () => {
  const { showToast } = useToast();
  
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/consultations');
      if (response.data.success) {
        setConsultations(response.data.data);
      }
    } catch (err) {
      console.error('Fetch consultations error:', err);
      showToast('Failed to align consultation schedule. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleRefresh = () => {
    fetchConsultations();
    showToast('Consultation schedule updated.', 'info');
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
        showToast('Consultation successfully cancelled and deleted.', 'success');
        fetchConsultations();
      }
    } catch (err) {
      console.error('Delete consultation error:', err);
      showToast('Failed to cancel consultation', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await api.put(`/consultations/${id}`, { status: newStatus });
      if (response.data.success) {
        showToast(`Session status aligned to: ${newStatus}`, 'success');
        setConsultations(consultations.map(c => c._id === id ? response.data.data : c));
      }
    } catch (err) {
      console.error('Change status error:', err);
      showToast('Failed to update consultation status', 'error');
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
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0 pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in font-sans">
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
            <Button 
              variant="secondary"
              onClick={handleRefresh}
              className="px-3"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              onClick={handleBookClick}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" /> Book Consultation
            </Button>
          </div>
        </div>

        {/* Calendar / Consultation List Table */}
        <Card className="p-0 overflow-hidden border border-cosmic-800/30 shadow-2xl">
          {loading ? (
            <div className="py-24">
              <Spinner size="lg" />
              <p className="text-xs text-cosmic-400 uppercase tracking-widest text-center mt-4 animate-pulse">Checking alignments...</p>
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
            <div className="py-20 flex flex-col items-center justify-center max-w-sm mx-auto text-center px-4">
              <div className="p-4 rounded-2xl bg-cosmic-950/60 border border-cosmic-800/40 text-cosmic-400 mb-4 animate-float">
                <Calendar className="h-10 w-10 text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Empty Calendar Schedule</h3>
              <p className="text-xs text-cosmic-300/50 mt-1 leading-relaxed">
                You do not have any consultations logged under your schedule yet. Align a new booking session to begin.
              </p>
              <Button
                onClick={handleBookClick}
                className="mt-5"
                size="sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Book First Session
              </Button>
            </div>
          )}
        </Card>
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
