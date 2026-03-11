import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  HealthInfo: undefined;
};

type HealthInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HealthInfo'
>;

type Props = {
  navigation: HealthInfoScreenNavigationProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const HealthInfoScreen: React.FC<Props> = ({ navigation }) => {
  const healthTips = [
    {
      id: '1',
      title: 'Daily Routine (Dinacharya)',
      content: [
        'Wake up before 6 AM',
        'Drink water in the morning',
        'Practice yoga/exercise',
        'Eat meals at proper times',
        'Sleep before 10 PM',
      ],
    },
    {
      id: '2',
      title: 'Diet Guidelines (Ahara)',
      content: [
        'Eat foods suitable for your constitution',
        'Drink warm water',
        'Take adequate time for meals',
        'Keep dinner light',
        'Avoid excessive oily and fried foods',
      ],
    },
    {
      id: '3',
      title: 'Seasonal Routine (Ritucharya)',
      content: [
        'Eat foods appropriate for the season',
        'Wear clothes suitable for the season',
        'Adjust lifestyle according to environmental temperature',
        'Protect yourself from seasonal diseases',
        'Take special care during seasonal transitions',
      ],
    },
    {
      id: '4',
      title: 'Mental Health (Manas Swasthya)',
      content: [
        'Practice meditation',
        'Maintain positive thinking',
        'Get adequate rest',
        'Maintain healthy social relationships',
        'Manage stress effectively',
      ],
    },
    {
      id: '5',
      title: 'Immunity (Vyadhikshamatva)',
      content: [
        'Use Rasayana herbs (e.g., Ashwagandha)',
        'Proper exercise',
        'Adequate sleep',
        'Consume fruits and vegetables',
        'Include grains in your diet',
      ],
    },
    {
      id: '6',
      title: 'Lifestyle (Jeevan Shaili)',
      content: [
        'Follow a Sattvic lifestyle',
        'Proper time management',
        'Eco-friendly lifestyle',
        'Balanced meals',
        'Proper rest and work balance',
      ],
    },
  ];

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayurvedic Health Information</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Ayurveda for Healthy Living</Text>
          <Text style={styles.introText}>
            Ayurveda is a complete way of life. Following the guidelines included here
            can help you lead a healthy life.
          </Text>
        </View>

        {healthTips.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <Ionicons name="leaf" size={20} color="#166534" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.noteSection}>
          <Ionicons name="information-circle" size={24} color="#92400E" />
          <Text style={styles.noteText}>
            This information is for general awareness only. Please consult a qualified
            Ayurvedic practitioner for medical advice.
          </Text>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
  },
  introSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
  },
  noteSection: {
    backgroundColor: '#FEF3C7',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    marginLeft: 12,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
});

export default HealthInfoScreen; 