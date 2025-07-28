import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleForm,
  addPurchase,
  setActiveTab,
  approvePurchase,
  removePurchase,
  setSelectedPurchase,
  fetchPurchases,
} from '../../../features/Purchases/PurchasesSlice';
import { fetchSuppliers } from '../../../features/suppliers/suppliersSlice';
import { MdOutlineCheck } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

// ... (imports stay the same)
const App = () => {
  const dispatch = useDispatch();
  const { purchases, showForm, activeTab, selectedPurchase } = useSelector((state) => state.purchase);
  const supplierList = useSelector((state) => state.suppliers.list);

  const [supplier, setSupplier] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedGas, setSelectedGas] = useState('');
  const [gasKg, setGasKg] = useState('');
  const [gasPricePerKg, setGasPricePerKg] = useState('');
  const [cylinderCount, setCylinderCount] = useState('');
  const [cylinderPrice, setCylinderPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchPurchases());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let total = 0;
    if (selectedGas === 'Gas') {
      const kg = parseFloat(gasKg);
      const pricePerKg = parseFloat(gasPricePerKg);
      if (!isNaN(kg) && !isNaN(pricePerKg)) {
        total = kg * pricePerKg;
      }
    } else if (selectedGas === 'Cylinder') {
      const count = parseInt(cylinderCount);
      const price = parseFloat(cylinderPrice);
      if (!isNaN(count) && !isNaN(price)) {
        total = count * price;
      }
    }

    const newPurchase = {
      id: `PO-${Date.now()}`,
      supplier,
      orderDate: purchaseDate,
      total: `AED ${total.toFixed(2)}`,
      status: 'pending',
      notes,
      gasType: selectedGas,
      gasKg: selectedGas === 'Gas' ? gasKg : null,
      gasPricePerKg: selectedGas === 'Gas' ? gasPricePerKg : null,
      cylinderCount: selectedGas === 'Cylinder' ? cylinderCount : null,
      cylinderPrice: selectedGas === 'Cylinder' ? cylinderPrice : null,
      productName,
    };

    dispatch(addPurchase(newPurchase));

    setSupplier('');
    setPurchaseDate('');
    setNotes('');
    setSelectedGas('');
    setGasKg('');
    setGasPricePerKg('');
    setCylinderCount('');
    setCylinderPrice('');
    setProductName('');
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    dispatch(removePurchase(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // ... (the rest of the component remains unchanged)


  return (
    <div className="min-h-screen bg-white p-6 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Purchase Management</h1>
          <p className="text-gray-500">Create and manage purchase orders from suppliers</p>
        </div>
        <Button
          onClick={() => dispatch(toggleForm())}
          size="md"
          variant="primary"
        >
          + New Purchase Order
        </Button>
      </div>
      {/* TABS */}
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => dispatch(setActiveTab('orders'))}
          size="sm"
          variant={activeTab === 'orders' ? 'primary' : 'secondary'}
        >
          Purchase Orders
        </Button>
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto w-full mt-6">
        <div className="rounded-2xl shadow border border-blue-100 bg-white w-full p-2 md:p-6">
          <h2 className="text-xl font-bold text-blue-700 px-2 md:px-6 pt-2 md:pt-6">Purchase Orders</h2>
          <p className="text-sm text-gray-500 mb-4 px-2 md:px-6">All purchase orders and their status</p>
          <table className="w-full text-sm text-left rounded-xl overflow-hidden mt-2">
            <thead>
              <tr className="border-b text-blue-700 bg-blue-50">
                <th className="p-2 md:p-4 font-semibold">PO Number</th>
                <th className="p-2 md:p-4 font-semibold">Supplier</th>
                <th className="p-2 md:p-4 font-semibold">Purchase Date</th>
                <th className="p-2 md:p-4 font-semibold">Total</th>
                <th className="p-2 md:p-4 font-semibold">Status</th>
                <th className="p-2 md:p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((po, index) => (
                <tr key={po.id} className={
                  `border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`
                }>
                  <td className="p-2 md:p-4 font-medium">{po.id}</td>
                  <td className="p-2 md:p-4">{po.supplier}</td>
                  <td className="p-2 md:p-4">{po.orderDate}</td>
                  <td className="p-2 md:p-4">{po.total}</td>
                  <td className="p-2 md:p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        po.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => dispatch(setSelectedPurchase(po))}
                    >
                      <IoEyeOutline />
                    </Button>
                    {po.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => dispatch(approvePurchase(po.id))}
                      >
                        <MdOutlineCheck />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(po.id)}
                    >
                      <RxCross2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* VIEW PURCHASE MODAL */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <Button
              onClick={() => dispatch(setSelectedPurchase(null))}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              size="sm"
              variant="secondary"
            >
              &times;
            </Button>
            <h3 className="text-lg font-bold mb-4">Purchase Details</h3>
            <p><strong>ID:</strong> {selectedPurchase.id}</p>
            <p><strong>Supplier:</strong> {selectedPurchase.supplier}</p>
            <p><strong>Purchase Date:</strong> {selectedPurchase.orderDate}</p>
            <p><strong>Total:</strong> {selectedPurchase.total}</p>
            <p><strong>Status:</strong> {selectedPurchase.status}</p>
            <p><strong>Purchase Type:</strong> {selectedPurchase.gasType || 'N/A'}</p>
            <p><strong>Notes:</strong> {selectedPurchase.notes || 'None'}</p>
            {selectedPurchase.gasType === 'Gas' && (
              <p>
                <strong>Gas Details:</strong> {selectedPurchase.gasKg} KG @ AED {selectedPurchase.gasPricePerKg}/KG
              </p>
            )}
            {selectedPurchase.gasType === 'Cylinder' && (
              <p>
                <strong>Cylinder Details:</strong> {selectedPurchase.cylinderCount} units @ AED {selectedPurchase.cylinderPrice}/Cylinder
              </p>
            )}
          </div>
        </div>
      )}
      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative border border-blue-100">
            <Button
              onClick={() => dispatch(toggleForm())}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              size="sm"
              variant="secondary"
            >
              &times;
            </Button>
            <h3 className="text-2xl font-bold mb-6 text-blue-700">New Purchase Order</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Supplier */}
              <Select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                label="Supplier"
                required
              >
                <option value="">Select supplier</option>
                {supplierList.map((sup) => (
                  <option key={sup.id} value={sup.company}>
                    {sup.company}
                  </option>
                ))}
              </Select>
              {/* Purchase Date */}
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                label="Purchase Date"
                required
              />
              {/* Product Name */}
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                label="Product Name"
                placeholder="Enter product name"
                required
              />
              {/* Purchase Type */}
              <Select
                value={selectedGas}
                onChange={(e) => {
                  setSelectedGas(e.target.value);
                  setGasKg('');
                  setGasPricePerKg('');
                  setCylinderCount('');
                  setCylinderPrice('');
                }}
                label="Purchase Type"
                required
              >
                <option value="">Select type</option>
                <option value="Gas">Gas</option>
                <option value="Cylinder">Cylinder</option>
              </Select>
              {/* Gas Fields */}
              {selectedGas === 'Gas' && (
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <Input
                    type="number"
                    value={gasKg}
                    onChange={(e) => setGasKg(e.target.value)}
                    label="Gas KG"
                    required
                  />
                  <Input
                    type="number"
                    value={gasPricePerKg}
                    onChange={(e) => setGasPricePerKg(e.target.value)}
                    label="Price per KG"
                    required
                  />
                </div>
              )}
              {/* Cylinder Fields */}
              {selectedGas === 'Cylinder' && (
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <Input
                    type="number"
                    value={cylinderCount}
                    onChange={(e) => setCylinderCount(e.target.value)}
                    label="Cylinder Count"
                    required
                  />
                  <Input
                    type="number"
                    value={cylinderPrice}
                    onChange={(e) => setCylinderPrice(e.target.value)}
                    label="Price per Cylinder"
                    required
                  />
                </div>
              )}
              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <Button type="submit" size="md" variant="primary">
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-blue-100 relative animate-fade-in">
            <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Confirm Delete</h2>
            <p className="mb-6 text-center">Are you sure you want to delete this purchase?</p>
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

export default App;
