import type { CropType, SoilType, WeatherData, Language, Location } from "./app-context"

// Karnataka region climate zones based on location
type ClimateZone = "coastal" | "northern-dry" | "southern-dry" | "malnad" | "plateau"

// Crop suitability data based on real agricultural data
interface CropProfile {
  name: CropType
  optimalTemp: { min: number; max: number }
  optimalHumidity: { min: number; max: number }
  waterRequirement: "high" | "medium" | "low"
  suitableSoils: SoilType[]
  suitableZones: ClimateZone[]
  yieldPotential: number // 1-10 scale
  growthDays: number
  season: ("kharif" | "rabi" | "summer")[]
}

// Location to climate zone mapping for Karnataka
const locationClimateZones: Record<string, ClimateZone> = {
  "Bangalore": "plateau",
  "Mysore": "southern-dry",
  "Hubli": "northern-dry",
  "Belgaum": "malnad",
  "Mangalore": "coastal",
  "Dharwad": "northern-dry",
  "Gulbarga": "northern-dry",
  "Bellary": "northern-dry",
  "Shimoga": "malnad",
  "Tumkur": "plateau",
  "Davangere": "northern-dry",
  "Chitradurga": "northern-dry",
  "Hassan": "malnad",
  "Mandya": "southern-dry",
  "Raichur": "northern-dry",
  "Bijapur": "northern-dry",
  "Udupi": "coastal",
  "Chikmagalur": "malnad",
  "Kodagu": "malnad",
  "Haveri": "northern-dry"
}

// Default climate zone if location not found
const defaultClimateZone: ClimateZone = "plateau"

// Comprehensive crop profiles based on agricultural research
const cropProfiles: CropProfile[] = [
  {
    name: "rice",
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 90 },
    waterRequirement: "high",
    suitableSoils: ["clay", "loamy"],
    suitableZones: ["coastal", "malnad", "southern-dry"],
    yieldPotential: 8,
    growthDays: 120,
    season: ["kharif"]
  },
  {
    name: "wheat",
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 40, max: 70 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["northern-dry", "plateau"],
    yieldPotential: 7,
    growthDays: 110,
    season: ["rabi"]
  },
  {
    name: "tomato",
    optimalTemp: { min: 18, max: 30 },
    optimalHumidity: { min: 50, max: 80 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "sandy"],
    suitableZones: ["plateau", "southern-dry", "malnad"],
    yieldPotential: 9,
    growthDays: 90,
    season: ["rabi", "summer"]
  },
  {
    name: "cotton",
    optimalTemp: { min: 21, max: 35 },
    optimalHumidity: { min: 40, max: 70 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["northern-dry", "plateau"],
    yieldPotential: 7,
    growthDays: 180,
    season: ["kharif"]
  },
  {
    name: "sugarcane",
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 90 },
    waterRequirement: "high",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["coastal", "malnad", "southern-dry"],
    yieldPotential: 9,
    growthDays: 365,
    season: ["kharif", "rabi"]
  },
  {
    name: "maize",
    optimalTemp: { min: 18, max: 32 },
    optimalHumidity: { min: 50, max: 80 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "sandy"],
    suitableZones: ["plateau", "northern-dry", "southern-dry"],
    yieldPotential: 8,
    growthDays: 100,
    season: ["kharif", "rabi"]
  }
]

