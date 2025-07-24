// src/components/CustomerManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    trn: '',
    phone: '',
    email: '',
    totalPurchases: 0,
    outstanding: 0,
    lastPurchase: '',
  });

  const fetchCustomers = async () => {
    const res = await axios.get('http://localhost:5000/api/customers');
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/customers/${formData._id}`, formData);
    } else {
      await axios.post('http://localhost:5000/api/customers', formData);
    }
    fetchCustomers();
    resetForm();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/customers/${id}`);
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      trn: '',
      phone: '',
      email: '',
      totalPurchases: 0,
      outstanding: 0,
      lastPurchase: '',
    });
    setShowForm(false);
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Customer Management</h1>
          <p className="text-gray-500">Manage customer information and ledgers</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="md">
          + Add Customer
        </Button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="name" value={formData.name} onChange={handleChange} label="Customer Name" placeholder="Customer Name" required />
              <Input name="trn" value={formData.trn} onChange={handleChange} label="TRN Number" placeholder="TRN Number" required />
              <Input name="phone" value={formData.phone} onChange={handleChange} label="Phone Number" placeholder="Phone Number" required />
              <Input name="email" value={formData.email} onChange={handleChange} label="Email" placeholder="Email" />
              <Input name="totalPurchases" value={formData.totalPurchases} onChange={handleChange} label="Total Purchases" placeholder="Total Purchases" />
              <Input name="outstanding" value={formData.outstanding} onChange={handleChange} label="Outstanding" placeholder="Outstanding" />
              <Input name="lastPurchase" value={formData.lastPurchase} onChange={handleChange} label="Last Purchase (yyyy-mm-dd)" placeholder="Last Purchase (yyyy-mm-dd)" />
              <div className="col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={resetForm} size="md">Cancel</Button>
                <Button type="submit" variant={isEditing ? 'primary' : 'primary'} size="md">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Table/List */}
      <div className="bg-white border border-blue-100 rounded-2xl p-8 overflow-x-auto shadow-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Customer List</h2>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
              <th className="p-4">Name</th>
              <th className="p-4">TRN</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Total Purchases</th>
              <th className="p-4">Outstanding</th>
              <th className="p-4">Last Purchase</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b hover:bg-blue-50 transition-colors duration-200">
                <td className="p-4 font-medium">{customer.name}</td>
                <td className="p-4">{customer.trn}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.totalPurchases}</td>
                <td className="p-4">{customer.outstanding}</td>
                <td className="p-4">{customer.lastPurchase}</td>
                <td className="p-4 flex gap-2">
                  <Button onClick={() => handleEdit(customer)} size="sm" variant="primary"><FiEdit className="mr-1" /> Edit</Button>
                  <Button onClick={() => handleDelete(customer._id)} size="sm" variant="danger"><FiTrash2 className="mr-1" /> Delete</Button>
                  <Button onClick={() => handleView(customer)} size="sm" variant="secondary"><FiEye className="mr-1" /> View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
            <p><strong>Name:</strong> {selectedCustomer.name}</p>
            <p><strong>TRN:</strong> {selectedCustomer.trn}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Total Purchases:</strong> AED {selectedCustomer.totalPurchases}</p>
            <p><strong>Outstanding:</strong> AED {selectedCustomer.outstanding}</p>
            <p><strong>Last Purchase:</strong> {selectedCustomer.lastPurchase}</p>
            <div className="mt-4 text-right">
              <Button onClick={() => setSelectedCustomer(null)} size="md">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
