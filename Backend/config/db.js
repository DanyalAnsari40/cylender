import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://danyalansari69840:123123dA@cluster0.di6sae0.mongodb.net/cylender';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to cylender database');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
