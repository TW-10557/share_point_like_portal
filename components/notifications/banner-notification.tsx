"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Info, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BannerNotification() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentBanner, setCurrentBanner] = useState<{
    type: "urgent" | "info" | "success"
    message: string
    messageJa: string
  } | null>(null)
  const { language } = useLanguage()
  const { announcements } = useAppStore()

  // Find urgent announcements to display
  useEffect(() => {
    const urgentAnnouncement = announcements.find((a) => a.priority === "urgent" && a.status === "approved")

    if (urgentAnnouncement) {
      setCurrentBanner({
        type: "urgent",
        message: urgentAnnouncement.title,
        messageJa: urgentAnnouncement.titleJa || urgentAnnouncement.title,
      })
    } else {
      // Default maintenance banner
      setCurrentBanner({
        type: "info",
        message: "System Maintenance: This Saturday 2 AM - 6 AM JST",
        messageJa: "システムメンテナンス: 今週土曜日 午前2時〜6時（JST）",
      })
    }
  }, [announcements])

  if (!isVisible || !currentBanner) return null

  const bannerStyles = {
    urgent: {
      bg: "bg-destructive",
      icon: AlertTriangle,
    },
    info: {
      bg: "bg-primary",
      icon: Info,
    },
    success: {
      bg: "bg-green-600",
      icon: CheckCircle,
    },
  }

  const { bg, icon: Icon } = bannerStyles[currentBanner.type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={cn(bg, "text-white")}
      >
        <div className="flex items-center justify-between px-4 py-2 md:px-6">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{language === "ja" ? currentBanner.messageJa : currentBanner.message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
