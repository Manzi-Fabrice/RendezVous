import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || "mongodb+srv://niyigabamanzifabrice:1opiB1L7WZl109B3@cluster0.w4yli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected Successfully!`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle MongoDB Disconnection
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB Disconnected. Attempting Reconnection...');
  connectDB();
});

// Handle MongoDB Errors
mongoose.connection.on('error', (err) => {
  console.error(' MongoDB Error:', err);
});

export default connectDB;
