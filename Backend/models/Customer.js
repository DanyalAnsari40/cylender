import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  trn: String,
  phone: String,
  email: String,
  address: String,
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
