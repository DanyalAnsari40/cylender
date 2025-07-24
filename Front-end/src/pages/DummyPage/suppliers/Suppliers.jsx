import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteSupplier,
  addSupplier,
  updateSupplier,
  fetchSuppliers
} from '../../../features/suppliers/suppliersSlice';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

const Suppliers = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) =>
    Array.isArray(state.suppliers.list) ? state.suppliers.list : []
  );

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    company: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    trn: '',
    paymentTerms: '',
    status: 'active',
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateSupplier(formData));
    } else {
      dispatch(addSupplier(formData));
    }

    setFormData({
      id: '',
      company: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      trn: '',
      paymentTerms: '',
      status: 'active',
    });

    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (supplier) => {
    setFormData(supplier);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Supplier Management</h1>
          <p className="text-gray-500">Manage your suppliers</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
          }}
          size="md"
          variant="primary"
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Supplier
        </Button>
      </div>
      {showForm && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="id" value={formData.id} onChange={handleChange} label="Invoice Number" placeholder="Invoice Number" required disabled={isEditing} />
              <Input name="company" value={formData.company} onChange={handleChange} label="Company Name" placeholder="Company Name" required />
              <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} label="Contact Person" placeholder="Contact Person" required />
              <Input name="phone" value={formData.phone} onChange={handleChange} label="Phone" placeholder="Phone" required />
              <Input name="email" value={formData.email} onChange={handleChange} label="Email" placeholder="Email" required />
              <Input name="address" value={formData.address} onChange={handleChange} label="Address" placeholder="Address" required />
              <Input name="trn" value={formData.trn} onChange={handleChange} label="TRN Number" placeholder="TRN Number" required />
              <Input name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} label="Payment Terms" placeholder="Payment Terms" required />
              <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              <div className="col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setIsEditing(false); }} size="md">Cancel</Button>
                <Button type="submit" variant={isEditing ? 'primary' : 'primary'} size="md">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Supplier Table/List */}
      <div className="bg-white border border-blue-100 rounded-2xl p-8 overflow-x-auto shadow-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Supplier List</h2>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
              <th className="p-4">ID</th>
              <th className="p-4">Company</th>
              <th className="p-4">Contact Person</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Address</th>
              <th className="p-4">TRN</th>
              <th className="p-4">Payment Terms</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b hover:bg-blue-50 transition-colors duration-200">
                <td className="p-4 font-medium">{supplier.id}</td>
                <td className="p-4">{supplier.company}</td>
                <td className="p-4">{supplier.contactPerson}</td>
                <td className="p-4">{supplier.phone}</td>
                <td className="p-4">{supplier.email}</td>
                <td className="p-4">{supplier.address}</td>
                <td className="p-4">{supplier.trn}</td>
                <td className="p-4">{supplier.paymentTerms}</td>
                <td className="p-4">{supplier.status}</td>
                <td className="p-4 flex gap-2">
                  <Button onClick={() => handleEdit(supplier)} size="sm" variant="primary"><FiEdit className="mr-1" /> Edit</Button>
                  <Button onClick={() => dispatch(deleteSupplier(supplier.id))} size="sm" variant="danger"><FiTrash2 className="mr-1" /> Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
