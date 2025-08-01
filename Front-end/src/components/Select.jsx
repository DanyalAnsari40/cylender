import React from 'react';

const Select = ({ label, error, className = '', children, ...props }) => (
  <div className="w-full">
    {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
    <select
      className={[
        'w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white',
        error ? 'border-red-400' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

export default Select; 