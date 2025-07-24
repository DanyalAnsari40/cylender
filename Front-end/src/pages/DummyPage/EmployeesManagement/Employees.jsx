import React, { useState } from 'react';
import TabNavigation from './EmployeeTabs';
import EmployeeTable from './EmployeeList';
import AddEmployeeModal from './AddEmployeeModal';
import Button from '../../../components/Button';

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const [assignments, setAssignments] = useState([]);

  const handleAddOrUpdateEmployee = (employee) => {
    if (editingEmployeeId) {
      const updated = employees.map(emp =>
        emp.id === editingEmployeeId ? { ...emp, ...employee } : emp
      );
      setEmployees(updated);
    } else {
      const newEmployee = {
        ...employee,
        id: Date.now(),
        joinDate: new Date().toLocaleDateString(),
        status: 'active',
        stock: [],
      };
      setEmployees([...employees, newEmployee]);
    }

    setFormData({});
    setEditingEmployeeId(null);
    setShowAddModal(false);
    setActiveTab('employees');
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(emp =>
      emp.id === id
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
  };

  const handleEditEmployee = (emp) => {
    setEditingEmployeeId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      password: '',
    });
    setShowAddModal(true);
  };

  return (
    <div className="p-2 md:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen w-full">
      <div className="bg-white border border-blue-100 rounded-2xl p-2 md:p-8 shadow-xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Employees</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <p className="text-gray-600">Manage employees and assign inventory</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setFormData({});
                setEditingEmployeeId(null);
                setShowAddModal(true);
              }}
              size="md"
              variant="primary"
            >
              + Add Employee
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Views */}
        <div className="overflow-x-auto w-full">
        {activeTab === 'employees' && (
          <EmployeeTable
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            onToggleStatus={handleToggleStatus}
          />
        )}
        {activeTab === 'stock' && (
          <StockAssignments assignments={assignments} />
        )}
        {activeTab === 'notifications' && (
          <div>🔔 Notifications List</div>
        )}
        </div>
        {/* Modals */}
        {showAddModal && (
          <AddEmployeeModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingEmployeeId(null);
            }}
            onSubmit={handleAddOrUpdateEmployee}
            formData={formData}
            setFormData={setFormData}
            editingEmployeeId={editingEmployeeId}
          />
        )}
        {showStockModal && (
          <AssignStockModal
            onClose={() => setShowStockModal(false)}
            employees={employees}
            onAssign={handleAssignStock}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
