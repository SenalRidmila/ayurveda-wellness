# Ayurveda Wellness Admin Dashboard

This is the admin dashboard for managing doctor registrations and approvals in the Ayurveda Wellness application.

## Features

- **Direct Access**: No login required - instant access to dashboard
- **Doctor Management**: View all registered doctors
- **Approval System**: Approve or reject doctor registration requests
- **Status Filtering**: Filter doctors by approval status (pending, approved, rejected)
- **Real-time Updates**: Live updates from Firebase Firestore

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Access to the Firebase project with admin privileges

### Installation

1. Navigate to the admin dashboard directory:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:3000`

## Usage

### Doctor Approval Workflow

1. **Doctor Registration**: 
   - Doctor registers in mobile app with credentials and profile information
   - Status automatically set to "pending"
   - Doctor **cannot login** until approved

2. **Admin Review**:
   - Admin views pending registrations in dashboard
   - Reviews doctor information and credentials
   - Decides to approve or reject

3. **Approval Process**:
   - **Approve**: Doctor can now login to mobile app and see patients
   - **Reject**: Doctor cannot login, receives rejection message
   - **Revoke**: Previously approved doctor access can be removed

4. **Login Restrictions**:
   - Pending doctors: Cannot login, shown "approval pending" message
   - Rejected doctors: Cannot login, shown "registration rejected" message
   - Approved doctors: Full access to mobile app features

### Status Types

- **Pending**: New doctor registrations waiting for approval
- **Approved**: Doctors who can use the app and see patients
- **Rejected**: Doctors whose registration was declined

## Technical Details

### Built With

- **Next.js 14**: React framework for the web application
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase**: Backend services (Authentication & Firestore)

### Project Structure

```
admin-dashboard/
├── components/
│   └── DoctorApproval.tsx    # Main doctor management component
├── lib/
│   └── firebase.ts           # Firebase configuration
├── pages/
│   ├── index.tsx            # Main dashboard page
│   ├── _app.tsx             # Next.js app wrapper
│   └── _document.tsx        # HTML document structure
├── services/
│   └── doctorService.ts     # Doctor data management
├── styles/
│   └── globals.css          # Global styles
└── types/
    └── index.ts             # TypeScript type definitions
```

### Firebase Integration

The dashboard connects to the same Firebase project as the main mobile app:
- **Authentication**: Admin login verification
- **Firestore**: Real-time doctor data synchronization
- **Security**: Admin-only access controls

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables if needed
3. Deploy automatically on push to main branch

## Security

- Only authenticated admins can access the dashboard
- All Firebase operations require proper authentication
- No sensitive credentials are stored in the frontend code

## Contributing

1. Make sure all changes are tested locally
2. Follow the existing code style and patterns
3. Update documentation for any new features
4. Test with real Firebase data before deployment
