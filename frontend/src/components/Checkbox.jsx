import React from 'react';

export const Checkbox = ({
  label,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-slate-300 text-teal-600 cursor-pointer focus:ring-2 focus:ring-primary-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm text-slate-700 cursor-pointer font-medium">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
