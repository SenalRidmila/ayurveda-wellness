// Symptom categories
export const SYMPTOMS = {
  // Primary symptoms
  HEADACHE: 0,
  FEVER: 1,
  FATIGUE: 2,
  DIGESTIVE: 3,
  
  // Duration
  LESS_THAN_DAY: 4,
  ONE_TO_THREE_DAYS: 5,
  FOUR_TO_SEVEN_DAYS: 6,
  MORE_THAN_WEEK: 7,
  
  // Time of day
  MORNING: 8,
  AFTERNOON: 9,
  EVENING: 10,
  NIGHT: 11,
  
  // Triggers
  FOOD: 12,
  WEATHER: 13,
  STRESS: 14,
  PHYSICAL: 15,
  
  // Sleep patterns
  LIGHT_INTERRUPTED: 16,
  MODERATE_DREAMS: 17,
  HEAVY_PROLONGED: 18,
  VARIABLE_SLEEP: 19,
  
  // Energy levels
  VARIABLE_ENERGY: 20,
  STRONG_BURNOUT: 21,
  STEADY_SLOW: 22,
  LOW_NEEDS_STIMULATION: 23
};

// Dosha types
export const DOSHAS = {
  VATA: 0,
  PITTA: 1,
  KAPHA: 2
};

interface Symptoms {
  primary: string;
  duration: string;
  timeOfDay: string;
  trigger: string;
  sleep?: string;
  energy?: string;
}

export class AyurvedaModel {
  determineDosha(answers: string[]): string {
    const symptoms: Symptoms = {
      primary: answers[0],
      duration: answers[1],
      timeOfDay: answers[2],
      trigger: answers[3],
      sleep: answers[4],
      energy: answers[5]
    };

    // Simple rule-based system
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Primary symptom analysis
    switch (symptoms.primary) {
      case 'Headache':
        vataScore += 2;
        pittaScore += 1;
        break;
      case 'Fever':
        pittaScore += 2;
        break;
      case 'Fatigue':
        kaphaScore += 2;
        vataScore += 1;
        break;
      case 'Digestive Issues':
        vataScore += 1;
        pittaScore += 2;
        break;
    }

    // Duration analysis
    switch (symptoms.duration) {
      case 'Less than a day':
        vataScore += 2;
        break;
      case '1-3 days':
        pittaScore += 2;
        break;
      case '4-7 days':
        kaphaScore += 1;
        pittaScore += 1;
        break;
      case 'More than a week':
        kaphaScore += 2;
        break;
    }

    // Time of day analysis
    switch (symptoms.timeOfDay) {
      case 'Morning':
        kaphaScore += 2;
        break;
      case 'Afternoon':
        pittaScore += 2;
        break;
      case 'Evening':
        vataScore += 1;
        break;
      case 'Night':
        vataScore += 2;
        break;
    }

    // Trigger analysis
    switch (symptoms.trigger) {
      case 'Food':
        pittaScore += 2;
        break;
      case 'Weather':
        vataScore += 2;
        break;
      case 'Stress':
        vataScore += 2;
        break;
      case 'Physical Activity':
        kaphaScore += 2;
        break;
    }
    
    // Sleep pattern analysis
    if (symptoms.sleep) {
      switch (symptoms.sleep) {
        case 'Light and interrupted':
          vataScore += 3;
          break;
        case 'Moderate but intense dreams':
          pittaScore += 3;
          break;
        case 'Heavy and prolonged':
          kaphaScore += 3;
          break;
        case 'Variable and inconsistent':
          vataScore += 2;
          pittaScore += 1;
          break;
      }
    }
    
    // Energy level analysis
    if (symptoms.energy) {
      switch (symptoms.energy) {
        case 'Variable and unpredictable':
          vataScore += 3;
          break;
        case 'Strong but burns out quickly':
          pittaScore += 3;
          break;
        case 'Steady but slow to start':
          kaphaScore += 3;
          break;
        case 'Low and needs stimulation':
          kaphaScore += 2;
          vataScore += 1;
          break;
      }
    }

    // Determine dominant dosha
    if (vataScore >= pittaScore && vataScore >= kaphaScore) {
      return 'VATA';
    } else if (pittaScore >= vataScore && pittaScore >= kaphaScore) {
      return 'PITTA';
    } else {
      return 'KAPHA';
    }
  }

  getDoshaRecommendations(dosha: string): {
    description: string;
    remedies: string[];
  } {
    switch (dosha) {
      case 'VATA':
        return {
          description: "You show signs of Vata imbalance. Vata is associated with movement, cold, and irregularity. This dosha governs all movement in the mind and body. Vata types are typically creative, quick-thinking, and energetic when balanced.",
          remedies: [
            "Maintain regular daily routines",
            "Favor warm, cooked, and easily digestible foods",
            "Practice gentle yoga and meditation",
            "Use warm oil massage (abhyanga)",
            "Stay warm and avoid cold, dry environments",
            "Get adequate rest and avoid excessive stimulation"
          ]
        };
      
      case 'PITTA':
        return {
          description: "You show signs of Pitta imbalance. Pitta is associated with heat, metabolism, and transformation. This dosha governs digestion and metabolism. Pitta types are typically focused, determined, and intelligent when balanced.",
          remedies: [
            "Avoid spicy and hot foods",
            "Practice cooling breathing exercises",
            "Engage in moderate exercise during cooler times",
            "Use coconut or sunflower oil for massage",
            "Include sweet, bitter, and astringent tastes in diet",
            "Take time to relax and avoid excessive competition"
          ]
        };
      
      case 'KAPHA':
        return {
          description: "You show signs of Kapha imbalance. Kapha is associated with structure, stability, and moisture. This dosha maintains body resistance. Kapha types are typically calm, grounded, and loyal when balanced.",
          remedies: [
            "Exercise regularly, especially in the morning",
            "Favor light, warm, and spicy foods",
            "Practice stimulating breathing exercises",
            "Use dry massage with powder",
            "Stay active and avoid daytime napping",
            "Embrace change and new experiences"
          ]
        };
        
      default:
        return {
          description: "Unable to determine dosha balance.",
          remedies: [
            "Consult with an Ayurvedic practitioner",
            "Maintain a balanced lifestyle",
            "Follow a regular daily routine",
            "Practice mindful eating",
            "Get adequate rest and exercise"
          ]
        };
    }
  }
} 