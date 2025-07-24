import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSale } from '../../../features/SalesSlice/Sales';
import NewSaleForm from './NewSale';
import SignatureModal from './Signature';
import InvoicePreview from './InvoicePreview';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TfiReceipt } from "react-icons/tfi";
import Button from '../../../components/Button';

const GasSales = () => {
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.sales.sales);

  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const handleConfirmSignature = (image) => {
    setSignatureImage(image);
  };

  const handleEditSignature = () => {
    setSignatureImage(null); 
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen flex-1">
      <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Sales</h1>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Gas Sales</h1>
            <p className="text-gray-500">Process gas sales and generate invoices</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            size="md"
            variant="primary"
          >
            + New Sale
          </Button>
        </div>
        {showForm && <NewSaleForm onClose={() => setShowForm(false)} />}
        {/* Modernized Recent Sales Section */}
        <div className="overflow-x-auto w-full mt-6">
          <div className="rounded-2xl shadow border border-blue-100 bg-white w-full p-2 md:p-8">
            <h2 className="text-lg font-bold text-blue-700 px-2 md:px-6 pt-2 md:pt-6">Recent Sales</h2>
            <table className="w-full text-sm text-left rounded-xl overflow-hidden mt-2">
              <thead>
                <tr className="border-b text-blue-700 bg-blue-50">
                  <th className="p-2 md:p-3 font-semibold">Invoice #</th>
                  <th className="p-2 md:p-3 font-semibold">Customer</th>
                  <th className="p-2 md:p-3 font-semibold">Date</th>
                  <th className="p-2 md:p-3 font-semibold">Total</th>
                  <th className="p-2 md:p-3 font-semibold">Paid</th>
                  <th className="p-2 md:p-3 font-semibold">Pending</th>
                  <th className="p-2 md:p-3 font-semibold">Status</th>
                  <th className="p-2 md:p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, index) => (
                  <tr key={s.id || s.invoice || index} className={
                    `border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`
                  }>
                    <td className="p-2 md:p-3 font-medium">{s.invoice}</td>
                    <td className="p-2 md:p-3">{s.customer}</td>
                    <td className="p-2 md:p-3">{s.date}</td>
                    <td className="p-2 md:p-3">AED {s.total.toFixed(2)}</td>
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
                    <td className="p-2 md:p-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        title="Receipt"
                        onClick={() => {
                          setSelectedInvoice(s.invoice);
                          setSelectedSale(s);
                        }}
                      >
                        <TfiReceipt />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        title="Delete"
                        onClick={() => dispatch(deleteSale(s.id))}
                      >
                        <RiDeleteBin6Line />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Signature Modal */}
        {selectedInvoice && !signatureImage && (
          <SignatureModal
            invoice={selectedInvoice}
            onClose={() => {
              setSelectedInvoice(null);
              setSelectedSale(null);
            }}
            onConfirm={handleConfirmSignature}
          />
        )}
        {/* Invoice Preview with signature and actions */}
        {signatureImage && selectedSale && (
          <InvoicePreview
            invoiceData={selectedSale}
            signature={signatureImage}
            onEdit={handleEditSignature}
            onClose={() => {
              setSignatureImage(null);
              setSelectedInvoice(null);
              setSelectedSale(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GasSales;
