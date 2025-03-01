import express from 'express';
import { getRecommendations, getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import Restaurant from '../models/Restaurant.js';
import { fetchNearbyRestaurants } from '../services/googlePlaces.js';
import { getAIRecommendations } from '../services/openai.js';

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
router.post('/personalized', async (req, res) => {
  try {
    // 1. First gets real restaurants from Google
    const restaurants = await fetchNearbyRestaurants(
      req.body.location,
      { cuisinePreferences: req.body.cuisineTypes }
    );

    // 2. Then sends these real restaurants to AI for analysis
    const aiSuggestions = await getAIRecommendations(
      restaurants,  // Real restaurant data from Google
      req.body     // User preferences
    );

    res.json(aiSuggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Recommendation routes working' });
});

// Test Google Places
router.post('/test/places', async (req, res) => {
  try {
    console.log('Testing Google Places API with params:', req.body);
    // Build a preferences object that includes restaurantName if provided
    const preferences = {
      restaurantName: req.body.restaurantName, // This will be used in fetchNearbyRestaurants
      cuisinePreferences: req.body.cuisineTypes || ['italian']
    };
    const restaurants = await fetchNearbyRestaurants(
      req.body.location || { lat: 40.7128, lng: -74.0060 },
      preferences
    );
    res.json({
      count: restaurants.length,
      results: restaurants
    });
  } catch (error) {
    console.error('Google Places Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Test OpenAI
router.post('/test/ai', async (req, res) => {
  try {
    console.log('Testing OpenAI with sample data');
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

    const aiSuggestions = await getAIRecommendations(
      sampleRestaurants,
      req.body
    );
    res.json(aiSuggestions);
  } catch (error) {
    console.error('Test AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/test/comparison', async (req, res) => {
  try {
    // 1. Get base restaurants from Google using provided location
    const googleResults = await fetchNearbyRestaurants(
      req.body.location || {
        lat: 43.7044,  // Dartmouth coordinates as fallback
        lng: -72.2887
      },
      {
        cuisinePreferences: req.body.cuisineTypes
      }
    );

    // 2. Get AI enhanced recommendations
    const aiResults = await getAIRecommendations(
      googleResults,
      req.body
    );

    res.json({
      googlePlaces: {
        count: googleResults.length,
        results: googleResults
      },
      aiEnhanced: aiResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const simplePrompt = "Tell me about Italian cuisine.";

// Add a simple test endpoint
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
        messages: [
          { role: 'user', content: 'Say hello!' }
        ],
        stream: false
      })
    });

    const data = await response.json();
    console.log('Test Response:', {
      status: response.status,
      headers: response.headers,
      data: data
    });

    res.json({
      success: response.ok,
      status: response.status,
      data: data
    });
  } catch (error) {
    console.error('Test Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error
    });
  }
});

export default router;
