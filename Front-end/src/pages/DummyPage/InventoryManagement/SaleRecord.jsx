import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const ITEMS_PER_PAGE = 5;

const GasSales = () => {
  const sales = useSelector((state) => state.sales.sales);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSales = sales.filter((sale) =>
    sale.invoice?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-2 md:p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen w-full">
      <div className="bg-white border border-blue-100 rounded-2xl p-2 md:p-6 shadow-xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Sale Records</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold">Gas Sales</h2>
          <div className="w-full md:w-72">
            <Input
              type="text"
              placeholder="Search by Invoice #"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              label=""
            />
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="border-b text-blue-700 bg-blue-50">
                <th className="p-2 md:p-3 font-semibold">Invoice #</th>
                <th className="p-2 md:p-3 font-semibold">Customer</th>
                <th className="p-2 md:p-3 font-semibold">Date</th>
                <th className="p-2 md:p-3 font-semibold">Paid</th>
                <th className="p-2 md:p-3 font-semibold">Pending</th>
                <th className="p-2 md:p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No sales found.</td>
                </tr>
              ) : (
                paginatedSales.map((s, index) => (
                  <tr key={s.id || s.invoice || index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`}>
                    <td className="p-2 md:p-3 font-medium">{s.invoice}</td>
                    <td className="p-2 md:p-3">{s.customer}</td>
                    <td className="p-2 md:p-3">{s.date}</td>
                    <td className="p-2 md:p-3">AED {parseFloat(s.paid).toFixed(2)}</td>
                    <td className="p-2 md:p-3">
                      {s.due > 0 ? (
                        <span className="text-red-600 font-semibold">AED {s.due.toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600 font-semibold">-</span>
                      )}
                    </td>
                    <td className="p-2 md:p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                          s.status === 'paid'
                            ? 'bg-green-100 text-green-900'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredSales.length)} of{' '}
            {filteredSales.length}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              size="sm"
              variant="secondary"
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              size="sm"
              variant="secondary"
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasSales;
