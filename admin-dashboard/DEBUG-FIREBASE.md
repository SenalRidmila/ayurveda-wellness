# Firebase Connection Debug Guide

## Current Status
- Admin Dashboard: http://localhost:3001
- Firebase Project: ayurweda-wellness
- Issue: Doctors not loading (Total doctors loaded: 0)

## Debug Steps:

### 1. Open Browser Console
1. Go to http://localhost:3001
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for Firebase-related errors

### 2. Expected Console Output
You should see logs like:
```
DoctorService: Getting doctors from collection "doctors"
DoctorService: Testing Firebase connection...
DoctorService: Firebase connection successful
```

### 3. Common Firebase Errors:

#### Error: "Missing or insufficient permissions"
**Solution:** Firestore security rules are too restrictive

#### Error: "Failed to get document because the client is offline"
**Solution:** Network/internet connectivity issue

#### Error: "Project 'ayurweda-wellness' not found"
**Solution:** Firebase project configuration mismatch

### 4. Test Firebase Connection
1. Click the "Create Test Doctor" button in the dashboard
2. Check console for success/error messages
3. If successful, you should see a test doctor appear

### 5. Firebase Rules Fix (if needed)
If you get permissions errors, you need to update Firestore rules:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select "ayurweda-wellness" project
3. Go to Firestore Database
4. Click "Rules" tab
5. Temporarily use these rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**IMPORTANT:** These rules are for testing only. Change them back to secure rules for production.

### 6. Check Network Tab
1. Go to Network tab in DevTools
2. Look for requests to firestore.googleapis.com
3. Check if requests are returning 200 (success) or error codes

### 7. Mobile App Test
To verify mobile app is working:
1. Run mobile app
2. Register a new doctor
3. Check if doctor appears in Firebase Console
4. Then check if same doctor appears in admin dashboard

## Next Steps:
1. Open http://localhost:3001
2. Open browser console (F12)
3. Check console output
4. Click "Create Test Doctor" button
5. Report back what errors/messages you see
