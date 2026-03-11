# EmailJS Setup Instructions

To enable email notifications for doctor approvals, you need to set up EmailJS:

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Create a new service (Gmail, Outlook, etc.)

## Step 2: Create Email Template
1. In your EmailJS dashboard, go to Email Templates
2. Create a new template with ID: `template_doctor_approval`
3. Use these template variables:
   - `{{to_name}}` - Doctor's name
   - `{{to_email}}` - Doctor's email
   - `{{status}}` - approved/rejected
   - `{{message}}` - Custom message
   - `{{from_name}}` - From: Ayurveda Wellness Admin

## Sample Template:
```
Subject: Doctor Registration {{status}} - Ayurveda Wellness

Dear {{to_name}},

{{message}}

Best regards,
{{from_name}}
```

## Step 3: Update Configuration
Update the following values in `src/services/emailService.ts`:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id'; // From EmailJS dashboard
const EMAILJS_TEMPLATE_ID = 'template_doctor_approval'; // Template ID you created
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // From EmailJS dashboard
```

## Step 4: Test
1. Register a test doctor in the mobile app
2. Use the admin dashboard to approve/reject
3. Check if the email is sent successfully

## Environment Variables (Optional)
You can also use environment variables:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=template_doctor_approval
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Then update emailService.ts to use:
```typescript
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_ayurveda';
```
