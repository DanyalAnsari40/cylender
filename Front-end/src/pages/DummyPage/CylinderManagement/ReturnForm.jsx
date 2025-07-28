import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReturn } from '../../../features/CylinderManagement/CylinderSlice';

const ReturnForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const deposits = useSelector((state) => state.cylinders.deposits);

  const [formData, setFormData] = useState({
    customer: '',
    cylinderType: '',
    quantity: 1,
    returnDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.cylinderType || !formData.quantity || !formData.returnDate) return;
    dispatch(addReturn(formData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Return Cylinder</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Dropdown */}
          <select
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          >
            <option value="">Select Customer</option>
            {deposits.map((d) => (
              <option key={d._id} value={d.customer}>{d.customer}</option>
            ))}
          </select>
          {/* Cylinder Type Dropdown */}
          <select
            value={formData.cylinderType}
            onChange={(e) => setFormData({ ...formData, cylinderType: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          >
            <option value="">Select Cylinder Type</option>
            {deposits
              .filter((d) => d.customer === formData.customer)
              .map((d) => (
                <option key={d._id} value={d.cylinderType}>{d.cylinderType}</option>
              ))}
          </select>
          {/* Quantity Input */}
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            min="1"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          />
          {/* Return Date Picker */}
          <input
            type="date"
            value={formData.returnDate}
            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            required
          />
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-6 py-3 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Return Cylinder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnForm;
