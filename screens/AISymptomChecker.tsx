import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AyurvedaModel } from '../models/AyurvedaModel';

type RootStackParamList = {
  Home: undefined;
  AISymptomChecker: undefined;
};

type AISymptomCheckerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AISymptomChecker'
>;

type Props = {
  navigation: AISymptomCheckerScreenNavigationProp;
};

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;
const windowWidth = Dimensions.get('window').width;

interface Question {
  id: number;
  text: string;
  description: string;
  options: Array<{
    text: string;
    description: string;
  }>;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is your primary symptom?",
    description: "Select the most prominent symptom you're experiencing right now.",
    options: [
      { 
        text: "Headache",
        description: "Including tension, migraine, or general head discomfort"
      },
      { 
        text: "Fever",
        description: "Elevated body temperature with or without chills"
      },
      { 
        text: "Fatigue",
        description: "Persistent tiredness or lack of energy"
      },
      { 
        text: "Digestive Issues",
        description: "Including bloating, indigestion, or irregular bowel movements"
      }
    ]
  },
  {
    id: 2,
    text: "How long have you been experiencing this symptom?",
    description: "This helps determine if the condition is acute or chronic.",
    options: [
      { 
        text: "Less than a day",
        description: "Symptoms started recently"
      },
      { 
        text: "1-3 days",
        description: "Short-term acute condition"
      },
      { 
        text: "4-7 days",
        description: "Extended acute condition"
      },
      { 
        text: "More than a week",
        description: "Potentially chronic condition"
      }
    ]
  },
  {
    id: 3,
    text: "What time of day do you feel worse?",
    description: "Different doshas are more active at different times of the day.",
    options: [
      { 
        text: "Morning",
        description: "6 AM - 10 AM (Kapha time)"
      },
      { 
        text: "Afternoon",
        description: "10 AM - 2 PM (Pitta time)"
      },
      { 
        text: "Evening",
        description: "2 PM - 6 PM (Vata time)"
      },
      { 
        text: "Night",
        description: "6 PM - 10 PM (Kapha time)"
      }
    ]
  },
  {
    id: 4,
    text: "Have you noticed any triggers?",
    description: "Understanding triggers helps identify the root cause.",
    options: [
      { 
        text: "Food",
        description: "Certain foods or eating habits"
      },
      { 
        text: "Weather",
        description: "Changes in temperature or climate"
      },
      { 
        text: "Stress",
        description: "Emotional or mental pressure"
      },
      { 
        text: "Physical Activity",
        description: "Exercise or physical strain"
      }
    ]
  },
  {
    id: 5,
    text: "How would you describe your sleep pattern?",
    description: "Sleep patterns can indicate dosha imbalances.",
    options: [
      { 
        text: "Light and interrupted",
        description: "Difficulty staying asleep, waking up frequently"
      },
      { 
        text: "Moderate but intense dreams",
        description: "Sleep through the night but with vivid dreams"
      },
      { 
        text: "Heavy and prolonged",
        description: "Deep sleep, difficulty waking up"
      },
      { 
        text: "Variable and inconsistent",
        description: "Sleep pattern changes frequently"
      }
    ]
  },
  {
    id: 6,
    text: "What is your typical energy level throughout the day?",
    description: "Energy patterns can reveal your dominant dosha.",
    options: [
      { 
        text: "Variable and unpredictable",
        description: "Energy comes in bursts, then crashes"
      },
      { 
        text: "Strong but burns out quickly",
        description: "Intense focus but may exhaust easily"
      },
      { 
        text: "Steady but slow to start",
        description: "Takes time to get going but maintains energy"
      },
      { 
        text: "Low and needs stimulation",
        description: "Often feels lethargic and needs motivation"
      }
    ]
  }
];

const AISymptomChecker: React.FC<Props> = ({ navigation }) => {
  // States
  const [screenState, setScreenState] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{
    dosha: string;
    description: string;
    remedies: string[];
  } | null>(null);

  // Start the quiz
  const startQuiz = () => {
    setScreenState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      try {
        const model = new AyurvedaModel();
        const dosha = model.determineDosha(newAnswers);
        const recommendations = model.getDoshaRecommendations(dosha);
        
        setResult({
          dosha,
          description: recommendations.description,
          remedies: recommendations.remedies
        });
        
        // Show results screen
        setScreenState('results');
      } catch (error) {
        console.error("Error determining dosha:", error);
      }
    }
  };

  // Go back to previous question
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progress = (currentQuestion + 1) / questions.length * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>
    );
  };

  // Render welcome screen
  const renderWelcomeScreen = () => {
    return (
      <View style={styles.mainCard}>
        <Ionicons name="medical" size={64} color="#3B82F6" />
        <Text style={styles.mainTitle}>What are your symptoms?</Text>
        <Text style={styles.mainSubtitle}>
          Our AI will analyze your symptoms and provide personalized Ayurvedic recommendations.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={startQuiz}
        >
          <Text style={styles.buttonText}>Start Assessment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render quiz questions
  const renderQuizScreen = () => {
    const question = questions[currentQuestion];
    return (
      <>
        {renderProgressBar()}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>
          <Text style={styles.questionDescription}>{question.description}</Text>
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option.text)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {currentQuestion > 0 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={20} color="#666" />
              <Text style={styles.backButtonText}>Previous Question</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Important Note</Text>
          <Text style={styles.noteText}>
            This tool provides general wellness guidance based on Ayurvedic principles. For serious health concerns, please consult with a qualified healthcare professional.
          </Text>
        </View>
      </>
    );
  };

  // Render results screen
  const renderResultsScreen = () => {
    if (!result) return null;
    
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Dosha Type</Text>
          <View style={styles.doshaContainer}>
            <Text style={styles.doshaText}>{result.dosha}</Text>
          </View>
          <Text style={styles.resultDescription}>{result.description}</Text>
          
          <Text style={styles.remediesTitle}>Recommended Remedies:</Text>
          {result.remedies.map((remedy, index) => (
            <View key={index} style={styles.remedyItem}>
              <Text style={styles.remedyText}>• {remedy}</Text>
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={startQuiz}
            >
              <Text style={styles.buttonText}>Retake Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Main render
  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Symptom Checker</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {screenState === 'welcome' && renderWelcomeScreen()}
          {screenState === 'quiz' && renderQuizScreen()}
          {screenState === 'results' && renderResultsScreen()}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  questionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  resultContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  doshaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  doshaText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    lineHeight: 24,
  },
  remediesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  remedyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  remedyText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  noteCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  retakeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  homeButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default AISymptomChecker; 