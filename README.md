# Ayurveda Wellness App

A React Native/Expo application for Ayurvedic wellness services, doctor appointments, and health information.

## Email Notification Setup

The app uses EmailJS to send appointment notifications to doctors and patients. Follow these steps to set up email notifications:

### 1. Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. The free tier allows 200 emails per month, which should be sufficient for testing and small-scale use

### 2. Create Email Templates

You need to create two email templates in EmailJS:

#### Doctor Appointment Notification Template

1. In your EmailJS dashboard, go to "Email Templates" and create a new template
2. Name it "Doctor Appointment Notification"
3. Use the following variables in your template:
   - `{{doctor_name}}` - Doctor's name
   - `{{patient_name}}` - Patient's name
   - `{{patient_email}}` - Patient's email
   - `{{patient_phone}}` - Patient's phone number
   - `{{appointment_date}}` - Appointment date
   - `{{appointment_time}}` - Appointment time
   - `{{appointment_notes}}` - Any notes from the patient
   - `{{to_email}}` - Doctor's email address

#### Patient Confirmation Template

1. Create another template named "Patient Appointment Confirmation"
2. Use these variables:
   - `{{patient_name}}` - Patient's name
   - `{{doctor_name}}` - Doctor's name
   - `{{appointment_date}}` - Appointment date
   - `{{appointment_time}}` - Appointment time
   - `{{to_email}}` - Patient's email address

### 3. Configure Email Service in the App

1. Open `services/EmailService.ts`
2. Update the following constants with your EmailJS information:
   ```typescript
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // From EmailJS dashboard
   const EMAILJS_USER_ID = 'YOUR_USER_ID';       // From EmailJS dashboard
   const DOCTOR_TEMPLATE_ID = 'YOUR_DOCTOR_TEMPLATE_ID'; // Template ID for doctor notifications
   const PATIENT_TEMPLATE_ID = 'YOUR_PATIENT_TEMPLATE_ID'; // Template ID for patient confirmations
   ```
3. Uncomment the `emailjs.send()` calls in the code to enable actual email sending

### 4. Testing Email Functionality

1. Make a test appointment booking
2. Check the console logs to verify the email parameters are correct
3. If everything looks good, uncomment the `emailjs.send()` calls to start sending real emails

## Other Features

- Patient registration and login
- Doctor profiles and search
- Appointment booking and management
- Health information and Ayurvedic remedies
- AI symptom checker

## Development

1. Install dependencies: `npm install`
2. Start the development server: `npx expo start` 