// Additional crops for recommendations
const additionalCrops: CropProfile[] = [
  {
    name: "ragi" as CropType,
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 40, max: 70 },
    waterRequirement: "low",
    suitableSoils: ["sandy", "loamy"],
    suitableZones: ["plateau", "southern-dry", "northern-dry"],
    yieldPotential: 7,
    growthDays: 100,
    season: ["kharif"]
  },
  {
    name: "groundnut" as CropType,
    optimalTemp: { min: 22, max: 35 },
    optimalHumidity: { min: 45, max: 75 },
    waterRequirement: "low",
    suitableSoils: ["sandy", "loamy"],
    suitableZones: ["northern-dry", "plateau"],
    yieldPotential: 8,
    growthDays: 120,
    season: ["kharif", "summer"]
  },
  {
    name: "jowar" as CropType,
    optimalTemp: { min: 25, max: 38 },
    optimalHumidity: { min: 30, max: 60 },
    waterRequirement: "low",
    suitableSoils: ["clay", "loamy"],
    suitableZones: ["northern-dry", "plateau"],
    yieldPotential: 7,
    growthDays: 110,
    season: ["kharif", "rabi"]
  },
  {
    name: "sunflower" as CropType,
    optimalTemp: { min: 18, max: 30 },
    optimalHumidity: { min: 40, max: 70 },
    waterRequirement: "low",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["northern-dry", "plateau"],
    yieldPotential: 7,
    growthDays: 90,
    season: ["rabi", "summer"]
  },
  {
    name: "chilli" as CropType,
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 50, max: 80 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "sandy"],
    suitableZones: ["northern-dry", "southern-dry", "plateau"],
    yieldPotential: 8,
    growthDays: 150,
    season: ["kharif", "rabi"]
  },
  {
    name: "coconut" as CropType,
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 70, max: 95 },
    waterRequirement: "high",
    suitableSoils: ["sandy", "loamy"],
    suitableZones: ["coastal", "malnad"],
    yieldPotential: 9,
    growthDays: 365,
    season: ["kharif", "rabi", "summer"]
  },
  {
    name: "arecanut" as CropType,
    optimalTemp: { min: 22, max: 35 },
    optimalHumidity: { min: 70, max: 95 },
    waterRequirement: "high",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["coastal", "malnad"],
    yieldPotential: 9,
    growthDays: 365,
    season: ["kharif", "rabi", "summer"]
  },
  {
    name: "coffee" as CropType,
    optimalTemp: { min: 15, max: 28 },
    optimalHumidity: { min: 60, max: 90 },
    waterRequirement: "medium",
    suitableSoils: ["loamy"],
    suitableZones: ["malnad"],
    yieldPotential: 9,
    growthDays: 365,
    season: ["kharif", "rabi", "summer"]
  },
  {
    name: "turmeric" as CropType,
    optimalTemp: { min: 20, max: 32 },
    optimalHumidity: { min: 60, max: 90 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "clay"],
    suitableZones: ["malnad", "southern-dry"],
    yieldPotential: 8,
    growthDays: 270,
    season: ["kharif"]
  },
  {
    name: "onion" as CropType,
    optimalTemp: { min: 15, max: 30 },
    optimalHumidity: { min: 50, max: 70 },
    waterRequirement: "medium",
    suitableSoils: ["loamy", "sandy"],
    suitableZones: ["northern-dry", "plateau", "southern-dry"],
    yieldPotential: 8,
    growthDays: 120,
    season: ["rabi", "kharif"]
  }
]

// All crops combined
const allCrops = [...cropProfiles, ...additionalCrops]

// Extended crop names for display
const extendedCropNames: Record<string, Record<Language, string>> = {
  ragi: { en: "Finger Millet (Ragi)", kn: "ರಾಗಿ", hi: "रागी", te: "రాగి" },
  groundnut: { en: "Groundnut", kn: "ಶೇಂಗಾ", hi: "मूंगफली", te: "వేరుశెనగ" },
  jowar: { en: "Sorghum (Jowar)", kn: "ಜೋಳ", hi: "ज्वार", te: "జొన్న" },
  sunflower: { en: "Sunflower", kn: "ಸೂರ್ಯಕಾಂತಿ", hi: "सूरजमुखी", te: "పొద్దుతిరుగుడు" },
  chilli: { en: "Chilli", kn: "ಮೆಣಸಿನಕಾಯಿ", hi: "मिर्च", te: "మిర్చి" },
  coconut: { en: "Coconut", kn: "ತೆಂಗಿನಕಾಯಿ", hi: "नारियल", te: "కొబ్బరి" },
  arecanut: { en: "Arecanut", kn: "ಅಡಿಕೆ", hi: "सुपारी", te: "వక్క" },
  coffee: { en: "Coffee", kn: "ಕಾಫಿ", hi: "कॉफ़ी", te: "కాఫీ" },
  turmeric: { en: "Turmeric", kn: "ಅರಿಶಿನ", hi: "हल्दी", te: "పసుపు" },
  onion: { en: "Onion", kn: "ಈರುಳ್ಳಿ", hi: "प्याज", te: "ఉల్లి" }
}

export interface CropRecommendation {
  crop: string
  cropDisplayName: string
  suitabilityScore: number // 0-100
  reasons: string[]
  yieldPotential: string
  waterRequirement: string
  growthDays: number
  isBetterThanCurrent: boolean
}

export interface CurrentCropAnalysis {
  isSuitable: boolean
  suitabilityScore: number
  issues: string[]
  suggestions: string[]
}

