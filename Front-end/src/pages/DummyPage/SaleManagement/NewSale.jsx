import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSale } from '../../../features/SalesSlice/Sales';
import { v4 as uuidv4 } from 'uuid';

const NewSaleForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const products = useSelector((state) => state.products.products);

  const [formData, setFormData] = useState({
    invoice: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    customer: '',
    date: new Date().toISOString().split('T')[0],
    products: [],
    paid: '',
    note: ''
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const addProductToList = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.name === selectedProduct);
    if (!product) return;

    const newProduct = {
      id: uuidv4(),
      name: selectedProduct,
      quantity: Number(quantity),
      price: product.sellingPrice,
      category: product.category
    };

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));

    setSelectedProduct('');
    setQuantity(1);
  };

  const calculateTotal = () =>
    formData.products.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    const paid = parseFloat(formData.paid || 0);
    const due = total - paid;
    const status = due <= 0 ? 'paid' : 'partial';

    const sale = {
      id: uuidv4(),
      ...formData,
      total,
      due,
      status
    };

    dispatch(addSale(sale));
    onClose();
  };

  const total = calculateTotal();
  const paid = parseFloat(formData.paid || 0);
  const due = total - paid;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Create New Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Customer</label>
              <select
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c, index) => (
                  <option key={c.id || `${c.name}-${index}`} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Add Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedProduct(''); // Reset product selection when category changes
                  }}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="gas">Gas</option>
                  <option value="cylinder">Cylinder</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={!selectedCategory}
                >
                  <option value="">Select Product</option>
                  {filteredProducts.map((prod) => (
                    <option key={prod.name} value={prod.name}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Qty"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addProductToList}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={!selectedProduct || !quantity}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {formData.products.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-3">Selected Products</h4>
              <div className="space-y-2">
                {formData.products.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className={`capitalize text-xs px-3 py-1 rounded-full font-semibold ${
                        item.category === 'gas' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category}
                      </span>
                      <span className="font-medium">{item.name} x {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-700">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300">
                  <span>Total</span>
                  <span className="text-blue-600">AED {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Paid Amount</label>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: e.target.value })}
                placeholder="Enter paid amount"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Note (Optional)</label>
              <input
                name="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add a note"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Due Amount</label>
              <input
                type="text"
                value={`AED ${due.toFixed(2)}`}
                disabled
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-100 text-red-600 font-semibold"
                placeholder="Due Amount"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Status</label>
              <input
                type="text"
                value={due <= 0 ? 'Paid' : 'Partial'}
                disabled
                className={`w-full p-4 border border-gray-200 rounded-xl font-semibold ${
                  due <= 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSaleForm;
