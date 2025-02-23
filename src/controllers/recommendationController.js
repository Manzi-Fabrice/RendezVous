import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';

// export const getFilteredRestaurants = async (req, res) => {
//   try {
//     console.log("✅ Fetching restaurant recommendations...");

//     // Hardcoded test preferences (since no authentication)
//     const foodPreferences = ["Italian", "Mexican"]; // Replace with actual values from frontend
//     const maxDistance = 10; // Optional, distance in km (not implemented yet)

//     // Debugging: Log MongoDB Connection
//     console.log(`🔍 Connected to MongoDB: ${process.env.MONGO_URI}`);

//     // Construct query for MongoDB
//     let query = {
//       cuisine: { $in: foodPreferences } // Matches at least one preferred cuisine
//     };

//     // (Optional) If maxDistance is provided, filter by location (not implemented yet)
//     /*
//     if (maxDistance) {
//       query.location = {
//         $near: {
//           $geometry: { type: "Point", coordinates: [-73.935242, 40.730610] }, // Example: NYC coordinates
//           $maxDistance: maxDistance * 1000 // Convert km to meters
//         }
//       };
//     }
//     */

//     console.log("🔍 Query being used:", JSON.stringify(query, null, 2));

//     // Fetch restaurants based on query
//     const restaurants = await Restaurant.find(query).limit(10);

//     // Debugging: Check if restaurants were found
//     console.log(`✅ Found ${restaurants.length} restaurants`);

//     // Return filtered results
//     res.json({ recommendations: restaurants });
//   } catch (error) {
//     console.error("❌ Error fetching recommendations:", error);
//     res.status(500).json({ error: `Failed to fetch recommendations: ${error.message}` });
//   }
// };
// export const getFilteredRestaurants = async (req, res) => {
//     try {
//       console.log("✅ Fetching restaurant recommendations...");
  
//       // Hardcoded test preferences for now
//       const foodPreferences = ["Italian", "Mexican"];
  
//       console.log(`🔍 Searching for cuisines: ${JSON.stringify(foodPreferences)}`);
  
//       // Use a simple $in query without $elemMatch
//       let query = {
//         cuisine: { $in: foodPreferences }
//       };
  
//       console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2));
  
//       const restaurants = await Restaurant.find(query).limit(10);
  
//       console.log(`✅ Found ${restaurants.length} restaurants`);
  
//       res.json({ recommendations: restaurants });
//     } catch (error) {
//       console.error("❌ Error fetching recommendations:", error);
//       res.status(500).json({ error: `Failed to fetch recommendations: ${error.message}` });
//     }
//   };


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
      cuisinePreferences = [],
      priceRange,
      features = [],
      location,
      radius = 5000, // meters
      minRating = 0,
      timeOfDay,
      ambiance = []
    } = req.query;

    // Base query
    let query = {};

    // Cuisine preferences with weighted scoring
    if (cuisinePreferences.length > 0) {
      query.cuisine = { $in: cuisinePreferences };
    }

    // Feature matching
    if (features.length > 0) {
      query.features = { $in: features };
    }

    // Price range filter
    if (priceRange) {
      query.priceRange = priceRange;
    }

    // Location-based filtering
    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      };
    }

    // Rating threshold
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Get matching restaurants
    const restaurants = await Restaurant.find(query);

    // AI scoring system
    const scoredRestaurants = restaurants.map(restaurant => {
      let score = 0;
      
      // Cuisine match score (40% weight)
      if (cuisinePreferences.length > 0) {
        const cuisineMatchCount = restaurant.cuisine.filter(c => 
          cuisinePreferences.includes(c)).length;
        score += (cuisineMatchCount / cuisinePreferences.length) * 40;
      } else {
        score += 40; // Give full score if no preferences specified
      }

      // Feature match score (30% weight)
      if (features.length > 0) {
        const featureMatchCount = restaurant.features.filter(f => 
          features.includes(f)).length;
        score += (featureMatchCount / features.length) * 30;
      } else {
        score += 30; // Give full score if no features specified
      }

      // Rating score (20% weight)
      if (restaurant.rating) {
        score += (restaurant.rating / 5) * 20;
      }

      // Ambiance match score (10% weight)
      if (ambiance.length > 0 && restaurant.ambiance) {
        const ambianceMatchCount = restaurant.ambiance.filter(a => 
          ambiance.includes(a)).length;
        score += (ambianceMatchCount / ambiance.length) * 10;
      } else {
        score += 10; // Give full score if no ambiance specified
      }

      return {
        ...restaurant.toObject(),
        matchScore: Math.round(score)
      };
    });

    // Sort by score and return top matches
    const recommendations = scoredRestaurants
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json({
      count: recommendations.length,
      recommendations
    });

  } catch (error) {
    console.error('❌ Recommendation Error:', error);
    res.status(500).json({ error: error.message });
  }
};
  
  