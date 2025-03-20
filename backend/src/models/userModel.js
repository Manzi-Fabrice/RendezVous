import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  dietaryRestrictions: [{
    type: String,
    enum: ['halal', 'kosher', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free']
  }],
  cuisinePreferences: [{
    type: String,
    enum: ['italian', 'japanese', 'indian', 'ethiopian', 'jamaican', 'chinese', 'thai', 'mexican', 'mediterranean']
  }],
  priceRangePreference: [{
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  }],
  vibePreferences: [{
    type: String,
    enum: ['fine dining', 'casual', 'family-friendly', 'romantic', 'trendy', 'quiet', 'outdoor']
  }],
  minimumRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3.5
  },
  searchRadius: {
    type: Number,
    default: 5000,
    min: 1000,
    max: 50000
  },
  locationPreferences: {
    maxDistance: {
      type: Number,
      default: 10,
      min: 1,
      max: 50
    },
    preferredNeighborhoods: [String],
    requireParking: Boolean,
    requireAccessibility: Boolean,
    transitPreferred: Boolean
  },
  savedLocations: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    type: {
      type: String,
      enum: ['home', 'work', 'favorite', 'other']
    }
  }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: userPreferencesSchema,
  savedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  savedRestaurants: [{
    name: String,
    address: String,
    cuisineTypes: [String],
    rating: Number,
    priceRange: String,
    savedAt: { type: Date, default: Date.now },
    photos: [String],
    reviews: [{
      rating: Number,
      comment: String,
      date: Date
    }]
  }],
  searchHistory: [{
    timestamp: Date,
    location: {
      lat: Number,
      lng: Number
    },
    preferences: userPreferencesSchema
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;