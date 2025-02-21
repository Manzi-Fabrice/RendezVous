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
  },
  { timestamps: true },
);

export default mongoose.model('Event', eventSchema);
