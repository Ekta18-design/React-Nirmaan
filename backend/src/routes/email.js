import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST route to send email
router.post('/send', async (req, res) => {
  console.log('Received POST request on /send');
  const { email, subject, message, fileUrl } = req.body;

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., Gmail, Outlook
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // recipient email
    subject: subject, // subject of the email
    text: message, // email body
    html: `<p>${message}</p>
    <p>File: <a href="${fileUrl}">Click to view</a></p>`, // if you want to send HTML content
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

export default router;
