// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',     // Get this from your EmailJS dashboard
  USER_ID: 'YOUR_USER_ID',           // Get this from your EmailJS dashboard
  DOCTOR_TEMPLATE_ID: 'template_doctor',  // Create this template in EmailJS
  PATIENT_TEMPLATE_ID: 'template_patient' // Create this template in EmailJS
};

/*
HOW TO SET UP EMAILJS:

1. Create an account at https://www.emailjs.com/
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create two email templates:
   
   a) Doctor Notification Template (template_doctor):
      - Subject: New Appointment Request: {{patient_name}}
      - Body:
        ```
        Dear Dr. {{doctor_name}},
        
        You have a new appointment request with the following details:
        
        Patient: {{patient_name}}
        Email: {{patient_email}}
        Phone: {{patient_phone}}
        Date: {{appointment_date}}
        Time: {{appointment_time}}
        Notes: {{appointment_notes}}
        
        Please log in to the Ayurveda Wellness app to confirm or reschedule this appointment.
        
        Thank you,
        Ayurveda Wellness Team
        ```
   
   b) Patient Confirmation Template (template_patient):
      - Subject: Appointment Confirmation with Dr. {{doctor_name}}
      - Body:
        ```
        Dear {{patient_name}},
        
        Your appointment has been scheduled with the following details:
        
        Doctor: Dr. {{doctor_name}}
        Date: {{appointment_date}}
        Time: {{appointment_time}}
        
        If you need to reschedule or cancel, please do so at least 24 hours in advance through the app.
        
        Thank you for choosing Ayurveda Wellness!
        ```

4. Get your Service ID and User ID from the EmailJS dashboard
5. Update the values in this file with your actual credentials
*/ 