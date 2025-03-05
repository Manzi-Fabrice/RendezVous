// src/routes/recommendationRoutes.js
import express from 'express';
import { getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import { fetchNearbyRestaurants } from '../services/googlePlaces.js'; 
// (Remove getRecommendations import if not provided by the controller)

const router = express.Router();

/**
 * ✅ Test route to create a restaurant in the database
 */
router.post('/test-restaurant', async (req, res) => {
  try {
    console.log('Creating test restaurant with data:', req.body);
    // Assuming Restaurant model is available in your project
    // (Import it here if needed)
    const restaurant = new Restaurant(req.body);
    const saved = await restaurant.save();
    console.log('✅ Created restaurant:', saved);
    res.json(saved);
  } catch (error) {
    console.error('❌ Error creating restaurant:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Personalized recommendations route (Full DateContext)
 * This route uses the updated controller function that:
 *  1. Accepts location as a city name,
 *  2. Geocodes it,
 *  3. Uses maxDistance and other preferences to call Google Places,
 *  4. (Optionally) Calls AI for further recommendations.
 */
router.post('/personalized', getPersonalizedRecommendations);

/**
 * ✅ (Optional) Test route for Google Places API with user-provided parameters
 */
router.post('/test/places', async (req, res) => {
  try {
    console.log('🔍 Testing Google Places API with params:', req.body);
    
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
    console.error('❌ Google Places Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ (Optional) Simple test endpoint to verify the API is running
 */
router.get('/test', (req, res) => {
  res.json({ message: '✅ Recommendation routes working!' });
});

export default router;
