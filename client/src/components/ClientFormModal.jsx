import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { X, Sparkles, User, Mail, Phone, Calendar, Clock, MapPin } from 'lucide-react';

const ClientFormModal = ({ isOpen, onClose, clientData, onSave }) => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load client data if editing
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
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
      });
    }
    setErrors({});
  }, [clientData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Client Name is required';
    
    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address format is invalid';
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
      if (clientData) {
        response = await api.put(`/clients/${clientData._id}`, formData);
      } else {
        response = await api.post('/clients', formData);
      }

      if (response.data.success) {
        showToast(
          clientData ? 'Client records updated successfully.' : 'New client registered in registry!',
          'success'
        );
        onSave();
        onClose();
      }
    } catch (err) {
      console.error('Save client error:', err);
      showToast(err.response?.data?.message || 'Failed to save client details.', 'error');
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
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5" noValidate>
          <div className="space-y-4">
            {/* Name */}
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              error={errors.name}
              placeholder="Karan Verma"
              required
            />

            {/* Email */}
            <Input
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              placeholder="karan@gmail.com"
              required
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
              placeholder="+91 99888 77665"
            />

            {/* Astrology Metrics Grid */}
            <div className="border-t border-cosmic-800/10 pt-4 mt-6">
              <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Birth Alignment Metrics
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DOB */}
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  icon={Calendar}
                  className="[color-scheme:dark]"
                />

                {/* TOB */}
                <Input
                  label="Time of Birth"
                  name="timeOfBirth"
                  type="text"
                  value={formData.timeOfBirth}
                  onChange={handleChange}
                  icon={Clock}
                  placeholder="14:45"
                />

                {/* POB */}
                <Input
                  label="Place of Birth"
                  name="placeOfBirth"
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  icon={MapPin}
                  placeholder="New Delhi, India"
                  className="sm:col-span-2"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              size="sm"
            >
              {clientData ? 'Save Details' : 'Register'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
