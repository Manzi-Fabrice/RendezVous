import mongoose from 'mongoose';

// Add debug logging for the URI
const mongoURI = process.env.MONGO_URI || "mongodb+srv://niyigabamanzifabrice:1opiB1L7WZl109B3@cluster0.w4yli.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', mongoURI);

    await mongoose.connect(mongoURI, {
      dbName: 'Cluster0' // Explicitly set database name
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📌 Using database: ${mongoose.connection.db.databaseName}`);

    // Test direct connection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Test restaurant collection
    const count = await db.collection('restaurants').countDocuments();
    console.log(`Found ${count} restaurants in database`);

    const sample = await db.collection('restaurants').findOne();
    console.log('Sample restaurant:', sample);

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Full error:', error);
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
