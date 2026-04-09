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

  const responses = {
    en: {
      irrigateToday: `Rain expected ${today.rainProbability}%. ${today.rainProbability > 60 ? "No irrigation needed." : "Irrigate your crops."}`,
      rainTomorrow: `Tomorrow rain expected ${tomorrow.rainMm} mm. ${tomorrow.rainProbability > 60 ? "No irrigation needed." : "Plan for irrigation."}`,
      weather: `Today: ${today.temperature}°C, ${today.humidity}% humidity, ${today.rainProbability}% rain chance.`,
      waterNeed: `Based on weather, your crop needs ${today.rainProbability > 60 ? "no" : "5-8 mm"} water today.`,
      default: "I can help with irrigation advice. Ask about today's weather, rain forecast, or irrigation needs."
    },
    kn: {
      irrigateToday: `ಮಳೆ ${today.rainProbability}% ನಿರೀಕ್ಷಿತ. ${today.rainProbability > 60 ? "ನೀರಾವರಿ ಬೇಡ." : "ಬೆಳೆಗೆ ನೀರು ಹಾಕಿ."}`,
      rainTomorrow: `ನಾಳೆ ${tomorrow.rainMm} ಮಿಮೀ ಮಳೆ ನಿರೀಕ್ಷಿತ. ${tomorrow.rainProbability > 60 ? "ನೀರಾವರಿ ಬೇಡ." : "ನೀರಾವರಿ ಯೋಜಿಸಿ."}`,
      weather: `ಇಂದು: ${today.temperature}°C, ${today.humidity}% ಆರ್ದ್ರತೆ, ${today.rainProbability}% ಮಳೆ ಸಾಧ್ಯತೆ.`,
      waterNeed: `ಹವಾಮಾನದ ಪ್ರಕಾರ, ಇಂದು ${today.rainProbability > 60 ? "ನೀರು ಬೇಡ" : "5-8 ಮಿಮೀ ನೀರು ಬೇಕು"}.`,
      default: "ನೀರಾವರಿ ಸಲಹೆಗಾಗಿ ಕೇಳಿ. ಇಂದಿನ ಹವಾಮಾನ, ಮಳೆ ಅಥವಾ ನೀರಾವರಿ ಬಗ್ಗೆ ಕೇಳಿ."
    },
    hi: {
      irrigateToday: `बारिश ${today.rainProbability}% अपेक्षित. ${today.rainProbability > 60 ? "सिंचाई की जरूरत नहीं." : "फसल की सिंचाई करें."}`,
      rainTomorrow: `कल ${tomorrow.rainMm} मिमी बारिश अपेक्षित. ${tomorrow.rainProbability > 60 ? "सिंचाई की जरूरत नहीं." : "सिंचाई की योजना बनाएं."}`,
      weather: `आज: ${today.temperature}°C, ${today.humidity}% नमी, ${today.rainProbability}% बारिश की संभावना.`,
      waterNeed: `मौसम के अनुसार, आज ${today.rainProbability > 60 ? "पानी की जरूरत नहीं" : "5-8 मिमी पानी चाहिए"}.`,
      default: "सिंचाई सलाह के लिए पूछें. आज का मौसम, बारिश या सिंचाई के बारे में पूछें."
    },
    te: {
      irrigateToday: `వర్షం ${today.rainProbability}% ఆశిస్తోంది. ${today.rainProbability > 60 ? "నీటిపారుదల అవసరం లేదు." : "పంటకు నీరు పెట్టండి."}`,
      rainTomorrow: `రేపు ${tomorrow.rainMm} మిమీ వర్షం ఆశిస్తోంది. ${tomorrow.rainProbability > 60 ? "నీటిపారుదల అవసరం లేదు." : "నీటిపారుదల ప్లాన్ చేయండి."}`,
      weather: `ఈ రోజు: ${today.temperature}°C, ${today.humidity}% తేమ, ${today.rainProbability}% వర్షం అవకాశం.`,
      waterNeed: `వాతావరణం ప్రకారం, ఈ రోజు ${today.rainProbability > 60 ? "నీరు అవసరం లేదు" : "5-8 మిమీ నీరు అవసరం"}.`,
      default: "నీటిపారుదల సలహా కోసం అడగండి. ఈ రోజు వాతావరణం, వర్షం లేదా నీటిపారుదల గురించి అడగండి."
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

  // Pattern matching for common queries
  if (lowerQuery.includes("irrigate") || lowerQuery.includes("today") || lowerQuery.includes("ನೀರು") || lowerQuery.includes("ಇಂದು") || lowerQuery.includes("सिंचाई") || lowerQuery.includes("आज")) {
    return resp.irrigateToday
  }
  if (lowerQuery.includes("tomorrow") || lowerQuery.includes("rain") || lowerQuery.includes("ನಾಳೆ") || lowerQuery.includes("ಮಳೆ") || lowerQuery.includes("कल") || lowerQuery.includes("बारिश") || lowerQuery.includes("రేపు") || lowerQuery.includes("వర్షం")) {
    return resp.rainTomorrow
  }
  if (lowerQuery.includes("weather") || lowerQuery.includes("temperature") || lowerQuery.includes("ಹವಾಮಾನ") || lowerQuery.includes("मौसम") || lowerQuery.includes("వాతావరణం")) {
    return resp.weather
  }
  if (lowerQuery.includes("water") || lowerQuery.includes("need") || lowerQuery.includes("ನೀರು") || lowerQuery.includes("पानी") || lowerQuery.includes("నీరు")) {
    return resp.waterNeed
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
