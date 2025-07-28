import React from 'react';
import StatCard from './StateCard';
import { TrendingUp, PackageCheck, Users, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';

const ReportsDashboard = () => {
  const { sales } = useSelector((state) => state.sales);
  const { customers } = useSelector((state) => state.customers);

  // Calculate total revenue from sales (paid amount)
  const totalRevenue =
    sales?.reduce((sum, sale) => sum + Number(sale.paid || 0), 0) || 0;

  // Calculate total gas products sold
  const gasSold =
    sales?.reduce((total, sale) => {
      return (
        total +
        (sale.products?.reduce((sum, product) => sum + product.quantity, 0) || 0)
      );
    }, 0) || 0;

  const totalCustomers = customers?.length || 0;

  // Placeholder: You can connect this to actual refills if needed
  const cylinderRefills = 25;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen w-full">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">Reports Dashboard</h1>
        <p className="text-gray-600 mb-8 text-lg">Key business metrics and performance</p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`AED ${totalRevenue.toFixed(2)}`}
            subtitle="All employees"
            icon={TrendingUp}
          />
          <StatCard
            title="Gas Sales"
            value={gasSold}
            subtitle="Units sold"
            icon={PackageCheck}
          />
          <StatCard
            title="Cylinder Refills"
            value={cylinderRefills}
            subtitle="Refills completed"
            icon={RotateCcw}
          />
          <StatCard
            title="Customers Served"
            value={totalCustomers}
            subtitle="Total customers"
            icon={Users}
          />
        </section>

        {/* Ledger Section */}
        <section className="w-full bg-white rounded-2xl shadow-lg p-6 mb-10 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-4">
            <span>Ledger</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4h-4" /></svg>
          </h2>
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input type="text" placeholder="Search by customer" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="cleared">Cleared</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Filter
            </button>
          </div>
          {/* Ledger Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b bg-blue-50 text-blue-700 uppercase text-sm font-semibold">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row, replace with dynamic data */}
                <tr className="border-b hover:bg-blue-50 transition-colors duration-200">
                  <td className="p-4 font-medium">INV-00123</td>
                  <td className="p-4">John Doe</td>
                  <td className="p-4"><span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">Pending</span></td>
                  <td className="p-4">AED 1,200.00</td>
                  <td className="p-4">2024-06-30</td>
                  <td className="p-4 flex gap-2">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Mark Cleared</button>
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> View</button>
                  </td>
                </tr>
                {/* End example row */}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsDashboard;
