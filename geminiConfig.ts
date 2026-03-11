import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API key
const GEMINI_API_KEY = "REMOVED_API_KEY";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Static fallback questions used when API quota is exceeded
const FALLBACK_QUESTION_SETS = [
  [
    {
      question: "How would you describe your body frame and weight?",
      options: ["Thin, light, hard to gain weight", "Medium, muscular, stable weight", "Large, heavy, easy to gain weight", "Varies a lot depending on season"]
    },
    {
      question: "How is your digestion usually?",
      options: ["Irregular, prone to gas and bloating", "Strong, can eat almost anything", "Slow, feel heavy after meals", "Sensitive, varies day to day"]
    },
    {
      question: "How do you typically respond to stress?",
      options: ["Anxious, worried, overthink", "Irritable, frustrated, intense", "Withdrawn, comfort eating, lethargic", "Depends on the situation"]
    },
    {
      question: "How is your sleep quality?",
      options: ["Light, interrupted, hard to fall asleep", "Moderate, wake up if disturbed", "Deep, long, hard to wake up", "Varies greatly"]
    },
    {
      question: "Which climate do you prefer?",
      options: ["Warm and humid", "Cool and well-ventilated", "Warm and dry", "Mild, not too extreme"]
    }
  ],
  [
    {
      question: "How would you describe your skin type?",
      options: ["Dry, rough, or flaky", "Oily, sensitive, prone to rashes", "Thick, smooth, well-moisturized", "Combination type"]
    },
    {
      question: "What are your typical food cravings?",
      options: ["Warm, oily, sweet foods", "Cool, refreshing, slightly bitter foods", "Light, dry, spicy foods", "No consistent preference"]
    },
    {
      question: "How is your energy level throughout the day?",
      options: ["Variable, bursts of energy then tired", "Steady but can overheat", "Consistent but slow to start", "Low in mornings, better later"]
    },
    {
      question: "How do you handle physical exercise?",
      options: ["Enjoy light activity, tire easily", "Enjoy moderate-intense workouts", "Prefer gentle, steady movement", "Varies based on mood"]
    },
    {
      question: "How is your memory and learning style?",
      options: ["Learn quickly, forget quickly", "Sharp focus, good concentration", "Slow to learn but retain well", "Depends on interest level"]
    }
  ],
  [
    {
      question: "How would you describe your hair?",
      options: ["Dry, brittle, thin", "Fine, oily, prone to early greying", "Thick, lustrous, slightly oily", "Normal with occasional issues"]
    },
    {
      question: "What is your typical appetite like?",
      options: ["Irregular, can skip meals easily", "Strong, get irritable if meals are delayed", "Moderate, can go without food", "Changes day to day"]
    },
    {
      question: "How do you usually feel in the morning?",
      options: ["Alert but restless", "Refreshed and ready", "Groggy and slow to wake up", "Depends on previous night"]
    },
    {
      question: "How do you respond to cold weather?",
      options: ["Very sensitive, feel cold easily", "Tolerate cold well, prefer it over heat", "Cold bothers you mildly", "No strong preference"]
    },
    {
      question: "What best describes your emotional nature?",
      options: ["Creative, enthusiastic but anxious", "Driven, passionate but can be intense", "Calm, nurturing but can be stubborn", "Mix of all these traits"]
    }
  ]
];

