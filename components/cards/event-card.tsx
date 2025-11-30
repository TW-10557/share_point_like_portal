"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Repeat } from "lucide-react"
import type { Event } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: Event
  variant?: "default" | "compact"
}

const priorityColors: Record<string, string> = {
  urgent: "bg-urgent text-white",
  important: "bg-important text-white",
  event: "bg-event text-white",
  deadline: "bg-destructive text-white",
  ceo: "bg-ceo text-white",
  general: "bg-secondary text-secondary-foreground",
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const { language } = useLanguage()

  const title = language === "ja" && event.titleJa ? event.titleJa : event.title
  const description = language === "ja" && event.descriptionJa ? event.descriptionJa : event.description

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)

  const formattedDate = startDate.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
  })

  const formattedTime = `${startDate.toLocaleTimeString(language === "ja" ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString(language === "ja" ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit" })}`

  if (variant === "compact") {
    return (
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
                <span className="text-xs text-primary font-medium uppercase">
                  {startDate.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", { month: "short" })}
                </span>
                <span className="text-2xl font-bold text-primary">{startDate.getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formattedTime}</span>
                </div>
              </div>
              {event.isRecurring && <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={cn(priorityColors[event.priority])}>
              {t(event.priority as keyof typeof import("@/lib/i18n").translations.en, language)}
            </Badge>
            {event.isRecurring && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="h-3 w-3" />
                {event.recurrencePattern}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base leading-tight mt-2">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
