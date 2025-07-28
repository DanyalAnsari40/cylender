import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaChartBar } from 'react-icons/fa';
import {
  fetchEmployees,
  deleteEmployeeFromBackend,
  toggleStatus,
  updateEmployeeInBackend,
} from '../../../features/EmployeesSlice/Employees';

const EmployeeManager = () => {
  const dispatch = useDispatch();
  const { list: employees, status, error } = useSelector(state => state.employees);
  const sales = useSelector(state => state.sales.sales);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [salesEmployee, setSalesEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  // Helper to calculate sales info for an employee
  const getEmployeeSalesInfo = (employee) => {
    if (!employee || !sales) return { totalCylinders: 0, totalGas: 0, credit: 0, debit: 0 };
    let totalCylinders = 0;
    let totalGas = 0;
    let credit = 0;
    let debit = 0;
    sales.forEach(sale => {
      if (sale.customer === employee.name) {
        sale.products.forEach(product => {
          if (product.category === 'cylinder') totalCylinders += product.quantity;
          if (product.category === 'gas') totalGas += product.quantity;
        });
        credit += Number(sale.paid || 0);
        debit += Number(sale.due || 0);
      }
    });
    return { totalCylinders, totalGas, credit, debit };
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    dispatch(deleteEmployeeFromBackend(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleStatus(id));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
              <th>Actions</th>
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
                <td className="text-center space-x-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => { setSalesEmployee(emp); setShowSalesModal(true); }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-3 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                    title="View Sales Info"
                  >
                    <FaChartBar />
                    Sales Info
                  </button>
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(emp._id)}
                    className="text-yellow-600 hover:text-yellow-800 text-xs"
                    title="Toggle Status"
                  >
                    {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Sales Info Modal */}
      {showSalesModal && salesEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowSalesModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">{salesEmployee.name}'s Sales Info</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {(() => {
                const info = getEmployeeSalesInfo(salesEmployee);
                return (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
                      <span className="text-3xl font-bold text-blue-600">{info.totalCylinders}</span>
                      <span className="text-xs text-gray-600 mt-1">Cylinders Sold</span>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
                      <span className="text-3xl font-bold text-green-600">{info.totalGas}</span>
                      <span className="text-xs text-gray-600 mt-1">Gas Sold</span>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold text-yellow-600">AED {info.credit.toFixed(2)}</span>
                      <span className="text-xs text-gray-600 mt-1">Credit (Paid)</span>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center shadow">
                      <span className="text-2xl font-bold text-red-600">AED {info.debit.toFixed(2)}</span>
                      <span className="text-xs text-gray-600 mt-1">Debit (Due)</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <button
              onClick={() => setShowSalesModal(false)}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-blue-100 relative animate-fade-in">
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Confirm Delete</h2>
            <p className="mb-6 text-center">Are you sure you want to delete this employee?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-200 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
