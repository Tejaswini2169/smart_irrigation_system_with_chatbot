"use client"

import { useApp, useTranslations } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { generateWeatherForecast, getIrrigationRecommendations, calculateWaterSavings } from "@/lib/weather-data"
import { Cloud, CloudRain, Sun, Thermometer, Droplets, Wind, CloudSun, Home, CalendarDays, MessageSquare, Settings } from "lucide-react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun
}

export function DashboardScreen() {
  const { language, location, cropType, soilType, setCurrentScreen } = useApp()
  const t = useTranslations()

  const weather = useMemo(() => generateWeatherForecast(), [])
  const recommendations = useMemo(
    () => getIrrigationRecommendations(weather, cropType, soilType, language),
    [weather, cropType, soilType, language]
  )
  const waterSavings = useMemo(
    () => calculateWaterSavings(recommendations, cropType),
    [recommendations, cropType]
  )

  const today = weather[0]
  const WeatherIcon = weatherIcons[today.condition]

  const getActionColor = (action: string) => {
    switch (action) {
      case "skip": return "bg-primary/20 text-primary"
      case "light": return "bg-secondary text-secondary-foreground"
      case "irrigate": return "bg-accent text-accent-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "skip": return t.noIrrigation
      case "light": return t.lightIrrigation
      case "irrigate": return t.irrigate
      default: return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">{t.location}</p>
            <h2 className="font-semibold text-lg">{location?.name || "Unknown"}</h2>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm">{t.crops[cropType || "rice"]}</p>
            <p className="text-sm">{t.soils[soilType || "loamy"]}</p>
          </div>
        </div>

        {/* Today&apos;s Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WeatherIcon className="w-16 h-16" />
            <div>
              <p className="text-4xl font-bold">{today.temperature}°C</p>
              <p className="text-primary-foreground/80">{t.today}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <Droplets className="w-4 h-4" />
              <span>{today.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <CloudRain className="w-4 h-4" />
              <span>{today.rainProbability}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 flex-1 space-y-6">
        {/* Today&apos;s Recommendation Card */}
        <Card className="p-6 shadow-lg">
          <h3 className="font-semibold text-foreground mb-3">{t.irrigationPlan}</h3>
          <div className="flex items-center gap-4">
            <div className={cn("px-4 py-2 rounded-full font-medium", getActionColor(recommendations[0].action))}>
              {getActionText(recommendations[0].action)}
            </div>
            <p className="text-sm text-muted-foreground flex-1">{recommendations[0].reason}</p>
          </div>
          
          {/* Rain Prediction */}
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <CloudRain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.rainProbability}</p>
                <p className="font-semibold text-foreground">{today.rainProbability}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.expectedRainfall}</p>
                <p className="font-semibold text-foreground">{today.rainMm} mm</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Water Savings */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Droplets className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t.waterSaved}</p>
              <p className="text-2xl font-bold text-primary">{waterSavings.saved.toLocaleString()} {t.liters}</p>
            </div>
          </div>
        </Card>

        {/* 5-Day Forecast Preview */}
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentScreen("forecast")}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{t.forecast}</h3>
            <span className="text-sm text-primary">View All</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {weather.slice(0, 5).map((day, index) => {
              const DayIcon = weatherIcons[day.condition]
              const date = new Date(day.date)
              return (
                <div key={day.date} className="flex-shrink-0 w-16 text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {index === 0 ? t.today : t.days[date.getDay()]}
                  </p>
                  <DayIcon className="w-8 h-8 mx-auto mb-2 text-foreground" />
                  <p className="text-sm font-medium text-foreground">{day.rainProbability}%</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            className="flex flex-col items-center gap-1 text-primary"
            onClick={() => setCurrentScreen("dashboard")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">{t.home}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCurrentScreen("forecast")}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs">{t.forecast}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCurrentScreen("chatbot")}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">{t.assistant}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCurrentScreen("welcome")}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">{t.settings}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
