# 📧 EmailJS Setup Instructions

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. Go to Email Services in your EmailJS dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note down your **Service ID** (e.g., `service_xyz123`)

## Step 3: Create Email Template
1. Go to Email Templates in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: Doctor Registration {{status}} - Ayurveda Wellness

Dear Dr. {{to_name}},

{{message}}

Best regards,
{{from_name}}
```

4. Note down your **Template ID** (e.g., `template_abc456`)

## Step 4: Get Public Key
1. Go to Account → General
2. Copy your **Public Key** (e.g., `user_xyz789abc`)

## Step 5: Update Configuration
Edit `admin-dashboard/lib/services/emailService.ts`:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here'; // From Step 2
const EMAILJS_TEMPLATE_ID = 'your_template_id_here'; // From Step 3  
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // From Step 4
```

## Step 6: Test
1. Save the file
2. Refresh your admin dashboard
3. Try approving/rejecting a doctor
4. Check if real emails are sent

---

## 🔧 Current Status
- ✅ Dashboard works without EmailJS setup
- ✅ Shows email simulation when EmailJS not configured
- ✅ Will automatically use real emails once configured
- ✅ No errors or crashes if EmailJS not set up

## 📝 Notes
- Free EmailJS account allows 200 emails/month
- Email simulation shows what would be sent
- All other dashboard features work normally
- Doctor approval/rejection saves to database regardless of email status
