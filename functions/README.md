# Ayurveda Wellness Firebase Functions

This directory contains the Firebase Cloud Functions for the Ayurveda Wellness app.

## Setup Instructions

1. Install Firebase CLI globally:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Install dependencies:
   ```
   cd functions
   npm install
   ```

4. Update the email configuration:
   - Open `index.js`
   - Replace `your-email@gmail.com` and `your-app-password` with your actual email and app password
   - For Gmail, you need to:
     - Enable "Less secure app access" in your Google account settings
     - Or create an App Password if you have 2-factor authentication enabled

## Local Testing

1. Start the Firebase emulators:
   ```
   firebase emulators:start
   ```

2. Access the Firebase Emulator UI:
   - Open http://localhost:4000 in your browser

## Deployment

Deploy the functions to Firebase:
```
firebase deploy --only functions
```

## Available Functions

1. `sendEmail` - HTTP callable function to send emails
   - Parameters:
     - `to`: Email recipient
     - `subject`: Email subject
     - `text`: (Optional) Plain text email body
     - `html`: (Optional) HTML email body

2. `createAppointment` - Firestore trigger function that sends emails when new appointments are created 