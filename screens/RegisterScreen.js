// /screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { register } from '../auth/authFunctions';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      await register(email, password);
      Alert.alert('Success!', 'Registration successful!');
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Register Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize='none'
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  loginText: { color:'#218838', marginTop:15, fontSize:15 }
});
