import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Sparkles, User, Mail, Phone, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

const ClientFormModal = ({ isOpen, onClose, clientData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load client data if we are editing
  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        dateOfBirth: clientData.dateOfBirth ? clientData.dateOfBirth.substring(0, 10) : '',
        timeOfBirth: clientData.timeOfBirth || '',
        placeOfBirth: clientData.placeOfBirth || '',
      });
    } else {
      // Clear form for creation
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
      });
    }
    setError('');
  }, [clientData, isOpen]);

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

    if (!formData.name || !formData.email) {
      setError('Name and Email are required fields');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (clientData) {
        // Edit existing client
        response = await api.put(`/clients/${clientData._id}`, formData);
      } else {
        // Create new client
        response = await api.post('/clients', formData);
      }

      if (response.data.success) {
        onSave();
        onClose();
      }
    } catch (err) {
      console.error('Save client error:', err);
      setError(err.response?.data?.message || 'Failed to save client details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="glass-panel-glow border-cosmic-800/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cosmic-800/20 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-gold-400" />
            {clientData ? 'Modify Client Registry' : 'Register New Client'}
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
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                  placeholder="Karan Verma"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                  placeholder="karan@gmail.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                  placeholder="+91 99888 77665"
                />
              </div>
            </div>

            {/* Astrology Metrics Grid */}
            <div className="border-t border-cosmic-800/10 pt-4 mt-6">
              <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Birth Alignment Metrics
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DOB */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* TOB */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                    Time of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      name="timeOfBirth"
                      type="text"
                      value={formData.timeOfBirth}
                      onChange={handleChange}
                      className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                      placeholder="14:45 (24 hr format)"
                    />
                  </div>
                </div>

                {/* POB */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                    Place of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      name="placeOfBirth"
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                      placeholder="New Delhi, India"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all disabled:opacity-50 flex items-center justify-center min-w-[90px]"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-cosmic-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                clientData ? 'Save Details' : 'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
