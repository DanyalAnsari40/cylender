import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  category: {
    type: String,
    enum: ['gas', 'cylinder'],
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  invoice: String,
  customer: String,
  date: String,
  products: [productSchema],
  total: Number,
  paid: Number,
  due: Number,
  status: String,
  note: String,
});

export default mongoose.model('Sale', saleSchema);
