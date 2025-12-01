"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Clock, MapPin } from "lucide-react"

export function DashboardHeader() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentHour = currentTime.getHours()

  // Dynamic greeting based on time
  const greeting =
    currentHour >= 5 && currentHour < 12
      ? t("goodMorning", language)
      : currentHour >= 12 && currentHour < 17
        ? t("goodAfternoon", language)
        : t("goodEvening", language)

  // Format date
  const formattedDate = currentTime.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Format time
  const formattedTime = currentTime.toLocaleTimeString(language === "ja" ? "ja-JP" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Get user's first name for personalized greeting
  const firstName = user?.name.split(" ")[0] || (language === "ja" ? "ユーザー" : "User")

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {greeting}, {firstName}!
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
        <p className="text-muted-foreground flex items-center gap-2">
          <span>{t("todayOverview", language)}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm">{formattedTime}</span>
          </div>
          {user?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{user.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
