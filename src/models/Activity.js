import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Links to an event
    votes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Canceled'], // Status options
      default: 'Pending',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Activity', activitySchema);
