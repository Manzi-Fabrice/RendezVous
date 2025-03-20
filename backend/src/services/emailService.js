import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmailInvites(attendees, username, eventId) {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let attendee of attendees) {
      const eventViewLink = `https://web-app-sustainable.onrender.com/invitation?eventId=${eventId}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: attendee.email,
        subject: "You're Invited!",
        html: `<p>Hello ${attendee.name},</p>
               <p>You are invited to an event! ${username} has invited you to a date!</p>
               <p>Click the link below to view the event details and respond to the invitation:</p>
               <p><a href="${eventViewLink}" style="display:inline-block; background-color:#E3C16F; color:black; padding:10px 20px; text-decoration:none; border-radius:5px;">View Event Details</a></p>
               <p>Event ID: ${eventId}</p>
               <p>Best regards,</p>
               <p>The Rendezvous Team</p>`,
      };

      await transport.sendMail(mailOptions);
    }

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending an email:", error);
    return { success: false, error: "Failed to send emails." };
  }
}

export default sendEmailInvites;
