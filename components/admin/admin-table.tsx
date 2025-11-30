"use client"
import { motion } from "framer-motion"
import { Edit, Trash2, Check, X, MoreHorizontal, Sparkles, Eye } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AdminTableProps {
  announcements: Announcement[]
  onEdit: (announcement: Announcement) => void
  onDelete: (id: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const statusColors = {
  pending: "bg-important text-white",
  approved: "bg-success text-white",
  rejected: "bg-destructive text-white",
}

const priorityColors: Record<string, string> = {
  urgent: "bg-urgent text-white",
  important: "bg-important text-white",
  event: "bg-event text-white",
  deadline: "bg-destructive text-white",
  ceo: "bg-ceo text-white",
  general: "bg-secondary text-secondary-foreground",
}

export function AdminTable({ announcements, onEdit, onDelete, onApprove, onReject }: AdminTableProps) {
  const { language } = useLanguage()

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement, index) => (
            <motion.tr
              key={announcement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[250px]">
                    {language === "ja" && announcement.titleJa ? announcement.titleJa : announcement.title}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn(priorityColors[announcement.priority])}>
                  {t(announcement.priority as keyof typeof import("@/lib/i18n").translations.en, language)}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">
                {announcement.department === "all"
                  ? t("allDepartments", language)
                  : t(announcement.department as keyof typeof import("@/lib/i18n").translations.en, language)}
              </TableCell>
              <TableCell>
                <Badge className={cn(statusColors[announcement.status])}>
                  {t(announcement.status as keyof typeof import("@/lib/i18n").translations.en, language)}
                </Badge>
              </TableCell>
              <TableCell>
                {announcement.isAiGenerated && (
                  <Sparkles
                    className={cn("h-4 w-4", announcement.aiOverridden ? "text-muted-foreground" : "text-accent")}
                  />
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(announcement.createdAt).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(announcement)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    {announcement.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onApprove(announcement.id)} className="text-success">
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(announcement.id)} className="text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(announcement.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
