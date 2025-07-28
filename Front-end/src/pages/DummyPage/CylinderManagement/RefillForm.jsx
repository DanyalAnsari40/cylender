import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRefill } from '../../../features/CylinderManagement/CylinderSlice';

const cylinderPrices = {
  Small: 50,
  Large: 80,
};

const RefillForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers); // Get customers from Redux

  const [formData, setFormData] = useState({
    customer: '',
    cylinderType: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
  });

  const price = cylinderPrices[formData.cylinderType] || 0;
  const totalPrice = price * formData.quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addRefill({ ...formData, price: totalPrice }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Refill Cylinder</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Dropdown */}
          <div>
            <label htmlFor="customer" className="block mb-1 font-medium text-gray-700">Customer</label>
            <select
              id="customer"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Cylinder Type Dropdown */}
          <div>
            <label htmlFor="cylinderType" className="block mb-1 font-medium text-gray-700">Cylinder Type</label>
            <select
              id="cylinderType"
              value={formData.cylinderType}
              onChange={(e) => setFormData({ ...formData, cylinderType: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            >
              <option value="">Select Cylinder Type</option>
              <option value="Small">Small</option>
              <option value="Large">Large</option>
            </select>
          </div>
          {/* Show Price Info */}
          {formData.cylinderType && (
            <div className="text-blue-600 font-semibold">
              Price per Cylinder: AED {price} | Total: AED {totalPrice}
            </div>
          )}
          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block mb-1 font-medium text-gray-700">Quantity</label>
            <input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              min="1"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
          {/* Date Picker */}
          <div>
            <label htmlFor="date" className="block mb-1 font-medium text-gray-700">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-6 py-3 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Proceed Refill</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefillForm;
