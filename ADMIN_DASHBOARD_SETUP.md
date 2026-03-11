# Ayurveda Wellness Admin Dashboard

This is the admin dashboard for managing doctor approvals in the Ayurveda Wellness platform.

## Features

- **Doctor Approval Management**: Review and approve/reject doctor registration applications
- **Email Notifications**: Automatically send email notifications to doctors when approved/rejected
- **Status Tracking**: Track doctor application status (pending, approved, rejected)
- **Custom Messages**: Add custom messages to approval/rejection emails

## Setup Instructions

### 1. Navigate to Admin Dashboard
```bash
cd admin-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure EmailJS (Required for email functionality)
1. Go to https://www.emailjs.com/ and create an account
2. Create a new email service (Gmail, Outlook, etc.)
3. Create a template with ID: `template_doctor_approval`
4. Update `src/services/emailService.ts` with your EmailJS credentials:
   ```typescript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

### 4. Start the Admin Dashboard
```bash
npm start
```

This will start the React web app on http://localhost:3000

## Usage

### Doctor Registration Flow

1. **Mobile App**: Doctor registers through the mobile app
2. **Status**: Doctor status is set to 'pending' automatically
3. **Admin Review**: Admin reviews the application in the dashboard
4. **Approval/Rejection**: Admin can approve or reject with custom message
5. **Email Notification**: Doctor receives email notification automatically

### Admin Login
- Email: `admin@ayurveda-wellness.com`
- Password: `admin123`

### Doctor Approval Process

1. Navigate to the Doctor Approvals page
2. Review pending doctor applications
3. Click "Approve" or "Reject" for each doctor
4. Add custom message if needed
5. Confirm the action - email will be sent automatically

## Quick Start Commands

```bash
# From the main project directory
cd admin-dashboard
npm install
npm start
```

The admin dashboard will be available at http://localhost:3000
