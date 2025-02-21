import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './db';

import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import activityRoutes from './routes/activityRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Enable JSON body parsing

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);

// Root endpoint (Hello World check)
app.get('/', (req, res) => {
  res.send('🔥 API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