export const generateQuizQuestions = async () => {
  try {
    // Generate a random seed to ensure different questions each time
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = Date.now();
    
    // Random categories to focus on (select 5 from these)
    const categories = [
      "Dosha constitution (Vata, Pitta, Kapha)",
      "Sleep patterns and quality",
      "Digestive health and appetite",
      "Energy levels and stamina",
      "Stress response and mental state",
      "Physical characteristics and body type",
      "Skin and hair conditions",
      "Seasonal preferences and adaptation",
      "Food preferences and cravings",
      "Emotional patterns and mood",
      "Exercise tolerance and preferences",
      "Weather sensitivity"
    ];
    
    // Randomly shuffle and select categories
    const shuffledCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    const prompt = `
      Create a unique 5-question multiple-choice quiz for Ayurvedic health assessment. 
      Random seed: ${randomSeed} | Time: ${timestamp}
      
      Generate COMPLETELY DIFFERENT questions each time, avoiding repetitive patterns.
      Each question should be relevant to Ayurvedic principles and help identify dosha imbalances.
      Provide 4 varied answer options for each question.
      
      Focus specifically on these randomly selected categories:
      ${shuffledCategories.map((cat, idx) => `${idx + 1}. ${cat}`).join('\n      ')}
      
      Requirements:
      - Make questions conversational and easy to understand
      - Vary question structure and wording significantly 
      - Include creative and diverse scenarios
      - Ensure answers clearly relate to different doshas
      - Avoid using the same question patterns from previous generations
      
      Format as JSON array with "question" and "options" keys:
      [
        {
          "question": "Your unique question here?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
        }
      ]
      
      Generate 5 completely unique questions now.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract only the JSON part
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonText = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonText);
    } else {
      throw new Error("No valid JSON found in response");
    }
  } catch (error: any) {
    console.error("Error generating quiz questions:", error);
    
    // Check for quota exceeded or rate limit error - use static fallback questions
    if (
      (error.message && error.message.includes('exceeded your current quota')) ||
      (error.message && error.message.includes('429'))
    ) {
      console.log("Gemini API quota exceeded - using fallback questions");
      const randomSet = FALLBACK_QUESTION_SETS[Math.floor(Math.random() * FALLBACK_QUESTION_SETS.length)];
      return randomSet;
    }
    
    // For other errors, also return fallback questions
    const randomSet = FALLBACK_QUESTION_SETS[Math.floor(Math.random() * FALLBACK_QUESTION_SETS.length)];
    return randomSet;
  }
};

export const generateQuizResult = async (questions: Array<{question: string, options: string[]}>, userAnswers: string[]) => {
  try {
    const answersText = questions.map((q, index) => 
      `Q${index + 1}: ${q.question}\nAnswer: ${userAnswers[index] || 'Not answered'}`
    ).join('\n\n');

    const prompt = `
      Based on the following Ayurveda symptom checker quiz responses, provide a personalized analysis and recommendations:

      ${answersText}

      Please provide:
      1. Primary dosha constitution analysis (Vata, Pitta, or Kapha dominance)
      2. Current health imbalances identified
      3. 3-4 specific Ayurvedic lifestyle recommendations
      4. Dietary suggestions based on dosha
      5. General wellness advice

      Format the response in a clear, encouraging, and informative way.
      Keep it conversational but professional.
      Limit to 200-250 words.
      
      Remember to mention that this is for informational purposes only and to consult with qualified Ayurvedic practitioners for serious health concerns.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error: any) {
    console.error('Error generating quiz result:', error);
    
    // Check for quota exceeded or rate limit - return a generic analysis
    if (
      (error.message && error.message.includes('exceeded your current quota')) ||
      (error.message && error.message.includes('429'))
    ) {
      console.log("Gemini API quota exceeded for analysis - using fallback result");
      return `Based on your responses, here is a general Ayurvedic wellness overview:\n\nYour answers suggest a unique combination of the three doshas — Vata, Pitta, and Kapha. Each person carries all three doshas, but in different proportions that shape physical and mental characteristics.\n\n**Lifestyle Recommendations:**\n• Maintain a regular daily routine (dinacharya) for balance\n• Practice mindful eating — eat warm, freshly prepared meals\n• Include yoga or gentle exercise suited to your energy level\n• Prioritize quality sleep by winding down before 10 PM\n\n**Dietary Suggestions:**\n• Favor seasonal, locally sourced whole foods\n• Stay well hydrated with warm water or herbal teas\n• Reduce processed, cold, and heavy foods\n\n**Wellness Advice:**\nListen to your body's signals and adjust your lifestyle accordingly. Small, consistent changes lead to lasting wellness.\n\n*Note: This is a general assessment for informational purposes only. Please consult a qualified Ayurvedic practitioner for a personalized consultation and treatment plan.*`;
    }
    
    return null;
  }
};
