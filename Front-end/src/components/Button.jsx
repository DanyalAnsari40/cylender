import React from 'react';

const base =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  primary:
    'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl',
  secondary:
    'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
  outline:
    'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50',
};

const sizes = {
  md: 'px-6 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
  lg: 'px-8 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  ...props
}) => (
  <button
    className={[
      base,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-blue-200 border-t-blue-600 rounded-full"></span>
    ) : null}
    {children}
  </button>
);

export default Button; 