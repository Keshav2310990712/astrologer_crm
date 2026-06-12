import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, Award, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const ConstellationSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="30" r="1.5" fill="#e2be2b" />
    <circle cx="50" cy="15" r="1.5" fill="#e2be2b" />
    <circle cx="80" cy="45" r="1.5" fill="#e2be2b" />
    <circle cx="40" cy="65" r="1.5" fill="#e2be2b" />
    <circle cx="65" cy="80" r="1.5" fill="#e2be2b" />
    <path d="M20 30 L50 15 L80 45 M40 65 L65 80 L80 45 M20 30 L40 65" stroke="rgba(244, 235, 147, 0.25)" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

const AstrologicalWheel = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
    <circle cx="100" cy="100" r="60" stroke="rgba(244, 235, 147, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="40" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="0.75" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" />
    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" />
    <line x1="36" y1="36" x2="164" y2="164" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="0.75" />
    <line x1="36" y1="164" x2="164" y2="36" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="0.75" />
  </svg>
);

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
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg min-h-screen">
      {/* Background Star systems */}
      <div className="absolute inset-0 stars-sm z-0"></div>
      <div className="absolute inset-0 stars-md z-0"></div>
      <div className="absolute inset-0 stars-lg z-0"></div>

      {/* Background Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-600/10 blur-[130px] -top-32 -right-32 animate-pulse-slow"></div>
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gold-500/5 blur-[120px] -bottom-32 -left-32 animate-pulse-slow"></div>

      {/* Floating vector structures */}
      <ConstellationSVG className="absolute w-80 h-80 text-gold-400/10 -right-12 bottom-12 animate-float-reverse hidden md:block" />
      <AstrologicalWheel className="absolute w-96 h-96 text-cosmic-400/5 -left-12 -top-12 animate-spin-very-slow hidden md:block" />

      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-cosmic-950 via-cosmic-900 to-cosmic-950 border border-gold-400/20 shadow-2xl mb-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-500/10 to-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="h-10 w-10 text-gold-300 animate-float" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-100 to-gold-300 uppercase">
            Begin Onboarding
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-cosmic-300/50 max-w-md mx-auto leading-relaxed">
            Register your profile details to establish your practice account.
          </p>
        </div>

        {/* Form Card */}
        <Card premium className="p-8 sm:p-10">
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
                className="w-full py-4 font-bold tracking-wider"
              >
                Complete Onboarding
                <ArrowRight className="h-5 w-5 ml-2 shrink-0 animate-float" />
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs sm:text-sm border-t border-cosmic-900/40 pt-6">
            <span className="text-cosmic-300/40">Already registered? </span>
            <Link to="/login" className="font-semibold text-gold-300 hover:text-gold-200 transition-all duration-200 hover:underline">
              Access Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
