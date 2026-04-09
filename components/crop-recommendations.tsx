"use client"

import { useApp, useTranslations } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  analyzeCurrentCrop, 
  getHighYieldCropRecommendations, 
  recommendationTranslations,
  type CropRecommendation,
  type CurrentCropAnalysis 
} from "@/lib/crop-recommendations"
import { generateWeatherForecast } from "@/lib/weather-data"
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Droplets, 
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface CropRecommendationsProps {
  onCropSelect?: (crop: string) => void
}

export function CropRecommendations({ onCropSelect }: CropRecommendationsProps) {
  const { language, cropType, soilType, location, setCropType } = useApp()
  const t = useTranslations()
  const rt = recommendationTranslations[language]
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null)

  const weather = useMemo(() => generateWeatherForecast(), [])
  
  const currentAnalysis: CurrentCropAnalysis = useMemo(
    () => analyzeCurrentCrop(cropType, weather, soilType, location, language),
    [cropType, weather, soilType, location, language]
  )

  const recommendations: CropRecommendation[] = useMemo(
    () => getHighYieldCropRecommendations(cropType, weather, soilType, location, language, t),
    [cropType, weather, soilType, location, language, t]
  )

  const getSuitabilityLabel = (score: number) => {
    if (score >= 85) return rt.excellent
    if (score >= 70) return rt.good
    return rt.moderate
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 85) return "text-primary bg-primary/10"
    if (score >= 70) return "text-accent bg-accent/10"
    return "text-secondary-foreground bg-secondary"
  }

  const handleSelectCrop = (crop: string) => {
    if (["rice", "wheat", "tomato", "cotton", "sugarcane", "maize"].includes(crop)) {
      setCropType(crop as typeof cropType)
    }
    onCropSelect?.(crop)
  }

  return (
    <div className="space-y-4">
      {/* Current Crop Analysis */}
      {cropType && (
        <Card className="p-4 overflow-hidden">
          <div className="flex items-start gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              currentAnalysis.isSuitable ? "bg-primary/20" : "bg-destructive/20"
            )}>
              {currentAnalysis.isSuitable ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{rt.currentCropAnalysis}</h3>
              <p className="text-sm text-muted-foreground">
                {t.crops[cropType]} - {rt.suitabilityScore}: {currentAnalysis.suitabilityScore}%
              </p>
            </div>
          </div>

          {/* Suitability Bar */}
          <div className="mb-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  currentAnalysis.suitabilityScore >= 70 ? "bg-primary" : 
                  currentAnalysis.suitabilityScore >= 50 ? "bg-secondary" : "bg-destructive"
                )}
                style={{ width: `${currentAnalysis.suitabilityScore}%` }}
              />
            </div>
          </div>

          {/* Issues */}
          {currentAnalysis.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">{rt.issues}</p>
              {currentAnalysis.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{issue}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestion to switch */}
          {!currentAnalysis.isSuitable && recommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {rt.considerSwitching}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Better Alternatives Header */}
      {recommendations.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <Lightbulb className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{rt.betterAlternatives}</h3>
            <p className="text-xs text-muted-foreground">{rt.basedOnAnalysis}</p>
          </div>
        </div>
      )}

      {/* Recommended Crops */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.crop}
            className={cn(
              "overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md",
              expandedCrop === rec.crop ? "ring-2 ring-primary/50" : ""
            )}
            onClick={() => setExpandedCrop(expandedCrop === rec.crop ? null : rec.crop)}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{rec.cropDisplayName}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getSuitabilityColor(rec.suitabilityScore))}>
                      {getSuitabilityLabel(rec.suitabilityScore)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{rec.suitabilityScore}%</span>
                  <ChevronRight className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    expandedCrop === rec.crop ? "rotate-90" : ""
                  )} />
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{rec.yieldPotential}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{rec.waterRequirement}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{rec.growthDays} {rt.days}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCrop === rec.crop && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                      {rt.whyRecommended}
                    </p>
                    <ul className="space-y-1.5">
                      {rec.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select Button */}
                  {["rice", "wheat", "tomato", "cotton", "sugarcane", "maize"].includes(rec.crop) && (
                    <Button 
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectCrop(rec.crop)
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {language === "en" ? `Switch to ${rec.cropDisplayName}` :
                       language === "kn" ? `${rec.cropDisplayName} ಗೆ ಬದಲಾಯಿಸಿ` :
                       language === "hi" ? `${rec.cropDisplayName} में बदलें` :
                       `${rec.cropDisplayName} కు మారండి`}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* No recommendations message */}
      {recommendations.length === 0 && cropType && currentAnalysis.isSuitable && (
        <Card className="p-6 text-center bg-primary/5 border-primary/20">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">
            {language === "en" ? "Great choice!" :
             language === "kn" ? "ಉತ್ತಮ ಆಯ್ಕೆ!" :
             language === "hi" ? "बढ़िया चुनाव!" :
             "గొప్ప ఎంపిక!"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "en" ? `${t.crops[cropType]} is well-suited for your conditions.` :
             language === "kn" ? `${t.crops[cropType]} ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತ.` :
             language === "hi" ? `${t.crops[cropType]} आपकी स्थिति के लिए उपयुक्त है।` :
             `${t.crops[cropType]} మీ పరిస్థితులకు అనుకూలం.`}
          </p>
        </Card>
      )}
    </div>
  )
}
