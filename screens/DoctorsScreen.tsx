import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from '../firebaseConfig';
import { auth, db } from '../firebaseConfig';
import { Doctor, doctorService } from '../models/DoctorModel';

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

type DoctorsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Doctors'
>;

type Props = {
  navigation: DoctorsScreenNavigationProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const specializations = [
  'Ayurvedic Physician',
  'Panchakarma Specialist',
  'Marma Therapy Expert',
  'Herbal Medicine Specialist',
  'Nadi Pariksha Expert',
  'Ayurvedic Nutritionist',
  'Ayurvedic Dermatologist',
  'Yoga Therapist',
  'Ayurvedic Gynecologist',
  'Ayurvedic Pediatrician'
];

// Sample doctors data for initial population
const sampleDoctors: Doctor[] = [
  {
    name: "Dr. Kamal Perera",
    specialization: "Ayurvedic Physician",
    location: "Colombo",
    email: "kamal.perera@example.com",
    phone: "0771234567",
    imageUrl: "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg",
    bio: "Dr. Kamal is a highly experienced Ayurvedic physician with over 15 years of practice in traditional Sri Lankan medicine.",
    experience: 15,
    languages: ["English", "Sinhala", "Tamil"],
    rating: 4.8,
    reviewCount: 124,
    availability: {
      'Monday': [{ start: '09:00 AM', end: '12:00 PM' }],
      'Wednesday': [{ start: '02:00 PM', end: '05:00 PM' }],
      'Friday': [{ start: '09:00 AM', end: '12:00 PM' }]
    },
    consultationFee: 2500
  },
  {
    name: "Dr. Amali Silva",
    specialization: "Panchakarma Specialist",
    location: "Kandy",
    email: "amali.silva@example.com",
    phone: "0762345678",
    imageUrl: "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg",
    bio: "Dr. Amali is specialized in Panchakarma therapies with expertise in detoxification and rejuvenation treatments.",
    experience: 12,
    languages: ["English", "Sinhala"],
    rating: 4.9,
    reviewCount: 98,
    availability: {
      'Tuesday': [{ start: '10:00 AM', end: '01:00 PM' }],
      'Thursday': [{ start: '03:00 PM', end: '06:00 PM' }],
      'Saturday': [{ start: '10:00 AM', end: '01:00 PM' }]
    },
    consultationFee: 3000
  },
  {
    name: "Dr. Nimal Bandara",
    specialization: "Marma Therapy Expert",
    location: "Galle",
    email: "nimal.bandara@example.com",
    phone: "0753456789",
    imageUrl: "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg",
    bio: "Dr. Nimal specializes in Marma therapy, focusing on vital energy points to heal various ailments and promote wellness.",
    experience: 10,
    languages: ["English", "Sinhala"],
    rating: 4.7,
    reviewCount: 76,
    availability: {
      'Monday': [{ start: '02:00 PM', end: '05:00 PM' }],
      'Wednesday': [{ start: '09:00 AM', end: '12:00 PM' }],
      'Saturday': [{ start: '02:00 PM', end: '05:00 PM' }]
    },
    consultationFee: 2800
  }
];

const DoctorsScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      let doctorsList = await doctorService.getAllDoctors();
      
      // If no doctors found, add sample doctors
      if (doctorsList.length === 0) {
        console.log('No doctors found, adding sample doctors...');
        for (const doctor of sampleDoctors) {
          await doctorService.addDoctor(doctor);
        }
        // Fetch the newly added doctors
        doctorsList = await doctorService.getAllDoctors();
      }
      
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
      Alert.alert('Error', 'Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    navigation.navigate('BookAppointment', { 
      doctorId: doctor.id || '',
      doctorName: doctor.name,
      specialization: doctor.specialization,
      location: doctor.location,
      email: doctor.email
    });
  };

  const handleToggleLocation = () => {
    setLocationEnabled(!locationEnabled);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Doctors</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors by name, specialization..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[
            styles.locationButton,
            locationEnabled && styles.locationButtonActive
          ]}
          onPress={handleToggleLocation}
        >
          <Ionicons
            name="location"
            size={20}
            color={locationEnabled ? "#FFFFFF" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E8B57" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : (
        <ScrollView style={styles.doctorsList}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <View key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.specialization}>{doctor.specialization}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.location}>{doctor.location}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={styles.rating}>{doctor.rating}</Text>
                    <Text style={styles.experience}>{doctor.experience} years</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBookAppointment(doctor)}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialIcons name="search-off" size={64} color="#CCCCCC" />
              <Text style={styles.noResultsText}>No doctors found</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your search</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  enableButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  doctorsList: {
    flex: 1,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
  },
  experience: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  requiredStar: {
    color: 'red',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  locationButton: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 6,
  },
  locationButtonActive: {
    backgroundColor: '#3B82F6',
  },
  searchIcon: {
    marginRight: 8,
  },
});

export default DoctorsScreen; 