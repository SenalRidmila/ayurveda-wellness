import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation prop
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Home: undefined;
  AISymptomChecker: undefined;
  Doctors: undefined;
  KeyFeatures: undefined;
  Remedies: undefined;
  HealthInfo: undefined;
  DoctorLogin: undefined;
  DoctorRegister: undefined;
  RemedyDetail: {
    title: string;
    description: string;
    category: string;
    instructions: string[];
    ingredients: string[];
    benefits: string[];
  };
  BookAppointment: {
    doctorName: string;
    specialization: string;
    location: string;
  };
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9F4" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf-outline" size={60} color="#28a745" />
        </View>
        <Text style={styles.title}>Welcome to Ayurvedic Wellness</Text>
        <Text style={styles.subtitle}>Discover holistic healing</Text>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => navigation.navigate('KeyFeatures')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E4F2E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E5631',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: '#28a745',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 