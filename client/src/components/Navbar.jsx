import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User as UserIcon, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel border-b border-cosmic-800/30 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider text-slate-100 group">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cosmic-600 to-gold-500 text-white shadow-md shadow-cosmic-900/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 animate-pulse-slow" />
              </span>
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cosmic-100 to-gold-200">
                Aura CRM
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Welcome, </span>
                  <span className="font-semibold text-gold-300">{user.name}</span>
                  <span className="text-cosmic-400 text-xs px-2 py-0.5 rounded-full bg-cosmic-900/50 border border-cosmic-800/40">
                    {user.specialization}
                  </span>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-cosmic-900/40 border border-transparent hover:border-cosmic-800/40 transition-all duration-200"
                >
                  <LayoutDashboard className="h-4 w-4 text-cosmic-400" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-cosmic-900/30 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="relative group overflow-hidden px-4.5 py-2 rounded-lg text-sm font-medium text-cosmic-950 transition-all duration-200"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all group-hover:opacity-90"></span>
                  <span className="relative z-10 font-semibold flex items-center gap-1">
                    Onboard <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
