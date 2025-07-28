import Employee from '../models/Employee.js';

// GET /api/employees/returned-stock
export const getReturnedStock = async (req, res) => {
  try {
    console.log('Fetching returned stock for all employees...');
    const employees = await Employee.find({}, 'name email returned');
    console.log('Found employees:', employees.length);
    
    const data = employees.map(emp => ({
      employeeId: emp._id,
      name: emp.name,
      email: emp.email,
      returned: emp.returned
    }));
    
    console.log('Returned stock data:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error fetching returned stock:', error);
    res.status(500).json({ message: 'Failed to fetch returned stock' });
  }
};

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
    
    // Create notification for employee
    try {
      const Notification = (await import('../models/Notification.js')).default;
      await Notification.create({
        recipientId: employeeId,
        recipientRole: 'employee',
        senderId: 'admin',
        senderName: 'Admin',
        type: 'stock_assigned',
        title: 'Stock Assigned',
        message: `You have been assigned ${qty} ${type}(s)`,
        details: {
          stockType: type,
          quantity: qty,
          employeeName: employee.name
        }
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }
    
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

export const returnStock = async (req, res) => {
  try {
    const { employeeId, type, qty } = req.body;
    console.log('Return stock request:', { employeeId, type, qty });
    
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    console.log('Employee found:', employee.name);
    console.log('Current returned stock:', employee.returned);

    // Only update the returned array
    const retIdx = employee.returned.findIndex(r => r.type === type);
    if (retIdx > -1) {
      employee.returned[retIdx].qty += Number(qty);
      console.log('Updated existing returned stock:', employee.returned[retIdx]);
    } else {
      employee.returned.push({ type, qty: Number(qty) });
      console.log('Added new returned stock:', { type, qty: Number(qty) });
    }
    
    await employee.save();
    console.log('Employee saved. Updated returned stock:', employee.returned);
    
    // Create notification for admin
    try {
      const Notification = (await import('../models/Notification.js')).default;
      await Notification.create({
        recipientId: 'admin',
        recipientRole: 'admin',
        senderId: employeeId,
        senderName: employee.name,
        type: 'stock_returned',
        title: 'Stock Returned',
        message: `${employee.name} has returned ${qty} ${type}(s)`,
        details: {
          stockType: type,
          quantity: qty,
          employeeName: employee.name
        }
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }
    
    res.json(employee.returned);
  } catch (error) {
    console.error('Error in returnStock:', error);
    res.status(500).json({ message: 'Failed to return stock' });
  }
};
