import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, KeyRound } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Decorative Blur Spheres */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cosmic-600/10 blur-[100px] -top-20 -left-20 animate-pulse-slow"></div>
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gold-500/5 blur-[100px] -bottom-20 -right-20 animate-pulse-slow"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-slide-up">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cosmic-600 to-gold-500 text-white shadow-xl shadow-cosmic-950/50 mb-4 ring-1 ring-cosmic-300/30">
            <Sparkles className="h-8 w-8 text-gold-200 animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-100 to-gold-200">
            Cosmic Portal
          </h2>
          <p className="mt-2 text-sm text-cosmic-300/60">
            Align your dashboard to manage consultations
          </p>
        </div>

        {/* Session Expired / Status Notice */}
        {sessionExpired && (
          <div className="glass-panel-glow border-gold-500/20 bg-gold-950/10 p-4 rounded-xl flex items-start space-x-3 text-gold-200 animate-fade-in text-sm">
            <KeyRound className="h-5 w-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gold-300">Session Expired</p>
              <p className="text-gold-200/70 text-xs mt-0.5">Your cosmic session has ended. Please log in again to continue.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Astrologer Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                  placeholder="name@auracrm.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70 mb-2">
                Secret Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-cosmic-400/40"
                  placeholder="••••••••"
                />
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
                    <LogIn className="h-4.5 w-4.5 mr-2" />
                    Enter Sanctuary
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-cosmic-300/50">New to Aura CRM? </span>
            <Link to="/signup" className="font-semibold text-gold-300 hover:text-gold-200 transition-colors">
              Begin Onboarding
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
