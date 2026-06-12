import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

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

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true);
      showToast('Your session expired. Please log in again.', 'warning');
    }
  }, [searchParams, showToast]);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email address format is invalid';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Sanctuary entry authorized. Welcome back!', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.error || 'Invalid email or password', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg min-h-screen">
      {/* Background Star systems */}
      <div className="absolute inset-0 stars-sm z-0"></div>
      <div className="absolute inset-0 stars-md z-0"></div>
      <div className="absolute inset-0 stars-lg z-0"></div>

      {/* Decorative Blur Spheres */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-600/10 blur-[130px] -top-32 -left-32 animate-pulse-slow"></div>
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gold-500/5 blur-[120px] -bottom-32 -right-32 animate-pulse-slow"></div>
      
      {/* Floating vector structures */}
      <ConstellationSVG className="absolute w-72 h-72 text-gold-400/10 -left-12 bottom-12 animate-float-slow hidden md:block" />
      <AstrologicalWheel className="absolute w-96 h-96 text-cosmic-400/5 -right-12 -top-12 animate-spin-very-slow hidden md:block" />

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-cosmic-950 via-cosmic-900 to-cosmic-950 border border-gold-400/20 shadow-2xl mb-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-500/10 to-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="h-10 w-10 text-gold-300 animate-float" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-100 to-gold-300 uppercase">
            Cosmic Portal
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-cosmic-300/50 max-w-xs mx-auto leading-relaxed">
            Verify your stellar alignments to enter your consultation sanctuary.
          </p>
        </div>

        {/* Card Form */}
        <Card premium className="p-8 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Astrologer Email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              error={errors.email}
              placeholder="name@auracrm.com"
              required
            />

            <Input
              label="Secret Password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            <div>
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-4 font-bold tracking-wider"
              >
                <LogIn className="h-5 w-5 mr-2 shrink-0" /> Enter Sanctuary
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs sm:text-sm border-t border-cosmic-900/40 pt-6">
            <span className="text-cosmic-300/40">New to Aura CRM? </span>
            <Link to="/signup" className="font-semibold text-gold-300 hover:text-gold-200 transition-all duration-200 hover:underline">
              Begin Onboarding
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
