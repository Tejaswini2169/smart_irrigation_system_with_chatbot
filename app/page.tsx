"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { WelcomeScreen } from "@/components/screens/welcome-screen"
import { CropSelectionScreen } from "@/components/screens/crop-selection-screen"
import { LocationScreen } from "@/components/screens/location-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { ForecastScreen } from "@/components/screens/forecast-screen"
import { ChatbotScreen } from "@/components/screens/chatbot-screen"

function AppContent() {
  const { currentScreen } = useApp()

  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen />
    case "crop-selection":
      return <CropSelectionScreen />
    case "location":
      return <LocationScreen />
    case "dashboard":
      return <DashboardScreen />
    case "forecast":
      return <ForecastScreen />
    case "chatbot":
      return <ChatbotScreen />
    default:
      return <WelcomeScreen />
  }
}

export default function SmartIrrigationApp() {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen bg-background">
        <AppContent />
      </div>
    </AppProvider>
  )
}
