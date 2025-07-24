import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center justify-center">
      <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Unauthorized</h1>
        <p className="text-lg text-gray-700 mb-6">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
