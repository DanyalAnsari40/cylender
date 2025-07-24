import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatCard from '../components/Card/StatCard';
import { fetchCustomers } from '../features/CustomerSlice/Customer';
import { fetchSales } from '../features/SalesSlice/Sales';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchSales());
  }, [dispatch]);

  const { customers } = useSelector((state) => state.customers);
  const totalCustomers = customers?.length || 0;

  const { sales } = useSelector((state) => state.sales);

  const totalProductsSold = sales?.reduce((total, sale) => {
    const saleTotalProducts = sale.products?.reduce((sum, product) => sum + product.quantity, 0);
    return total + saleTotalProducts;
  }, 0) || 0;

  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.paid || 0), 0) || 0;

  const cylinderServices = 15;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8 text-lg">Welcome to GasCorp Management System</p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`AED ${totalRevenue.toFixed(2)}`}
            change="+12.5% from last month"
            isPositive
          />
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            change="+180 new this month"
            isPositive
          />
          <StatCard
            title="Products Sold"
            value={totalProductsSold}
            change="+19% from last month"
            isPositive
          />
          <StatCard
            title="Cylinder Services"
            value={cylinderServices}
            change="-5% from last month"
            isPositive={false}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-1 text-blue-700">Weekly Sales Overview</h2>
            <p className="text-gray-500 text-sm mb-2">Gas sales, cylinder services, and revenue</p>
            {/* Placeholder for chart/graph */}
            <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-300">[Chart Coming Soon]</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-1 text-blue-700">Revenue Distribution</h2>
            <p className="text-gray-500 text-sm mb-2">Breakdown by service type</p>
            {/* Placeholder for chart/graph */}
            <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-300">[Chart Coming Soon]</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
