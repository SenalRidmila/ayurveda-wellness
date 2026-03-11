import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { generateQuizQuestions, generateQuizResult } from '../geminiConfig';

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

interface Question {
  question: string;
  options: string[];
}

const AISymptomChecker: React.FC<Props> = ({ navigation }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [generatingResult, setGeneratingResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Add a small random delay to ensure fresh generation
        const randomDelay = Math.floor(Math.random() * 500) + 200; // 200-700ms
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        console.log("Generating fresh questions with timestamp:", Date.now());
        const generatedQuestions = await generateQuizQuestions();
        if (generatedQuestions && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          // If AI fails, show error and retry option
          setQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleShowResult(newAnswers);
    }
  };

  const handleShowResult = async (finalAnswers: string[]) => {
    setGeneratingResult(true);
    
    try {
      const geminiResult = await generateQuizResult(questions, finalAnswers);
      
      // Check if AI analysis was successful
      if (geminiResult && geminiResult.trim()) {
        setResult(geminiResult);
      } else {
        // AI returned null or empty result
        setResult(
          "🤖 AI Analysis Unavailable\n\n" 
        )
      }
    } catch (error) {
      console.error('Error generating result:', error);
      // If AI analysis fails, show error message instead of fallback
      setResult(
        "⚠️ AI Service Unavailable\n\n" +
        "Unable to connect to AI analysis service. Please check your internet connection and try again.\n\n" +
        "For immediate guidance, consider consulting with a qualified Ayurvedic practitioner."
      )
    } finally {
      setGeneratingResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setGeneratingResult(false);
    setLoading(true);
    
    const fetchQuestions = async () => {
      try {
        // Add random delay to ensure fresh question generation
        const randomDelay = Math.floor(Math.random() * 500) + 200;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        console.log("Generating NEW random questions with timestamp:", Date.now());
        const generatedQuestions = await generateQuizQuestions();
        if (generatedQuestions && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Failed to refetch questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  };

  const retryGenerateQuestions = async () => {
    setLoading(true);
    try {
      // Add random delay for fresh generation
      const randomDelay = Math.floor(Math.random() * 500) + 200;
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      
      console.log("Retrying with fresh questions, timestamp:", Date.now());
      const generatedQuestions = await generateQuizQuestions();
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Failed to retry questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomSafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Generating your personalized AI quiz...</Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  // Show error if no questions generated
  if (!loading && questions.length === 0) {
    return (
      <CustomSafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Symptom Checker</Text>
          </View>
          
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
            <Text style={styles.errorTitle}>AI Service Unavailable</Text>
            <Text style={styles.errorText}>
              AI system is currently experiencing high demand or has reached daily limits.
            </Text>
            <Text style={styles.errorBullets}>
              • AI quota may be exceeded (50 requests per day limit){'\n'}
              • Try again in 24 hours when quota resets{'\n'}
              • Check your internet connection{'\n'}
              • Use other app features while waiting
            </Text>
            
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={retryGenerateQuestions}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backToHomeButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backToHomeButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (generatingResult) {
    return (
      <CustomSafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Analyzing your responses with AI...</Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (result) {
    return (
      <CustomSafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Health Analysis Result</Text>
          </View>
          
          {/* Show Questions and Answers */}
          <View style={styles.questionsAnswersCard}>
            <Text style={styles.resultTitle}>Your Responses</Text>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionAnswerItem}>
                <Text style={styles.questionItemText}>
                  Q{index + 1}: {question.question}
                </Text>
                <Text style={styles.answerItemText}>
                  Answer: {answers[index] || 'Not answered'}
                </Text>
              </View>
            ))}
          </View>

          {/* AI Analysis */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>AI-Powered Ayurvedic Analysis</Text>
            <Text style={styles.resultText}>{result}</Text>
            <Text style={styles.disclaimer}>
              This is a preliminary analysis based on Ayurvedic principles and is not a substitute for professional medical advice.
            </Text>
          </View>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Start New Analysis</Text>
          </TouchableOpacity>
        </ScrollView>
      </CustomSafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <CustomSafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Symptom Checker</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          <Text style={styles.questionDescription}>Select the option that best describes you.</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton} 
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F2',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  questionContainer: {
    marginBottom: 30,
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 28,
  },
  questionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 15,
  },
  disclaimer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  restartButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionsAnswersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionAnswerItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  questionItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
    lineHeight: 20,
  },
  answerItemText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  errorBullets: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backToHomeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backToHomeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AISymptomChecker;
