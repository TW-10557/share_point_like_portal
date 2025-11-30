"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"

export function DashboardHeader() {
  const { user } = useAuth()
  const { language } = useLanguage()

  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? language === "ja"
        ? "おはようございます"
        : "Good morning"
      : currentHour < 18
        ? language === "ja"
          ? "こんにちは"
          : "Good afternoon"
        : language === "ja"
          ? "こんばんは"
          : "Good evening"

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {greeting}, {user?.name.split(" ")[0]}!
      </h1>
      <p className="text-muted-foreground mt-1">
        {t("todayOverview", language)} •{" "}
        {new Date().toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </motion.div>
  )
}
