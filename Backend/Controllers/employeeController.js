import Employee from '../models/Employee.js';

export const addEmployee = async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Server error while saving employee' });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

export const assignStock = async (req, res) => {
  try {
    const { employeeId, type, qty } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    // Find if this type already exists
    const stockIdx = employee.stock.findIndex(s => s.type === type);
    if (stockIdx > -1) {
      // Update qty
      employee.stock[stockIdx].qty += Number(qty);
    } else {
      // Add new type
      employee.stock.push({ type, qty: Number(qty) });
    }
    await employee.save();
    res.json(employee.stock);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign stock' });
  }
};

export const getAssignedStock = async (req, res) => {
  try {
    const employees = await Employee.find({}, 'name stock');
    // Return as array of { employeeId, name, stock }
    const result = employees.map(emp => ({ employeeId: emp._id, name: emp.name, stock: emp.stock }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assigned stock' });
  }
};