function getClimateZone(location: Location | null): ClimateZone {
  if (!location?.name) return defaultClimateZone
  return locationClimateZones[location.name] || defaultClimateZone
}

function getCurrentSeason(): "kharif" | "rabi" | "summer" {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 10) return "kharif"
  if (month >= 11 || month <= 2) return "rabi"
  return "summer"
}

function calculateCropSuitability(
  crop: CropProfile,
  weather: WeatherData[],
  soilType: SoilType | null,
  location: Location | null
): { score: number; reasons: string[]; issues: string[] } {
  const soil = soilType || "loamy"
  const climateZone = getClimateZone(location)
  const currentSeason = getCurrentSeason()
  const avgTemp = weather.reduce((sum, w) => sum + w.temperature, 0) / weather.length
  const avgHumidity = weather.reduce((sum, w) => sum + w.humidity, 0) / weather.length
  const avgRainProb = weather.reduce((sum, w) => sum + w.rainProbability, 0) / weather.length

  let score = 0
  const reasons: string[] = []
  const issues: string[] = []

  // Temperature suitability (25 points)
  if (avgTemp >= crop.optimalTemp.min && avgTemp <= crop.optimalTemp.max) {
    score += 25
    reasons.push("temperature_optimal")
  } else if (avgTemp < crop.optimalTemp.min - 5 || avgTemp > crop.optimalTemp.max + 5) {
    score += 5
    issues.push("temperature_unsuitable")
  } else {
    score += 15
    issues.push("temperature_marginal")
  }

  // Humidity suitability (20 points)
  if (avgHumidity >= crop.optimalHumidity.min && avgHumidity <= crop.optimalHumidity.max) {
    score += 20
    reasons.push("humidity_optimal")
  } else if (avgHumidity < crop.optimalHumidity.min - 15 || avgHumidity > crop.optimalHumidity.max + 15) {
    score += 5
    issues.push("humidity_unsuitable")
  } else {
    score += 12
    issues.push("humidity_marginal")
  }

  // Soil suitability (20 points)
  if (crop.suitableSoils.includes(soil)) {
    score += 20
    reasons.push("soil_suitable")
  } else {
    score += 5
    issues.push("soil_unsuitable")
  }

  // Climate zone suitability (20 points)
  if (crop.suitableZones.includes(climateZone)) {
    score += 20
    reasons.push("zone_suitable")
  } else {
    score += 5
    issues.push("zone_unsuitable")
  }

  // Season suitability (15 points)
  if (crop.season.includes(currentSeason)) {
    score += 15
    reasons.push("season_suitable")
  } else {
    score += 3
    issues.push("season_unsuitable")
  }

  // Water availability based on rain (bonus points)
  if (crop.waterRequirement === "high" && avgRainProb > 50) {
    score += 5
    reasons.push("rain_sufficient")
  } else if (crop.waterRequirement === "low" && avgRainProb < 40) {
    score += 5
    reasons.push("low_water_crop")
  }

  return { score: Math.min(score, 100), reasons, issues }
}

