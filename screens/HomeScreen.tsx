import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  ImageBackground,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from '../firebaseConfig';
import { auth, db } from '../firebaseConfig';

type RootStackParamList = {
  Home: undefined;
  AISymptomChecker: undefined;
  Login: undefined;
  Doctors: undefined;
  Remedies: undefined;
  HealthInfo: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;
const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check Firebase connection
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser?.displayName) {
          setUserName(currentUser.displayName);
        } else if (currentUser?.email) {
          // If display name is not set, use email before '@'
          setUserName(currentUser.email.split('@')[0]);
        } else {
          setUserName('User');
        }
        
        // Use a simpler approach to check connectivity
        try {
          // Try to get a document that should exist
          await fetch('https://www.google.com', { mode: 'no-cors' });
          console.log('Network connection successful');
          setConnectionStatus('connected');
        } catch (error) {
          console.error('Network connection error:', error);
          setConnectionStatus('error');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setConnectionStatus('error');
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');  // Navigate to Login screen after signing out
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert("Logout Error", "Failed to sign out. Please try again.");
    }
  };

  // Show loading indicator while checking connection
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/ayurveda-background.png')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.gradientOverlay} />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <CustomSafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.nameText}>{userName}</Text>
              {connectionStatus === 'error' && (
                <Text style={styles.errorText}>Offline Mode</Text>
              )}
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bell" size={24} color="#2E8B57" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                <Feather name="log-out" size={24} color="#2E8B57" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={[styles.quickActionsContainer, styles.centeredSection]}>
            <TouchableOpacity 
              style={[styles.quickActionCard, styles.cardGradient1]}
              onPress={() => navigation.navigate('AISymptomChecker')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E6F5EC' }]}>
                <Ionicons name="medical" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickActionTitle}>Symptom Checker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, styles.cardGradient2]}
              onPress={() => navigation.navigate('Doctors')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F0F0FF' }]}>
                <Ionicons name="people" size={24} color="#059669" />
              </View>
              <Text style={styles.quickActionTitle}>Find Doctors</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuresContainer, styles.centeredSection]}>
            <TouchableOpacity
              style={[styles.featureCard, styles.cardGradient3]}
              onPress={() => navigation.navigate('Remedies')}
            >
              <MaterialCommunityIcons name="meditation" size={32} color="#7C3AED" />
              <Text style={styles.featureTitle}>Remedies</Text>
              <Text style={styles.featureDescription}>
                Browse traditional Ayurvedic remedies and treatments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, styles.cardGradient4]}
              onPress={() => navigation.navigate('HealthInfo')}
            >
              <MaterialCommunityIcons name="heart-pulse" size={32} color="#7C3AED" />
              <Text style={styles.featureTitle}>Health Info</Text>
              <Text style={styles.featureDescription}>
                Learn about Ayurvedic lifestyle and wellness tips
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>Daily Tips</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tipsContainer}
            contentContainerStyle={[styles.tipsContentContainer, styles.centeredTipsContainer]}
          >
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Feather name="sun" size={24} color="#FFB347" />
              </View>
              <Text style={styles.tipTitle}>Morning Routine</Text>
              <Text style={styles.tipText}>Start your day with warm water and lemon to boost digestion</Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Feather name="moon" size={24} color="#6B66FF" />
              </View>
              <Text style={styles.tipTitle}>Night Routine</Text>
              <Text style={styles.tipText}>Practice meditation before bed for better sleep</Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Feather name="heart" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.tipTitle}>Self Care</Text>
              <Text style={styles.tipText}>Regular oil massage improves circulation</Text>
            </View>
          </ScrollView>
        </ScrollView>
      </CustomSafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  nameText: {
    fontSize: 24,
    color: '#2E8B57',
    fontFamily: 'Poppins_600SemiBold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(240, 255, 244, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  featuredImage: {
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 255, 244, 0.5)',
  },
  featuredContent: {
    padding: 20,
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 22,
    color: '#2E8B57',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 10,
    textAlign: 'center',
  },
  featuredText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginTop: 5,
    textAlign: 'center',
    maxWidth: '90%',
  },
  startButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#2E8B57',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quickActionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: '48%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  featureTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsContentContainer: {
    paddingRight: 20,
    justifyContent: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width * 0.7,
    maxWidth: 280,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 5,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#2E8B57',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 5,
  },
  centeredSection: {
    justifyContent: 'center',
    gap: 15,
  },
  centeredTipsContainer: {
    justifyContent: 'center',
  },
  cardGradient1: {
    backgroundColor: 'rgba(230, 245, 236, 0.9)',
  },
  cardGradient2: {
    backgroundColor: 'rgba(240, 240, 255, 0.9)',
  },
  cardGradient3: {
    backgroundColor: 'rgba(245, 230, 245, 0.9)',
  },
  cardGradient4: {
    backgroundColor: 'rgba(230, 245, 245, 0.9)',
  },
});

export default HomeScreen; 