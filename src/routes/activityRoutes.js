import express from 'express';
import { getActivities, createActivity, updateActivityStatus } from '../controllers/activityController';

const router = express.Router();

// Get all activities
router.get('/', getActivities);

// Create a new activity
router.post('/', createActivity);

// Update activity status (Pending, Confirmed, Canceled)
router.patch('/status', updateActivityStatus);

export default router;
