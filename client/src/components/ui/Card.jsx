import React from 'react';

const Card = ({ children, className = '', glow = false, premium = false, ...props }) => {
  let baseStyle = 'glass-panel';
  if (glow) baseStyle = 'glass-panel-glow';
  if (premium) baseStyle = 'glass-card-premium';
  
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
