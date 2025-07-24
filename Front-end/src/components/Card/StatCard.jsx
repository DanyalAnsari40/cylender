import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 bg-white shadow-lg rounded-2xl flex flex-col gap-2 hover:shadow-xl transition-shadow duration-300 group">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 font-semibold tracking-wide uppercase">{title}</p>
      <span className={`rounded-full p-2 ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} group-hover:scale-110 transition-transform`}>
        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
      </span>
    </div>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    <p className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
  </div>
);

export default StatCard;