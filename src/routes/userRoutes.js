import express from 'express';
import { getUsers, createUser, loginUser, saveEvent } from '../controllers/userController.js';
import User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUsers);

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/save-event', authMiddleware, saveEvent);
router.post('/save-restaurant', authMiddleware, async (req, res) => {
  try {
    const { userId, restaurant } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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

router.get('/:userId/saved-restaurants', authMiddleware, async (req, res) => {

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

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    console.log(`Fetching user with ID: ${req.params.userId}`);
    console.log(`User from token: ${JSON.stringify(req.user)}`);
    
    const user = await User.findById(req.params.userId).populate('savedEvents');
    console.log(`User found: ${user ? 'Yes' : 'No'}`);
    
    if (!user) {
      console.log(`User not found with ID: ${req.params.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`Returning user data: ${user.name}, ${user.email}`);
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
