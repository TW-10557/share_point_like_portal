"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Grid, List, Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { EventCard } from "@/components/cards/event-card"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function EventsPage() {
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingEvents = mockEvents.filter((e) => new Date(e.startDate) >= today)
  const pastEvents = mockEvents.filter((e) => new Date(e.startDate) < today)
  const todayEvents = mockEvents.filter((e) => {
    const eventDate = new Date(e.startDate)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() === today.getTime()
  })

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    return mockEvents.filter((e) => {
      const eventDate = new Date(e.startDate)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === date.getTime()
    })
  }

  const monthNames =
    language === "ja"
      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

  const dayNames =
    language === "ja" ? ["日", "月", "火", "水", "木", "金", "土"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("events", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja"
                ? "会社のイベントとミーティングをご確認ください"
                : "Browse company events and meetings"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("addEvent", language)}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t("scheduleEvent", language)}</DialogTitle>
                  <DialogDescription>
                    {language === "ja"
                      ? "新しいイベントの詳細を入力してください"
                      : "Fill in the details for your new event"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>{t("eventTitle", language)}</Label>
                    <Input placeholder={language === "ja" ? "イベント名" : "Event name"} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("startTime", language)}</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("endTime", language)}</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("location", language)}</Label>
                    <Input placeholder={language === "ja" ? "場所" : "Location"} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("recurring", language)}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "ja" ? "繰り返しなし" : "No repeat"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{language === "ja" ? "繰り返しなし" : "No repeat"}</SelectItem>
                        <SelectItem value="daily">{t("daily", language)}</SelectItem>
                        <SelectItem value="weekly">{t("weekly", language)}</SelectItem>
                        <SelectItem value="monthly">{t("monthly", language)}</SelectItem>
                        <SelectItem value="quarterly">{t("quarterly", language)}</SelectItem>
                        <SelectItem value="yearly">{t("yearly", language)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("eventDescription", language)}</Label>
                    <Textarea placeholder={language === "ja" ? "イベントの説明" : "Event description"} rows={3} />
                  </div>
                  <Button className="w-full">{t("create", language)}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Today's Events Banner */}
        {todayEvents.length > 0 && (
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("todayEvents", language)} ({todayEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {todayEvents.map((event) => (
                  <Badge key={event.id} variant="secondary" className="py-2 px-3">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(event.startDate).toLocaleTimeString(language === "ja" ? "ja-JP" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    - {language === "ja" && event.titleJa ? event.titleJa : event.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              {language === "ja" ? "今後のイベント" : "Upcoming"}
              <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{upcomingEvents.length}</span>
            </TabsTrigger>
            <TabsTrigger value="past">{t("pastEvents", language)}</TabsTrigger>
            <TabsTrigger value="calendar">{t("calendar", language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} variant="compact" />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">{t("noResults", language)}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    {language === "ja" ? "今日" : "Today"}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2 min-h-[80px]" />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayEvents = getEventsForDay(day)
                    const isToday =
                      day === today.getDate() &&
                      currentDate.getMonth() === today.getMonth() &&
                      currentDate.getFullYear() === today.getFullYear()

                    return (
                      <div
                        key={day}
                        className={cn(
                          "p-2 min-h-[80px] border rounded-lg transition-colors",
                          isToday && "bg-primary/10 border-primary",
                          dayEvents.length > 0 && "hover:bg-muted/50 cursor-pointer",
                        )}
                      >
                        <div className={cn("text-sm font-medium mb-1", isToday && "text-primary")}>{day}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-[10px] px-1.5 py-0.5 rounded truncate"
                              style={{ backgroundColor: event.color || "#0078D4", color: "white" }}
                            >
                              {language === "ja" && event.titleJa ? event.titleJa : event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
