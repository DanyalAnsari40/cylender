import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard';
import Dummy from '../pages/DummyPage/Dummy';
import Supplier from '../pages/DummyPage/suppliers/Suppliers';
import Purchases from '../pages/DummyPage/Purchases/Purchase';
import InventoryManagement from '../pages/DummyPage/InventoryManagement/InventoryManage';
import CustomerManagement from '../pages/DummyPage/CustomerManagement/Customer';
import GasSales from '../pages/DummyPage/SaleManagement/Sales';
import CylinderManagement from '../pages/DummyPage/CylinderManagement/Cylinder';
import EmployeeManagement from '../pages/DummyPage/EmployeesManagement/Employees';
import ProtectedRoute from '../components/ProtectedRoute/Protected';
import ReportsDashboard from '../pages/DummyPage/Report/Dasboard';
import Employee from '../pages/EmployeesComponent/Employees';
import Product from '../pages/DummyPage/Product';
import Stock from '../pages/DummyPage/Stock';

const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<Login />} />

    {/* Protected Dashboard (Both Roles) */}
    <Route
      path="/"
      element={
        <ProtectedRoute allowedRoles={['admin', 'employee']}>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Admin-only Routes */}
    <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['admin']}><Supplier /></ProtectedRoute>} />
    <Route path="/purchases" element={<ProtectedRoute allowedRoles={['admin']}><Purchases /></ProtectedRoute>} />
    <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin']}><CustomerManagement /></ProtectedRoute>} />
    <Route path="/gas-sales" element={<ProtectedRoute allowedRoles={['admin']}><GasSales /></ProtectedRoute>} />
    <Route path="/cylinders" element={<ProtectedRoute allowedRoles={['admin']}><CylinderManagement /></ProtectedRoute>} />
    <Route path="/employees" element={<ProtectedRoute allowedRoles={['admin']}><EmployeeManagement /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><Product /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><InventoryManagement /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute allowedRoles={[ 'admin']}><ReportsDashboard/></ProtectedRoute>} />
    <Route path="/sales" element={<ProtectedRoute allowedRoles={['employee']}><GasSales /></ProtectedRoute>} />
    <Route path="/debt-credit" element={<ProtectedRoute allowedRoles={['employee']}><Dummy /></ProtectedRoute>} />
    <Route path="/stock" element={<ProtectedRoute allowedRoles={['employee']}><Stock /></ProtectedRoute>} />


    {/* Shared (Admin + Employee) Routes */}
    <Route path="/inventorysys" element={<ProtectedRoute allowedRoles={[ 'employee']}><InventoryManagement /></ProtectedRoute>} />
    <Route path="/report-sys" element={<ProtectedRoute allowedRoles={[ 'employee']}><ReportsDashboard /></ProtectedRoute>} />
    <Route path="/employee-management" element={<ProtectedRoute allowedRoles={[ 'employee']}><Employee/></ProtectedRoute>} />
    <Route path="/pl" element={<ProtectedRoute allowedRoles={[ 'employee']}><Dummy /></ProtectedRoute>} />

    {/* Fallback 404 */}
    <Route path="*" element={<div className="p-6 text-red-600 text-xl">404 - Page Not Found</div>} />
  </Routes>
);

export default AppRoutes;
