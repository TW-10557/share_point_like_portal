"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Search } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { AnnouncementCard } from "@/components/cards/announcement-card"
import { CardSkeleton } from "@/components/skeleton/card-skeleton"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Priority, Department } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const priorities: (Priority | "all")[] = ["all", "urgent", "important", "event", "deadline", "ceo", "general"]
const departments: Department[] = ["all", "engineering", "marketing", "sales", "hr", "finance", "operations"]

export default function AnnouncementsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState<Department>("all")
  const [isLoading] = useState(false)

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = priorityFilter === "all" || announcement.priority === priorityFilter

    const matchesDepartment =
      departmentFilter === "all" || announcement.department === "all" || announcement.department === departmentFilter

    const matchesUserDepartment =
      announcement.department === "all" ||
      announcement.department === user?.department ||
      user?.role === "admin" ||
      user?.role === "ceo"

    return matchesSearch && matchesPriority && matchesDepartment && matchesUserDepartment
  })

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("announcements", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja"
                ? "会社からの最新のお知らせをご確認ください"
                : "Stay updated with the latest company announcements"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | "all")}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "all"
                      ? language === "ja"
                        ? "すべて"
                        : "All"
                      : t(p as keyof typeof import("@/lib/i18n").translations.en, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value as Department)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all"
                      ? t("allDepartments", language)
                      : t(d as keyof typeof import("@/lib/i18n").translations.en, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnnouncementCard announcement={announcement} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noResults", language)}</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setPriorityFilter("all")
                setDepartmentFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}
