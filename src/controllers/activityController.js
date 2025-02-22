import Activity from '../models/Activity.js';

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate('event');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Create new activity
export const createActivity = async (req, res) => {
  try {
    const { title, category, event } = req.body;
    const activity = new Activity({ title, category, event });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: 'Activity creation failed' });
  }
};

// Update activity status
export const updateActivityStatus = async (req, res) => {
  try {
    const { activityId, status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Canceled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const activity = await Activity.findByIdAndUpdate(activityId, { status }, { new: true });

    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    res.json({ message: 'Activity status updated', activity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity status' });
  }
};
