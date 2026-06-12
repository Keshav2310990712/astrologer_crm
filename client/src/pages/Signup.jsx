import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Award, BookOpen, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    bio: '',
  });

  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client side validation
    const { name, email, password, specialization, experience } = formData;
    if (!name || !email || !password || !specialization || !experience) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      ...formData,
      experience: Number(formData.experience),
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
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

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                    placeholder="Acharya Sharma"
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
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                    placeholder="sharma@auracrm.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                  Create Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                  Primary Skillset *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <select
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm appearance-none bg-cosmic-950"
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
              </div>

              {/* Experience */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
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
                    className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                    placeholder="Describe your lineage, alignment practices, and how you guide clients..."
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative group w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 focus:ring-offset-cosmic-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-cosmic-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Complete Onboarding
                    <ArrowRight className="h-4.5 w-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-cosmic-300/50">Already registered? </span>
            <Link to="/login" className="font-semibold text-gold-300 hover:text-gold-200 transition-colors">
              Access Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
