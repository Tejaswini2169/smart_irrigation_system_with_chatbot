import type { WeatherData, IrrigationRecommendation, CropType, SoilType, Language, Location } from "./app-context"
import { getHighYieldCropRecommendations, analyzeCurrentCrop } from "./crop-recommendations"

// Simulated weather data for demo purposes
// In production, this would fetch from a real weather API
export function generateWeatherForecast(): WeatherData[] {
  const today = new Date()
  const forecast: WeatherData[] = []
  
  const weatherPatterns = [
    { rainProbability: 75, rainMm: 12, temperature: 28, humidity: 85, condition: "rainy" as const },
    { rainProbability: 10, rainMm: 1, temperature: 32, humidity: 65, condition: "sunny" as const },
    { rainProbability: 35, rainMm: 4, temperature: 30, humidity: 72, condition: "partly-cloudy" as const },
    { rainProbability: 80, rainMm: 15, temperature: 26, humidity: 90, condition: "rainy" as const },
    { rainProbability: 20, rainMm: 2, temperature: 33, humidity: 60, condition: "sunny" as const },
  ]

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    forecast.push({
      date: date.toISOString().split("T")[0],
      ...weatherPatterns[i]
    })
  }

  return forecast
}

// Crop water requirements (mm per day) based on Kaggle dataset patterns
const cropWaterRequirements: Record<CropType, { base: number; highTemp: number; lowHumidity: number }> = {
  rice: { base: 8, highTemp: 12, lowHumidity: 10 },
  wheat: { base: 4, highTemp: 6, lowHumidity: 5 },
  tomato: { base: 5, highTemp: 7, lowHumidity: 6 },
  cotton: { base: 6, highTemp: 8, lowHumidity: 7 },
  sugarcane: { base: 7, highTemp: 10, lowHumidity: 9 },
  maize: { base: 5, highTemp: 7, lowHumidity: 6 }
}

// Soil water retention factors
const soilRetentionFactor: Record<SoilType, number> = {
  sandy: 0.6,  // Drains quickly, needs more frequent irrigation
  loamy: 1.0,  // Balanced retention
  clay: 1.4    // Retains water longer, needs less frequent irrigation
}

export function getIrrigationRecommendations(
  weather: WeatherData[],
  cropType: CropType | null,
  soilType: SoilType | null,
  language: Language
): IrrigationRecommendation[] {
  const crop = cropType || "rice"
  const soil = soilType || "loamy"
  
  const messages = {
    en: {
      highRain: "Heavy rain expected. Skip irrigation.",
      moderateRain: "Moderate rain expected. Light irrigation only.",
      lowRain: "Low rain expected. Irrigate crops.",
      cloudy: "Cloudy weather. Reduce irrigation.",
      hot: "High temperature. Increase irrigation."
    },
    kn: {
      highRain: "ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷಿತ. ನೀರಾವರಿ ಬೇಡ.",
      moderateRain: "ಮಧ್ಯಮ ಮಳೆ ನಿರೀಕ್ಷಿತ. ಕಡಿಮೆ ನೀರಾವರಿ.",
      lowRain: "ಕಡಿಮೆ ಮಳೆ. ಬೆಳೆಗೆ ನೀರು ಹಾಕಿ.",
      cloudy: "ಮೋಡ ಕವಿದ ವಾತಾವರಣ. ನೀರಾವರಿ ಕಡಿಮೆ ಮಾಡಿ.",
      hot: "ಹೆಚ್ಚಿನ ತಾಪಮಾನ. ನೀರಾವರಿ ಹೆಚ್ಚಿಸಿ."
    },
    hi: {
      highRain: "भारी बारिश की उम्मीद. सिंचाई न करें.",
      moderateRain: "मध्यम बारिश की उम्मीद. हल्की सिंचाई.",
      lowRain: "कम बारिश. फसल की सिंचाई करें.",
      cloudy: "बादल छाए हुए. सिंचाई कम करें.",
      hot: "उच्च तापमान. सिंचाई बढ़ाएं."
    },
    te: {
      highRain: "భారీ వర్షం ఆశిస్తోంది. నీటిపారుదల వద్దు.",
      moderateRain: "మధ్యస్థ వర్షం. తేలికపాటి నీటిపారుదల.",
      lowRain: "తక్కువ వర్షం. పంటకు నీరు పెట్టండి.",
      cloudy: "మేఘావృతం. నీటిపారుదల తగ్గించండి.",
      hot: "అధిక ఉష్ణోగ్రత. నీటిపారుదల పెంచండి."
    }
  }

  const msg = messages[language]

  return weather.map((day) => {
    let action: "skip" | "irrigate" | "light"
    let reason: string
    let waterAmount = 0

    const baseWater = cropWaterRequirements[crop].base
    const soilFactor = soilRetentionFactor[soil]

    if (day.rainProbability > 60 || day.rainMm > 10) {
      action = "skip"
      reason = msg.highRain
    } else if (day.rainProbability >= 30 && day.rainProbability <= 60) {
      action = "light"
      reason = msg.moderateRain
      waterAmount = Math.round((baseWater * 0.5) / soilFactor)
    } else if (day.condition === "cloudy") {
      action = "light"
      reason = msg.cloudy
      waterAmount = Math.round((baseWater * 0.7) / soilFactor)
    } else if (day.temperature > 35) {
      action = "irrigate"
      reason = msg.hot
      waterAmount = Math.round((cropWaterRequirements[crop].highTemp) / soilFactor)
    } else {
      action = "irrigate"
      reason = msg.lowRain
      waterAmount = Math.round(baseWater / soilFactor)
    }

    return {
      date: day.date,
      action,
      reason,
      waterAmount
    }
  })
}

