import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmailInvites(attendees, username) {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let attendee of attendees) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: attendee.email,
        subject: "You're Invited!",
        html: `<p>Hello ${attendee.name},</p>
               <p>You are invited to an event! ${username} has invited you to a date! Click the link below to confirm your attendance:</p>
               <a href="https://your-event-link.com">Confirm Attendance</a>
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
