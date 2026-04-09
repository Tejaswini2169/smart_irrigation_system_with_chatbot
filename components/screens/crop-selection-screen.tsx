"use client"

import { useApp, useTranslations, type CropType, type SoilType } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Wheat, Leaf, CircleDot, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const crops: { type: CropType; icon: React.ReactNode }[] = [
  { type: "rice", icon: <Leaf className="w-8 h-8" /> },
  { type: "wheat", icon: <Wheat className="w-8 h-8" /> },
  { type: "tomato", icon: <CircleDot className="w-8 h-8" /> },
  { type: "cotton", icon: <Flower2 className="w-8 h-8" /> },
  { type: "sugarcane", icon: <Leaf className="w-8 h-8" /> },
  { type: "maize", icon: <Wheat className="w-8 h-8" /> }
]

const soils: { type: SoilType; color: string }[] = [
  { type: "sandy", color: "bg-amber-200" },
  { type: "clay", color: "bg-orange-300" },
  { type: "loamy", color: "bg-amber-700" }
]

export function CropSelectionScreen() {
  const { cropType, setCropType, soilType, setSoilType, setCurrentScreen } = useApp()
  const t = useTranslations()
  const [step, setStep] = useState<"crop" | "soil">("crop")

  const handleContinue = () => {
    if (step === "crop" && cropType) {
      setStep("soil")
    } else if (step === "soil" && soilType) {
      setCurrentScreen("location")
    }
  }

  const handleBack = () => {
    if (step === "soil") {
      setStep("crop")
    } else {
      setCurrentScreen("welcome")
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-center">
          <div className="flex gap-2">
            <div className={cn("w-2 h-2 rounded-full", step === "crop" ? "bg-primary" : "bg-muted")} />
            <div className={cn("w-2 h-2 rounded-full", step === "soil" ? "bg-primary" : "bg-muted")} />
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">
        {step === "crop" ? t.selectCrop : t.selectSoil}
      </h2>

      {/* Crop Selection */}
      {step === "crop" && (
        <div className="grid grid-cols-2 gap-4 flex-1">
          {crops.map((crop) => (
            <Card
              key={crop.type}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3",
                cropType === crop.type
                  ? "border-2 border-primary bg-primary/10 shadow-md"
                  : "border border-border hover:border-primary/50 hover:shadow-sm"
              )}
              onClick={() => setCropType(crop.type)}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                cropType === crop.type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {crop.icon}
              </div>
              <span className="font-medium text-foreground">{t.crops[crop.type]}</span>
            </Card>
          ))}
        </div>
      )}

      {/* Soil Selection */}
      {step === "soil" && (
        <div className="flex flex-col gap-4 flex-1">
          {soils.map((soil) => (
            <Card
              key={soil.type}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 flex items-center gap-4",
                soilType === soil.type
                  ? "border-2 border-primary bg-primary/10 shadow-md"
                  : "border border-border hover:border-primary/50 hover:shadow-sm"
              )}
              onClick={() => setSoilType(soil.type)}
            >
              <div className={cn("w-16 h-16 rounded-xl", soil.color)} />
              <div className="flex-1">
                <span className="font-medium text-lg text-foreground">{t.soils[soil.type]}</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {soil.type === "sandy" && "Fast drainage, frequent irrigation"}
                  {soil.type === "clay" && "Slow drainage, holds water"}
                  {soil.type === "loamy" && "Balanced moisture retention"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <Button
        size="lg"
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={(step === "crop" && !cropType) || (step === "soil" && !soilType)}
      >
        {t.next}
      </Button>
    </div>
  )
}