// Comprehensive chatbot dataset for irrigation advice
const chatbotDataset = {
  en: {
    greetings: ["hello", "hi", "hey", "namaste", "good morning", "good evening"],
    greetingResponse: "Hello! I am your Smart Irrigation assistant. How can I help you today? Ask me about weather, irrigation, crops, or farming tips.",
    
    irrigationKeywords: ["irrigate", "irrigation", "water", "watering", "should i water"],
    weatherKeywords: ["weather", "temperature", "climate", "hot", "cold", "humid"],
    rainKeywords: ["rain", "rainfall", "raining", "monsoon", "shower"],
    tomorrowKeywords: ["tomorrow", "next day", "day after"],
    todayKeywords: ["today", "now", "current"],
    cropKeywords: ["crop", "recommend", "suggest", "grow", "yield", "best", "suitable", "plant", "what should"],
    soilKeywords: ["soil", "land", "ground", "earth", "mud"],
    helpKeywords: ["help", "what can you do", "options", "features"],
    
    helpResponse: "I can help you with:\n1. Today's weather and irrigation advice\n2. Rain forecast for tomorrow\n3. Crop recommendations for your land\n4. Water requirements for your crops\n5. Soil-based farming tips\n\nJust ask me anything!",
    soilResponse: (soilType: string) => `Your ${soilType} soil ${soilType === 'sandy' ? 'drains quickly, so water more frequently but less amount' : soilType === 'clay' ? 'retains water well, so water less frequently' : 'has balanced drainage, ideal for most crops'}.`,
  },
  kn: {
    greetings: ["ನಮಸ್ಕಾರ", "ಹಲೋ", "ಹೇ", "ಶುಭೋದಯ", "ಶುಭ ಸಂಜೆ"],
    greetingResponse: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ಹವಾಮಾನ, ನೀರಾವರಿ, ಬೆಳೆ ಅಥವಾ ಕೃಷಿ ಸಲಹೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
    
    irrigationKeywords: ["ನೀರು", "ನೀರಾವರಿ", "ನೀರು ಹಾಕು", "ನೀರು ಬೇಕಾ"],
    weatherKeywords: ["ಹವಾಮಾನ", "ತಾಪಮಾನ", "ಬಿಸಿ", "ತಂಪು", "ಆರ್ದ್ರತೆ"],
    rainKeywords: ["ಮಳೆ", "ಮಳೆ ಬರುತ್ತಾ", "ಮಾನ್ಸೂನ್"],
    tomorrowKeywords: ["ನಾಳೆ", "ಮುಂದಿನ ದಿನ"],
    todayKeywords: ["ಇಂದು", "ಈಗ", "ಪ್ರಸ್ತುತ"],
    cropKeywords: ["ಬೆಳೆ", "ಶಿಫಾರಸು", "ಬೆಳೆಯಿರಿ", "ಇಳುವರಿ", "ಉತ್ತಮ", "ಯಾವ ಬೆಳೆ"],
    soilKeywords: ["ಮಣ್ಣು", "ಭೂಮಿ", "ನೆಲ"],
    helpKeywords: ["ಸಹಾಯ", "ಏನು ಮಾಡಬಹುದು", "ವೈಶಿಷ್ಟ್ಯಗಳು"],
    
    helpResponse: "ನಾನು ಈ ವಿಷಯಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು:\n1. ಇಂದಿನ ಹವಾಮಾನ ಮತ್ತು ನೀರಾವರಿ ಸಲಹೆ\n2. ನಾಳೆಯ ಮಳೆ ಮುನ್ಸೂಚನೆ\n3. ನಿಮ್ಮ ಭೂಮಿಗೆ ಬೆಳೆ ಶಿಫಾರಸುಗಳು\n4. ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ನೀರಿನ ಅವಶ್ಯಕತೆಗಳು\n5. ಮಣ್ಣು ಆಧಾರಿತ ಕೃಷಿ ಸಲಹೆಗಳು",
    soilResponse: (soilType: string) => `ನಿಮ್ಮ ${soilType === 'sandy' ? 'ಮರಳು ಮಣ್ಣು ಬೇಗ ಒಣಗುತ್ತದೆ, ಆಗಾಗ್ಗೆ ಕಡಿಮೆ ನೀರು ಹಾಕಿ' : soilType === 'clay' ? 'ಜೇಡಿ ಮಣ್ಣು ನೀರನ್ನು ಚೆನ್ನಾಗಿ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ, ಕಡಿಮೆ ಬಾರಿ ನೀರು ಹಾಕಿ' : 'ಗೋಡು ಮಣ್ಣು ಸಮತೋಲಿತವಾಗಿದೆ, ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತ'}.`,
  },
  hi: {
    greetings: ["नमस्ते", "हेलो", "हाय", "सुप्रभात", "शुभ संध्या"],
    greetingResponse: "नमस्ते! मैं आपका स्मार्ट सिंचाई सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? मौसम, सिंचाई, फसल या खेती की सलाह के बारे में पूछें।",
    
    irrigationKeywords: ["सिंचाई", "पानी", "पानी देना", "क्या पानी दूं"],
    weatherKeywords: ["मौसम", "तापमान", "गर्म", "ठंडा", "नमी"],
    rainKeywords: ["बारिश", "वर्षा", "मानसून"],
    tomorrowKeywords: ["कल", "अगले दिन"],
    todayKeywords: ["आज", "अभी", "वर्तमान"],
    cropKeywords: ["फसल", "सिफारिश", "उगाएं", "उपज", "क्या उगाएं", "कौन सी फसल"],
    soilKeywords: ["मिट्टी", "जमीन", "भूमि"],
    helpKeywords: ["मदद", "क्या कर सकते हो", "विशेषताएं"],
    
    helpResponse: "मैं इन विषयों में मदद कर सकता हूं:\n1. आज का मौसम और सिंचाई सलाह\n2. कल की बारिश का पूर्वानुमान\n3. आपकी जमीन के लिए फसल सिफारिशें\n4. आपकी फसलों की पानी आवश्यकताएं\n5. मिट्टी आधारित खेती सलाह",
    soilResponse: (soilType: string) => `आपकी ${soilType === 'sandy' ? 'रेतीली मिट्टी जल्दी सूखती है, बार-बार कम पानी दें' : soilType === 'clay' ? 'चिकनी मिट्टी पानी अच्छी तरह रखती है, कम बार पानी दें' : 'दोमट मिट्टी संतुलित है, अधिकांश फसलों के लिए उपयुक्त'}।`,
  },
  te: {
    greetings: ["నమస్కారం", "హలో", "హాయ్", "శుభోదయం", "శుభ సాయంత్రం"],
    greetingResponse: "నమస్కారం! నేను మీ స్మార్ట్ నీటిపారుదల సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? వాతావరణం, నీటిపారుదల, పంట లేదా వ్యవసాయ చిట్కాల గురించి అడగండి.",
    
    irrigationKeywords: ["నీరు", "నీటిపారుదల", "నీరు పెట్టు", "నీరు అవసరమా"],
    weatherKeywords: ["వాతావరణం", "ఉష్ణోగ్రత", "వేడి", "చల్లని", "తేమ"],
    rainKeywords: ["వర్షం", "వర్షపాతం", "రుతుపవనాలు"],
    tomorrowKeywords: ["రేపు", "మరుసటి రోజు"],
    todayKeywords: ["ఈ రోజు", "ఇప్పుడు", "ప్రస్తుతం"],
    cropKeywords: ["పంట", "సిఫార్సు", "పండించు", "దిగుబడి", "ఏమి పండించాలి", "ఏ పంట"],
    soilKeywords: ["నేల", "భూమి", "మట్టి"],
    helpKeywords: ["సహాయం", "ఏమి చేయగలవు", "ఫీచర్లు"],
    
    helpResponse: "నేను ఈ విషయాలలో సహాయం చేయగలను:\n1. ఈ రోజు వాతావరణం మరియు నీటిపారుదల సలహా\n2. రేపటి వర్షం అంచనా\n3. మీ భూమికి పంట సిఫార్సులు\n4. మీ పంటలకు నీటి అవసరాలు\n5. నేల ఆధారిత వ్యవసాయ చిట్కాలు",
    soilResponse: (soilType: string) => `మీ ${soilType === 'sandy' ? 'ఇసుక నేల త్వరగా ఆరిపోతుంది, తరచుగా తక్కువ నీరు పెట్టండి' : soilType === 'clay' ? 'బంక నేల నీటిని బాగా నిలుపుకుంటుంది, తక్కువసార్లు నీరు పెట్టండి' : 'గరప నేల సమతుల్యంగా ఉంది, చాలా పంటలకు అనుకూలం'}.`,
  }
}

