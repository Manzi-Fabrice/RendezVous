import { fetchNearbyRestaurants } from '../services/googlePlaces.js';
import { getAIRecommendations } from '../services/openai.js';
import { geocodeAddress } from '../services/geocode.js';

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const {
      location,
      maxDistance,
      cuisine,
      budget,
      dietaryRestrictions,
      date,
      time,
      type,
      people = 1,
      transport,
      restaurantType
    } = req.body;

    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a city name (string)' });
    }
    if (!maxDistance) {
      return res.status(400).json({ error: 'maxDistance is required' });
    }

    const latLng = await geocodeAddress(location);

    const restaurants = await fetchNearbyRestaurants(latLng, {
      maxDistance,
      cuisinePreferences: cuisine ? [cuisine] : [],
      restaurantType: restaurantType ? [restaurantType] : [],
      budget,
      dietaryRestrictions: dietaryRestrictions || []
    });
    if (restaurants.length === 0) {
      return res.json({
        restaurants: { count: 0, results: [] },
        aiRecommendations: { message: "No restaurants found for the given criteria." }
      });
    }

    // Call AI recommendations
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
    return res.status(500).json({
      error: 'Failed to get recommendations',
      details: error.message
    });
  }
};
