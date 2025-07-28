import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['gas', 'cylinder'], required: true },
  costPrice: { type: Number, required: true },
  leastPrice: { type: Number, required: true },
  gasType: { type: String }, // Optional for cylinder
}, { timestamps: true });

export default mongoose.model('Product', productSchema); 