// Translation helper for recommendation reasons
function translateReason(reason: string, language: Language): string {
  const translations: Record<string, Record<Language, string>> = {
    temperature_optimal: {
      en: "Current temperature is ideal for this crop",
      kn: "ಪ್ರಸ್ತುತ ತಾಪಮಾನ ಈ ಬೆಳೆಗೆ ಸೂಕ್ತ",
      hi: "वर्तमान तापमान इस फसल के लिए आदर्श है",
      te: "ప్రస్తుత ఉష్ణోగ్రత ఈ పంటకు అనుకూలం"
    },
    humidity_optimal: {
      en: "Humidity levels are perfect",
      kn: "ಆರ್ದ್ರತೆ ಮಟ್ಟ ಸರಿಯಾಗಿದೆ",
      hi: "नमी का स्तर सही है",
      te: "తేమ స్థాయి సరిపోతుంది"
    },
    soil_suitable: {
      en: "Your soil type is excellent for this crop",
      kn: "ನಿಮ್ಮ ಮಣ್ಣು ಈ ಬೆಳೆಗೆ ಅತ್ಯುತ್ತಮ",
      hi: "आपकी मिट्टी इस फसल के लिए उत्कृष्ट है",
      te: "మీ నేల ఈ పంటకు అద్భుతం"
    },
    zone_suitable: {
      en: "Your region is well-suited for this crop",
      kn: "ನಿಮ್ಮ ಪ್ರದೇಶ ಈ ಬೆಳೆಗೆ ಸೂಕ್ತ",
      hi: "आपका क्षेत्र इस फसल के लिए उपयुक्त है",
      te: "మీ ప్రాంతం ఈ పంటకు అనుకూలం"
    },
    season_suitable: {
      en: "This is the right season for planting",
      kn: "ಇದು ಬಿತ್ತನೆಗೆ ಸರಿಯಾದ ಸಮಯ",
      hi: "यह बुवाई का सही मौसम है",
      te: "నాటడానికి ఇది సరైన సమయం"
    },
    rain_sufficient: {
      en: "Expected rainfall will meet water needs",
      kn: "ನಿರೀಕ್ಷಿತ ಮಳೆ ನೀರಿನ ಅವಶ್ಯಕತೆ ಪೂರೈಸುತ್ತದೆ",
      hi: "अपेक्षित वर्षा पानी की जरूरत पूरी करेगी",
      te: "ఆశించిన వర్షం నీటి అవసరాలను తీరుస్తుంది"
    },
    low_water_crop: {
      en: "This crop needs less water, ideal for current conditions",
      kn: "ಈ ಬೆಳೆಗೆ ಕಡಿಮೆ ನೀರು ಬೇಕು, ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತ",
      hi: "इस फसल को कम पानी चाहिए, वर्तमान स्थिति के लिए आदर्श",
      te: "ఈ పంటకు తక్కువ నీరు అవసరం, ప్రస్తుత పరిస్థితికి అనుకూలం"
    },
    temperature_unsuitable: {
      en: "Temperature is not ideal for this crop",
      kn: "ತಾಪಮಾನ ಈ ಬೆಳೆಗೆ ಸೂಕ್ತವಲ್ಲ",
      hi: "तापमान इस फसल के लिए उचित नहीं",
      te: "ఉష్ణోగ్రత ఈ పంటకు అనుకూలం కాదు"
    },
    temperature_marginal: {
      en: "Temperature is slightly outside optimal range",
      kn: "ತಾಪಮಾನ ಸ್ವಲ್ಪ ಹೊರಗಿದೆ",
      hi: "तापमान थोड़ा अनुकूल सीमा से बाहर है",
      te: "ఉష్ణోగ్రత కొద్దిగా అనుకూల పరిధి వెలుపల ఉంది"
    },
    humidity_unsuitable: {
      en: "Humidity levels are not suitable",
      kn: "ಆರ್ದ್ರತೆ ಮಟ್ಟ ಸೂಕ್ತವಲ್ಲ",
      hi: "नमी का स्तर उपयुक्त नहीं",
      te: "తేమ స్థాయి అనుకూలం కాదు"
    },
    humidity_marginal: {
      en: "Humidity is slightly outside optimal range",
      kn: "ಆರ್ದ್ರತೆ ಸ್ವಲ್ಪ ಹೊರಗಿದೆ",
      hi: "नमी थोड़ी अनुकूल सीमा से बाहर है",
      te: "తేమ కొద్దిగా అనుకూల పరిధి వెలుపల ఉంది"
    },
    soil_unsuitable: {
      en: "Your soil type is not ideal for this crop",
      kn: "ನಿಮ್ಮ ಮಣ್ಣು ಈ ಬೆಳೆಗೆ ಸೂಕ್ತವಲ್ಲ",
      hi: "आपकी मिट्टी इस फसल के लिए आदर्श नहीं",
      te: "మీ నేల ఈ పంటకు అనుకూలం కాదు"
    },
    zone_unsuitable: {
      en: "This crop is not traditionally grown in your region",
      kn: "ಈ ಬೆಳೆ ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಸಾಮಾನ್ಯವಲ್ಲ",
      hi: "यह फसल आपके क्षेत्र में परंपरागत रूप से नहीं उगाई जाती",
      te: "ఈ పంట మీ ప్రాంతంలో సాంప్రదాయంగా పండించబడదు"
    },
    season_unsuitable: {
      en: "This is not the ideal season for this crop",
      kn: "ಈ ಬೆಳೆಗೆ ಇದು ಸರಿಯಾದ ಋತು ಅಲ್ಲ",
      hi: "इस फसल के लिए यह सही मौसम नहीं है",
      te: "ఈ పంటకు ఇది సరైన సీజన్ కాదు"
    }
  }

  return translations[reason]?.[language] || reason
}

