# Ayurveda Wellness Admin Dashboard Setup Guide

## සිංහල / Sinhala Instructions

### මුලික සකස් කිරීම (Initial Setup)

1. **Node.js ස්ථාපනය කරන්න**:
   - https://nodejs.org වෙතින් Node.js බාගත කර ස්ථාපනය කරන්න
   - Command Prompt එකේ `node --version` ධාවනය කරල version එක බලන්න

2. **Admin Dashboard ස්ථාපනය**:
   ```
   admin-dashboard folder එකට යන්න
   install.bat file එක double-click කරන්න
   ```

3. **සර්වර ආරම්භ කරන්න**:
   ```
   start.bat file එක double-click කරන්න
   ```

4. **Browser එකේ Admin Dashboard බලන්න**:
   ```
   http://localhost:3000 open කරන්න
   Dashboard එක කෙලින්ම load වෙයි
   ```

### Doctor Approvals කරන්නේ කොහොමද

1. **Dashboard එක open කරන්න**:
   - http://localhost:3000 open කරන්න

2. **Pending doctors බලන්න**:
   - "Pending" tab එක click කරන්න
   - නව doctor registrations ලිස්ට් එකේ පෙන්වයි

3. **Doctor එකක් approve කරන්න**:
   - Doctor එකේ row එකේ "Approve" button එක click කරන්න
   - Approved doctor කට app එකේ login වෙන්න පුළුවන්

4. **Doctor එකක් reject කරන්න**:
   - "Reject" button එක click කරන්න
   - Rejected doctor කට app එකේ login වෙන්න බෑ

---

## English Instructions

### Initial Setup

1. **Install Node.js**:
   - Download and install Node.js from https://nodejs.org
   - Verify installation by running `node --version` in Command Prompt

2. **Install Admin Dashboard**:
   ```
   Navigate to the admin-dashboard folder
   Double-click the install.bat file
   ```

3. **Start the Server**:
   ```
   Double-click the start.bat file
   ```

4. **Access Admin Dashboard**:
   ```
   Open http://localhost:3000 in your browser
   Dashboard loads directly without login
   ```

## How to Approve Doctors

1. **Open Dashboard**:
   - Navigate to http://localhost:3000

2. **View Pending Doctors**:
   - Click the "Pending" tab
   - See list of new doctor registrations

3. **Approve a Doctor**:
   - Click "Approve" button next to doctor's name
   - Approved doctors can now login to the app

4. **Reject a Doctor**:
   - Click "Reject" button
   - Rejected doctors cannot login to the app

### Features Available

- **Dashboard Overview**: See all doctor registrations
- **Status Filtering**: Filter by pending, approved, or rejected
- **Bulk Actions**: Approve or reject multiple doctors
- **Doctor Details**: View complete doctor information
- **Real-time Updates**: Instant updates when status changes

### Security Notes

- Only authorized admins can access the dashboard
- All actions are logged and traceable
- Doctor data is securely stored in Firebase
- Admin credentials should be kept confidential

### Troubleshooting

**Can't install dependencies?**
- Make sure Node.js is properly installed
- Run Command Prompt as Administrator
- Check internet connection

**Can't login to admin dashboard?**
- Verify admin user exists in Firebase Authentication
- Check email and password are correct
- Ensure Firebase configuration is correct

**Doctors not showing up?**
- Check Firebase Firestore rules
- Verify internet connection
- Refresh the page

### Support

For technical support or questions:
- Check the README.md file for detailed documentation
- Verify Firebase project configuration
- Ensure all dependencies are properly installed
