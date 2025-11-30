"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnnouncementCard } from "@/components/cards/announcement-card"
import { EventCard } from "@/components/cards/event-card"
import { StatsCard } from "@/components/cards/stats-card"
import { CardSkeleton } from "@/components/skeleton/card-skeleton"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockAnnouncements, mockEvents } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, FileText, Calendar, TrendingUp, Activity } from "lucide-react"

export default function DashboardPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [isLoading] = useState(false)

  const filteredAnnouncements = mockAnnouncements.filter(
    (a) => a.department === "all" || a.department === user?.department,
  )

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="Total Views" value="12,847" change="+12.5%" changeType="positive" icon={BarChart3} />
          <StatsCard title="Active Users" value="1,234" change="+8.2%" changeType="positive" icon={Users} />
          <StatsCard title="New Posts" value="48" change="+15" changeType="positive" icon={FileText} />
          <StatsCard title="Events" value="12" change="This month" changeType="neutral" icon={Calendar} />
          <StatsCard title="Engagement" value="89%" change="+3.1%" changeType="positive" icon={TrendingUp} />
          <StatsCard title="Uptime" value="99.9%" change="Last 30 days" changeType="neutral" icon={Activity} />
        </div>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("recentAnnouncements", language)}
              <Badge variant="secondary">{filteredAnnouncements.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t("allDepartments", language)}</TabsTrigger>
                <TabsTrigger value="urgent">{t("urgent", language)}</TabsTrigger>
                <TabsTrigger value="important">{t("important", language)}</TabsTrigger>
                <TabsTrigger value="events">{t("event", language)}</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAnnouncements.map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="urgent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAnnouncements
                    .filter((a) => a.priority === "urgent")
                    .map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="important">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAnnouncements
                    .filter((a) => a.priority === "important")
                    .map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}
