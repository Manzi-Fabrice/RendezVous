import Event from '../models/Event.js';
import User from '../models/User.js';

// Get all events
export const getEvents = async (req, res) => {
  console.log('✅ Inside getEvents controller');

  try {
    const events = await Event.find().populate('createdBy participants');

    console.log('✅ MongoDB Response:', JSON.stringify(events, null, 2)); // Log data retrieved

    if (!events || events.length === 0) {
      console.warn('⚠ No events found in the database!');
    }

    res.json(events);
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};


// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, createdBy } = req.body;
    const event = new Event({ title, description, date, location, createdBy });

    await event.save();

    await User.findByIdAndUpdate(createdBy, { $push: { createdEvents: event._id } });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Event creation failed' });
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

    const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Event status updated', event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event status' });
  }
};
