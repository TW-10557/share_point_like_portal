"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Calendar, Users, HelpCircle, Settings, BookOpen } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"

const quickLinks = [
  { icon: FileText, href: "/announcements", labelEn: "Announcements", labelJa: "お知らせ" },
  { icon: Calendar, href: "/events", labelEn: "Events", labelJa: "イベント" },
  { icon: Users, href: "/departments", labelEn: "Directory", labelJa: "社員名簿" },
  { icon: HelpCircle, href: "/help", labelEn: "Help Desk", labelJa: "ヘルプデスク" },
  { icon: BookOpen, href: "/docs", labelEn: "Documents", labelJa: "ドキュメント" },
  { icon: Settings, href: "/settings", labelEn: "Settings", labelJa: "設定" },
]

export function QuickLinks() {
  const { language } = useLanguage()

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {quickLinks.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={link.href}>
            <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">
                  {language === "ja" ? link.labelJa : link.labelEn}
                </span>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
