const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/**
 * Configure the email transport using the default SMTP transport and a Gmail account.
 * For Gmail, enable these:
 * 1. https://myaccount.google.com/apppasswords - Create an app password
 * 2. https://myaccount.google.com/lesssecureapps - Turn off (no longer needed with app passwords)
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // Replace these with your actual email and app password in production
    // For development, you can use environment variables
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

// Log when the functions are initialized
console.log('Firebase Cloud Functions initialized');

/**
 * Send an email using Nodemailer
 * 
 * Expected data format:
 * {
 *   to: "recipient@example.com",
 *   subject: "Email Subject",
 *   text: "Plain text version of the message (optional)",
 *   html: "HTML version of the message (optional)"
 * }
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  try {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    // Validate email data
    if (!data.to || !data.subject) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with "to" and "subject" arguments.'
      );
    }

    console.log(`Attempting to send email to: ${data.to}`);

    // Prepare email options
    const mailOptions = {
      from: '"Ayurveda Wellness" <your-email@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text || '',
      html: data.html || '',
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${data.to}`);
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create a new appointment and send notification emails
 */
exports.createAppointment = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    try {
      const appointment = snap.data();
      
      // Send email to doctor
      const doctorMailOptions = {
        from: '"Ayurveda Wellness" <your-email@gmail.com>',
        to: appointment.doctorEmail,
        subject: `New Appointment Request: ${appointment.patientName} on ${appointment.date} at ${appointment.time}`,
        html: `
          <h2>New Appointment Request</h2>
          <p>Dear Dr. ${appointment.doctorName},</p>
          <p>You have a new appointment request with the following details:</p>
          <ul>
            <li><strong>Patient:</strong> ${appointment.patientName}</li>
            <li><strong>Date:</strong> ${appointment.date}</li>
            <li><strong>Time:</strong> ${appointment.time}</li>
            <li><strong>Notes:</strong> ${appointment.notes || 'No additional notes'}</li>
          </ul>
          <p>Please log in to the Ayurveda Wellness app to confirm or reschedule this appointment.</p>
          <p>Thank you,<br>Ayurveda Wellness Team</p>
        `
      };
      
      // Send email to patient
      const patientMailOptions = {
        from: '"Ayurveda Wellness" <your-email@gmail.com>',
        to: appointment.patientEmail,
        subject: `Appointment Confirmation with Dr. ${appointment.doctorName}`,
        html: `
          <h2>Appointment Confirmation</h2>
          <p>Dear ${appointment.patientName},</p>
          <p>Your appointment has been scheduled with the following details:</p>
          <ul>
            <li><strong>Doctor:</strong> Dr. ${appointment.doctorName}</li>
            <li><strong>Date:</strong> ${appointment.date}</li>
            <li><strong>Time:</strong> ${appointment.time}</li>
          </ul>
          <p>If you need to reschedule or cancel, please do so at least 24 hours in advance through the app.</p>
          <p>Thank you for choosing Ayurveda Wellness!</p>
        `
      };
      
      // Send both emails
      await Promise.all([
        transporter.sendMail(doctorMailOptions),
        transporter.sendMail(patientMailOptions)
      ]);
      
      return null;
    } catch (error) {
      console.error('Error sending appointment emails:', error);
      return null;
    }
  }); 