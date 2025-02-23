import express from 'express';
import { getRecommendations, getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Add this test route
router.post('/test-restaurant', async (req, res) => {
  try {
    console.log('Creating test restaurant with data:', req.body);
    const restaurant = new Restaurant(req.body);
    const saved = await restaurant.save();
    console.log('Created restaurant:', saved);
    res.json(saved);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update to use the new recommendations function
router.get('/restaurants', getRecommendations);
router.post('/personalized', getPersonalizedRecommendations);

export default router;
