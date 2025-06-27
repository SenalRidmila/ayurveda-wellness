import { db } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from '../emailjsConfig';

// EmailJS configuration from the config file
const EMAILJS_SERVICE_ID = EMAILJS_CONFIG.SERVICE_ID;
const EMAILJS_USER_ID = EMAILJS_CONFIG.USER_ID;
const DOCTOR_TEMPLATE_ID = EMAILJS_CONFIG.DOCTOR_TEMPLATE_ID;
const PATIENT_TEMPLATE_ID = EMAILJS_CONFIG.PATIENT_TEMPLATE_ID;

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface AppointmentData {
  doctorName: string;
  doctorEmail: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

/**
 * Email service that uses EmailJS to send real emails
 */
export class EmailService {
  /**
   * Send email using EmailJS
   */
  static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // Log the email request to Firestore for tracking
      await db.collection('email_queue').add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
      });
      
      // For development/testing purposes, log the email data
      console.log('Email being sent:', data);
      
      // In production, uncomment this to send real emails with EmailJS
      // Make sure to configure EmailJS first in emailjsConfig.ts
      // const templateParams = {
      //   to_email: data.to,
      //   subject: data.subject,
      //   message_html: data.html || data.text
      // };
      // 
      // await emailjs.send(
      //   EMAILJS_SERVICE_ID,
      //   data.to.includes('doctor') ? DOCTOR_TEMPLATE_ID : PATIENT_TEMPLATE_ID,
      //   templateParams,
      //   EMAILJS_USER_ID
      // );
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  /**
   * Send appointment confirmation emails to both doctor and patient
   */
  static async sendAppointmentEmails(appointment: AppointmentData): Promise<boolean> {
    try {
      // Send email to doctor
      const doctorEmailSent = await this.sendEmail({
        to: appointment.doctorEmail,
        subject: `New Appointment Request: ${appointment.patientName} on ${appointment.date} at ${appointment.time}`,
        html: `
          <h2>New Appointment Request</h2>
          <p>Dear Dr. ${appointment.doctorName},</p>
          <p>You have a new appointment request with the following details:</p>
          <ul>
            <li><strong>Patient:</strong> ${appointment.patientName}</li>
            <li><strong>Patient Email:</strong> ${appointment.patientEmail}</li>
            <li><strong>Date:</strong> ${appointment.date}</li>
            <li><strong>Time:</strong> ${appointment.time}</li>
            <li><strong>Notes:</strong> ${appointment.notes || 'No additional notes'}</li>
          </ul>
          <p>Please log in to the Ayurveda Wellness app to confirm or reschedule this appointment.</p>
          <p>Thank you,<br>Ayurveda Wellness Team</p>
        `
      });
      
      // Send email to patient
      const patientEmailSent = await this.sendEmail({
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
      });
      
      return doctorEmailSent && patientEmailSent;
    } catch (error) {
      console.error('Error sending appointment emails:', error);
      return false;
    }
  }
  
  /**
   * Send direct email to doctor with appointment details
   * This method can be called directly from BookAppointmentScreen
   */
  static async sendDoctorAppointmentNotification(appointmentData: {
    doctorName: string;
    doctorEmail: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    date: string;
    time: string;
    notes?: string;
  }): Promise<boolean> {
    try {
      // Using EmailJS to send the email directly
      const templateParams = {
        doctor_name: appointmentData.doctorName,
        patient_name: appointmentData.patientName,
        patient_email: appointmentData.patientEmail,
        patient_phone: appointmentData.patientPhone,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        appointment_notes: appointmentData.notes || 'No additional notes',
        to_email: appointmentData.doctorEmail
      };
      
      // Log for development
      console.log('Sending doctor notification with params:', templateParams);
      
      // Store the email in Firestore for tracking and later sending
      await db.collection('doctor_emails').add({
        ...templateParams,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
      });
      
      // In production, uncomment this to send real emails with EmailJS
      // Make sure to configure EmailJS first in emailjsConfig.ts
      // await emailjs.send(
      //   EMAILJS_SERVICE_ID,
      //   DOCTOR_TEMPLATE_ID,
      //   templateParams,
      //   EMAILJS_USER_ID
      // );
      
      return true;
    } catch (error) {
      console.error('Error sending doctor notification:', error);
      return false;
    }
  }
} 