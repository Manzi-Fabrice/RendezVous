import express from 'express';
import { sendEmailInvites } from '../services/emailService.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { attendees, username, eventId } = req.body;

  if (!attendees || !attendees.length || !username || !eventId) {
    return res.status(400).json({ success: false, error: "Invalid request data. Required: attendees, username, eventId" });
  }

  const result = await sendEmailInvites(attendees, username, eventId);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
