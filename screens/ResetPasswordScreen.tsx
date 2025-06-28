import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

type RootStackParamList = {
  Login: undefined;
};

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: ResetPasswordScreenNavigationProp;
};

const ResetPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Send Firebase password reset email only
      await firebase.auth().sendPasswordResetEmail(email);
      
      Alert.alert(
        "Success",
        "Password reset instructions have been sent to your email. Please check your inbox.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#2E8B57" />
      </TouchableOpacity>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>
      
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
          editable={!loading}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFF4',
        justifyContent: 'center',
        paddingHorizontal: 24,
      },
      backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
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
      button: {
        backgroundColor: '#2E8B57',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginTop: 10,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
      },
      buttonDisabled: {
        backgroundColor: '#A9A9A9',
      }
});

export default ResetPasswordScreen; 