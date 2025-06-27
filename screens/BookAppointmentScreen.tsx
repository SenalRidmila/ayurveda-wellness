import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import { appointmentService } from '../models/AppointmentModel';
import { EmailService } from '../services/EmailService';

type RootStackParamList = {
  Home: undefined;
  Doctors: undefined;
  BookAppointment: {
    doctorId: string;
    doctorName: string;
    specialization: string;
    location: string;
    email: string;
  };
};

type BookAppointmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookAppointment'
>;

type BookAppointmentScreenRouteProp = RouteProp<
  RootStackParamList,
  'BookAppointment'
>;

type Props = {
  navigation: BookAppointmentScreenNavigationProp;
  route: BookAppointmentScreenRouteProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const BookAppointmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { doctorId, doctorName, specialization, location, email: doctorEmail } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Get current user info
  React.useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // If user is logged in, pre-fill some fields
      if (currentUser.displayName) {
        setPatientName(currentUser.displayName);
      }
      if (currentUser.email) {
        setPatientEmail(currentUser.email);
      }
      
      // You might also fetch the user's phone number from Firestore if available
      const fetchUserData = async () => {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
          const userData = userDoc.data();
          if (userData?.phoneNumber) {
            setPhoneNumber(userData.phoneNumber);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, []);

  const handleBooking = async () => {
    if (!isFormValid()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to book an appointment.');
        setLoading(false);
        return;
      }
      
      // Create appointment in Firestore
      const appointmentId = await appointmentService.createAppointment({
        doctorId,
        doctorName,
        doctorEmail,
        patientId: currentUser.uid,
        patientName,
        patientEmail,
        patientPhone: phoneNumber,
        date: selectedDate,
        time: selectedTime,
        notes,
        status: 'pending'
      });
      
      if (!appointmentId) {
        throw new Error('Failed to create appointment');
      }
      
      // First, send direct email notification to the doctor
      console.log(`Attempting to send email to doctor: ${doctorEmail}`);
      const doctorEmailSent = await EmailService.sendDoctorAppointmentNotification({
        doctorName,
        doctorEmail,
        patientName,
        patientEmail,
        patientPhone: phoneNumber,
        date: selectedDate,
        time: selectedTime,
        notes
      });
      
      if (!doctorEmailSent) {
        console.error(`Failed to send email to doctor: ${doctorEmail}`);
      } else {
        console.log(`Successfully sent email to doctor: ${doctorEmail}`);
      }
      
      // Then send the standard email notifications
      await EmailService.sendAppointmentEmails({
        doctorName,
        doctorEmail,
        patientName,
        patientEmail,
        date: selectedDate,
        time: selectedTime,
        notes,
        status: 'pending'
      });
      
      Alert.alert(
        'Appointment Booked',
        'Your appointment request has been sent to the doctor. You will receive a confirmation email shortly.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return selectedDate && selectedTime && patientName && phoneNumber && patientEmail;
  };

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialization}>{specialization}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient Name *</Text>
            <TextInput
              style={styles.input}
              value={patientName}
              onChangeText={setPatientName}
              placeholder="Enter patient name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={patientEmail}
              onChangeText={setPatientEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Date *</Text>
            <TextInput
              style={styles.input}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="Select date (DD/MM/YYYY)"
            />
          </View>

          <Text style={styles.label}>Available Time Slots *</Text>
          <View style={styles.timeSlotContainer}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes for the doctor"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, !isFormValid() && styles.disabledButton]}
          onPress={handleBooking}
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#059669',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeSlot: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#3B82F6',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bookButton: {
    backgroundColor: '#EA580C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookAppointmentScreen; 