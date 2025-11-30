"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Check, Trash2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockNotifications } from "@/lib/mock-data"
import type { Notification } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {t("notifications", language)}
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
            </h1>
            <p className="text-muted-foreground">
              {language === "ja" ? "最新の通知をご確認ください" : "Stay updated with your latest notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              {t("markAllRead", language)}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === "ja" ? "すべての通知" : "All Notifications"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                      !notification.isRead && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full shrink-0",
                        notification.type === "announcement" && "bg-primary/10 text-primary",
                        notification.type === "event" && "bg-event/10 text-event",
                        notification.type === "reminder" && "bg-important/10 text-important",
                        notification.type === "system" && "bg-muted text-muted-foreground",
                      )}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={cn("font-medium text-sm", !notification.isRead && "text-primary")}>
                          {language === "ja" ? notification.titleJa : notification.title}
                        </h4>
                        {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "ja" ? notification.messageJa : notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">{t("noNotifications", language)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}
