import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class="min-h-screen bg-cosmic-950 flex flex-col items-center justify-center relative overflow-hidden cosmic-bg">
        {/* Decorative Glowing Orbs */}
        <div class="absolute w-[300px] h-[300px] rounded-full bg-cosmic-500/10 blur-[80px] top-1/4 left-1/4 animate-pulse-slow"></div>
        <div class="absolute w-[250px] h-[250px] rounded-full bg-gold-500/10 blur-[80px] bottom-1/4 right-1/4 animate-pulse-slow"></div>
        
        <div class="flex flex-col items-center z-10">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-2 border-t-cosmic-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div class="absolute inset-2 rounded-full border border-t-transparent border-r-gold-300 border-b-transparent border-l-transparent animate-spin-slow"></div>
            <div class="absolute inset-0 flex items-center justify-center text-xl">✨</div>
          </div>
          <p class="mt-4 text-cosmic-300/80 font-medium tracking-widest text-xs uppercase animate-pulse">
            Aligning Stars...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
