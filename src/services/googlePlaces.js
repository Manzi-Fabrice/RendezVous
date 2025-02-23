import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({});

export async function fetchNearbyRestaurants(location, options = {}) {
  try {
    console.log('🔍 Calling Google Places API with:', { location, options });
    
    const response = await client.placesNearby({
      params: {
        location,
        radius: options.radius || 5000,
        type: 'restaurant',
        keyword: options.cuisinePreferences 
          ? `${options.cuisinePreferences.join(' ')} restaurant` 
          : 'restaurant',
        minprice: 1,
        maxprice: 4,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    // Get detailed information for each restaurant
    const detailedRestaurants = await Promise.all(
      response.data.results
        .filter(place => 
          place.types.includes('restaurant') && 
          !place.types.includes('lodging')  // Exclude hotels
        )
        .map(async place => {
          const details = await getPlaceDetails(place.place_id);
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
              // Add cuisine from name if it matches
              ...(place.name.toLowerCase().includes('italian') ? ['Italian'] : []),
              // Add cuisine from types
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
            // Add new details
            phone: details?.formatted_phone_number || null,
            website: details?.website || null,
            openingHours: details?.opening_hours?.weekday_text || null,
            reviews: details?.reviews?.slice(0, 3) || [],
            priceLevel: details?.price_level,
            businessStatus: place.business_status
          };
        })
    );

    return detailedRestaurants;
  } catch (error) {
    console.error('❌ Google Places API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to extract features from place data
function extractFeatures(place) {
  const features = [];
  
  if (place.price_level >= 3) features.push('Fine Dining');
  if (place.opening_hours?.open_now) features.push('Open Now');
  if (place.rating >= 4.5) features.push('Highly Rated');
  
  const typeToFeature = {
    'meal_takeaway': 'Takeout',
    'meal_delivery': 'Delivery',
    'family_restaurant': 'Family-Friendly',
    'pizza': 'Pizza',
    'pasta': 'Pasta',
    'wine_bar': 'Wine Bar',
    'cafe': 'Café'
  };

  place.types.forEach(type => {
    if (typeToFeature[type]) {
      features.push(typeToFeature[type]);
    }
  });

  return features;
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
          'url'  // Google Maps link
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