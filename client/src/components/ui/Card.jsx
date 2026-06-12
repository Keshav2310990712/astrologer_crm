import React from 'react';

const Card = ({ children, className = '', glow = false, ...props }) => {
  const baseStyle = glow ? 'glass-panel-glow' : 'glass-panel';
  return (
    <div 
      className={`${baseStyle} rounded-2xl p-6 shadow-xl transition-all duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
