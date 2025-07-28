import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'active' },
    stock: [
      {
        type: { type: String, enum: ['cylinder', 'gas'], required: true },
        qty: { type: Number, required: true, default: 0 }
      }
    ],
    // Track returned stock from employee to admin
    returned: [
      {
        type: { type: String, enum: ['cylinder', 'gas'], required: true },
        qty: { type: Number, required: true, default: 0 }
      }
    ],
    role: { type: String, default: 'employee' } 
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
