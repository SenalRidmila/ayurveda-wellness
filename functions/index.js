const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.onAppointmentCreated = functions.database
  .ref('/appointments/{appointmentId}')
  .onCreate((snapshot, context) => {
    const appointment = snapshot.val();
    console.log('New appointment created:', appointment);
    return Promise.resolve();
  });

exports.onAppointmentUpdated = functions.database
  .ref('/appointments/{appointmentId}')
  .onUpdate((change, context) => {
    const after = change.after.val();
    console.log('Appointment updated:', after);
    return Promise.resolve();
  }); 