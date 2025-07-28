import React, { useState, useEffect } from 'react';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const initialForm = {
  name: '',
  category: 'gas',
  costPrice: '',
  leastPrice: '',
  gasType: ''
};

const API_URL = "http://localhost:5000/api/products";

const Product = () => {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (isEditing) {
        res = await fetch(`${API_URL}/${form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');
      setForm(initialForm);
      setShowForm(false);
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
      fetchProducts();
    } catch {}
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setForm(initialForm);
    setShowForm(false);
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Product Management</h1>
          <p className="text-gray-500">Manage product information and pricing</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="md">
          + Add Product
        </Button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="name" value={form.name} onChange={handleChange} label="Product Name" placeholder="Product Name" required />
              <div>
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white">
                  <option value="gas">Gas</option>
                  <option value="cylinder">Cylinder</option>
                </select>
              </div>
              <Input name="costPrice" type="number" value={form.costPrice} onChange={handleChange} label="Cost Price" placeholder="Cost Price" required />
              <Input name="leastPrice" type="number" value={form.leastPrice} onChange={handleChange} label="Least Price" placeholder="Least Price" required />
              {form.category === 'gas' && (
                <Input name="gasType" value={form.gasType} onChange={handleChange} label="Gas Type" placeholder="Gas Type" />
              )}
              <div className="col-span-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={resetForm} size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md">{isEditing ? 'Update' : 'Add'}</Button>
              </div>
              {error && <div className="col-span-2 text-red-600">{error}</div>}
            </form>
          </div>
        </div>
      )}
      <div className="bg-white border border-blue-100 rounded-2xl p-8 overflow-x-auto shadow-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Product List</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Cost Price</th>
                <th className="p-4">Least Price</th>
                <th className="p-4">Gas Type</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-blue-50 transition-colors duration-200">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{p.costPrice}</td>
                  <td className="p-4">{p.leastPrice}</td>
                  <td className="p-4">{p.gasType || '-'}</td>
                  <td className="p-4 flex gap-2">
                    <Button onClick={() => handleEdit(p)} size="sm" variant="primary"><FiEdit className="mr-1" /> Edit</Button>
                    <Button onClick={() => handleDelete(p._id)} size="sm" variant="danger"><FiTrash2 className="mr-1" /> Delete</Button>
                    <Button onClick={() => handleView(p)} size="sm" variant="secondary"><FiEye className="mr-1" /> View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Cost Price:</strong> {selectedProduct.costPrice}</p>
            <p><strong>Least Price:</strong> {selectedProduct.leastPrice}</p>
            {selectedProduct.category === 'gas' && <p><strong>Gas Type:</strong> {selectedProduct.gasType}</p>}
            <div className="mt-4 text-right">
              <Button onClick={() => setSelectedProduct(null)} size="md">Close</Button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-blue-100 relative animate-fade-in">
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Confirm Delete</h2>
            <p className="mb-6 text-center">Are you sure you want to delete this product?</p>
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

export default Product; 