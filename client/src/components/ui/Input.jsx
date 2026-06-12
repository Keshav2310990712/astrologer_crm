import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  name, 
  type = 'text', 
  placeholder, 
  className = '', 
  value,
  onChange,
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-cosmic-300/70">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cosmic-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`glass-input block w-full pr-4 py-2.5 rounded-xl text-sm placeholder-cosmic-400/30 ${Icon ? 'pl-10' : 'pl-4'} ${error ? 'border-rose-500/50 focus:border-rose-500/70 focus:shadow-[0_0_15px_rgba(244,63,94,0.15)]' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[10px] text-rose-400 font-semibold tracking-wide flex items-center gap-1 animate-fade-in">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
