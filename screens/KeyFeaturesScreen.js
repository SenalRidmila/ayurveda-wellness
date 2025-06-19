import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92 > 400 ? 400 : width * 0.92;

export default function KeyFeaturesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Key Features</Text>
        <Text style={styles.subtitle}>
          Everything you need for holistic wellness
        </Text>

        {/* Feature Cards */}
        <View style={styles.cardsWrapper}>
          {/* AI Symptom Checker */}
          <View style={[styles.card, { borderLeftColor: '#3a84fa' }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#eaf1ff', shadowColor: '#3a84fa' }]}>
              <Image source={require('../assets/icons/ai.png')} style={styles.iconImg} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>AI Symptom Checker</Text>
              <Text style={styles.cardDesc}>Get personalized health insights</Text>
            </View>
          </View>
          {/* Natural Remedies */}
          <View style={[styles.card, { borderLeftColor: '#35c759' }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#e7faee', shadowColor: '#35c759' }]}>
              <Image source={require('../assets/icons/leaf.png')} style={styles.iconImg} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Natural Remedies</Text>
              <Text style={styles.cardDesc}>Traditional healing solutions</Text>
            </View>
          </View>
          {/* Book Ayurvedic Doctors */}
          <View style={[styles.card, { borderLeftColor: '#ffd560' }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#fff9e7', shadowColor: '#ffd560' }]}>
              <Image source={require('../assets/icons/doctor.png')} style={styles.iconImg} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Book Ayurvedic Doctors</Text>
              <Text style={styles.cardDesc}>Connect with certified practitioners</Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started {'>'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF6',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingBottom: 55,
    minHeight: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#218838',
    textAlign: 'center',
    letterSpacing: 1.1,
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#4A7C59',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 15,
    letterSpacing: 0.15,
  },
  cardsWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 34,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderRadius: 24,
    marginBottom: 25,
    width: CARD_WIDTH,
    minHeight: 100,
    shadowColor: "#b3f7c7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 7,
    borderLeftWidth: 9,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 22,
    elevation: 7,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.23,
    shadowRadius: 12,
    backgroundColor: '#e7faee',
  },
  iconImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  cardText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#218838',
    marginBottom: 4,
    letterSpacing: 0.32,
  },
  cardDesc: {
    fontSize: 15.5,
    color: '#4a7c59',
    opacity: 0.96,
    letterSpacing: 0.1,
  },
  button: {
    backgroundColor: '#20a34a',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 33,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: "#20a34a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.21,
    shadowRadius: 18,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.3,
  },
});
