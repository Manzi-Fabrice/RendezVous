import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// POST endpoint to handle responses from the frontend app
router.post('/respond', async (req, res) => {
  const { eventId, attendeeId, response } = req.body;

  if (!eventId || !attendeeId || !response) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the attendee in the event
    const attendeeIndex = event.attendees.findIndex(
      attendee => String(attendee._id) === attendeeId || String(attendee.id) === attendeeId
    );

    if (attendeeIndex === -1) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    // Update attendee's response
    const attendeeResponse = response === 'accept' ? 'Accepted' : 'Declined';

    if (!event.attendeeResponses) {
      event.attendeeResponses = [];
    }

    const responseIndex = event.attendeeResponses.findIndex(
      resp => String(resp.attendeeId) === attendeeId
    );

    if (responseIndex !== -1) {
      event.attendeeResponses[responseIndex].response = attendeeResponse;
    } else {
      event.attendeeResponses.push({
        attendeeId: attendeeId,
        response: attendeeResponse
      });
    }
    const allResponded = event.attendeeResponses.length === event.attendees.length;
    const allAccepted = event.attendeeResponses.every(resp => resp.response === 'Accepted');

    if (allResponded && allAccepted) {
      event.status = 'Confirmed';
    } else if (attendeeResponse === 'Declined') {
      if (String(event.dateWith._id) === attendeeId ||
          event.dateWith.id === attendeeId ||
          event.dateWith.email === event.attendees[attendeeIndex].email) {
        event.status = 'Canceled';
      }
    }

    await event.save();

    return res.json({
      success: true,
      message: `You have ${attendeeResponse.toLowerCase()} the invitation.`,
      eventStatus: event.status,
      event: event
    });
  } catch (error) {
    console.error('❌ Error processing response:', error);
    return res.status(500).json({ error: 'Failed to process response' });
  }
});

router.get('/respond', async (req, res) => {
  const { dateId, attendeeId, response } = req.query;

  if (!dateId || !attendeeId || !response) {
    return res.status(400).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .error { color: #F44336; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Request</h1>
          <p>The link you followed is invalid or incomplete.</p>
        </body>
      </html>
    `);
  }

  try {
    // Find the event
    const event = await Event.findById(dateId);

    if (!event) {
      return res.status(404).send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .error { color: #F44336; }
            </style>
          </head>
          <body>
            <h1 class="error">Event Not Found</h1>
            <p>We couldn't find the event you're responding to.</p>
          </body>
        </html>
      `);
    }

    // Find the attendee in the event
    const attendeeIndex = event.attendees.findIndex(
      attendee => String(attendee._id) === attendeeId || String(attendee.id) === attendeeId
    );

    if (attendeeIndex === -1) {
      return res.status(404).send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .error { color: #F44336; }
            </style>
          </head>
          <body>
            <h1 class="error">Attendee Not Found</h1>
            <p>We couldn't find your information for this event.</p>
          </body>
        </html>
      `);
    }

    // Update attendee's response
    const attendeeResponse = response === 'accept' ? 'Accepted' : 'Declined';

    // Initialize responses array if it doesn't exist
    if (!event.attendeeResponses) {
      event.attendeeResponses = [];
    }

    // Update or add response for this attendee
    const responseIndex = event.attendeeResponses.findIndex(
      resp => String(resp.attendeeId) === attendeeId
    );

    if (responseIndex !== -1) {
      event.attendeeResponses[responseIndex].response = attendeeResponse;
    } else {
      event.attendeeResponses.push({
        attendeeId: attendeeId,
        response: attendeeResponse
      });
    }

    // Check if all attendees have responded and update event status accordingly
    const allResponded = event.attendeeResponses.length === event.attendees.length;
    const allAccepted = event.attendeeResponses.every(resp => resp.response === 'Accepted');

    if (allResponded && allAccepted) {
      event.status = 'Confirmed';
    } else if (attendeeResponse === 'Declined') {
      // If primary person declines, cancel the event
      if (String(event.dateWith._id) === attendeeId ||
          event.dateWith.id === attendeeId ||
          event.dateWith.email === event.attendees[attendeeIndex].email) {
        event.status = 'Canceled';
      }
    }

    await event.save();

    // Return a nice confirmation page
    const color = attendeeResponse === 'Accepted' ? '#4CAF50' : '#F44336';
    const message = attendeeResponse === 'Accepted' ?
      'You have accepted the invitation.' :
      'You have declined the invitation.';

    // Link back to the event details
    const eventDetailsLink = `https://project-api-sustainable-waste.onrender.com/api/events/view/${dateId}?attendeeId=${attendeeId}`;

    return res.send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response Recorded</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            .confirmation {
              color: ${color};
              font-size: 28px;
              margin-bottom: 20px;
            }
            .message {
              font-size: 18px;
              margin-bottom: 30px;
            }
            .details {
              margin-top: 30px;
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 10px;
              text-align: left;
              display: inline-block;
            }
            .label {
              font-weight: bold;
            }
            .back-button {
              display: inline-block;
              background-color: #E3C16F;
              color: black;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1 class="confirmation">Response Recorded</h1>
          <p class="message">${message}</p>

          <div class="details">
            <p><span class="label">Event:</span> ${event.title}</p>
            <p><span class="label">Date:</span> ${new Date(event.date).toLocaleString()}</p>
            <p><span class="label">Location:</span> ${event.location}</p>
            <p><span class="label">Restaurant:</span> ${event.restaurant.name}</p>
            <p><span class="label">Status:</span> ${event.status}</p>
          </div>

          <a href="${eventDetailsLink}" class="back-button">Back to Event Details</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ Error processing response:', error);
    return res.status(500).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .error { color: #F44336; }
          </style>
        </head>
        <body>
          <h1 class="error">Error</h1>
          <p>Something went wrong processing your response.</p>
        </body>
      </html>
    `);
  }
});

export default router;