function translateYieldPotential(potential: number, language: Language): string {
  const levels = {
    high: { en: "High yield potential", kn: "ಹೆಚ್ಚಿನ ಇಳುವರಿ", hi: "उच्च उपज क्षमता", te: "అధిక దిగుబడి" },
    medium: { en: "Medium yield potential", kn: "ಮಧ್ಯಮ ಇಳುವರಿ", hi: "मध्यम उपज क्षमता", te: "మధ్యస్థ దిగుబడి" },
    low: { en: "Lower yield potential", kn: "ಕಡಿಮೆ ಇಳುವರಿ", hi: "कम उपज क्षमता", te: "తక్కువ దిగుబడి" }
  }

  if (potential >= 8) return levels.high[language]
  if (potential >= 6) return levels.medium[language]
  return levels.low[language]
}

function translateWaterRequirement(req: string, language: Language): string {
  const translations = {
    high: { en: "High water requirement", kn: "ಹೆಚ್ಚಿನ ನೀರು ಅಗತ್ಯ", hi: "अधिक पानी की आवश्यकता", te: "ఎక్కువ నీరు అవసరం" },
    medium: { en: "Medium water requirement", kn: "ಮಧ್ಯಮ ನೀರು ಅಗತ್ಯ", hi: "मध्यम पानी की आवश्यकता", te: "మధ్యస్థ నీరు అవసరం" },
    low: { en: "Low water requirement", kn: "ಕಡಿಮೆ ನೀರು ಅಗತ್ಯ", hi: "कम पानी की आवश्यकता", te: "తక్కువ నీరు అవసరం" }
  }
  return translations[req as keyof typeof translations]?.[language] || req
}

export function analyzeCurrentCrop(
  selectedCrop: CropType | null,
  weather: WeatherData[],
  soilType: SoilType | null,
  location: Location | null,
  language: Language
): CurrentCropAnalysis {
  if (!selectedCrop) {
    return {
      isSuitable: true,
      suitabilityScore: 0,
      issues: [],
      suggestions: []
    }
  }

  const cropProfile = cropProfiles.find(c => c.name === selectedCrop) || cropProfiles[0]
  const { score, issues } = calculateCropSuitability(cropProfile, weather, soilType, location)

  return {
    isSuitable: score >= 65,
    suitabilityScore: score,
    issues: issues.map(i => translateReason(i, language)),
    suggestions: issues.length > 0 
      ? [getImprovementSuggestion(issues, language)]
      : []
  }
}

function getImprovementSuggestion(issues: string[], language: Language): string {
  const suggestions = {
    en: "Consider choosing a crop better suited to your conditions for higher yield",
    kn: "ಹೆಚ್ಚಿನ ಇಳುವರಿಗಾಗಿ ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಹೆಚ್ಚು ಸೂಕ್ತವಾದ ಬೆಳೆಯನ್ನು ಪರಿಗಣಿಸಿ",
    hi: "अधिक उपज के लिए अपनी स्थिति के लिए बेहतर उपयुक्त फसल चुनने पर विचार करें",
    te: "అధిక దిగుబడి కోసం మీ పరిస్థితులకు మరింత అనుకూలమైన పంటను ఎంచుకోండి"
  }
  return suggestions[language]
}

export function getHighYieldCropRecommendations(
  currentCrop: CropType | null,
  weather: WeatherData[],
  soilType: SoilType | null,
  location: Location | null,
  language: Language,
  translations: { crops: Record<string, string> }
): CropRecommendation[] {
  const recommendations: CropRecommendation[] = []
  
  // Analyze all crops
  for (const crop of allCrops) {
    const { score, reasons } = calculateCropSuitability(crop, weather, soilType, location)
    
    // Get display name
    let displayName: string
    if (crop.name in translations.crops) {
      displayName = translations.crops[crop.name]
    } else if (extendedCropNames[crop.name]) {
      displayName = extendedCropNames[crop.name][language]
    } else {
      displayName = crop.name.charAt(0).toUpperCase() + crop.name.slice(1)
    }

    // Only include crops with good suitability
    if (score >= 60) {
      recommendations.push({
        crop: crop.name,
        cropDisplayName: displayName,
        suitabilityScore: score,
        reasons: reasons.slice(0, 3).map(r => translateReason(r, language)),
        yieldPotential: translateYieldPotential(crop.yieldPotential, language),
        waterRequirement: translateWaterRequirement(crop.waterRequirement, language),
        growthDays: crop.growthDays,
        isBetterThanCurrent: currentCrop ? score > calculateCropSuitability(
          cropProfiles.find(c => c.name === currentCrop) || cropProfiles[0],
          weather, soilType, location
        ).score : true
      })
    }
  }

  // Sort by suitability score and filter out current crop
  return recommendations
    .filter(r => r.crop !== currentCrop)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 3)
}

