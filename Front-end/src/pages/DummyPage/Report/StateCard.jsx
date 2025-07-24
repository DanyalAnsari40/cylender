import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 w-full shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col gap-2 group">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">{title}</h4>
          <p className="text-2xl md:text-3xl font-extrabold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        {Icon && <Icon className="text-blue-400 w-8 h-8 group-hover:scale-110 transition-transform" />}
      </div>
    </div>
  );
};

export default StatCard;
