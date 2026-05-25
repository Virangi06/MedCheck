import React from 'react';

export const Select = ({
  label,
  error,
  options = [],
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
      <select
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
          appearance-none
          bg-white
          cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};

export default Select;
