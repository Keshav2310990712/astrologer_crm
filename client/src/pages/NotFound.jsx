import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden cosmic-bg">
      {/* Glow Orbs */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cosmic-600/10 blur-[80px] top-1/4 left-1/4 animate-pulse-slow"></div>
      
      <div className="text-center relative z-10 space-y-6 max-w-md animate-slide-up">
        {/* Floating Icon */}
        <div className="inline-flex p-4 rounded-full bg-cosmic-900/50 border border-cosmic-800/40 text-gold-400 animate-float">
          <Compass className="h-12 w-12 animate-spin-slow" />
        </div>
        
        <h1 className="text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-slate-100 to-cosmic-400">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-100">Lost in the Cosmos</h2>
          <p className="text-sm text-cosmic-300/50 leading-relaxed">
            The coordinates you requested do not match any planetary alignments in our registry. You may have entered a cosmic black hole.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-cosmic-800/30 text-sm font-semibold rounded-xl text-slate-200 bg-cosmic-950/60 hover:bg-cosmic-900/40 hover:text-white transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Sanctuary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
