import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DepositForm from './DepositForm';
import RefillForm from './RefillForm';
import ReturnForm from './ReturnForm';
import SignatureModal from './Signature';
import { LuReceiptText } from "react-icons/lu";
import DepositInvoice from './DepositInvoice';
import RefillInvoice from './RefillInvoice';
import ReturnInvoice from './ReturnInvoice';
import Button from '../../../components/Button';
import { 
  fetchCylinders, 
  fetchRefills, 
  fetchReturns, 
  deleteDeposit,
  deleteRefill,
  deleteReturn
} from '../../../features/CylinderManagement/CylinderSlice';
import { IoTrash } from "react-icons/io5";

const CylinderManagement = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('Deposits');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showRefillForm, setShowRefillForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const deposits = useSelector((state) => state.cylinders.deposits || []);
  const refills = useSelector((state) => state.cylinders.refills || []);
  const returns = useSelector((state) => state.cylinders.returns || []);






 const handleDeleteDeposit = (id) => {
  if (window.confirm("Are you sure you want to delete this deposit?")) {
    dispatch(deleteDeposit(id)); 
  }
};

const handleDeleterefill = (id) => {
  if (window.confirm("Are you sure you want to delete this refill?")) {
    dispatch(deleteRefill(id)); 
  }
};

const handledeleteReturn = (id) => {
  if (window.confirm("Are you sure you want to delete this refill?")) {
    dispatch(deleteReturn(id)); 
  }
};


  useEffect(() => {
    dispatch(fetchCylinders());
    dispatch(fetchRefills());
    dispatch(fetchReturns());


  }, [dispatch]);

  const handleConfirmSignature = (image) => {
    setSignatureImage(image);
  };

  const handleEditSignature = () => {
    setSignatureImage(null);
  };

  const handleGenerateReceipt = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const handleDepositSuccess = (newDeposit) => {
    setShowDepositForm(false);
    setSelectedItem(newDeposit);
    setSelectedType('deposit');
  };

  const generateInvoiceData = (item) => {
    const base = {
      invoice: `${selectedType.charAt(0).toUpperCase()}-${item._id}`,
      customer: item.customer,
      date: new Date().toISOString().split('T')[0],
    };

    switch (selectedType) {
      case 'refill':
        return {
          ...base,
          total: parseFloat(item.price),
          products: [
            {
              name: `${item.cylinderType} Refill`,
              quantity: item.quantity,
              price: parseFloat(item.price / item.quantity),
            },
          ],
        };
      case 'deposit':
        return {
          ...base,
          total: item.quantity * 100,
          products: [
            {
              name: `${item.cylinderType} Deposit`,
              quantity: item.quantity,
              price: 100,
            },
          ],
        };
      case 'return':
        return {
          ...base,
          total: 0,
          products: [
            {
              name: `${item.cylinderType} Return`,
              quantity: item.quantity,
              price: 0,
            },
          ],
        };
      default:
        return {};
    }
  };

  const renderRows = () => {
    if (activeTab === 'Deposits') {
      return deposits.length > 0 ? (
        deposits.map((d) => (
          <tr key={d._id} className="border-b">
            <td className="p-2">{d.customer}</td>
            <td className="p-2">{d.cylinderType}</td>
            <td className="p-2">{d.quantity}</td>
            <td className="p-2">{d.paymentMethod}</td>
            <td className="p-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleGenerateReceipt(d, 'deposit')}
                title="Generate Receipt"
              >
                <LuReceiptText />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteDeposit(d._id)}
                title="Delete Deposit"
              >
                <IoTrash />
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="5" className="text-center p-4">No deposits yet</td></tr>
      );
    }

    if (activeTab === 'Refills') {
      return refills.length > 0 ? (
        refills.map((r) => (
          <tr key={r._id} className="border-b">
            <td className="p-2">{r.customer}</td>
            <td className="p-2">{r.cylinderType}</td>
            <td className="p-2">{r.quantity}</td>
            <td className="p-2">AED {r.price}</td>
            <td className="p-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleGenerateReceipt(r, 'refill')}
                title="Generate Receipt"
              >
                <LuReceiptText />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleterefill(r._id)}
                title="Delete Refill"
              >
                <IoTrash />
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="5" className="text-center p-4">No refills yet</td></tr>
      );
    }

    if (activeTab === 'Returns') {
      return returns.length > 0 ? (
        returns.map((ret) => (
          <tr key={ret._id} className="border-b">
            <td className="p-2">{ret.customer}</td>
            <td className="p-2">{ret.cylinderType}</td>
            <td className="p-2">{ret.quantity}</td>
            <td className="p-2">{ret.returnDate}</td>
            <td className="p-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleGenerateReceipt(ret, 'return')}
                title="Generate Receipt"
              >
                <LuReceiptText />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handledeleteReturn(ret._id)}
                title="Delete Return"
              >
                <IoTrash />
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr><td colSpan="5" className="text-center p-4">No returns yet</td></tr>
      );
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Cylinder Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowDepositForm(true)} size="md" variant="primary">+ Deposit</Button>
          <Button onClick={() => setShowRefillForm(true)} size="md" variant="secondary">+ Refill</Button>
          <Button onClick={() => setShowReturnForm(true)} size="md" variant="outline">+ Return</Button>
        </div>
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl p-8 overflow-x-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">{activeTab} List</h2>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
              {activeTab === 'Deposits' && (
                <>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Cylinder Type</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Receipt</th>
                </>
              )}
              {activeTab === 'Refills' && (
                <>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Cylinder Type</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Total Price</th>
                  <th className="p-2">Receipt</th>
                </>
              )}
              {activeTab === 'Returns' && (
                <>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Cylinder Type</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Return Date</th>
                  <th className="p-2">Receipt</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>

      {/* Modals */}
      {showDepositForm && (
        <DepositForm
          onClose={() => setShowDepositForm(false)}
          onSuccess={handleDepositSuccess}
        />
      )}
      {showRefillForm && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <RefillForm onClose={() => setShowRefillForm(false)} />
        </div>
      )}
      {showReturnForm && (
        <ReturnForm onClose={() => setShowReturnForm(false)} />
      )}

      {/* Signature Modal */}
      {selectedItem && !signatureImage && (
        <SignatureModal
          invoice={selectedItem._id}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleConfirmSignature}
        />
      )}

      {/* Invoice Preview */}
      {signatureImage && selectedItem && selectedType === 'deposit' && (
  <DepositInvoice
    invoiceData={generateInvoiceData(selectedItem)}
    signature={signatureImage}
    onEdit={handleEditSignature}
    onClose={() => {
      setSignatureImage(null);
      setSelectedItem(null);
      setSelectedType(null);
    }}
  />
)}

{signatureImage && selectedItem && selectedType === 'refill' && (
  <RefillInvoice
    invoiceData={generateInvoiceData(selectedItem)}
    signature={signatureImage}
    onEdit={handleEditSignature}
    onClose={() => {
      setSignatureImage(null);
      setSelectedItem(null);
      setSelectedType(null);
    }}
  />
)}

{signatureImage && selectedItem && selectedType === 'return' && (
  <ReturnInvoice
    invoiceData={generateInvoiceData(selectedItem)}
    signature={signatureImage}
    onEdit={handleEditSignature}
    onClose={() => {
      setSignatureImage(null);
      setSelectedItem(null);
      setSelectedType(null);
    }}
  />
)}

    </div>
  );
};

export default CylinderManagement;
