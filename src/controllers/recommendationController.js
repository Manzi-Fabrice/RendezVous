// src/controllers/recommendationController.js
import { fetchNearbyRestaurants } from '../services/googlePlaces.js';
import { getAIRecommendations } from '../services/openai.js';
import { geocodeAddress } from '../services/geocode.js';

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    console.log("📨 Full received request body:", req.body);

    // Destructure expected fields from the request body.
    // Set a default value for people if not provided.
    const {
      location,           // e.g. "Hanover, New Hampshire"
      maxDistance,        // e.g. 11 (in kilometers)
      cuisine,            // e.g. "Mexican"
      budget,             // e.g. "$$$"
      dietaryRestrictions,// e.g. ["Gluten-Free"]
      date,
      time,
      type,
      people = 1,         // default to 1 if undefined
      transport,
      restaurantType      // e.g. "Fast Food"
    } = req.body;

    // Validate required fields
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a city name (string)' });
    }
    if (!maxDistance) {
      return res.status(400).json({ error: 'maxDistance is required' });
    }

    // Geocode the city name into lat/lng
    console.log(`🌐 Geocoding city: ${location}`);
    const latLng = await geocodeAddress(location);
    console.log('🗺  Resolved lat/lng:', latLng);

    // Fetch restaurants from Google Places using the geocoded coordinates
    const restaurants = await fetchNearbyRestaurants(latLng, {
      maxDistance,
      cuisinePreferences: cuisine ? [cuisine] : [],
      restaurantType: restaurantType ? [restaurantType] : [],
      budget,
      dietaryRestrictions: dietaryRestrictions || []
    });

    // If no restaurants are found, return a response without calling AI
    if (restaurants.length === 0) {
      return res.json({
        restaurants: { count: 0, results: [] },
        aiRecommendations: { message: "No restaurants found for the given criteria." }
      });
    }

    // Call AI recommendations (optional)
    const aiRecommendations = await getAIRecommendations(restaurants, {
      date,
      time,
      type,
      people,
      cuisine,
      transport,
      budget,
      dietaryRestrictions
    });

    // Return final data to the frontend
    return res.json({
      restaurants: { count: restaurants.length, results: restaurants },
      aiRecommendations
    });

  } catch (error) {
    console.error('🚨 Error in getPersonalizedRecommendations:', error);
    return res.status(500).json({
      error: 'Failed to get recommendations',
      details: error.message
    });
  }
};
