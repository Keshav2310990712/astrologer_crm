import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Sparkles, User, Calendar, Clock, DollarSign, BookOpen, AlertCircle } from 'lucide-react';

const ConsultationFormModal = ({ isOpen, onClose, consultationData, onSave }) => {
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    duration: '30',
    fee: '100',
    notes: '',
  });

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch clients to populate the dropdown
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await api.get('/clients', { params: { limit: 100 } });
        if (response.data.success) {
          setClients(response.data.data);
        }
      } catch (err) {
        console.error('Fetch clients for dropdown error:', err);
      } finally {
        setLoadingClients(false);
      }
    };

    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  // Load consultation data if editing
  useEffect(() => {
    if (consultationData) {
      // Format Date to datetime-local format: YYYY-MM-DDTHH:MM
      const d = new Date(consultationData.date);
      const tzOffset = d.getTimezoneOffset() * 60000; // Offset in milliseconds
      const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);

      setFormData({
        client: consultationData.client?._id || consultationData.client || '',
        date: localISOTime,
        duration: String(consultationData.duration || 30),
        fee: String(consultationData.fee || 0),
        notes: consultationData.notes || '',
      });
    } else {
      setFormData({
        client: '',
        date: '',
        duration: '30',
        fee: '100',
        notes: '',
      });
    }
    setError('');
  }, [consultationData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { client, date, duration, fee } = formData;
    if (!client || !date || !duration || fee === '') {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let response;
      const submitData = {
        client,
        date: new Date(date).toISOString(),
        duration: Number(duration),
        fee: Number(fee),
        notes: formData.notes,
      };

      if (consultationData) {
        response = await api.put(`/consultations/${consultationData._id}`, submitData);
      } else {
        response = await api.post('/consultations', submitData);
      }

      if (response.data.success) {
        onSave();
        onClose();
      }
    } catch (err) {
      console.error('Save consultation error:', err);
      setError(err.response?.data?.message || 'Failed to schedule consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="glass-panel-glow border-cosmic-800/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cosmic-800/20 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-gold-400" />
            {consultationData ? 'Reschedule Consultation' : 'Book Aligned Consultation'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-cosmic-400 hover:text-rose-400 hover:bg-cosmic-900/40 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 animate-fade-in text-sm shrink-0">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Client selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Select Client *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <User className="h-4 w-4" />
                </div>
                <select
                  name="client"
                  required
                  disabled={loadingClients || !!consultationData}
                  value={formData.client}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none bg-cosmic-950 disabled:opacity-50"
                >
                  <option value="" disabled className="bg-cosmic-950 text-slate-500">
                    {loadingClients ? 'Loading clients...' : 'Choose Client'}
                  </option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id} className="bg-cosmic-950 text-slate-200">
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              {(!loadingClients && clients.length === 0) && (
                <p className="text-[10px] text-amber-400 mt-1">
                  No clients available. Please register a client in your directory first.
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Consultation Date & Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Duration & Fee Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                  Duration (Minutes) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Fee */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                  Consultation Fee (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <input
                    name="fee"
                    type="number"
                    min="0"
                    required
                    value={formData.fee}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Session Notes / Cosmic Intentions
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 text-cosmic-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                  placeholder="Record details of Kundali charts, card alignments, or client history..."
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-cosmic-800/10 flex justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 rounded-xl border border-cosmic-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-cosmic-900/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (clients.length === 0 && !consultationData)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all disabled:opacity-50 flex items-center justify-center min-w-[90px]"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-cosmic-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                consultationData ? 'Reschedule' : 'Book Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationFormModal;
