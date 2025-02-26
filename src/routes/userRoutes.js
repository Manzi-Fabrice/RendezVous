import express from 'express';
import { getUsers, createUser, saveEvent } from '../controllers/userController.js';
import User from '../models/userModel.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Create a new user
router.post('/', createUser);

// Save an event to user's saved events
router.post('/save-event', saveEvent);

// Add this route
router.post('/save-restaurant', async (req, res) => {
  try {
    const { userId, restaurant } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add restaurant to user's saved restaurants
    if (!user.savedRestaurants) {
      user.savedRestaurants = [];
    }
    user.savedRestaurants.push(restaurant);
    await user.save();
    
    res.json({ message: 'Restaurant saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route
router.get('/:userId/saved-restaurants', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.savedRestaurants || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
