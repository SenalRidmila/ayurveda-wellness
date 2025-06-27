import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth, db } from '../firebaseConfig';
import { Doctor, doctorService } from '../models/DoctorModel';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  DoctorRegister: undefined;
  DoctorLogin: undefined;
  Home: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

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

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const DoctorRegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSpecializations, setShowSpecializations] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!name || !email || !password || !confirmPassword || !specialization) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Create user account with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create doctor profile
      const doctorData: Doctor = {
        name,
        specialization,
        location: location || 'Not specified',
        email,
        phone: phone || '',
        bio: bio || '',
        experience: parseInt(experience) || 0,
        languages: ['English', 'Sinhala'],
        rating: 5.0,
        reviewCount: 0,
        availability: {
          'Monday': [{ start: '09:00 AM', end: '12:00 PM' }],
          'Wednesday': [{ start: '02:00 PM', end: '05:00 PM' }],
          'Friday': [{ start: '09:00 AM', end: '12:00 PM' }]
        },
        consultationFee: 1500,
        imageUrl: 'https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg'
      };

      // Add doctor to Firestore
      const doctorId = await doctorService.addDoctor(doctorData);

      // Update user record with role and doctorId
      await db.collection('users').doc(user?.uid).set({
        email: email,
        name: name,
        role: 'doctor',
        doctorId: doctorId,
        createdAt: new Date()
      });

      Alert.alert(
        'Registration Successful',
        'Your doctor account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Error registering doctor:', error);
      Alert.alert('Registration Failed', 'Failed to create doctor account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSpecializationDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setShowSpecializations(!showSpecializations)}
        >
          <Text style={styles.dropdownText}>
            {specialization || 'Select Specialization'}
          </Text>
          <Ionicons
            name={showSpecializations ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {showSpecializations && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
              {specializations.map((spec, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSpecialization(spec);
                    setShowSpecializations(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{spec}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <CustomSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register as Doctor</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Dr. Full Name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="doctor@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
              />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Professional Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialization <Text style={styles.required}>*</Text></Text>
              {renderSpecializationDropdown()}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Experience (Years)</Text>
              <TextInput
                style={styles.input}
                value={experience}
                onChangeText={setExperience}
                placeholder="Years of Experience"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Brief description about yourself and your practice"
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Register as Doctor</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
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
  required: {
    color: '#FF3B30',
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
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownHeader: {
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
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1001,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default DoctorRegisterScreen; 