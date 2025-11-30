"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Grid, List } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { EventCard } from "@/components/cards/event-card"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const today = new Date()
  const upcomingEvents = mockEvents.filter((e) => new Date(e.startDate) >= today)
  const pastEvents = mockEvents.filter((e) => new Date(e.startDate) < today)

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
          </div>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              {language === "ja" ? "今後のイベント" : "Upcoming"}
              <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{upcomingEvents.length}</span>
            </TabsTrigger>
            <TabsTrigger value="past">{language === "ja" ? "過去のイベント" : "Past Events"}</TabsTrigger>
            <TabsTrigger value="calendar">{language === "ja" ? "カレンダー" : "Calendar"}</TabsTrigger>
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
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  {language === "ja" ? "カレンダービューは近日公開予定" : "Calendar view coming soon"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
