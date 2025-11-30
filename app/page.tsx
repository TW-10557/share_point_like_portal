"use client"

import { motion } from "framer-motion"
import { Megaphone, Calendar, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickLinks } from "@/components/dashboard/quick-links"
import { AnnouncementCard } from "@/components/cards/announcement-card"
import { EventCard } from "@/components/cards/event-card"
import { StatsCard } from "@/components/cards/stats-card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockAnnouncements, mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { language } = useLanguage()
  const { user } = useAuth()

  // Filter announcements based on user department
  const filteredAnnouncements = mockAnnouncements.filter(
    (a) => a.department === "all" || a.department === user?.department,
  )

  const ceoAnnouncements = filteredAnnouncements.filter((a) => a.priority === "ceo")
  const urgentAnnouncements = filteredAnnouncements.filter((a) => a.priority === "urgent")
  const upcomingEvents = mockEvents.slice(0, 3)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <DashboardHeader />

        {/* Quick Links */}
        <motion.section variants={itemVariants}>
          <QuickLinks />
        </motion.section>

        {/* Stats Overview */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title={t("announcements", language)}
            value={filteredAnnouncements.length}
            change="+3 this week"
            changeType="positive"
            icon={Megaphone}
          />
          <StatsCard
            title={t("upcomingEvents", language)}
            value={mockEvents.length}
            change="2 this month"
            changeType="neutral"
            icon={Calendar}
          />
          <StatsCard
            title="Active Projects"
            value={12}
            change="+2 from last month"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatsCard title="Team Members" value={156} change="+5 new hires" changeType="positive" icon={Users} />
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CEO Updates - Featured */}
          <motion.section variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t("ceoUpdates", language)}</CardTitle>
                <Link href="/announcements?priority=ceo">
                  <Button variant="ghost" size="sm" className="gap-1">
                    {t("viewAll", language)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {ceoAnnouncements.length > 0 ? (
                  <AnnouncementCard announcement={ceoAnnouncements[0]} variant="featured" />
                ) : (
                  <p className="text-muted-foreground text-center py-8">{t("noResults", language)}</p>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Urgent News */}
          <motion.section variants={itemVariants}>
            <Card className="border-l-4 border-l-urgent">
              <CardHeader>
                <CardTitle className="text-lg text-urgent">{t("urgentNews", language)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {urgentAnnouncements.length > 0 ? (
                  urgentAnnouncements
                    .slice(0, 3)
                    .map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} variant="compact" />
                    ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No urgent announcements</p>
                )}
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Events & Recent Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <motion.section variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t("upcomingEvents", language)}</CardTitle>
                <Link href="/events">
                  <Button variant="ghost" size="sm" className="gap-1">
                    {t("viewAll", language)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="compact" />
                ))}
              </CardContent>
            </Card>
          </motion.section>

          {/* Recent Announcements */}
          <motion.section variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t("recentAnnouncements", language)}</CardTitle>
                <Link href="/announcements">
                  <Button variant="ghost" size="sm" className="gap-1">
                    {t("viewAll", language)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredAnnouncements.slice(0, 4).map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} variant="compact" />
                ))}
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Department News */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("departmentNews", language)}</CardTitle>
              <Link href="/departments">
                <Button variant="ghost" size="sm" className="gap-1">
                  {t("viewAll", language)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnnouncements
                  .filter((a) => a.department !== "all")
                  .slice(0, 3)
                  .map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </MainLayout>
  )
}
