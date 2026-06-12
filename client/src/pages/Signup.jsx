import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, Award, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specializations = [
    'Vedic Astrology',
    'Tarot Reading',
    'Numerology',
    'Vastu Shastra',
    'Palmistry',
    'Western Astrology',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full Name is required';
    
    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address format is invalid';
    }
    
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.specialization) {
      tempErrors.specialization = 'Primary skillset selection is required';
    }
    
    if (formData.experience === '') {
      tempErrors.experience = 'Years of practice is required';
    } else if (Number(formData.experience) < 0) {
      tempErrors.experience = 'Practice experience cannot be negative';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      showToast('Please verify validation errors on the form.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      ...formData,
      experience: Number(formData.experience),
    });
    setIsSubmitting(false);

    if (result.success) {
      showToast('Astrologer onboarding completed successfully!', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.error || 'Failed to complete registration', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Background Orbs */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-cosmic-600/10 blur-[100px] -top-20 -right-20 animate-pulse-slow"></div>
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gold-500/5 blur-[100px] -bottom-20 -left-20 animate-pulse-slow"></div>

      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cosmic-600 to-gold-500 text-white shadow-xl shadow-cosmic-950/50 mb-4 ring-1 ring-cosmic-300/30">
            <Sparkles className="h-8 w-8 text-gold-200 animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-100 to-gold-200">
            Onboard as an Astrologer
          </h2>
          <p className="mt-2 text-sm text-cosmic-300/60">
            Register your profile to begin auditing and consulting clients
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <Input
                label="Full Name *"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                error={errors.name}
                placeholder="Acharya Sharma"
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
                placeholder="sharma@auracrm.com"
                required
              />

              {/* Password */}
              <Input
                label="Create Password *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              {/* Specialization */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70">
                  Primary Skillset *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none bg-cosmic-950 ${errors.specialization ? 'border-rose-500/50' : ''}`}
                    required
                  >
                    <option value="" disabled className="bg-cosmic-950 text-slate-500">
                      Select Specialization
                    </option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec} className="bg-cosmic-950 text-slate-200">
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.specialization && (
                  <p className="text-[10px] text-rose-400 font-semibold tracking-wide flex items-center gap-1">
                    <span>⚠️</span> {errors.specialization}
                  </p>
                )}
              </div>

              {/* Experience */}
              <Input
                label="Years of Experience *"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                icon={Award}
                error={errors.experience}
                placeholder="5"
                required
                className="md:col-span-2"
              />

              {/* Bio */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70">
                  Professional Bio / Cosmic Practice
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 text-cosmic-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30"
                    placeholder="Describe your lineage, alignment practices, and how you guide clients..."
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-3.5"
              >
                Complete Onboarding
                <ArrowRight className="h-4.5 w-4.5 ml-2 shrink-0" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-cosmic-300/50">Already registered? </span>
            <Link to="/login" className="font-semibold text-gold-300 hover:text-gold-200 transition-colors">
              Access Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
