import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  features: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Family-Friendly', 'Outdoor Seating']
  }],
  popularDishes: [{
    type: String
  }],
  openingHours: {
    type: Map,
    of: {
      open: String,
      close: String
    }
  },
  ambiance: [{
    type: String,
    enum: ['Casual', 'Fine Dining', 'Fast Food', 'Cafe', 'Pub']
  }]
}, {
  strict: false,
  collection: 'restaurants' // Explicitly set collection name
});


restaurantSchema.pre('find', async function() {
  if (mongoose.connection.readyState === 1) {
    console.log(' Finding restaurants with:');
    console.log(' Query:', JSON.stringify(this.getQuery()));
    console.log(' Collection:', this.model.collection.name);
    console.log(' Database:', mongoose.connection.db.databaseName);
  }
});

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ features: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);


export default Restaurant;
