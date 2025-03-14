
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const createUser = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, preferences } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password with a salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      preferences,
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed', details: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('savedEvents');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const saveEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId);
      await user.save();
    }
    res.json({ message: 'Event saved successfully', savedEvents: user.savedEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save event', details: error.message });
  }
};

export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('savedEvents');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.savedEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved events', details: error.message });
  }
};