// Chatbot responses based on dataset patterns
export function getChatbotResponse(
  query: string, 
  weather: WeatherData[], 
  language: Language,
  cropType?: CropType | null,
  soilType?: SoilType | null,
  location?: Location | null,
  translations?: { crops: Record<string, string> }
): string {
  const lowerQuery = query.toLowerCase()
  const today = weather[0]
  const tomorrow = weather[1]
  const dataset = chatbotDataset[language]

  // Check for greetings
  if (dataset.greetings.some(g => lowerQuery.includes(g))) {
    return dataset.greetingResponse
  }

  // Check for help request
  if (dataset.helpKeywords.some(k => lowerQuery.includes(k))) {
    return dataset.helpResponse
  }

  // Dynamic responses based on current weather
  const responses = {
    en: {
      irrigateToday: today.rainProbability > 60 
        ? `Rain probability is ${today.rainProbability}% today with expected ${today.rainMm}mm rainfall. No irrigation needed. Save water and let nature do the work!`
        : today.rainProbability > 30
        ? `Moderate rain chance (${today.rainProbability}%) today. Give light irrigation only - about 3-4mm water.`
        : `Low rain probability (${today.rainProbability}%) today. Your crops need irrigation. Provide 5-8mm water based on your crop type.`,
      rainTomorrow: `Tomorrow's forecast: ${tomorrow.rainProbability}% rain probability with ${tomorrow.rainMm}mm expected rainfall. Temperature: ${tomorrow.temperature}°C. ${tomorrow.rainProbability > 60 ? "Plan to skip irrigation tomorrow." : "Plan for irrigation tomorrow."}`,
      weather: `Current weather: Temperature ${today.temperature}°C, Humidity ${today.humidity}%, Rain probability ${today.rainProbability}%. ${today.temperature > 35 ? "High heat - crops may need extra water." : today.temperature < 20 ? "Cool weather - reduce irrigation." : "Normal conditions for farming."}`,
      waterNeed: cropType 
        ? `Your ${translations?.crops[cropType] || cropType} crop needs ${today.rainProbability > 60 ? "no additional" : cropType === 'rice' ? "8-12mm" : cropType === 'wheat' ? "4-6mm" : "5-7mm"} water today based on weather and crop requirements.`
        : `Based on today's weather, crops generally need ${today.rainProbability > 60 ? "no" : "5-8mm"} water. Select your crop type for specific recommendations.`,
      default: dataset.helpResponse
    },
    kn: {
      irrigateToday: today.rainProbability > 60 
        ? `ಇಂದು ಮಳೆ ಸಾಧ್ಯತೆ ${today.rainProbability}%, ${today.rainMm}ಮಿಮೀ ಮಳೆ ನಿರೀಕ್ಷಿತ. ನೀರಾವರಿ ಬೇಡ. ನೀರು ಉಳಿಸಿ!`
        : today.rainProbability > 30
        ? `ಇಂದು ಮಧ್ಯಮ ಮಳೆ ಸಾಧ್ಯತೆ (${today.rainProbability}%). ಕಡಿಮೆ ನೀರಾವರಿ - 3-4ಮಿಮೀ ಮಾತ್ರ.`
        : `ಇಂದು ಕಡಿಮೆ ಮಳೆ ಸಾಧ್ಯತೆ (${today.rainProbability}%). ಬೆಳೆಗೆ ನೀರು ಹಾಕಿ. 5-8ಮಿಮೀ ನೀರು ಕೊಡಿ.`,
      rainTomorrow: `ನಾಳೆಯ ಮುನ್ಸೂಚನೆ: ${tomorrow.rainProbability}% ಮಳೆ ಸಾಧ್ಯತೆ, ${tomorrow.rainMm}ಮಿಮೀ ಮಳೆ ನಿರೀಕ್ಷಿತ. ತಾಪಮಾನ: ${tomorrow.temperature}°C. ${tomorrow.rainProbability > 60 ? "ನಾಳೆ ನೀರಾವರಿ ಬೇಡ." : "ನಾಳೆ ನೀರಾವರಿ ಯೋಜಿಸಿ."}`,
      weather: `ಈಗಿನ ಹವಾಮಾನ: ತಾಪಮಾನ ${today.temperature}°C, ಆರ್ದ್ರತೆ ${today.humidity}%, ಮಳೆ ಸಾಧ್ಯತೆ ${today.rainProbability}%. ${today.temperature > 35 ? "ಹೆಚ್ಚಿನ ಬಿಸಿ - ಬೆಳೆಗಳಿಗೆ ಹೆಚ್ಚು ನೀರು ಬೇಕು." : today.temperature < 20 ? "ತಂಪು ಹವಾಮಾನ - ನೀರಾವರಿ ಕಡಿಮೆ ಮಾಡಿ." : "ಸಾಮಾನ್ಯ ಕೃಷಿ ಪರಿಸ್ಥಿತಿ."}`,
      waterNeed: cropType 
        ? `ನಿಮ್ಮ ${translations?.crops[cropType] || cropType} ಬೆಳೆಗೆ ಇಂದು ${today.rainProbability > 60 ? "ಹೆಚ್ಚುವರಿ ನೀರು ಬೇಡ" : cropType === 'rice' ? "8-12ಮಿಮೀ" : cropType === 'wheat' ? "4-6ಮಿಮೀ" : "5-7ಮಿಮೀ"} ನೀರು ಬೇಕು.`
        : `ಇಂದಿನ ಹವಾಮಾನದ ಪ್ರಕಾರ, ${today.rainProbability > 60 ? "ನೀರು ಬೇಡ" : "5-8ಮಿಮೀ ನೀರು ಬೇಕು"}. ನಿಖರ ಶಿಫಾರಸಿಗಾಗಿ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ.`,
      default: dataset.helpResponse
    },
    hi: {
      irrigateToday: today.rainProbability > 60 
        ? `आज बारिश की संभावना ${today.rainProbability}%, ${today.rainMm}मिमी बारिश अपेक्षित। सिंचाई की जरूरत नहीं। पानी बचाएं!`
        : today.rainProbability > 30
        ? `आज मध्यम बारिश की संभावना (${today.rainProbability}%)। हल्की सिंचाई करें - 3-4मिमी।`
        : `आज कम बारिश की संभावना (${today.rainProbability}%)। फसल को पानी दें। 5-8मिमी पानी दें।`,
      rainTomorrow: `कल का पूर्वानुमान: ${tomorrow.rainProbability}% बारिश संभावना, ${tomorrow.rainMm}मिमी बारिश अपेक्षित। तापमान: ${tomorrow.temperature}°C। ${tomorrow.rainProbability > 60 ? "कल सिंचाई न करें।" : "कल सिंचाई की योजना बनाएं।"}`,
      weather: `वर्तमान मौसम: तापमान ${today.temperature}°C, नमी ${today.humidity}%, बारिश संभावना ${today.rainProbability}%। ${today.temperature > 35 ? "अधिक गर्मी - फसलों को अतिरिक्त पानी चाहिए।" : today.temperature < 20 ? "ठंडा मौसम - सिंचाई कम करें।" : "सामान्य खेती की स्थिति।"}`,
      waterNeed: cropType 
        ? `आपकी ${translations?.crops[cropType] || cropType} फसल को आज ${today.rainProbability > 60 ? "अतिरिक्त पानी नहीं" : cropType === 'rice' ? "8-12मिमी" : cropType === 'wheat' ? "4-6मिमी" : "5-7मिमी"} पानी चाहिए।`
        : `आज के मौसम के अनुसार, ${today.rainProbability > 60 ? "पानी नहीं चाहिए" : "5-8मिमी पानी चाहिए"}। सटीक सिफारिश के लिए फसल चुनें।`,
      default: dataset.helpResponse
    },
    te: {
      irrigateToday: today.rainProbability > 60 
        ? `ఈ రోజు వర్షం అవకాశం ${today.rainProbability}%, ${today.rainMm}మిమీ వర్షం అంచనా. నీటిపారుదల అవసరం లేదు. నీరు ఆదా చేయండి!`
        : today.rainProbability > 30
        ? `ఈ రోజు మధ్యస్థ వర్షం అవకాశం (${today.rainProbability}%). తేలికపాటి నీటిపారుదల - 3-4మిమీ మాత్రమే.`
        : `ఈ రోజు తక్కువ వర్షం అవకాశం (${today.rainProbability}%). పంటకు నీరు పెట్టండి. 5-8మిమీ నీరు ఇవ్వండి.`,
      rainTomorrow: `రేపటి అంచనా: ${tomorrow.rainProbability}% వర్షం అవకాశం, ${tomorrow.rainMm}మిమీ వర్షం అంచనా. ఉష్ణోగ్రత: ${tomorrow.temperature}°C. ${tomorrow.rainProbability > 60 ? "రేపు నీటిపారుదల వద్దు." : "రేపు నీటిపారుదల ప్లాన్ చేయండి."}`,
      weather: `ప్రస్తుత వాతావరణం: ఉష్ణోగ్రత ${today.temperature}°C, తేమ ${today.humidity}%, వర్షం అవకాశం ${today.rainProbability}%. ${today.temperature > 35 ? "అధిక వేడి - పంటలకు ఎక్కువ నీరు అవసరం." : today.temperature < 20 ? "చల్లని వాతావరణం - నీటిపారుదల తగ్గించండి." : "సాధారణ వ్యవసాయ పరిస్థితి."}`,
      waterNeed: cropType 
        ? `మీ ${translations?.crops[cropType] || cropType} పంటకు ఈ రోజు ${today.rainProbability > 60 ? "అదనపు నీరు అవసరం లేదు" : cropType === 'rice' ? "8-12మిమీ" : cropType === 'wheat' ? "4-6మిమీ" : "5-7మిమీ"} నీరు అవసరం.`
        : `ఈ రోజు వాతావరణం ప్రకారం, ${today.rainProbability > 60 ? "నీరు అవసరం లేదు" : "5-8మిమీ నీరు అవసరం"}. ఖచ్చితమైన సిఫార్సు కోసం పంట ఎంచుకోండి.`,
      default: dataset.helpResponse
    }
  }

  const resp = responses[language]

  // Pattern matching for crop recommendation queries
  const cropKeywords = [
    "crop", "recommend", "suggest", "grow", "yield", "best", "suitable", "plant", "what should",
    "ಬೆಳೆ", "ಶಿಫಾರಸು", "ಬೆಳೆಯಿರಿ", "ಇಳುವರಿ", "ಉತ್ತಮ",
    "फसल", "सिफारिश", "उगाएं", "उपज", "क्या उगाएं",
    "పంట", "సిఫార్సు", "పండించు", "దిగుబడి", "ఏమి పండించాలి"
  ]

  if (cropKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (translations && location) {
      const recommendations = getHighYieldCropRecommendations(
        cropType || null, weather, soilType || null, location, language, translations
      )
      
      if (recommendations.length > 0) {
        const cropList = recommendations.slice(0, 3).map(r => r.cropDisplayName).join(", ")
        const cropResponses = {
          en: `Based on your location, soil, and weather: I recommend ${cropList}. ${recommendations[0].cropDisplayName} has ${recommendations[0].suitabilityScore}% suitability with ${recommendations[0].yieldPotential.toLowerCase()}.`,
          kn: `ನಿಮ್ಮ ಸ್ಥಳ, ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನದ ಆಧಾರದ ಮೇಲೆ: ${cropList} ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ. ${recommendations[0].cropDisplayName} ${recommendations[0].suitabilityScore}% ಸೂಕ್ತತೆ ಹೊಂದಿದೆ.`,
          hi: `आपके स्थान, मिट्टी और मौसम के आधार पर: मैं ${cropList} की सिफारिश करता हूं। ${recommendations[0].cropDisplayName} की ${recommendations[0].suitabilityScore}% उपयुक्तता है।`,
          te: `మీ స్థానం, నేల మరియు వాతావరణం ఆధారంగా: నేను ${cropList} సిఫార్సు చేస్తున్నాను. ${recommendations[0].cropDisplayName}కు ${recommendations[0].suitabilityScore}% అనుకూలత ఉంది.`
        }
        return cropResponses[language]
      }
    }
    
    const defaultCropResponses = {
      en: "For crop recommendations, please set your location and soil type. I'll analyze conditions and suggest the best crops for high yield.",
      kn: "ಬೆಳೆ ಶಿಫಾರಸುಗಳಿಗಾಗಿ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಹೊಂದಿಸಿ.",
      hi: "फसल सिफारिशों के लिए, कृपया अपना स्थान और मिट्टी का प्रकार सेट करें।",
      te: "పంట సిఫార్సుల కోసం, దయచేసి మీ స్థానం మరియు నేల రకాన్ని సెట్ చేయండి."
    }
    return defaultCropResponses[language]
  }

  // Current crop analysis queries
  const analyzeKeywords = [
    "my crop", "current crop", "is it suitable", "good choice", "right crop",
    "ನನ್ನ ಬೆಳೆ", "ಸೂಕ್ತವೇ", "ಸರಿಯಾದ ಬೆಳೆ",
    "मेरी फसल", "उपयुक्त है", "सही फसल",
    "నా పంట", "సరిపోతుందా", "సరైన పంట"
  ]

  if (analyzeKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (cropType && location) {
      const analysis = analyzeCurrentCrop(cropType, weather, soilType || null, location, language)
      const analysisResponses = {
        en: analysis.isSuitable 
          ? `Your ${translations?.crops[cropType] || cropType} is well-suited for your conditions with ${analysis.suitabilityScore}% suitability score.`
          : `Your ${translations?.crops[cropType] || cropType} has ${analysis.suitabilityScore}% suitability. Consider switching to a better-suited crop for higher yield.`,
        kn: analysis.isSuitable
          ? `ನಿಮ್ಮ ${translations?.crops[cropType] || cropType} ${analysis.suitabilityScore}% ಸೂಕ್ತತೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಾಗಿದೆ.`
          : `ನಿಮ್ಮ ${translations?.crops[cropType] || cropType} ${analysis.suitabilityScore}% ಸೂಕ್ತತೆ ಹೊಂದಿದೆ. ಹೆಚ್ಚಿನ ಇಳುವರಿಗಾಗಿ ಬದಲಾಯಿಸಿ.`,
        hi: analysis.isSuitable
          ? `आपकी ${translations?.crops[cropType] || cropType} ${analysis.suitabilityScore}% उपयुक्तता के साथ आपकी स्थिति के लिए उपयुक्त है।`
          : `आपकी ${translations?.crops[cropType] || cropType} की ${analysis.suitabilityScore}% उपयुक्तता है। अधिक उपज के लिए बदलने पर विचार करें।`,
        te: analysis.isSuitable
          ? `మీ ${translations?.crops[cropType] || cropType} ${analysis.suitabilityScore}% అనుకూలతతో మీ పరిస్థితులకు అనుకూలం.`
          : `మీ ${translations?.crops[cropType] || cropType}కు ${analysis.suitabilityScore}% అనుకూలత ఉంది. అధిక దిగుబడి కోసం మారడాన్ని పరిగణించండి.`
      }
      return analysisResponses[language]
    }
  }

  // Check for soil-related queries
  if (dataset.soilKeywords.some(k => lowerQuery.includes(k))) {
    if (soilType) {
      return dataset.soilResponse(soilType)
    }
    const soilPrompt = {
      en: "Please select your soil type first (Sandy, Loamy, or Clay) to get specific soil advice.",
      kn: "ನಿರ್ದಿಷ್ಟ ಮಣ್ಣು ಸಲಹೆಗಾಗಿ ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      hi: "विशिष्ट मिट्टी सलाह के लिए कृपया पहले अपनी मिट्टी का प्रकार चुनें।",
      te: "నిర్దిష్ట నేల సలహా కోసం దయచేసి మీ నేల రకాన్ని ఎంచుకోండి."
    }
    return soilPrompt[language]
  }

  // Pattern matching using dataset keywords - check tomorrow first (more specific)
  if (dataset.tomorrowKeywords.some(k => lowerQuery.includes(k)) || dataset.rainKeywords.some(k => lowerQuery.includes(k))) {
    return resp.rainTomorrow
  }
  
  // Check for irrigation/today queries
  if (dataset.irrigationKeywords.some(k => lowerQuery.includes(k)) || dataset.todayKeywords.some(k => lowerQuery.includes(k))) {
    return resp.irrigateToday
  }
  
  // Check for weather queries
  if (dataset.weatherKeywords.some(k => lowerQuery.includes(k))) {
    return resp.weather
  }

  return resp.default
}

// Calculate water savings based on smart irrigation vs traditional
export function calculateWaterSavings(
  recommendations: IrrigationRecommendation[],
  cropType: CropType | null
): { saved: number; traditional: number; smart: number } {
  const crop = cropType || "rice"
  const traditionalDaily = cropWaterRequirements[crop].base * 1000 // Convert to liters per hectare
  
  let smartTotal = 0
  let traditionalTotal = 0

  recommendations.forEach((rec) => {
    traditionalTotal += traditionalDaily
    if (rec.action === "skip") {
      smartTotal += 0
    } else if (rec.action === "light") {
      smartTotal += traditionalDaily * 0.5
    } else {
      smartTotal += (rec.waterAmount || 0) * 1000
    }
  })

  return {
    saved: Math.round(traditionalTotal - smartTotal),
    traditional: Math.round(traditionalTotal),
    smart: Math.round(smartTotal)
  }
}
