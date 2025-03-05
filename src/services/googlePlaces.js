// src/services/googlePlaces.js
import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@googlemaps/google-maps-services-js';
import { calculateDistance } from '../utils/distance.js';

const client = new Client({});

export async function fetchNearbyRestaurants(location, preferences) {
  try {
    console.log('🔍 Searching with preferences:', preferences);
    
    // Destructure the location values
    const { lat, lng } = location; // e.g. { lat: 43.7022451, lng: -72.2895526 }
    const {
      maxDistance,
      cuisinePreferences,
      restaurantType,
      budget,
      dietaryRestrictions
    } = preferences;
    
    // Convert km to meters (default to 10 km if maxDistance is undefined)
    const distanceInMeters = (maxDistance ?? 10) * 1000;
    
    // Build params for the Google Places Nearby Search
    const params = {
      location: `${lat},${lng}`,
      radius: distanceInMeters,
      type: 'restaurant',
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    // Use restaurantType or cuisinePreferences to set keyword
    if (restaurantType && restaurantType.length > 0) {
      params.keyword = `${restaurantType.join(' ')} restaurant`;
    } else if (cuisinePreferences && cuisinePreferences.length > 0) {
      params.keyword = cuisinePreferences.join(' ');
    }

    // If budget is provided (e.g. "$$" → length=2)
    if (budget && budget.length > 0) {
      params.minprice = budget.length;
      params.maxprice = budget.length;
    }

    console.log('Search params:', params);
    const response = await client.placesNearby({ params });
    const places = response.data.results || [];
    console.log(`✅ Found ${places.length} places from Google Places`);
    
    // Capture lat and lng into new constants to ensure they are in scope inside the map callback
    const userLat = lat;
    const userLng = lng;
    
    // Simplify the results, returning a "distance" object
    const simplified = places.map(place => {
      const distanceKm = calculateDistance({ lat: userLat, lng: userLng }, {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      });
      
      return {
        name: place.name,
        rating: place.rating || null,
        userRatingsTotal: place.user_ratings_total || 0,
        priceLevel: place.price_level ?? null,
        address: place.vicinity,
        photos: place.photos?.map(photo => ({
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        })) || [],
        distance: {
          value: distanceKm,
          text: `${distanceKm.toFixed(2)} km`
        },
        isOpenNow: place.opening_hours?.open_now ?? false,
      };
    });
    
    return simplified;
    
  } catch (error) {
    console.error('❌ Google Places API Error:', error.response?.data || error.message);
    throw error;
  }
}
