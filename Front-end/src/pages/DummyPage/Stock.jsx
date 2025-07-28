import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';

const API_URL = 'http://localhost:5000/api/employees/assigned-stock';
const RETURN_URL = 'http://localhost:5000/api/employees/return-stock';

const Stock = () => {
  const user = useSelector((state) => state.auth.user);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [returnType, setReturnType] = useState('');
  const [returnQty, setReturnQty] = useState('');

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log('Fetched assigned stock:', data);
      console.log('Current user._id:', user._id);
      // Find this employee's stock
      const emp = data.find((e) => e.employeeId === user._id);
      setStock(emp ? emp.stock : []);
    } catch (err) {
      setError('Failed to fetch stock');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStock();
    // eslint-disable-next-line
  }, []);

  const handleReturn = (type) => {
    // Find the current stock for this type
    const currentStock = stock.find(s => s.type === type);
    if (!currentStock || currentStock.qty <= 0) {
      alert('No stock available to return for this type.');
      return;
    }
    setReturnType(type);
    setShowReturn(true);
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(RETURN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: user._id, type: returnType, qty: Number(returnQty) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to return stock');
      
      // Show success message
      alert(`Successfully returned ${returnQty} ${returnType}(s) to admin!`);
      
      setShowReturn(false);
      setReturnQty('');
      fetchStock();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Stock</h1>
          <p className="text-gray-500">View and return your assigned stock</p>
        </div>
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl p-8 overflow-x-auto shadow-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Assigned Stock</h2>
        <p className="text-gray-600 mb-4">Welcome, {user.name || user.email}! Here's your assigned stock. You can return any stock back to admin using the Return button.</p>
        {loading ? (
          <div>Loading...</div>
        ) : stock.length === 0 ? (
          <div>No stock assigned.</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
                <th className="p-4">Type</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.type} className="border-b hover:bg-blue-50 transition-colors duration-200">
                  <td className="p-4 font-medium">{s.type}</td>
                  <td className="p-4">{s.qty}</td>
                  <td className="p-4">
                    <Button onClick={() => handleReturn(s.type)} size="sm" variant="secondary">Return to Admin</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showReturn && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Return Stock</h2>
            <form onSubmit={submitReturn} className="space-y-4">
              <Input label="Type" value={returnType} disabled />
              <Input 
                label="Quantity to Return" 
                type="number" 
                value={returnQty} 
                onChange={e => setReturnQty(e.target.value)} 
                required 
                min={1}
                max={stock.find(s => s.type === returnType)?.qty || 1}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowReturn(false)} size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md">Return</Button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock; 