import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: { type: [String], default: [] },
    createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Events the user created
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Events the user saved
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
