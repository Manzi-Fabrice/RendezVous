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

export default router;
