import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './db.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import activityRoutes from './routes/activityRoutes.js';


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

connectDB();


app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
