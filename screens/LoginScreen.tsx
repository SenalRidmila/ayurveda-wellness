import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter both email and password.");
    }
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Home'); // Navigate to Home screen after successful login
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2E8B57" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.doctorButton}
          onPress={() => navigation.navigate('DoctorLogin')}
        >
          <Text style={styles.doctorButtonText}>For Doctors</Text>
          <Ionicons name="medical" size={18} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.loginButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.registerText, styles.registerLink]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  doctorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7EC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  doctorButtonText: {
    color: '#2E8B57',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginRight: 6,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#556B2F',
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#2E8B57',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#2E8B57',
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // A lighter shade of the original button color
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#556B2F',
  },
  registerLink: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#2E8B57',
  },
});

export default LoginScreen; 