// Translations for the recommendation UI
export const recommendationTranslations = {
  en: {
    cropRecommendations: "Crop Recommendations",
    basedOnAnalysis: "Based on your location, soil, and weather analysis",
    currentCropAnalysis: "Current Crop Analysis",
    suitabilityScore: "Suitability Score",
    issues: "Issues",
    betterAlternatives: "Better Alternatives for Higher Yield",
    whyRecommended: "Why recommended",
    growthPeriod: "Growth period",
    days: "days",
    excellent: "Excellent match",
    good: "Good match",
    moderate: "Moderate match",
    notSuitable: "Not suitable for your conditions",
    suitable: "Suitable for your conditions",
    viewDetails: "View Details",
    considerSwitching: "Consider switching for higher yield"
  },
  kn: {
    cropRecommendations: "ಬೆಳೆ ಶಿಫಾರಸುಗಳು",
    basedOnAnalysis: "ನಿಮ್ಮ ಸ್ಥಳ, ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ",
    currentCropAnalysis: "ಪ್ರಸ್ತುತ ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ",
    suitabilityScore: "ಸೂಕ್ತತೆ ಸ್ಕೋರ್",
    issues: "ಸಮಸ್ಯೆಗಳು",
    betterAlternatives: "ಹೆಚ್ಚಿನ ಇಳುವರಿಗಾಗಿ ಉತ್ತಮ ಪರ್ಯಾಯಗಳು",
    whyRecommended: "ಏಕೆ ಶಿಫಾರಸು",
    growthPeriod: "ಬೆಳವಣಿಗೆ ಅವಧಿ",
    days: "ದಿನಗಳು",
    excellent: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ",
    good: "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ",
    moderate: "ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ",
    notSuitable: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಲ್ಲ",
    suitable: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತ",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    considerSwitching: "ಹೆಚ್ಚಿನ ಇಳುವರಿಗಾಗಿ ಬದಲಾಯಿಸಲು ಪರಿಗಣಿಸಿ"
  },
  hi: {
    cropRecommendations: "फसल सिफारिशें",
    basedOnAnalysis: "आपके स्थान, मिट्टी और मौसम विश्लेषण के आधार पर",
    currentCropAnalysis: "वर्तमान फसल विश्लेषण",
    suitabilityScore: "उपयुक्तता स्कोर",
    issues: "समस्याएं",
    betterAlternatives: "अधिक उपज के लिए बेहतर विकल्प",
    whyRecommended: "क्यों अनुशंसित",
    growthPeriod: "विकास अवधि",
    days: "दिन",
    excellent: "उत्कृष्ट मिलान",
    good: "अच्छा मिलान",
    moderate: "मध्यम मिलान",
    notSuitable: "आपकी स्थिति के लिए उपयुक्त नहीं",
    suitable: "आपकी स्थिति के लिए उपयुक्त",
    viewDetails: "विवरण देखें",
    considerSwitching: "अधिक उपज के लिए बदलने पर विचार करें"
  },
  te: {
    cropRecommendations: "పంట సిఫార్సులు",
    basedOnAnalysis: "మీ స్థానం, నేల మరియు వాతావరణ విశ్లేషణ ఆధారంగా",
    currentCropAnalysis: "ప్రస్తుత పంట విశ్లేషణ",
    suitabilityScore: "అనుకూలత స్కోర్",
    issues: "సమస్యలు",
    betterAlternatives: "అధిక దిగుబడి కోసం మెరుగైన ప్రత్యామ్నాయాలు",
    whyRecommended: "ఎందుకు సిఫార్సు",
    growthPeriod: "పెరుగుదల కాలం",
    days: "రోజులు",
    excellent: "అద్భుతమైన మ్యాచ్",
    good: "మంచి మ్యాచ్",
    moderate: "మధ్యస్థ మ్యాచ్",
    notSuitable: "మీ పరిస్థితులకు అనుకూలం కాదు",
    suitable: "మీ పరిస్థితులకు అనుకూలం",
    viewDetails: "వివరాలు చూడండి",
    considerSwitching: "అధిక దిగుబడి కోసం మార్చడాన్ని పరిగణించండి"
  }
}
