import Event from '../models/Event.js';
import User from '../models/userModel.js';

// Get all events
export const getEvents = async (req, res) => {
  console.log('✅ Inside getEvents controller');

  try {
    const events = await Event.find().populate('createdBy participants');
    console.log('✅ MongoDB Response:', JSON.stringify(events, null, 2));

    if (!events || events.length === 0) {
      console.warn('⚠ No events found in the database!');
    }

    res.json(events);
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get upcoming dates for home screen
export const getUpcomingDates = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log('Current date:', currentDate);
    
    // Find all events with detailed logging
    const events = await Event.find({})
    .populate('createdBy participants')
    .sort({ createdAt: -1 })
    .limit(10);
    
    // Debug each event's attendees structure
    events.forEach((event, index) => {
      console.log(`Event ${index}: ${event.title}`);
      console.log(`- dateWith:`, event.dateWith);
      console.log(`- attendees:`, event.attendees);
      console.log(`- numberOfPeople:`, event.numberOfPeople);
      console.log(`- created:`, event.createdAt);
    });
    
    res.json(events);
  } catch (error) {
    console.error('❌ Error fetching upcoming dates:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming dates' });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      createdBy,
      restaurant,
      dateWith,
      travelTime,
      preferences,
      attendees,
      numberOfPeople,
      status
    } = req.body;

    console.log('Creating new event with date:', date);
    console.log('Attendees received:', attendees);
    console.log('Number of people:', numberOfPeople);

    const event = new Event({
      title,
      description,
      date: new Date(date),
      location,
      createdBy,
      restaurant,
      dateWith,
      travelTime,
      preferences,
      attendees,
      numberOfPeople,
      status: status || 'Pending'
    });

    await event.save();
    
    // Verify the event was saved by fetching it back
    const savedEvent = await Event.findById(event._id);
    console.log('Successfully saved event:', {
      id: savedEvent._id,
      title: savedEvent.title,
      date: savedEvent.date,
      restaurant: savedEvent.restaurant?.name,
      attendees: savedEvent.attendees,
      numberOfPeople: savedEvent.numberOfPeople
    });
    
    if (createdBy) {
      await User.findByIdAndUpdate(createdBy, { $push: { createdEvents: event._id } });
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(400).json({ error: 'Event creation failed', message: error.message });
  }
};

// Update event status
export const updateEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Canceled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    ).populate('createdBy participants');

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event status updated', event });
  } catch (error) {
    console.error('❌ Error updating event status:', error);
    res.status(500).json({ error: 'Failed to update event status' });
  }
};
