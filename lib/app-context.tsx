"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "kn" | "hi" | "te"
export type CropType = "rice" | "wheat" | "tomato" | "cotton" | "sugarcane" | "maize"
export type SoilType = "sandy" | "clay" | "loamy"

export interface Location {
  latitude: number
  longitude: number
  name: string
}

export interface WeatherData {
  date: string
  temperature: number
  humidity: number
  rainProbability: number
  rainMm: number
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy"
}

export interface IrrigationRecommendation {
  date: string
  action: "skip" | "irrigate" | "light"
  reason: string
  waterAmount?: number
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  cropType: CropType | null
  setCropType: (crop: CropType) => void
  soilType: SoilType | null
  setSoilType: (soil: SoilType) => void
  location: Location | null
  setLocation: (loc: Location) => void
  currentScreen: string
  setCurrentScreen: (screen: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const translations = {
  en: {
    appName: "JalMitra",
    tagline: "Smart Irrigation Planning",
    welcome: "Welcome to JalMitra",
    selectLanguage: "Select Your Language",
    continue: "Continue",
    selectCrop: "Select Your Crop",
    selectSoil: "Select Soil Type",
    location: "Location",
    detectLocation: "Detect My Location",
    enterManually: "Enter Manually",
    weather: "Weather",
    temperature: "Temperature",
    humidity: "Humidity",
    rainProbability: "Rain Probability",
    expectedRainfall: "Expected Rainfall",
    irrigationPlan: "Irrigation Plan",
    today: "Today",
    tomorrow: "Tomorrow",
    noIrrigation: "No Irrigation Needed",
    irrigate: "Irrigate",
    lightIrrigation: "Light Irrigation",
    waterSaved: "Water Saved",
    liters: "Liters",
    chatbot: "Ask JalMitra",
    voiceAssistant: "Voice Assistant",
    askQuestion: "Ask a question...",
    listening: "Listening...",
    crops: {
      rice: "Rice",
      wheat: "Wheat",
      tomato: "Tomato",
      cotton: "Cotton",
      sugarcane: "Sugarcane",
      maize: "Maize"
    },
    soils: {
      sandy: "Sandy",
      clay: "Clay",
      loamy: "Loamy"
    },
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    back: "Back",
    next: "Next",
    skip: "Skip",
    home: "Home",
    forecast: "Forecast",
    assistant: "Assistant",
    settings: "Settings"
  },
  kn: {
    appName: "ಜಲಮಿತ್ರ",
    tagline: "ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಯೋಜನೆ",
    welcome: "ಜಲಮಿತ್ರಕ್ಕೆ ಸ್ವಾಗತ",
    selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    selectCrop: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectSoil: "ಮಣ್ಣಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",
    location: "ಸ್ಥಳ",
    detectLocation: "ನನ್ನ ಸ್ಥಳ ಪತ್ತೆಮಾಡಿ",
    enterManually: "ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ",
    weather: "ಹವಾಮಾನ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
    rainProbability: "ಮಳೆ ಸಾಧ್ಯತೆ",
    expectedRainfall: "ನಿರೀಕ್ಷಿತ ಮಳೆ",
    irrigationPlan: "ನೀರಾವರಿ ಯೋಜನೆ",
    today: "ಇಂದು",
    tomorrow: "ನಾಳೆ",
    noIrrigation: "ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲ",
    irrigate: "ನೀರಾವರಿ ಮಾಡಿ",
    lightIrrigation: "ಲಘು ನೀರಾವರಿ",
    waterSaved: "ಉಳಿಸಿದ ನೀರು",
    liters: "ಲೀಟರ್",
    chatbot: "ಜಲಮಿತ್ರ ಕೇಳಿ",
    voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
    askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    listening: "ಕೇಳುತ್ತಿದೆ...",
    crops: {
      rice: "ಭತ್ತ",
      wheat: "ಗೋಧಿ",
      tomato: "ಟೊಮೆಟೊ",
      cotton: "ಹತ್ತಿ",
      sugarcane: "ಕಬ್ಬು",
      maize: "ಮೆಕ್ಕೆಜೋಳ"
    },
    soils: {
      sandy: "ಮರಳು",
      clay: "ಜೇಡಿಮಣ್ಣು",
      loamy: "ಗೋಡು"
    },
    days: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
    back: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    skip: "ಬಿಡಿ",
    home: "ಮುಖಪುಟ",
    forecast: "ಮುನ್ಸೂಚನೆ",
    assistant: "ಸಹಾಯಕ",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್"
  },
  hi: {
    appName: "जलमित्र",
    tagline: "स्मार्ट सिंचाई योजना",
    welcome: "जलमित्र में आपका स्वागत है",
    selectLanguage: "अपनी भाषा चुनें",
    continue: "जारी रखें",
    selectCrop: "अपनी फसल चुनें",
    selectSoil: "मिट्टी का प्रकार चुनें",
    location: "स्थान",
    detectLocation: "मेरा स्थान पता करें",
    enterManually: "मैन्युअल रूप से दर्ज करें",
    weather: "मौसम",
    temperature: "तापमान",
    humidity: "नमी",
    rainProbability: "बारिश की संभावना",
    expectedRainfall: "अपेक्षित वर्षा",
    irrigationPlan: "सिंचाई योजना",
    today: "आज",
    tomorrow: "कल",
    noIrrigation: "सिंचाई की जरूरत नहीं",
    irrigate: "सिंचाई करें",
    lightIrrigation: "हल्की सिंचाई",
    waterSaved: "बचाया पानी",
    liters: "लीटर",
    chatbot: "जलमित्र से पूछें",
    voiceAssistant: "वॉइस असिस्टेंट",
    askQuestion: "सवाल पूछें...",
    listening: "सुन रहा है...",
    crops: {
      rice: "धान",
      wheat: "गेहूं",
      tomato: "टमाटर",
      cotton: "कपास",
      sugarcane: "गन्ना",
      maize: "मक्का"
    },
    soils: {
      sandy: "रेतीली",
      clay: "चिकनी मिट्टी",
      loamy: "दोमट"
    },
    days: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
    back: "पीछे",
    next: "आगे",
    skip: "छोड़ें",
    home: "होम",
    forecast: "पूर्वानुमान",
    assistant: "सहायक",
    settings: "सेटिंग्स"
  },
  te: {
    appName: "జలమిత్ర",
    tagline: "స్మార్ట్ నీటిపారుదల ప్రణాళిక",
    welcome: "జలమిత్రకు స్వాగతం",
    selectLanguage: "మీ భాషను ఎంచుకోండి",
    continue: "కొనసాగించు",
    selectCrop: "మీ పంటను ఎంచుకోండి",
    selectSoil: "నేల రకాన్ని ఎంచుకోండి",
    location: "స్థానం",
    detectLocation: "నా స్థానం గుర్తించు",
    enterManually: "మాన్యువల్‌గా నమోదు చేయండి",
    weather: "వాతావరణం",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    rainProbability: "వర్షం సంభావ్యత",
    expectedRainfall: "ఊహించిన వర్షపాతం",
    irrigationPlan: "నీటిపారుదల ప్రణాళిక",
    today: "ఈ రోజు",
    tomorrow: "రేపు",
    noIrrigation: "నీటిపారుదల అవసరం లేదు",
    irrigate: "నీరు పెట్టండి",
    lightIrrigation: "తేలికపాటి నీటిపారుదల",
    waterSaved: "ఆదా చేసిన నీరు",
    liters: "లీటర్లు",
    chatbot: "జలమిత్రను అడగండి",
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    askQuestion: "ప్రశ్న అడగండి...",
    listening: "వింటోంది...",
    crops: {
      rice: "వరి",
      wheat: "గోధుమ",
      tomato: "టమాటో",
      cotton: "పత్తి",
      sugarcane: "చెరకు",
      maize: "మొక్కజొన్న"
    },
    soils: {
      sandy: "ఇసుక",
      clay: "బంక మట్టి",
      loamy: "గుల్ల మట్టి"
    },
    days: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
    back: "వెనక్కి",
    next: "తరువాత",
    skip: "వదిలేయి",
    home: "హోమ్",
    forecast: "అంచనా",
    assistant: "సహాయకుడు",
    settings: "సెట్టింగ్‌లు"
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [cropType, setCropType] = useState<CropType | null>(null)
  const [soilType, setSoilType] = useState<SoilType | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [currentScreen, setCurrentScreen] = useState("welcome")

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        cropType,
        setCropType,
        soilType,
        setSoilType,
        location,
        setLocation,
        currentScreen,
        setCurrentScreen
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export function useTranslations() {
  const { language } = useApp()
  return translations[language]
}
