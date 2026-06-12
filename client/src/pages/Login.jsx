import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, Sparkles, KeyRound } from 'lucide-react';

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

        {/* Card Form */}
        <Card className="p-8">
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
                className="w-full py-3.5"
              >
                <LogIn className="h-4.5 w-4.5 mr-2 shrink-0" /> Enter Sanctuary
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-cosmic-300/50">New to Aura CRM? </span>
            <Link to="/signup" className="font-semibold text-gold-300 hover:text-gold-200 transition-colors">
              Begin Onboarding
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
