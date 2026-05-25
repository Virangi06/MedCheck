import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-md',
    secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white',
    ghost: 'text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg w-full',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
