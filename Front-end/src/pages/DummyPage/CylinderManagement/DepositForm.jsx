import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDeposit } from '../../../features/CylinderManagement/CylinderSlice';
import { fetchCustomers } from '../../../features/CustomerSlice/Customer';

const DepositForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    cylinderType: '',
    quantity: 1,
    paymentMethod: 'Cash',
    checkNumber: '',
    bankName: '',
  });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer || !formData.cylinderType || formData.quantity < 1) {
      alert('Please fill all required fields correctly.');
      return;
    }

    console.log('Submitting Deposit:', formData);

    setLoading(true);
    await dispatch(addDeposit(formData));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">New Cylinder Deposit</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Customer</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Customer</option>
              {customers.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.name}
                </option>
              ))}
            </select>
          </div>
          {/* Cylinder Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Cylinder Type</label>
            <select
              name="cylinderType"
              value={formData.cylinderType}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Select Type</option>
              <option value="Small">Small</option>
              <option value="Large">Large</option>
            </select>
          </div>
          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          {/* Payment Method */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          {/* Cheque Details */}
          {formData.paymentMethod === 'Cheque' && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Check Number</label>
                <input
                  type="text"
                  name="checkNumber"
                  value={formData.checkNumber}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter check number"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter bank name"
                />
              </div>
            </>
          )}
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-6 py-3 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Deposit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositForm;
