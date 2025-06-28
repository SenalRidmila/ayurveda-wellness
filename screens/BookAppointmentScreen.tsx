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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import { appointmentService, Appointment } from '../models/AppointmentModel';

type RootStackParamList = {
  Home: undefined;
  Doctors: undefined;
  BookAppointment: {
    doctorId: string;
    doctorName: string;
    specialization: string;
    location: string;
    email: string;
    existingAppointment?: Appointment;
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
  const { doctorId, doctorName, specialization, location, email: doctorEmail, existingAppointment } = route.params;
  const [selectedDate, setSelectedDate] = useState(existingAppointment?.date || '');
  const [selectedTime, setSelectedTime] = useState(existingAppointment?.time || '');
  const [patientName, setPatientName] = useState(existingAppointment?.patientName || '');
  const [patientEmail, setPatientEmail] = useState(existingAppointment?.patientEmail || '');
  const [phoneNumber, setPhoneNumber] = useState(existingAppointment?.patientPhone || '');
  const [notes, setNotes] = useState(existingAppointment?.notes || '');
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get current user info if not editing
  React.useEffect(() => {
    if (!existingAppointment) {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        if (currentUser.displayName) {
          setPatientName(currentUser.displayName);
        }
        if (currentUser.email) {
          setPatientEmail(currentUser.email);
        }
        
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
    }
  }, [existingAppointment]);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: Array<Date | null> = [];
    // Add empty days for padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatDate(date));
    setShowCalendar(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

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

      // Check for appointment conflicts
      const hasConflict = await appointmentService.checkAppointmentConflict(
        doctorId,
        selectedDate,
        selectedTime,
        existingAppointment?.id
      );

      if (hasConflict) {
        Alert.alert(
          'Time Slot Not Available',
          'This time slot is already booked. Please select a different time.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      if (existingAppointment) {
        // Update existing appointment
        await appointmentService.updateAppointment(existingAppointment.id!, {
          date: selectedDate,
          time: selectedTime,
          notes,
          patientPhone: phoneNumber
        });

        Alert.alert(
          'Appointment Updated',
          'Your appointment has been updated successfully.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]
        );
      } else {
        // Create new appointment
        console.log('Creating appointment with doctorId:', doctorId);
        console.log('Doctor details:', {
          doctorId,
          doctorName,
          doctorEmail
        });
        
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
        
        console.log('Created appointment with ID:', appointmentId);
        
        if (!appointmentId) {
          throw new Error('Failed to create appointment');
        }
        
        Alert.alert(
          'Appointment Booked',
          'Your appointment request has been sent. The doctor will review it in the app.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]
        );
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', existingAppointment ? 'Failed to update appointment.' : 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return selectedDate && selectedTime && patientName && phoneNumber && patientEmail;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowCalendar(false);
    if (selectedDate) {
      setSelectedDate(formatDate(selectedDate));
    }
  };

  const openDatePicker = () => {
    setShowCalendar(true);
  };

  const validateManualDate = (dateString: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const [day, month, year] = dateString.split('/').map(Number);
    
    // Check for valid day ranges
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 2024 || year > 2030) return false;
    
    // Check for specific month day limits
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2) {
      // February - check for leap year
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (day > (isLeapYear ? 29 : 28)) return false;
    } else if (day > daysInMonth[month - 1]) {
      return false;
    }
    
    const date = new Date(year, month - 1, day);
    
    // Check if it's a valid date
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return false;
    }
    
    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return false;
    }
    
    return true;
  };

  const handleManualDateChange = (text: string) => {
    // Remove all non-numeric characters
    const numbersOnly = text.replace(/\D/g, '');
    
    // Auto-format the date as user types
    let formattedDate = '';
    if (numbersOnly.length <= 2) {
      formattedDate = numbersOnly;
    } else if (numbersOnly.length <= 4) {
      formattedDate = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2);
    } else if (numbersOnly.length <= 8) {
      formattedDate = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) + '/' + numbersOnly.slice(4);
    } else {
      formattedDate = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) + '/' + numbersOnly.slice(4, 8);
    }
    
    setSelectedDate(formattedDate);
    
    // Validate when complete date is entered
    if (formattedDate.length === 10) {
      if (!validateManualDate(formattedDate)) {
        // Don't show alert immediately, let user complete typing
        setTimeout(() => {
          if (selectedDate === formattedDate) {
            Alert.alert('Invalid Date', 'Please enter a valid future date in DD/MM/YYYY format.');
          }
        }, 1000);
      }
    }
  };

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {existingAppointment ? 'Edit Appointment' : 'Book Appointment'}
        </Text>
        <View style={{ width: 24 }} />
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
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={handleManualDateChange}
                placeholder="DD/MM/YYYY"
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity 
                style={styles.calendarButton}
                onPress={openDatePicker}
              >
                <Ionicons name="calendar-outline" size={24} color="#059669" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dateHint}>Type numbers only - auto-formats to DD/MM/YYYY</Text>
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
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>
              {existingAppointment ? 'Update Appointment' : 'Book Appointment'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={prevMonth} style={styles.monthButton}>
                <Ionicons name="chevron-back" size={24} color="#059669" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
                <Ionicons name="chevron-forward" size={24} color="#059669" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarGrid}>
              <View style={styles.weekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Text key={day} style={styles.weekDay}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.daysGrid}>
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      day && isDateSelectable(day) && styles.selectableDay,
                      day && selectedDate === formatDate(day) && styles.selectedDay,
                    ]}
                    onPress={() => day && isDateSelectable(day) && handleDateSelect(day)}
                    disabled={!day || !isDateSelectable(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      day && isDateSelectable(day) && styles.selectableDayText,
                      day && selectedDate === formatDate(day) && styles.selectedDayText,
                    ]}>
                      {day ? day.getDate() : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.calendarFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.todayButton}
                onPress={() => {
                  const today = new Date();
                  setSelectedDate(formatDate(today));
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dateInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'monospace',
  },
  calendarButton: {
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    marginBottom: 20,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  selectableDay: {
    backgroundColor: '#F3F4F6',
  },
  selectedDay: {
    backgroundColor: '#059669',
  },
  dayText: {
    fontSize: 14,
    color: '#999',
  },
  selectableDayText: {
    color: '#333',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  todayButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default BookAppointmentScreen; 