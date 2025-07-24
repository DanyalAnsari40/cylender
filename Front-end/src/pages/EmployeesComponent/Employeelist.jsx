import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  fetchEmployees,
  deleteEmployeeFromBackend,
  toggleStatus,
  updateEmployeeInBackend,
} from '../../features/EmployeesSlice/Employees';

const EmployeeManager = () => {
  const dispatch = useDispatch();
  const { list: employees, status, error } = useSelector(state => state.employees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || '',
        email: selectedEmployee.email || '',
        password: ''
      });
    }
  }, [selectedEmployee]);

  

  const handleUpdate = (e) => {
    e.preventDefault();
    if (selectedEmployee) {
      const updatedData = { ...selectedEmployee, ...formData };
      dispatch(updateEmployeeInBackend({ id: selectedEmployee._id, data: updatedData }));
      setSelectedEmployee(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Employee Management</h1>
      {/* Edit Form */}
      {selectedEmployee && (
        <div className="mb-8 border border-blue-100 p-8 rounded-2xl shadow-xl bg-white">
          <h3 className="text-2xl font-bold mb-6 text-blue-700">Edit Employee</h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Update</button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status & Error */}
      {status === 'loading' && <p>Loading employees...</p>}
      {status === 'failed' && <p className="text-red-600">Error: {error}</p>}

      {/* Employee Table */}
      {status === 'succeeded' && (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="text-gray-600 font-semibold border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{emp.name}</td>
                <td className="text-center">{emp.email}</td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      emp.status === 'active'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeManager;
