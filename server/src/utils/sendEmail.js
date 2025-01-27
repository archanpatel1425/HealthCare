// /utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendEmail = async (reciver_email, mailData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service provider
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'noreply@yourdomain.com',
    to: reciver_email,
    subject: mailData.subject,
    text: mailData.text,
  };

  try {
    await transporter.sendMail(mailOptions);

  } catch (error) {
    throw new Error('Error sending email: ' + error.message);
  }
};
