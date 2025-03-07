import express from 'express';
import { getEvents, createEvent, updateEventStatus, getUpcomingDates } from '../controllers/eventController.js';

const router = express.Router();

// Get all events
router.get('/', getEvents);

// Get upcoming dates for home screen
router.get('/upcoming', getUpcomingDates);

// Create a new event
router.post('/', createEvent);

// Update event status (Pending, Confirmed, Canceled)
router.patch('/status', updateEventStatus);

export default router;
