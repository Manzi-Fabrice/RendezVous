import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔥 MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected. Attempting Reconnection...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

// Export the connection function
export default connectDB;
