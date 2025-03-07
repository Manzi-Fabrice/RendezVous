import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Canceled'], // Only these values allowed
      default: 'Pending', // Default to Pending
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who made the event
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // People attending
    // New fields for restaurant details
    restaurant: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      imageUrl: { type: String },
      rating: { type: Number, min: 0, max: 5 },
    },
    // Person they're going on the date with
    dateWith: {
      name: { type: String, required: true },
      email: { type: String },
    },
    // Additional details
    travelTime: { type: String },
    preferences: {
      budget: String,
      cuisine: String,
      dietaryRestrictions: [String],
    }
  },
  { timestamps: true },
);

export default mongoose.model('Event', eventSchema);
