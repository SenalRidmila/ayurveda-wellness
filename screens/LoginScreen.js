import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { login } from '../auth/authFunctions';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from '../config/firebase'; // Changed import

// Complete web browser session if needed
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '306656960463-vjlm3b1qmsk5su10ad6g4e46esgn9vl2.apps.googleusercontent.com',
    androidClientId: '686252877880-v0ndgeqjrvk6vsp91dthgrgkmb5g3133.apps.googleusercontent.com',
    iosClientId: '686252877880-le7tkrg8s8hrd5s8ju7t4q5023lgkmrn.apps.googleusercontent.com',
    webClientId: '686252877880-sku0iu4anej958aolkijeatd454sal7c.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        const auth = getFirebaseAuth(); // Get auth instance
        signInWithCredential(auth, credential)
          .then(() => navigation.replace('Home'))
          .catch((err) => Alert.alert("Google Sign In Error", err.message));
      } else {
        Alert.alert("Google Sign In Error", "No id_token received from Google.");
      }
    }
  }, [response]);

  // Email/password login
  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Login Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize='none'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()}>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F8FFF6', padding:18 },
  title: { fontSize:26, fontWeight:'bold', marginBottom:24, color:'#218838' },
  input: { width:'100%', maxWidth:350, backgroundColor:'#fff', padding:14, borderRadius:8, marginBottom:10, borderWidth:1, borderColor:'#c4e2d7', fontSize:16 },
  button: { backgroundColor:'#20a34a', paddingVertical:14, paddingHorizontal:100, borderRadius:8, alignItems:'center', marginTop:5, marginBottom:8 },
  buttonText: { color:'#fff', fontSize:17, fontWeight:'bold' },
  googleBtn: { backgroundColor:'#fff', borderWidth:1, borderColor:'#20a34a', paddingVertical:12, paddingHorizontal:40, borderRadius:8, marginBottom:8 },
  googleText: { color:'#20a34a', fontWeight:'bold', fontSize:17 },
  registerText: { color:'#218838', marginTop:15, fontSize:15 }
});
