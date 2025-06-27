import React, { useState, useEffect } from 'react';
import { NavigationContainer, Theme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { auth, rtdb } from './firebaseConfig';
import firebase from './firebaseConfig'; // Import directly from firebaseConfig
import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from './emailjsConfig';

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.USER_ID);

// Firebase Functions is already initialized in firebaseConfig.ts
// No need to initialize it again here

// Define theme colors
const theme = {
  colors: {
    primary: '#166534',
    secondary: '#7C3AED',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: '#333333',
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#059669',
    warning: '#92400E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Custom navigation theme
const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.error,
  },
};

// Define the type for the stack navigator
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
  DoctorDashboard: undefined;
  RemedyDetail: {
    title: string;
    description: string;
    category: string;
    instructions: string[];
    ingredients: string[];
    benefits: string[];
  };
  BookAppointment: {
    doctorId: string;
    doctorName: string;
    specialization: string;
    location: string;
    email: string;
  };
};

// Import screens
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import AISymptomChecker from './screens/AISymptomChecker';
import DoctorsScreen from './screens/DoctorsScreen';
import BookAppointmentScreen from './screens/BookAppointmentScreen';
import RemediesScreen from './screens/RemediesScreen';
import RemedyDetailScreen from './screens/RemedyDetailScreen';
import HealthInfoScreen from './screens/HealthInfoScreen';
import KeyFeaturesScreen from './screens/KeyFeaturesScreen';
import DoctorLoginScreen from './screens/DoctorLoginScreen';
import DoctorRegisterScreen from './screens/DoctorRegisterScreen';
import DoctorDashboardScreen from './screens/DoctorDashboardScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={{ marginTop: theme.spacing.md, color: theme.colors.text, fontFamily: 'Poppins_500Medium' }}>
      Loading...
    </Text>
  </View>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <Text style={{ color: theme.colors.error, fontSize: 18, marginBottom: theme.spacing.md, fontFamily: 'Poppins_600SemiBold' }}>
            Something went wrong
          </Text>
          <Text style={{ color: theme.colors.text, textAlign: 'center', paddingHorizontal: theme.spacing.lg, fontFamily: 'Poppins_400Regular' }}>
            We apologize for the inconvenience. Please try restarting the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [user, setUser] = useState<firebase.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    // Check authentication state
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Check network connectivity using a simpler approach
    const checkConnectivity = () => {
      fetch('https://www.google.com', { mode: 'no-cors' })
        .then(() => {
          setNetworkError(false);
        })
        .catch(() => {
          setNetworkError(true);
        });
    };

    // Check initially and then every 10 seconds
    checkConnectivity();
    const connectivityInterval = setInterval(checkConnectivity, 10000);

    return () => {
      unsubscribeAuth();
      clearInterval(connectivityInterval);
    };
  }, [initializing]);

  // Show network error if detected
  useEffect(() => {
    if (networkError && !initializing) {
      Alert.alert(
        "Network Connection Issue",
        "The app is having trouble connecting to the server. Some features may be limited.",
        [{ text: "OK" }]
      );
    }
  }, [networkError, initializing]);

  if (!fontsLoaded || initializing) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            initialRouteName={user ? "Home" : "Welcome"}
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: theme.colors.background },
              cardShadowEnabled: false,
              cardOverlayEnabled: true,
              gestureEnabled: true,
              presentation: 'card',
              headerStyle: {
                backgroundColor: theme.colors.background,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 18,
              },
              headerTintColor: theme.colors.text,
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="KeyFeatures" component={KeyFeaturesScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AISymptomChecker" component={AISymptomChecker} />
            <Stack.Screen name="Doctors" component={DoctorsScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="Remedies" component={RemediesScreen} />
            <Stack.Screen name="RemedyDetail" component={RemedyDetailScreen} />
            <Stack.Screen name="HealthInfo" component={HealthInfoScreen} />
            <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen} />
            <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} />
            <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
