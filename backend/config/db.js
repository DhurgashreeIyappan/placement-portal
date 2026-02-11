/**
 * MongoDB connection - single place for all Mongoose connection logic.
 */
import mongoose from 'mongoose';
import { env } from './env.js';

// Avoid deprecation warnings (Mongoose 7+)
mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
