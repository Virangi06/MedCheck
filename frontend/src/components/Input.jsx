import React from 'react';

export const Input = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`
            w-full 
            px-4 
            py-3 
            rounded-lg 
            border 
            border-slate-300
            focus:outline-none 
            focus:ring-2 
            focus:ring-primary-500 
            focus:border-transparent
            transition-all
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};

export default Input;
