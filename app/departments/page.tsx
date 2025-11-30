"use client"

import { motion } from "framer-motion"
import { Building2, Users, FileText, TrendingUp } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { AnnouncementCard } from "@/components/cards/announcement-card"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Department } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const departmentInfo: Record<
  Exclude<Department, "all">,
  { icon: typeof Building2; members: number; projects: number }
> = {
  engineering: { icon: Building2, members: 45, projects: 12 },
  marketing: { icon: TrendingUp, members: 22, projects: 8 },
  sales: { icon: Users, members: 38, projects: 15 },
  hr: { icon: Users, members: 12, projects: 4 },
  finance: { icon: FileText, members: 18, projects: 6 },
  operations: { icon: Building2, members: 21, projects: 9 },
}

const departments: Exclude<Department, "all">[] = ["engineering", "marketing", "sales", "hr", "finance", "operations"]

export default function DepartmentsPage() {
  const { language } = useLanguage()

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">{t("departments", language)}</h1>
          <p className="text-muted-foreground">
            {language === "ja" ? "部署別のニュースと情報をご覧ください" : "Browse news and information by department"}
          </p>
        </div>

        {/* Department Cards Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.map((dept, index) => {
            const info = departmentInfo[dept]
            const Icon = info.icon
            const deptAnnouncements = mockAnnouncements.filter((a) => a.department === dept)

            return (
              <motion.div
                key={dept}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">
                      {t(dept as keyof typeof import("@/lib/i18n").translations.en, language)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {info.members} {language === "ja" ? "人" : "members"}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {deptAnnouncements.length} {language === "ja" ? "件" : "posts"}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Department Tabs */}
        <Tabs defaultValue="engineering">
          <TabsList className="flex-wrap h-auto gap-1">
            {departments.map((dept) => (
              <TabsTrigger key={dept} value={dept} className="text-xs">
                {t(dept as keyof typeof import("@/lib/i18n").translations.en, language)}
              </TabsTrigger>
            ))}
          </TabsList>

          {departments.map((dept) => {
            const deptAnnouncements = mockAnnouncements.filter((a) => a.department === dept)

            return (
              <TabsContent key={dept} value={dept} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {t(dept as keyof typeof import("@/lib/i18n").translations.en, language)}
                      <Badge variant="secondary">{deptAnnouncements.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deptAnnouncements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deptAnnouncements.map((announcement) => (
                          <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">{t("noResults", language)}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
