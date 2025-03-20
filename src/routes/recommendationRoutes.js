import express from 'express';
import { getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import { fetchNearbyRestaurants } from '../services/googlePlaces.js';

const router = express.Router();

router.post('/test-restaurant', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const saved = await restaurant.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/personalized', getPersonalizedRecommendations);


router.post('/test/places', async (req, res) => {
  try {
    const { location, restaurantName, cuisineTypes } = req.body;
    const preferences = {
      restaurantName: restaurantName || '',
      cuisinePreferences: cuisineTypes || ['italian']
    };

    const restaurants = await fetchNearbyRestaurants(location || { lat: 40.7128, lng: -74.0060 }, preferences);

    res.json({
      count: restaurants.length,
      results: restaurants
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
