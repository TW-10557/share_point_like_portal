"use client"

import { motion } from "framer-motion"
import { Calendar, User, Sparkles, Edit } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AnnouncementCardProps {
  announcement: Announcement
  variant?: "default" | "compact" | "featured"
}

const priorityColors: Record<string, string> = {
  urgent: "bg-urgent text-white",
  important: "bg-important text-white",
  event: "bg-event text-white",
  deadline: "bg-destructive text-white",
  ceo: "bg-ceo text-white",
  general: "bg-secondary text-secondary-foreground",
}

export function AnnouncementCard({ announcement, variant = "default" }: AnnouncementCardProps) {
  const { language } = useLanguage()

  const title = language === "ja" && announcement.titleJa ? announcement.titleJa : announcement.title
  const content = language === "ja" && announcement.contentJa ? announcement.contentJa : announcement.content
  const priorityLabel = t(announcement.priority as keyof typeof import("@/lib/i18n").translations.en, language)

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  if (variant === "compact") {
    return (
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge className={cn("shrink-0", priorityColors[announcement.priority])}>{priorityLabel}</Badge>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (variant === "featured") {
    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-ceo">
          {announcement.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={announcement.imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge className={cn("absolute top-3 left-3", priorityColors[announcement.priority])}>
                {priorityLabel}
              </Badge>
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {announcement.isAiGenerated && <Sparkles className="h-4 w-4 text-accent" />}
              {announcement.aiOverridden && <Edit className="h-4 w-4 text-muted-foreground" />}
            </div>
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm line-clamp-3">{content}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/ceo-avatar.png" />
                <AvatarFallback>CEO</AvatarFallback>
              </Avatar>
              <span>{announcement.author}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={cn(priorityColors[announcement.priority])}>{priorityLabel}</Badge>
            <div className="flex items-center gap-1">
              {announcement.isAiGenerated && <Sparkles className="h-4 w-4 text-accent" title="AI Generated" />}
              {announcement.aiOverridden && <Edit className="h-4 w-4 text-muted-foreground" title="AI Overridden" />}
            </div>
          </div>
          <h3 className="font-semibold text-base leading-tight mt-2">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-2">{content}</p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{announcement.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
