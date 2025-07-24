import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPurchases,
  setSelectedPurchase,
} from '../../../features/Purchases/PurchasesSlice';
import { fetchSuppliers } from '../../../features/suppliers/suppliersSlice';
import SaleRecord from './SaleRecord';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const App = () => {
  const dispatch = useDispatch();
  const { purchases, selectedPurchase } = useSelector((state) => state.purchase);
  const supplierList = useSelector((state) => state.suppliers.list);

  const [view, setView] = useState('purchase');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchPurchases());
  }, [dispatch]);

  // Filter and Paginate
  const filteredPurchases = purchases.filter((po) =>
    po.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-2 md:p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen w-full">
      <div className="bg-white border border-blue-100 rounded-2xl p-2 md:p-6 shadow-xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Inventory Management</h1>
        {/* View Toggle Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setView('purchase')}
            size="md"
            variant={view === 'purchase' ? 'primary' : 'secondary'}
          >
            Purchase Record
          </Button>
          <Button
            onClick={() => setView('sales')}
            size="md"
            variant={view === 'sales' ? 'primary' : 'secondary'}
          >
            Sale Record
          </Button>
        </div>

        {view === 'purchase' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Purchase Management</h1>
                <p className="text-gray-500">Create and manage purchase orders from suppliers</p>
              </div>
              {/* Search Input */}
              <div className="w-full md:w-72">
                <Input
                  type="text"
                  placeholder="Search PO Number..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset to first page on search
                  }}
                  label=""
                />
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b text-blue-700 bg-blue-50">
                    <th className="p-2 md:p-3 font-semibold">PO Number</th>
                    <th className="p-2 md:p-3 font-semibold">Supplier</th>
                    <th className="p-2 md:p-3 font-semibold">Purchase Date</th>
                    <th className="p-2 md:p-3 font-semibold">Total</th>
                    <th className="p-2 md:p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPurchases.length > 0 ? (
                    currentPurchases.map((po, index) => (
                      <tr key={po.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`}>
                        <td className="p-2 md:p-3 font-medium">{po.id}</td>
                        <td className="p-2 md:p-3">{po.supplier}</td>
                        <td className="p-2 md:p-3">{po.orderDate}</td>
                        <td className="p-2 md:p-3">{po.total}</td>
                        <td className="p-2 md:p-3">
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredPurchases.length)} of{' '}
                {filteredPurchases.length}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrev}
                  size="sm"
                  variant="secondary"
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={handleNext}
                  size="sm"
                  variant="secondary"
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
            {/* Optional Modal View for PO Details */}
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
                  {/* Add more details if needed */}
                </div>
              </div>
            )}
          </>
        )}
        {view === 'sales' && <SaleRecord />}
      </div>
    </div>
  );
};

export default App;
