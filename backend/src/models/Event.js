import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Canceled'],
      default: 'Pending',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    restaurant: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      imageUrl: { type: String },
      rating: { type: Number, min: 0, max: 5 },
    },
    dateWith: {
      name: { type: String, required: true },
      email: { type: String },
    },
    attendees: [{
      name: { type: String },
      email: { type: String },
      id: { type: Number }
    }],
    attendeeResponses: [{
      attendeeId: { type: String },
      response: {
        type: String,
        enum: ['Accepted', 'Declined', 'Pending'],
        default: 'Pending'
      }
    }],
    numberOfPeople: { type: Number },
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
