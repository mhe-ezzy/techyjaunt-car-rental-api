/ config/email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send plain text email
async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
}

// Send HTML template email
async function sendTemplateEmail(to, subject, html, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
}

// Send verification email
async function sendVerificationEmail(userEmail, userName, verificationToken) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${userEmail}`;

  const subject = "Verify Your Email";
  const html = `
    <h1>Hello ${userName}!</h1>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>If you did not register, please ignore this email.</p>
  `;
  const text = `Hello ${userName}! Verify your email: ${verificationLink}`;

  await sendTemplateEmail(userEmail, subject, html, text);
}

module.exports = { sendEmail, sendTemplateEmail, sendVerificationEmail };