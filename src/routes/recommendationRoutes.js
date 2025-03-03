import express from 'express';
import { getRecommendations, getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import Restaurant from '../models/Restaurant.js';
import { fetchNearbyRestaurants } from '../services/googlePlaces.js';
import { getAIRecommendations } from '../services/openai.js';

const router = express.Router();

/**
 * ✅ Test route to create a restaurant in the database
 */
router.post('/test-restaurant', async (req, res) => {
  try {
    console.log('Creating test restaurant with data:', req.body);
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
 * ✅ Get restaurant recommendations (Standard API)
 */
router.get('/restaurants', getRecommendations);

/**
 * ✅ Personalized recommendations route (Full DateContext)
 */
router.post('/personalized', async (req, res) => {
  try {
    const {
      date,
      time,
      type,
      people,
      location,
      transport,
      maxDistance,
      restaurantType,
      cuisine,
      budget,
      dietaryRestrictions
    } = req.body;

    console.log('📨 Received full date plan:', req.body);

    // Fetch restaurants based on user filters
    const restaurants = await fetchNearbyRestaurants(location, {
      maxDistance,
      priceRangePreference: budget ? [budget] : [],
      cuisinePreferences: cuisine ? [cuisine] : [],
      restaurantType: restaurantType ? [restaurantType] : [],
      dietaryRestrictions: dietaryRestrictions || [],
    });

    // AI recommendations should consider time, event type, and group size
    const aiRecommendations = await getAIRecommendations(restaurants, {
      date,
      time,
      type,
      people,
      cuisine,
      transport
    });

    res.json({
      restaurants: { count: restaurants.length, results: restaurants },
      aiRecommendations
    });

  } catch (error) {
    console.error('🚨 Error:', error);
    res.status(500).json({ error: 'Failed to get recommendations', details: error.message });
  }
});

/**
 * ✅ Test Google Places API with user-provided parameters
 */
router.post('/test/places', async (req, res) => {
  try {
    console.log('🔍 Testing Google Places API with params:', req.body);
    
    const { location, restaurantName, cuisineTypes } = req.body;
    const preferences = {
      restaurantName: restaurantName || '', // Use user input or empty string
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
 * ✅ Test AI-based recommendations
 */
router.post('/test/ai', async (req, res) => {
  try {
    console.log('🤖 Testing OpenAI with sample data');

    const sampleRestaurants = [
      {
        name: "Bella Italia",
        rating: 4.5,
        cuisineTypes: ["Italian"],
        priceRange: "$$",
        address: "123 Main St",
        reviewCount: 150,
        features: ["Outdoor Seating", "Romantic Atmosphere"]
      },
      {
        name: "Roma's Kitchen",
        rating: 4.3,
        cuisineTypes: ["Italian", "Mediterranean"],
        priceRange: "$$$",
        address: "456 Park Ave",
        reviewCount: 200,
        features: ["Wine Bar", "Private Dining"]
      }
    ];

    const aiSuggestions = await getAIRecommendations(sampleRestaurants, req.body);

    res.json(aiSuggestions);

  } catch (error) {
    console.error('❌ Test AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Compare Google Places API results with AI-enhanced recommendations
 */
router.post('/test/comparison', async (req, res) => {
  try {
    console.log('🆚 Comparing Google Places results with AI recommendations');

    const googleResults = await fetchNearbyRestaurants(
      req.body.location || { lat: 43.7044, lng: -72.2887 },
      { cuisinePreferences: req.body.cuisineTypes }
    );

    const aiResults = await getAIRecommendations(googleResults, req.body);

    res.json({
      googlePlaces: { count: googleResults.length, results: googleResults },
      aiEnhanced: aiResults
    });

  } catch (error) {
    console.error('❌ Comparison Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Test DeepSeek API (Placeholder)
 */
router.get('/test/deepseek', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-8c2b7011a2e44205b98a07cd4ff7f1dc`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Say hello!' }],
        stream: false
      })
    });

    const data = await response.json();
    console.log('📝 DeepSeek Test Response:', data);

    res.json({ success: response.ok, status: response.status, data: data });

  } catch (error) {
    console.error('❌ DeepSeek Test Error:', error);
    res.status(500).json({ success: false, error: error.message, details: error });
  }
});

/**
 * ✅ Simple test endpoint to verify the API is running
 */
router.get('/test', (req, res) => {
  res.json({ message: '✅ Recommendation routes working!' });
});

export default router;
