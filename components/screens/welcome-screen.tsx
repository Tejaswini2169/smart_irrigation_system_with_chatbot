"use client"

import { useApp, useTranslations, type Language } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Droplets, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const languages: { code: Language; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "te", name: "Telugu", native: "తెలుగు" }
]

export function WelcomeScreen() {
  const { language, setLanguage, setCurrentScreen } = useApp()
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
          <Droplets className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">{t.appName}</h1>
        <p className="text-muted-foreground mt-1">{t.tagline}</p>
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">{t.welcome}</h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>{t.selectLanguage}</span>
        </div>
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
        {languages.map((lang) => (
          <Card
            key={lang.code}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              language === lang.code
                ? "border-2 border-primary bg-primary/10"
                : "border border-border hover:border-primary/50"
            )}
            onClick={() => setLanguage(lang.code)}
          >
            <div className="text-center">
              <p className="font-semibold text-foreground">{lang.native}</p>
              <p className="text-sm text-muted-foreground">{lang.name}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <Button
        size="lg"
        className="w-full max-w-sm"
        onClick={() => setCurrentScreen("crop-selection")}
      >
        {t.continue}
      </Button>
    </div>
  )
}
