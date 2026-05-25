import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    teal: 'bg-teal-100 text-teal-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`font-medium rounded-full inline-block ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
