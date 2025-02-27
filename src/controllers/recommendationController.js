import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';
import { fetchNearbyRestaurants } from '../services/googlePlaces.js';
import { calculateDistance } from '../utils/distance.js';
import { getAIRecommendations } from '../services/openai.js';


export const getFilteredRestaurants = async (req, res) => {
    try {
      // Ensure we're connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection not ready');
      }

      console.log("\n🔎 Starting restaurant search in database:", mongoose.connection.db.databaseName);
      
      // Try direct collection access first
      const db = mongoose.connection.db;
      const directResults = await db.collection('restaurants').find({}).toArray();
      console.log('Direct MongoDB query found:', directResults.length, 'restaurants');
      
      if (directResults.length === 0) {
        console.log('⚠️ No restaurants found in collection. Current collections:', 
          await db.listCollections().toArray().then(cols => cols.map(c => c.name)));
      }
      
      // Then try through Mongoose
      const restaurants = await Restaurant.find({}).lean();
      console.log('Mongoose query found:', restaurants.length, 'restaurants');
      
      // Return whichever results we found
      const results = restaurants.length > 0 ? restaurants : directResults;
      
      res.json({ 
        count: results.length,
        recommendations: results,
        source: restaurants.length > 0 ? 'mongoose' : 'direct'
      });
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      console.error("Full error object:", error);
      res.status(500).json({ error: `Failed to fetch recommendations: ${error.message}` });
    }
};

export const getRecommendations = async (req, res) => {
  try {
    const { 
      location = { lat: 40.7128, lng: -74.0060 },
      cuisinePreferences = [],
      features = [],
      priceRange,
      radius = 5000 
    } = req.query;

    console.log('📍 Fetching restaurants with params:', { location, cuisinePreferences });

    // Pass preferences to the service
    const restaurants = await fetchNearbyRestaurants({
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng)
    }, {
      cuisinePreferences: Array.isArray(cuisinePreferences) 
        ? cuisinePreferences 
        : [cuisinePreferences],
      radius,
      priceRange
    });

    // Enhanced scoring with more factors
    const scoredRestaurants = restaurants.map(restaurant => {
      let score = 0;
      let matchDetails = [];

      // Base score from rating (30 points max)
      const ratingScore = (restaurant.rating / 5) * 30;
      score += ratingScore;
      if (restaurant.rating >= 4.5) {
        matchDetails.push(`⭐ Highly rated ${restaurant.rating}/5`);
      }

      // Price range match (20 points)
      if (priceRange && restaurant.priceRange === priceRange) {
        score += 30;
        matchDetails.push(`💰 Matches your price preference (${restaurant.priceRange})`);
      }

      // Cuisine match (30 points max)
      if (cuisinePreferences.length > 0) {
        const matches = restaurant.cuisineTypes
          .filter(c => cuisinePreferences.includes(c.toLowerCase()));
        
        if (matches.length > 0) {
          score += 40;  // Big boost for cuisine match
          matchDetails.push(`🍝 ${matches.join(', ')} Restaurant`);
        }
      }

      // Currently open bonus (10 points)
      if (restaurant.isOpenNow) {
        score += 10;
        matchDetails.push('✅ Currently open');
      }

      // Add distance scoring (max 20 points for closest restaurants)
      const distance = calculateDistance(location, restaurant.location.coordinates);
      const distanceScore = Math.max(0, 20 - (distance * 2)); // Lose 2 points per km
      score += distanceScore;
      
      if (distance < 1) {
        matchDetails.push(`📍 Very close (${distance.toFixed(1)} km)`);
      } else if (distance < 3) {
        matchDetails.push(`📍 Nearby (${distance.toFixed(1)} km)`);
      }

      if (restaurant.cuisineTypes.includes('Italian')) {
        score += 40; // Give big boost to Italian places
        matchDetails.push('🍝 Authentic Italian Restaurant');
      }

      return {
        ...restaurant,
        distance: distance.toFixed(1),
        matchScore: Math.round(score),
        matchDetails
      };
    });

    // Sort by score and return top matches
    const recommendations = scoredRestaurants
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    // Return enhanced restaurant details
    res.json({
      count: recommendations.length,
      recommendations: recommendations.map(r => ({
        name: r.name,
        rating: r.rating,
        reviewCount: r.reviewCount,
        priceRange: r.priceRange,
        address: r.address,
        distance: r.distance,
        isOpenNow: r.isOpenNow,
        phone: r.phone,
        website: r.website,
        openingHours: r.openingHours,
        photos: r.photos,
        cuisineTypes: r.cuisineTypes,
        matchScore: r.matchScore,
        matchDetails: r.matchDetails,
        features: r.features,
        reviews: r.reviews?.map(review => ({
          rating: review.rating,
          text: review.text,
          time: review.time
        }))
      }))
    });

  } catch (error) {
    console.error('🚨 Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recommendations',
      details: error.message 
    });
  }
};

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userPreferences = req.body;
    console.log('📨 Received preferences:', userPreferences);

    // Get restaurants from Google Places
    const restaurants = await fetchNearbyRestaurants({
      lat: parseFloat(userPreferences.location.lat),
      lng: parseFloat(userPreferences.location.lng)
    }, {
      cuisinePreferences: userPreferences.cuisineTypes
    });

    // Get AI recommendations
    const aiSuggestions = await getAIRecommendations(
      restaurants,
      userPreferences
    );

    // Return both restaurant data and AI suggestions
    res.json({
      restaurants: {
        count: restaurants.length,
        results: restaurants
      },
      aiRecommendations: aiSuggestions
    });

  } catch (error) {
    console.error('🚨 Error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message 
    });
  }
};
  
  