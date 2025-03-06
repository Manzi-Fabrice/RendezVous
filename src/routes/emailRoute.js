import express from 'express';
import { sendEmailInvites } from '../services/emailService.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { attendees, username } = req.body;

  if (!attendees || !attendees.length || !username) {
    return res.status(400).json({ success: false, error: "Invalid request data" });
  }

  const result = await sendEmailInvites(attendees, username);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
