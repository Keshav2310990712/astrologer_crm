import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizes[size].split(' ')[0]} ${sizes[size].split(' ')[1]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-t-cosmic-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-1 rounded-full border border-t-transparent border-r-gold-300 border-b-transparent border-l-transparent animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">✨</div>
      </div>
    </div>
  );
};

export default Spinner;
