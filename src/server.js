// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './db.js'; // Ensure you have your DB connection file if needed
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Log all incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Log available routes (optional)
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  res.json(routes);
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
