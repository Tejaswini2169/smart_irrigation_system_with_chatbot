"use client"

import { useApp, useTranslations } from "@/lib/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateWeatherForecast, getChatbotResponse } from "@/lib/weather-data"
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Home, CalendarDays, MessageSquare, Settings, Bot, User } from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatbotScreen() {
  const { language, setCurrentScreen, cropType, soilType, location } = useApp()
  const t = useTranslations()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const weather = useMemo(() => generateWeatherForecast(), [])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessages = {
        en: "Hello! I'm your Smart Irrigation assistant. Ask me about irrigation, weather, crop care, or which crops are best for your land!",
        kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಹಾಯಕ. ನೀರಾವರಿ, ಹವಾಮಾನ, ಬೆಳೆ ಅಥವಾ ನಿಮ್ಮ ಭೂಮಿಗೆ ಯಾವ ಬೆಳೆ ಉತ್ತಮ ಎಂದು ಕೇಳಿ!",
        hi: "नमस्ते! मैं आपका स्मार्ट सिंचाई सहायक हूं। सिंचाई, मौसम, फसल या अपनी जमीन के लिए कौन सी फसल सबसे अच्छी है पूछें!",
        te: "నమస్కారం! నేను మీ స్మార్ట్ నీటిపారుదల సహాయకుడిని. నీటిపారుదల, వాతావరణం, పంట లేదా మీ భూమికి ఏ పంట మంచిది అని అడగండి!"
      }
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: welcomeMessages[language]
      }])
    }
  }, [language, messages.length])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      const langMap = {
        en: "en-US",
        kn: "kn-IN",
        hi: "hi-IN",
        te: "te-IN"
      }
      recognitionRef.current.lang = langMap[language]

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.abort()
      setIsListening(false)
    } else {
      const langMap = {
        en: "en-US",
        kn: "kn-IN",
        hi: "hi-IN",
        te: "te-IN"
      }
      recognitionRef.current.lang = langMap[language]
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    
    const langMap = {
      en: "en-US",
      kn: "kn-IN",
      hi: "hi-IN",
      te: "te-IN"
    }
    utterance.lang = langMap[language]
    utterance.rate = 0.9

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Get chatbot response
    setTimeout(() => {
      const response = getChatbotResponse(
        input.trim(), 
        weather, 
        language, 
        cropType, 
        soilType, 
        location,
        t
      )
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      }
      setMessages((prev) => [...prev, assistantMessage])
      
      // Speak the response
      speakText(response)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentScreen("dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{t.chatbot}</h1>
            <p className="text-xs text-muted-foreground">{t.voiceAssistant}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <Card
              className={cn(
                "p-3 max-w-[80%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              )}
            >
              <p className={cn(
                "text-sm",
                message.role === "user" ? "text-primary-foreground" : "text-foreground"
              )}>
                {message.content}
              </p>
            </Card>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isSpeaking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Speaking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleListening}
            className={cn(
              "flex-shrink-0",
              isListening && "bg-destructive hover:bg-destructive/90"
            )}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Input
            placeholder={isListening ? t.listening : t.askQuestion}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
            disabled={isListening}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isListening}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        {isListening && (
          <p className="text-center text-sm text-muted-foreground mt-2 animate-pulse">
            {t.listening}
          </p>
        )}
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
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setCurrentScreen("forecast")}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs">{t.forecast}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-primary"
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
