import Event from '../models/Event.js';
import mongoose from 'mongoose';
export const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await Event.find({ createdBy: userId })
      .populate('createdBy participants');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getUpcomingDates = async (req, res) => {
  try {
    const currentDate = new Date();
    const userId = req.user.userId;
    const events = await Event.find({
      createdBy: userId,
      date: { $gte: currentDate }
    })
      .populate('createdBy participants')
      .sort({ date: 1 })
      .limit(10);

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming dates' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const event = await Event.findOne({ _id: id, createdBy: userId })
      .populate('createdBy participants');

    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Create event request from user:', userId);
    console.log('Request body:', req.body);

    const {
      title,
      description,
      date,
      location,
      restaurant,
      dateWith,
      travelTime,
      preferences,
      attendees,
      numberOfPeople,
      status
    } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ error: 'Title, date, and location are required' });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const event = new Event({
      title,
      description,
      date: eventDate,
      location,
      createdBy: userId,
      restaurant,
      dateWith,
      travelTime,
      preferences,
      attendees,
      numberOfPeople,
      status: status || 'Pending'
    });

    await event.save();

    console.log('Event created successfully with ID:', event._id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: 'Event creation failed', message: error.message });
  }
};


export const updateEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Canceled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, createdBy: req.user.userId },
      { status },
      { new: true }
    ).populate('createdBy participants');

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event status updated', event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event status' });
  }
};

// Chatgpt helped to debug this method
// There were some errors with the onject types
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;
    console.log('Attempting to delete event:', eventId, 'for user:', userId);
    const objectEventId = new mongoose.Types.ObjectId(eventId);
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const eventRecord = await Event.findById(objectEventId);
    console.log('Event record from DB:', eventRecord);

    const event = await Event.findOneAndDelete({
      _id: objectEventId,
      createdBy: objectUserId,
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or not authorized to delete' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};