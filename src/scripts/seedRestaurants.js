import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import connectDB from '../db.js';

const testRestaurants = [
  {
    name: "Italian Delight",
    cuisine: ["Italian", "Mediterranean"],
    location: {
      type: "Point",
      coordinates: [-73.935242, 40.730610]
    },
    priceRange: "$$",
    rating: 4.5,
    features: ["Vegetarian", "Outdoor Seating"],
    popularDishes: ["Margherita Pizza", "Pasta Carbonara"],
    openingHours: {
      "Monday": { open: "11:00", close: "22:00" },
      "Tuesday": { open: "11:00", close: "22:00" },
      "Wednesday": { open: "11:00", close: "22:00" },
      "Thursday": { open: "11:00", close: "23:00" },
      "Friday": { open: "11:00", close: "23:00" },
      "Saturday": { open: "12:00", close: "23:00" },
      "Sunday": { open: "12:00", close: "22:00" }
    },
    ambiance: ["Casual", "Family-Friendly"]
  },
  {
    name: "Sushi Master",
    cuisine: ["Japanese", "Sushi"],
    location: {
      type: "Point",
      coordinates: [-73.936242, 40.731610]
    },
    priceRange: "$$$",
    rating: 4.8,
    features: ["Vegetarian", "Gluten-Free"],
    popularDishes: ["Dragon Roll", "Salmon Nigiri"],
    openingHours: {
      "Monday": { open: "12:00", close: "22:00" },
      "Tuesday": { open: "12:00", close: "22:00" },
      "Wednesday": { open: "12:00", close: "22:00" },
      "Thursday": { open: "12:00", close: "22:00" },
      "Friday": { open: "12:00", close: "23:00" },
      "Saturday": { open: "13:00", close: "23:00" },
      "Sunday": { open: "13:00", close: "21:00" }
    },
    ambiance: ["Fine Dining"]
  },
  {
    name: "Taco Fiesta",
    cuisine: ["Mexican", "Latin"],
    location: {
      type: "Point",
      coordinates: [-73.937242, 40.732610]
    },
    priceRange: "$",
    rating: 4.2,
    features: ["Family-Friendly", "Outdoor Seating"],
    popularDishes: ["Street Tacos", "Guacamole"],
    openingHours: {
      "Monday": { open: "11:00", close: "21:00" },
      "Tuesday": { open: "11:00", close: "21:00" },
      "Wednesday": { open: "11:00", close: "21:00" },
      "Thursday": { open: "11:00", close: "21:00" },
      "Friday": { open: "11:00", close: "22:00" },
      "Saturday": { open: "11:00", close: "22:00" },
      "Sunday": { open: "11:00", close: "20:00" }
    },
    ambiance: ["Casual"]
  }
];

const seedDatabase = async () => {
  try {
    // First ensure we're connected
    const connection = await connectDB();
    console.log('Connected to database:', connection.name);

    // Clear existing restaurants
    console.log('Clearing existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('🗑️ Cleared existing restaurants');

    // Insert new restaurants
    console.log('Inserting new restaurants...');
    const inserted = await Restaurant.insertMany(testRestaurants);
    console.log(`✅ Added ${inserted.length} restaurants to database`);

    // Verify the data
    const count = await Restaurant.countDocuments();
    console.log(`📊 Total restaurants in database: ${count}`);

    // Close the connection
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 