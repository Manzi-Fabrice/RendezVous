import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import connectDB from '../db.js';

const realRestaurants = [
  {
    name: "Gramercy Tavern",
    cuisine: ["American", "Contemporary"],
    location: {
      type: "Point",
      coordinates: [-73.9884, 40.7385]
    },
    priceRange: "$$$$",
    rating: 4.8,
    features: ["Fine Dining", "Vegetarian Options", "Wine List"],
    popularDishes: ["Seasonal Tasting Menu", "Duck Breast", "Chocolate Bread Pudding"],
    openingHours: {
      "Monday": { open: "17:00", close: "22:00" },
      "Tuesday": { open: "17:00", close: "22:00" },
      "Wednesday": { open: "17:00", close: "22:00" },
      "Thursday": { open: "17:00", close: "22:00" },
      "Friday": { open: "17:00", close: "23:00" },
      "Saturday": { open: "17:00", close: "23:00" },
      "Sunday": { open: "17:00", close: "22:00" }
    },
    ambiance: ["Fine Dining", "Romantic", "Upscale"],
    description: "Iconic fine-dining destination offering refined American cuisine in a sophisticated setting",
    imageUrl: "https://example.com/gramercy-tavern.jpg"
  },
  {
    name: "Lombardi's Pizza",
    cuisine: ["Italian", "Pizza"],
    location: {
      type: "Point",
      coordinates: [-73.9957, 40.7217]
    },
    priceRange: "$$",
    rating: 4.5,
    features: ["Historic", "Family-Friendly", "Casual"],
    popularDishes: ["Margherita Pizza", "Clam Pizza", "Meatballs"],
    openingHours: {
      "Monday": { open: "11:30", close: "23:00" },
      "Tuesday": { open: "11:30", close: "23:00" },
      "Wednesday": { open: "11:30", close: "23:00" },
      "Thursday": { open: "11:30", close: "23:00" },
      "Friday": { open: "11:30", close: "00:00" },
      "Saturday": { open: "11:30", close: "00:00" },
      "Sunday": { open: "11:30", close: "23:00" }
    },
    ambiance: ["Casual", "Historic", "Lively"],
    description: "America's first pizzeria, serving coal-fired pizza since 1905",
    imageUrl: "https://example.com/lombardis.jpg"
  },
  {
    name: "Morimoto",
    cuisine: ["Japanese", "Sushi", "Asian Fusion"],
    location: {
      type: "Point",
      coordinates: [-74.0083, 40.7399]
    },
    priceRange: "$$$$",
    rating: 4.7,
    features: ["Celebrity Chef", "Sushi Bar", "Vegetarian Options"],
    popularDishes: ["Omakase", "Rock Shrimp Tempura", "Black Cod Miso"],
    openingHours: {
      "Monday": { open: "17:00", close: "22:30" },
      "Tuesday": { open: "17:00", close: "22:30" },
      "Wednesday": { open: "17:00", close: "22:30" },
      "Thursday": { open: "17:00", close: "22:30" },
      "Friday": { open: "17:00", close: "23:30" },
      "Saturday": { open: "17:00", close: "23:30" },
      "Sunday": { open: "17:00", close: "22:00" }
    },
    ambiance: ["Modern", "Upscale", "Trendy"],
    description: "Iron Chef Masaharu Morimoto's flagship restaurant offering innovative Japanese cuisine",
    imageUrl: "https://example.com/morimoto.jpg"
  },
  {
    name: "Le Bernardin",
    cuisine: ["French", "Seafood"],
    location: {
      type: "Point",
      coordinates: [-73.9819, 40.7615]
    },
    priceRange: "$$$$",
    rating: 4.9,
    features: ["Michelin Starred", "Wine List", "Jacket Required"],
    popularDishes: ["Tuna Carpaccio", "Lobster Tail", "Chocolate-Olive Oil Cremeux"],
    openingHours: {
      "Monday": { open: "17:45", close: "22:30" },
      "Tuesday": { open: "17:45", close: "22:30" },
      "Wednesday": { open: "17:45", close: "22:30" },
      "Thursday": { open: "17:45", close: "22:30" },
      "Friday": { open: "17:45", close: "23:00" },
      "Saturday": { open: "17:45", close: "23:00" }
    },
    ambiance: ["Fine Dining", "Elegant", "Formal"],
    description: "Three Michelin-starred restaurant known for exquisite seafood and impeccable French service",
    imageUrl: "https://example.com/le-bernardin.jpg"
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
    const inserted = await Restaurant.insertMany(realRestaurants);
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