import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
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

type RemediesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Remedies'
>;

type Props = {
  navigation: RemediesScreenNavigationProp;
};

interface Remedy {
  id: string;
  title: string;
  description: string;
  category: string;
  instructions: string[];
  ingredients: string[];
  benefits: string[];
}

const remedies: Remedy[] = [
  {
    id: '1',
    title: 'Ginger Tea for Headache',
    description: 'Natural remedy for tension headaches and migraines',
    category: 'Neurological',
    instructions: [
      'Grate 1 inch of fresh ginger',
      'Boil 2 cups of water and add grated ginger',
      'Add 2-3 tulsi leaves (optional)',
      'Steep for 5-10 minutes',
      'Strain and add honey and lemon if desired',
      'Drink while warm, 2-3 times a day',
    ],
    ingredients: [
      'Fresh ginger root (1 inch)',
      'Water (2 cups)',
      'Honey (to taste)',
      'Lemon (optional)',
      'Tulsi leaves (optional)',
    ],
    benefits: [
      'Reduces inflammation',
      'Relieves headache pain',
      'Improves circulation',
      'Natural pain relief',
      'Boosts immunity',
      'Reduces nausea',
    ],
  },
  {
    id: '2',
    title: 'Turmeric Milk for Joint Pain',
    description: 'Anti-inflammatory golden milk for joint health and immunity',
    category: 'Musculoskeletal',
    instructions: [
      'Heat 1 cup of milk (preferably organic)',
      'Add 1 teaspoon turmeric powder',
      'Add 1/4 teaspoon black pepper',
      'Add 1/2 teaspoon ginger powder',
      'Add 1/2 teaspoon cinnamon powder',
      'Simmer for 5-7 minutes on low heat',
      'Add honey to taste',
      'Drink warm before bedtime',
    ],
    ingredients: [
      'Organic milk (1 cup)',
      'Turmeric powder (1 tsp)',
      'Black pepper (1/4 tsp)',
      'Ginger powder (1/2 tsp)',
      'Cinnamon powder (1/2 tsp)',
      'Honey (to taste)',
    ],
    benefits: [
      'Reduces joint inflammation',
      'Improves flexibility',
      'Boosts immunity',
      'Natural pain management',
      'Promotes better sleep',
      'Improves digestion',
    ],
  },
  {
    id: '3',
    title: 'Triphala for Digestion',
    description: 'Traditional herbal blend for digestive health and detoxification',
    category: 'Digestive',
    instructions: [
      'Take 1/2-1 teaspoon Triphala powder',
      'Mix with warm water or honey',
      'Consume before bedtime or early morning',
      'Start with smaller dose and increase gradually',
      'Take on empty stomach for best results',
      'Maintain 2-hour gap from meals',
    ],
    ingredients: [
      'Triphala powder',
      'Warm water',
      'Honey (optional)',
    ],
    benefits: [
      'Improves digestion',
      'Cleanses digestive tract',
      'Reduces bloating',
      'Supports gut health',
      'Natural detoxification',
      'Promotes regular bowel movements',
    ],
  },
  {
    id: '4',
    title: 'Ashwagandha for Stress',
    description: 'Powerful adaptogenic herb for stress relief and mental wellness',
    category: 'Mental Health',
    instructions: [
      'Take 1/2 teaspoon Ashwagandha powder',
      'Mix with warm milk or water',
      'Add honey if desired',
      'Consume twice daily after meals',
      'Best taken regularly for 2-3 months',
      'Can be combined with other adaptogens',
    ],
    ingredients: [
      'Ashwagandha powder',
      'Warm milk or water',
      'Honey (optional)',
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves sleep quality',
      'Boosts energy levels',
      'Enhances mental clarity',
      'Supports immune system',
      'Balances hormones',
    ],
  },
  {
    id: '5',
    title: 'Neem for Skin Health',
    description: 'Natural antibacterial and anti-inflammatory remedy for skin conditions',
    category: 'Dermatological',
    instructions: [
      'Boil neem leaves in water for 10 minutes',
      'Let it cool and strain',
      'Apply directly to affected areas',
      'Can be used as face wash or bath water',
      'For internal use, take 2-3 neem leaves',
      'Chew fresh leaves or make tea',
    ],
    ingredients: [
      'Fresh neem leaves',
      'Water',
      'Neem powder (alternative)',
    ],
    benefits: [
      'Treats acne and pimples',
      'Reduces skin inflammation',
      'Natural blood purifier',
      'Antibacterial properties',
      'Improves skin complexion',
      'Treats various skin conditions',
    ],
  },
  {
    id: '6',
    title: 'Brahmi for Memory',
    description: 'Cognitive enhancer for better memory and mental performance',
    category: 'Neurological',
    instructions: [
      'Take 1/2 teaspoon Brahmi powder',
      'Mix with warm water or honey',
      'Consume twice daily after meals',
      'Can be taken with milk at bedtime',
      'Regular use recommended for best results',
      'Avoid on empty stomach',
    ],
    ingredients: [
      'Brahmi powder',
      'Warm water or milk',
      'Honey (optional)',
    ],
    benefits: [
      'Improves memory',
      'Enhances concentration',
      'Reduces anxiety',
      'Promotes mental clarity',
      'Supports brain health',
      'Reduces stress',
    ],
  },
  {
    id: '7',
    title: 'Amla for Immunity',
    description: 'Vitamin C-rich superfood for immune system and overall health',
    category: 'Immune System',
    instructions: [
      'Take fresh Amla juice (30ml)',
      'Mix with water if needed',
      'Add honey for taste',
      'Consume on empty stomach',
      'Can be taken as powder with honey',
      'Best taken in the morning',
    ],
    ingredients: [
      'Fresh Amla or Amla powder',
      'Water',
      'Honey (optional)',
    ],
    benefits: [
      'Boosts immunity',
      'Rich in Vitamin C',
      'Improves digestion',
      'Enhances skin health',
      'Promotes hair growth',
      'Anti-aging properties',
    ],
  },
  {
    id: '8',
    title: 'Tulsi for Respiratory Health',
    description: 'Sacred herb for respiratory wellness and immunity',
    category: 'Respiratory',
    instructions: [
      'Boil 5-6 Tulsi leaves in water',
      'Add ginger and black pepper',
      'Steep for 5-10 minutes',
      'Strain and add honey',
      'Drink warm 2-3 times daily',
      'Can be chewed fresh for quick relief',
    ],
    ingredients: [
      'Fresh Tulsi leaves',
      'Ginger (optional)',
      'Black pepper',
      'Honey',
      'Water',
    ],
    benefits: [
      'Relieves cough and cold',
      'Improves respiratory health',
      'Boosts immunity',
      'Anti-inflammatory properties',
      'Reduces stress',
      'Natural expectorant',
    ],
  },
];

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const RemediesScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleRemedyPress = (remedy: Remedy) => {
    navigation.navigate('RemedyDetail', {
      title: remedy.title,
      description: remedy.description,
      category: remedy.category,
      instructions: remedy.instructions,
      ingredients: remedy.ingredients,
      benefits: remedy.benefits,
    });
  };

  const filteredRemedies = remedies.filter(remedy =>
    remedy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayurvedic Remedies</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search remedies (e.g., headache, digestion)"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView style={styles.remediesList}>
        {filteredRemedies.map(remedy => (
          <TouchableOpacity
            key={remedy.id}
            style={styles.remedyCard}
            onPress={() => handleRemedyPress(remedy)}
          >
            <View style={styles.remedyContent}>
              <Text style={styles.remedyTitle}>{remedy.title}</Text>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{remedy.category}</Text>
              </View>
              <Text style={styles.remedyDescription}>{remedy.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
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
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  remediesList: {
    flex: 1,
    padding: 16,
  },
  remedyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  remedyContent: {
    flex: 1,
  },
  remedyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },
  remedyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default RemediesScreen; 