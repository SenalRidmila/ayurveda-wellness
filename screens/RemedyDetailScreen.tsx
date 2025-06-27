import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Remedies: undefined;
  RemedyDetail: {
    title: string;
    description: string;
    category: string;
    instructions: string[];
    ingredients: string[];
    benefits: string[];
  };
};

type RemedyDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RemedyDetail'
>;

type RemedyDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'RemedyDetail'
>;

type Props = {
  navigation: RemedyDetailScreenNavigationProp;
  route: RemedyDetailScreenRouteProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const RemedyDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    title,
    description,
    category,
    instructions,
    ingredients,
    benefits,
  } = route.params;

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#166534" />
              <Text style={styles.bulletText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Ionicons name="leaf" size={20} color="#166534" />
              <Text style={styles.bulletText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.bulletText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteSection}>
          <Ionicons name="information-circle" size={24} color="#92400E" />
          <Text style={styles.noteText}>
            Always consult with a qualified Ayurvedic practitioner before starting any new treatment regimen.
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
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
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
  categoryContainer: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#166534',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    lineHeight: 24,
  },
  noteSection: {
    backgroundColor: '#FEF3C7',
    margin: 16,
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
  },
});

export default RemedyDetailScreen; 