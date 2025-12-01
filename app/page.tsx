"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Megaphone, Calendar, Users, ArrowRight, FileText, HelpCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickLinks } from "@/components/dashboard/quick-links"
import { AnnouncementCard } from "@/components/cards/announcement-card"
import { EventCard } from "@/components/cards/event-card"
import { StatsCard } from "@/components/cards/stats-card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { mockAnnouncements, mockEvents, mockNotifications, mockDocuments, mockTeams } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const {
    announcements,
    setAnnouncements,
    events,
    setEvents,
    notifications,
    setNotifications,
    documents,
    setDocuments,
    teams,
    setTeams,
  } = useAppStore()

  // Initialize data on mount
  useEffect(() => {
    if (announcements.length === 0) {
      setAnnouncements(mockAnnouncements)
    }
    if (events.length === 0) {
      setEvents(mockEvents)
    }
    if (notifications.length === 0) {
      setNotifications(mockNotifications)
    }
    if (documents.length === 0) {
      setDocuments(mockDocuments)
    }
    if (teams.length === 0) {
      setTeams(mockTeams)
    }
  }, [
    announcements.length,
    events.length,
    notifications.length,
    documents.length,
    teams.length,
    setAnnouncements,
    setEvents,
    setNotifications,
    setDocuments,
    setTeams,
  ])

  // Filter announcements based on user department
  const filteredAnnouncements = announcements.filter(
    (a) => a.status === "approved" && (a.department === "all" || a.department === user?.department),
  )

  const ceoAnnouncements = filteredAnnouncements.filter((a) => a.priority === "ceo")
  const urgentAnnouncements = filteredAnnouncements.filter((a) => a.priority === "urgent")

  const today = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= today).slice(0, 3)

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
            change={`+${
              filteredAnnouncements.filter((a) => {
                const created = new Date(a.createdAt)
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                return created > weekAgo
              }).length
            } ${language === "ja" ? "今週" : "this week"}`}
            changeType="positive"
            icon={Megaphone}
          />
          <StatsCard
            title={t("upcomingEvents", language)}
            value={upcomingEvents.length}
            change={`${
              events.filter((e) => {
                const eventDate = new Date(e.startDate)
                const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                return eventDate <= monthEnd && eventDate >= today
              }).length
            } ${language === "ja" ? "今月" : "this month"}`}
            changeType="neutral"
            icon={Calendar}
          />
          <StatsCard
            title={language === "ja" ? "ドキュメント" : "Documents"}
            value={documents.reduce((acc, d) => acc + (d.children?.length || 0) + 1, 0)}
            change={language === "ja" ? "5フォルダ" : "5 folders"}
            changeType="neutral"
            icon={FileText}
          />
          <StatsCard
            title={language === "ja" ? "チームメンバー" : "Team Members"}
            value={teams.reduce((acc, t) => acc + t.memberCount, 0)}
            change={`${teams.length} ${language === "ja" ? "チーム" : "teams"}`}
            changeType="positive"
            icon={Users}
          />
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
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">{t("urgentNews", language)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {urgentAnnouncements.length > 0 ? (
                  urgentAnnouncements
                    .slice(0, 3)
                    .map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} variant="compact" />
                    ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {language === "ja" ? "緊急のお知らせはありません" : "No urgent announcements"}
                  </p>
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
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => <EventCard key={event.id} event={event} variant="compact" />)
                ) : (
                  <p className="text-muted-foreground text-center py-4">{t("noResults", language)}</p>
                )}
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

        {/* Quick Access Cards */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/help-desk">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <HelpCircle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("helpDesk", language)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ja" ? "サポートを受ける" : "Get support"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/documents">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("documents", language)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ja" ? "ファイルを閲覧" : "Browse files"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/teams">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("teams", language)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ja" ? "チャットを開始" : "Start chatting"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.section>

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
