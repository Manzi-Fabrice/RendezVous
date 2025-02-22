import express from 'express';
import { getEvents, createEvent, updateEventStatus } from '../controllers/eventController.js';

const router = express.Router();

// Get all events
router.get('/', getEvents);

// Create a new event
router.post('/', createEvent);

// Update event status (Pending, Confirmed, Canceled)
router.patch('/status', updateEventStatus);

export default router;
