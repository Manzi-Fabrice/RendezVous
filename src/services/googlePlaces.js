import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from 'dotenv';
import { calculateDistance } from '../utils/distance.js';
dotenv.config();

const client = new Client({});

export async function fetchNearbyRestaurants(location, preferences) {
  try {
    console.log('🔍 Searching with preferences:', preferences);
    
    const params = {
      location,
      radius: preferences.searchRadius || 5000,
      type: 'restaurant',
      minprice: preferences.priceRangePreference?.length ? 
        Math.min(...preferences.priceRangePreference.map(p => p.length)) : 0,
      maxprice: preferences.priceRangePreference?.length ?
        Math.max(...preferences.priceRangePreference.map(p => p.length)) : 4,
      keyword: preferences.cuisinePreferences?.length ?
        `${preferences.cuisinePreferences.join('|')} restaurant` : 'restaurant',
      key: process.env.GOOGLE_MAPS_API_KEY,
      rankby: preferences.rankByDistance ? 'distance' : undefined,
      opennow: preferences.openNow || undefined
    };

    // Enhanced feature extraction
    function extractFeatures(place) {
      const features = [];
      
      // Price level features
      if (place.price_level) {
        features.push(`Price: ${place.price_level}`);
      }

      // Rating-based features
      if (place.rating >= 4.5) features.push('Top Rated');
      else if (place.rating >= 4.0) features.push('Well Rated');

      // Dietary features from place details
      if (place.types.includes('halal')) features.push('Halal');
      if (place.types.includes('kosher')) features.push('Kosher');
      if (place.types.includes('vegetarian')) features.push('Vegetarian-Friendly');

      // Vibe features
      if (place.price_level >= 3) features.push('Fine Dining');
      if (place.types.includes('family_restaurant')) features.push('Family-Friendly');
      if (place.types.includes('bar')) features.push('Bar Available');
      if (place.outdoor_seating) features.push('Outdoor Seating');

      return features;
    }

    // Log the search parameters
    console.log('Search params:', params);

    const response = await client.placesNearby({
      params: params
    });

    console.log('Found restaurants:', response.data.results.length);

    // Get detailed information for each restaurant
    const detailedRestaurants = await Promise.all(
      response.data.results
        .filter(place => 
          place.types.includes('restaurant') && 
          !place.types.includes('lodging')  // Exclude hotels
        )
        .map(async place => {
          const details = await getPlaceDetails(place.place_id);
          const distance = calculateDistance(location, {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          });

          return {
            name: place.name,
            rating: place.rating,
            reviewCount: place.user_ratings_total,
            priceRange: place.price_level ? '$'.repeat(place.price_level) : 'N/A',
            address: place.vicinity,
            isOpenNow: place.opening_hours?.open_now || false,
            photos: place.photos?.map(photo => ({
              reference: photo.photo_reference,
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            })) || [],
            location: {
              type: "Point",
              coordinates: [place.geometry.location.lng, place.geometry.location.lat]
            },
            features: extractFeatures(place),
            cuisineTypes: [
              ...(place.name.toLowerCase().includes('india') ? ['Indian'] : []),
              ...place.types
                .filter(type => {
                  const cleanType = type.toLowerCase().replace('_restaurant', '');
                  return cuisineMapping[cleanType];
                })
                .map(type => {
                  const cleanType = type.toLowerCase().replace('_restaurant', '');
                  return cuisineMapping[cleanType];
                })
                .filter(Boolean)
            ],
            phone: details?.formatted_phone_number || null,
            website: details?.website || null,
            openingHours: details?.opening_hours?.weekday_text || null,
            reviews: details?.reviews?.slice(0, 3) || [],
            priceLevel: details?.price_level,
            businessStatus: place.business_status,
            distance: {
              value: distance,
              text: `${distance.toFixed(1)} km`
            },
            neighborhood: details?.address_components?.find(c => 
              c.types.includes('neighborhood'))?.long_name,
            transitOptions: details?.transit_options || [],
            parkingAvailable: details?.parking || false,
            accessibility: details?.wheelchair_accessible || false
          };
        })
    );

    // Sort by preference
    return detailedRestaurants.sort((a, b) => {
      if (preferences.rankByDistance) return a.distance.value - b.distance.value;
      return b.rating - a.rating;
    });
  } catch (error) {
    console.error('❌ Google Places API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Get additional details for a specific restaurant
export async function getPlaceDetails(placeId) {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
        fields: [
          'formatted_phone_number',
          'opening_hours',
          'website',
          'reviews',
          'price_level',
          'formatted_address',
          'url',  // Google Maps link
          'address_components',
          'transit_options',
          'parking',
          'wheelchair_accessible'
        ]
      }
    });

    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

// Simplify cuisine mapping
const cuisineMapping = {
  'italian': 'Italian',
  'italian_restaurant': 'Italian',
  'pizza': 'Italian',
  'japanese': 'Japanese',
  'japanese_restaurant': 'Japanese',
  'sushi': 'Japanese',
  'chinese': 'Chinese',
  'chinese_restaurant': 'Chinese',
  'thai': 'Thai',
  'thai_restaurant': 'Thai',
  'mexican': 'Mexican',
  'mexican_restaurant': 'Mexican',
  'indian': 'Indian',
  'indian_restaurant': 'Indian',
  'curry': 'Indian',
  'south_indian': 'Indian',
  'north_indian': 'Indian',
  // ... other cuisines
};

// Add more specific restaurant types
const restaurantTypes = [
  'restaurant',
  'food',
  'meal_takeaway',
  'meal_delivery',
  'cafe',
  'bar',
  'bakery'
];

// Add more specific Italian types
const italianTypes = [
  'italian_restaurant',
  'italian',
  'pizza',
  'ristorante',
  'trattoria',
  'osteria',
  'pizzeria',
  'pasta'
]; 