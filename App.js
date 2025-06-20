// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import KeyFeaturesScreen from './screens/KeyFeaturesScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AISymptomChecker from './screens/AISymptomChecker';
import Remedies from './screens/Remedies';
import Doctors from './screens/Doctors'; // <- Note: default import, correct path!

const Stack = createStackNavigator();

export default function App() {
  return (
  <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="KeyFeatures" component={KeyFeaturesScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="AISymptomChecker" component={AISymptomChecker} />
  <Stack.Screen name="Remedies" component={Remedies} />
  <Stack.Screen name="Doctors" component={Doctors} />
</Stack.Navigator>

  );
}
