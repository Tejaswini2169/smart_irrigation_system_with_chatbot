"use client"

import { useApp, useTranslations } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Navigation, Search } from "lucide-react"
import { useState } from "react"

const popularLocations = [
  { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { name: "Mysore", latitude: 12.2958, longitude: 76.6394 },
  { name: "Hubli", latitude: 15.3647, longitude: 75.1240 },
  { name: "Belgaum", latitude: 15.8497, longitude: 74.4977 },
  { name: "Dharwad", latitude: 15.4589, longitude: 75.0078 },
  { name: "Davangere", latitude: 14.4644, longitude: 75.9218 }
]

export function LocationScreen() {
  const { setLocation, setCurrentScreen } = useApp()
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)

  const handleDetectLocation = () => {
    setIsDetecting(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "Current Location"
          })
          setIsDetecting(false)
          setCurrentScreen("dashboard")
        },
        () => {
          // Fallback to default location on error
          setLocation({
            latitude: 12.9716,
            longitude: 77.5946,
            name: "Bangalore"
          })
          setIsDetecting(false)
          setCurrentScreen("dashboard")
        }
      )
    } else {
      // Fallback if geolocation not available
      setLocation({
        latitude: 12.9716,
        longitude: 77.5946,
        name: "Bangalore"
      })
      setIsDetecting(false)
      setCurrentScreen("dashboard")
    }
  }

  const handleSelectLocation = (loc: typeof popularLocations[0]) => {
    setLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      name: loc.name
    })
    setCurrentScreen("dashboard")
  }

  const filteredLocations = popularLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentScreen("crop-selection")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="flex-1 text-xl font-bold text-foreground text-center">{t.location}</h2>
        <div className="w-10" />
      </div>

      {/* Detect Location Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-6 h-16 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5"
        onClick={handleDetectLocation}
        disabled={isDetecting}
      >
        <Navigation className={`w-5 h-5 mr-3 text-primary ${isDetecting ? "animate-pulse" : ""}`} />
        <span className="text-foreground">{isDetecting ? "Detecting..." : t.detectLocation}</span>
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={t.enterManually}
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Location List */}
      <div className="flex-1 space-y-3 overflow-auto">
        {filteredLocations.map((loc) => (
          <Card
            key={loc.name}
            className="p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 flex items-center gap-3"
            onClick={() => handleSelectLocation(loc)}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{loc.name}</p>
              <p className="text-sm text-muted-foreground">
                {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
