import React from 'react';

export const Card = ({
  children,
  className = '',
  accent = 'primary',
  variant = 'default',
  ...props
}) => {
  const accentColors = {
    primary: 'border-l-primary-600',
    teal: 'border-l-teal-600',
    blue: 'border-l-blue-500',
    orange: 'border-l-orange-500',
  };

  const variants = {
    default: 'bg-white',
    subtle: 'bg-primary-50',
    bordered: 'border border-primary-200',
  };

  return (
    <div
      className={`
        ${variants[variant]} 
        border-l-4 
        ${accentColors[accent]} 
        rounded-lg 
        shadow-md 
        p-6 
        transition-all 
        duration-200 
        hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
