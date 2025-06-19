import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
// Expo gradient එක use කරන්න, expo install expo-linear-gradient කරලා import කරන්න
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#e9fff1', '#fdf8e3']}
      style={styles.container}
      start={[0, 0]}
      end={[0, 1]}
    >
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/icons/leaf.png')} style={styles.iconImg} />
        </View>
        <Text style={styles.title}>Welcome to Ayurvedic Wellness</Text>
        <Text style={styles.subtitle}>Discover holistic healing</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('KeyFeatures')}
          activeOpacity={0.88}
        >
          <Text style={styles.buttonText}>Next {'>'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -40,
  },
  iconCircle: {
    backgroundColor: '#e7faee',
    borderRadius: 80,
    padding: 28,
    marginBottom: 44,
    shadowColor: "#20a34a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.19,
    shadowRadius: 16.00,
    elevation: 10,
  },
  iconImg: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#218838',
    marginBottom: 10,
    letterSpacing: 0.9,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A7C59',
    marginBottom: 48,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.96,
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#20a34a',
    paddingVertical: 18,
    paddingHorizontal: 78,
    borderRadius: 30,
    marginTop: 12,
    elevation: 9,
    shadowColor: "#20a34a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.19,
    shadowRadius: 14.00,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});
