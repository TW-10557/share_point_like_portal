"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, FileText, Calendar, Users, Settings } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { AdminTable } from "@/components/admin/admin-table"
import { AnnouncementForm } from "@/components/admin/announcement-form"
import { StatsCard } from "@/components/cards/stats-card"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Announcement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function AdminPage() {
  const { language } = useLanguage()
  const { hasRole } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Check admin access
  if (!hasRole(["admin", "ceo"])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">{language === "ja" ? "アクセス権限がありません" : "Access denied"}</p>
        </div>
      </MainLayout>
    )
  }

  const handleSubmit = (data: Partial<Announcement>) => {
    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingAnnouncement.id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a)),
      )
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: data.title || "",
        titleJa: data.titleJa,
        content: data.content || "",
        contentJa: data.contentJa,
        priority: data.priority || "general",
        department: data.department || "all",
        status: "pending",
        author: "Admin",
        authorId: "admin-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: data.imageUrl,
        isAiGenerated: data.isAiGenerated || false,
        aiOverridden: false,
      }
      setAnnouncements((prev) => [newAnnouncement, ...prev])
    }
    setIsFormOpen(false)
    setEditingAnnouncement(null)
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  const handleApprove = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)))
  }

  const handleReject = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)))
  }

  const pendingCount = announcements.filter((a) => a.status === "pending").length
  const approvedCount = announcements.filter((a) => a.status === "approved").length
  const aiGeneratedCount = announcements.filter((a) => a.isAiGenerated).length

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("admin", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja" ? "お知らせとイベントを管理" : "Manage announcements and events"}
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t("createAnnouncement", language)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <AnnouncementForm
                announcement={editingAnnouncement || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingAnnouncement(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title={language === "ja" ? "全お知らせ" : "Total Announcements"}
            value={announcements.length}
            icon={FileText}
          />
          <StatsCard
            title={t("pending", language)}
            value={pendingCount}
            changeType={pendingCount > 0 ? "negative" : "neutral"}
            icon={Calendar}
          />
          <StatsCard title={t("approved", language)} value={approvedCount} icon={Users} />
          <StatsCard title={language === "ja" ? "AI生成" : "AI Generated"} value={aiGeneratedCount} icon={Settings} />
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{language === "ja" ? "すべて" : "All"}</TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              {t("pending", language)}
              {pendingCount > 0 && (
                <span className="bg-important text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">{t("approved", language)}</TabsTrigger>
            <TabsTrigger value="rejected">{t("rejected", language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <AdminTable
              announcements={announcements}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <AdminTable
              announcements={announcements.filter((a) => a.status === "pending")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <AdminTable
              announcements={announcements.filter((a) => a.status === "approved")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <AdminTable
              announcements={announcements.filter((a) => a.status === "rejected")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
