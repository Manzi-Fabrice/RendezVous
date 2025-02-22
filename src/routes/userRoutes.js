import express from 'express';
import { getUsers, createUser, saveEvent } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Create a new user
router.post('/', createUser);

// Save an event to user's saved events
router.post('/save-event', saveEvent);

export default router;
