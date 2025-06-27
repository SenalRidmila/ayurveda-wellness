import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

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

type KeyFeaturesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'KeyFeatures'
>;

type Props = {
  navigation: KeyFeaturesScreenNavigationProp;
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle, color }) => (
    <TouchableOpacity style={styles.featureCard}>
      <View style={[styles.featureIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
);

const KeyFeaturesScreen = ({ navigation }: Props) => {
  const features = [
    {
      icon: <MaterialCommunityIcons name="brain" size={30} color="#4A90E2" />,
      title: "AI Symptom Checker",
      subtitle: "Get personalized health insights",
      color: "#E7F0FA",
      description: 'Find personalized health insights and manage your health with AI.',
    },
    {
      icon: <Ionicons name="leaf" size={30} color="#34A853" />,
      title: "Natural Remedies",
      subtitle: "Traditional healing solutions",
      color: "#E6F4EA",
      description: 'Explore natural remedies and traditional healing solutions.',
    },
    {
      icon: <MaterialCommunityIcons name="doctor" size={30} color="#F5A623" />,
      title: "Book Ayurvedic Doctors",
      subtitle: "Connect with certified practitioners",
      color: "#FFF6E5",
      description: 'Find top-rated Ayurvedic doctors and book appointments seamlessly.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9F4" />
      <View style={styles.header}>
        <Text style={styles.title}>Key Features</Text>
        <Text style={styles.subtitle}>Everything you need for holistic wellness</Text>
      </View>
      <View style={styles.featuresList}>
        <FlatList
          data={features}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <FeatureCard 
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              color={item.color}
            />
          )}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F4',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E5631',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  featuresList: {
    width: '100%',
    flex: 1,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderColor: '#E8E8E8',
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default KeyFeaturesScreen; 