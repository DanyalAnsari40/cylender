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
      </div>
    </div>
  );
};

export default ReportsDashboard;
