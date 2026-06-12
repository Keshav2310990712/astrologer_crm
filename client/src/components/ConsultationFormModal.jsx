import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { X, Sparkles, User, Calendar, Clock, DollarSign, BookOpen } from 'lucide-react';

const ConsultationFormModal = ({ isOpen, onClose, consultationData, onSave }) => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    duration: '30',
    fee: '100',
    notes: '',
  });

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [errors, setErrors] = useState({});
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
      const d = new Date(consultationData.date);
      const tzOffset = d.getTimezoneOffset() * 60000;
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
    setErrors({});
  }, [consultationData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.client) tempErrors.client = 'Client selection is required';
    if (!formData.date) tempErrors.date = 'Consultation date and time is required';
    
    if (!formData.duration) {
      tempErrors.duration = 'Duration is required';
    } else if (Number(formData.duration) <= 0) {
      tempErrors.duration = 'Duration must be positive';
    }
    
    if (formData.fee === '') {
      tempErrors.fee = 'Fee amount is required';
    } else if (Number(formData.fee) < 0) {
      tempErrors.fee = 'Fee cannot be negative';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      showToast('Form verification failed. Please check validation alerts.', 'warning');
      return;
    }

    setLoading(true);
    try {
      let response;
      const submitData = {
        client: formData.client,
        date: new Date(formData.date).toISOString(),
        duration: Number(formData.duration),
        fee: Number(formData.fee),
        notes: formData.notes,
      };

      if (consultationData) {
        response = await api.put(`/consultations/${consultationData._id}`, submitData);
      } else {
        response = await api.post('/consultations', submitData);
      }

      if (response.data.success) {
        showToast(
          consultationData ? 'Consultation rescheduled successfully.' : 'Consultation booked successfully!',
          'success'
        );
        onSave();
        onClose();
      }
    } catch (err) {
      console.error('Save consultation error:', err);
      showToast(err.response?.data?.message || 'Failed to schedule consultation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="glass-panel-glow border-cosmic-800/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-slide-up max-h-[90vh] flex flex-col font-sans">
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
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5" noValidate>
          <div className="space-y-4">
            {/* Client selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70">
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
                  className={`glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none bg-cosmic-950 disabled:opacity-50 ${errors.client ? 'border-rose-500/50' : ''}`}
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
              {errors.client && (
                <p className="text-[10px] text-rose-400 font-semibold tracking-wide flex items-center gap-1">
                  <span>⚠️</span> {errors.client}
                </p>
              )}
              {(!loadingClients && clients.length === 0) && (
                <p className="text-[10px] text-amber-400 mt-1">
                  No clients available. Please register a client in your directory first.
                </p>
              )}
            </div>

            {/* Date & Time */}
            <Input
              label="Consultation Date & Time *"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              icon={Calendar}
              error={errors.date}
              required
              className="[color-scheme:dark]"
            />

            {/* Duration & Fee Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <Input
                label="Duration (Minutes) *"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                icon={Clock}
                error={errors.duration}
                placeholder="30"
                required
              />

              {/* Fee */}
              <Input
                label="Consultation Fee (USD) *"
                name="fee"
                type="number"
                min="0"
                value={formData.fee}
                onChange={handleChange}
                icon={DollarSign}
                error={errors.fee}
                placeholder="100"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70">
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
            <Button
              variant="secondary"
              onClick={onClose}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={clients.length === 0 && !consultationData}
              size="sm"
            >
              {consultationData ? 'Reschedule' : 'Book Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationFormModal;
