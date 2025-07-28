import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  cylinderType: { type: String, required: true },
  quantity: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  checkNumber: String,
  bankName: String,
  cashAmount: Number,
  category: { type: String, required: true },
  itemName: { type: String, required: true },
});

const Cylinder = mongoose.model('Cylinder', DepositSchema);

export default Cylinder;
