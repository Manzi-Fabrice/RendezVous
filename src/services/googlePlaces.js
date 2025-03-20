import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@googlemaps/google-maps-services-js';
import { calculateDistance } from '../utils/distance.js';

const client = new Client({});

export async function fetchNearbyRestaurants(location, preferences) {
  try {
    const { lat, lng } = location;
    const {
      maxDistance,
      cuisinePreferences,
      restaurantType,
      budget,
      dietaryRestrictions
    } = preferences;
    const distanceInMeters = (maxDistance ?? 10) * 1000;
    const params = {
      location: `${lat},${lng}`,
      radius: distanceInMeters,
      type: 'restaurant',
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    if (preferences.restaurantName && preferences.restaurantName.trim().length > 0) {
      params.keyword = preferences.restaurantName.trim();
    } else if (restaurantType && restaurantType.length > 0) {
      params.keyword = `${restaurantType.join(' ')} restaurant`;
    } else if (cuisinePreferences && cuisinePreferences.length > 0) {
      params.keyword = cuisinePreferences.join(' ');
    }

    if (budget && budget.length > 0) {
      params.minprice = budget.length;
      params.maxprice = budget.length;
    }

    const response = await client.placesNearby({ params });
    const places = response.data.results || [];

    const userLat = lat;
    const userLng = lng;

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
    throw error;
  }
}
