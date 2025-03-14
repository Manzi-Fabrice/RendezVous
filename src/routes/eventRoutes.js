import express from 'express';
import { getEvents, createEvent, updateEventStatus, getUpcomingDates, getEventById,deleteEvent } from '../controllers/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware,getEvents);

router.get('/upcoming', authMiddleware, getUpcomingDates);

router.get('/:id', authMiddleware, getEventById);

router.post('/', authMiddleware, createEvent);

router.patch('/status', authMiddleware, updateEventStatus);

router.delete('/:id', authMiddleware, deleteEvent);


export default router;
