import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_aeikn18'; // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_9snmn3q'; // Your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'GCaDEtHy6k43qhwUP'; // Your EmailJS public key

// Check if EmailJS is properly configured
const isEmailConfigured = (): boolean => {
  return EMAILJS_PUBLIC_KEY.length > 10 && !EMAILJS_PUBLIC_KEY.includes('your_public_key');
};

// Initialize EmailJS only if configured
if (isEmailConfigured()) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  doctorName: string;
  doctorEmail: string;
  status: 'approved' | 'rejected';
  message?: string;
}

export const sendDoctorApprovalEmail = async (params: EmailParams): Promise<boolean> => {
  // If EmailJS is not configured, simulate email sending
  if (!isEmailConfigured()) {
    console.log('📧 EmailJS not configured. Simulating email sending...');
    console.log('Email would be sent to:', params.doctorEmail);
    console.log('Status:', params.status);
    console.log('Message:', params.message || getEmailTemplate(params.status, params.doctorName).message);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show in browser console what would be sent
    alert(`📧 Email Simulation\n\nTo: ${params.doctorEmail}\nDoctor: ${params.doctorName}\nStatus: ${params.status.toUpperCase()}\n\nTo enable real emails, configure EmailJS in emailService.ts`);
    
    return true; // Simulate success
  }

  try {
    const templateParams = {
      to_name: params.doctorName,
      to_email: params.doctorEmail, // This is the doctor's email where the email should be sent
      status: params.status,
      message: params.message || getEmailTemplate(params.status, params.doctorName).message,
      from_name: 'Ayurveda Wellness Admin Team',
      reply_to: 'admin@ayurveda-wellness.com',
    };

    console.log('📧 Sending email with params:', templateParams);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    // Fallback to simulation if EmailJS fails
    console.log('📧 EmailJS failed, showing email simulation...');
    alert(`📧 Email Failed - Showing Preview\n\nTo: ${params.doctorEmail}\nDoctor: ${params.doctorName}\nStatus: ${params.status.toUpperCase()}\n\nConfigure EmailJS properly to send real emails.`);
    
    return false;
  }
};

// Email templates
export const getEmailTemplate = (status: 'approved' | 'rejected', doctorName: string) => {
  if (status === 'approved') {
    return {
      subject: 'Doctor Registration Approved - Ayurveda Wellness',
      message: `Dear Dr. ${doctorName},

Congratulations! Your doctor registration with Ayurveda Wellness has been approved.

You can now:
- Login to your doctor account
- Manage your profile and availability
- Start accepting patient appointments
- Access the doctor dashboard

Welcome to our platform! We look forward to working with you to provide excellent Ayurvedic care to our patients.

Best regards,
Ayurveda Wellness Admin Team

---
If you have any questions, please contact us at admin@ayurveda-wellness.com`
    };
  } else {
    return {
      subject: 'Doctor Registration Status - Ayurveda Wellness',
      message: `Dear Dr. ${doctorName},

Thank you for your interest in joining Ayurveda Wellness as a healthcare provider.

After careful review, we are unable to approve your registration at this time. This may be due to:
- Incomplete documentation
- Verification requirements not met
- Current capacity limitations

You are welcome to reapply in the future. If you have any questions about this decision, please contact our admin team.

Thank you for your understanding.

Best regards,
Ayurveda Wellness Admin Team

---
For questions, please contact us at admin@ayurveda-wellness.com`
    };
  }
};

export default {
  sendDoctorApprovalEmail,
  getEmailTemplate,
};
