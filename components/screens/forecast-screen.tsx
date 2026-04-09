"use client"

import { useApp, useTranslations } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateWeatherForecast, getIrrigationRecommendations } from "@/lib/weather-data"
import { Cloud, CloudRain, Sun, ArrowLeft, Droplets, Thermometer, CloudSun, Home, CalendarDays, MessageSquare, Settings, Check, X, AlertCircle } from "lucide-react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun
}

export function ForecastScreen() {
  const { language, cropType, soilType, setCurrentScreen } = useApp()
  const t = useTranslations()

  const weather = useMemo(() => generateWeatherForecast(), [])
  const recommendations = useMemo(
    () => getIrrigationRecommendations(weather, cropType, soilType, language),
    [weather, cropType, soilType, language]
  )

  const getActionIcon = (action: string) => {
    switch (action) {
      case "skip": return <X className="w-5 h-5" />
      case "light": return <AlertCircle className="w-5 h-5" />
      case "irrigate": return <Check className="w-5 h-5" />
      default: return null
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "skip": return "bg-primary text-primary-foreground"
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

  const getDayLabel = (index: number, date: Date) => {
    if (index === 0) return t.today
    if (index === 1) return t.tomorrow
    return t.days[date.getDay()]
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScreen("dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t.irrigationPlan}</h1>
        </div>
      </div>

      {/* Forecast List */}
      <div className="flex-1 p-6 space-y-4">
        {weather.map((day, index) => {
          const rec = recommendations[index]
          const date = new Date(day.date)
          const DayIcon = weatherIcons[day.condition]

          return (
            <Card key={day.date} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Day Info */}
                <div className="w-20 flex-shrink-0">
                  <p className="font-semibold text-foreground">{getDayLabel(index, date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>

                {/* Weather Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <DayIcon className="w-10 h-10 text-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{day.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CloudRain className="w-3 h-3" />
                          {day.rainProbability}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {day.rainMm} mm
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      getActionColor(rec.action)
                    )}>
                      {getActionIcon(rec.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{getActionText(rec.action)}</p>
                      <p className="text-xs text-muted-foreground truncate">{rec.reason}</p>
                    </div>
                    {rec.waterAmount && rec.action !== "skip" && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-primary">{rec.waterAmount} mm</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Legend</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <X className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{t.noIrrigation}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-secondary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{t.lightIrrigation}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-3 h-3 text-accent-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{t.irrigate}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCurrentScreen("dashboard")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">{t.home}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-primary"
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
