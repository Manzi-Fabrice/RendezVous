import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('createdEvents savedEvents');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    const user = new User({ name, email, password, preferences });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed' });
  }
};

// Save an event to a user's savedEvents
export const saveEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId);
      await user.save();
    }

    res.json({ message: 'Event saved successfully', savedEvents: user.savedEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save event' });
  }
};
