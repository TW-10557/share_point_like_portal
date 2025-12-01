"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Megaphone,
  Calendar,
  Building2,
  Shield,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Bot,
  Bell,
  Users,
  FileText,
  HelpCircle,
  Settings,
  MessageSquare,
  Hash,
  Lock,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { mockTeams } from "@/lib/mock-data"

const navItems = [
  { href: "/", icon: Home, labelKey: "home" as const },
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/announcements", icon: Megaphone, labelKey: "announcements" as const },
  { href: "/events", icon: Calendar, labelKey: "events" as const },
  { href: "/teams", icon: Users, labelKey: "teams" as const },
  { href: "/documents", icon: FileText, labelKey: "documents" as const },
  { href: "/help-desk", icon: HelpCircle, labelKey: "helpDesk" as const },
  { href: "/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/notifications", icon: Bell, labelKey: "notifications" as const },
]

const adminItems = [
  { href: "/admin", icon: Shield, labelKey: "admin" as const },
  { href: "/admin/ai", icon: Bot, labelKey: "aiAutomation" as const },
]

const bottomItems = [{ href: "/settings", icon: Settings, labelKey: "settings" as const }]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [teamsOpen, setTeamsOpen] = useState(false)
  const pathname = usePathname()
  const { hasRole } = useAuth()
  const { language } = useLanguage()
  const isAdmin = hasRole(["admin", "ceo"])

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 280 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const label = t(item.labelKey, language)

              if (item.labelKey === "teams" && !isCollapsed) {
                return (
                  <Collapsible key={item.href} open={teamsOpen} onOpenChange={setTeamsOpen}>
                    <CollapsibleTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                          pathname.startsWith("/teams")
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", teamsOpen && "rotate-180")} />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      <Link href="/teams">
                        <div className="flex items-center gap-2 px-3 py-2 ml-6 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent/30">
                          <MessageSquare className="h-4 w-4" />
                          <span>{t("allTeams", language)}</span>
                        </div>
                      </Link>
                      {mockTeams.slice(0, 4).map((team) => (
                        <div key={team.id} className="ml-6">
                          <div className="px-3 py-1.5 text-xs font-medium text-sidebar-foreground/50 uppercase">
                            {team.name}
                          </div>
                          {team.channels.slice(0, 3).map((channel) => (
                            <Link key={channel.id} href={`/teams/${team.id}/${channel.id}`}>
                              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent/30">
                                {channel.isPrivate ? (
                                  <Lock className="h-3.5 w-3.5" />
                                ) : (
                                  <Hash className="h-3.5 w-3.5" />
                                )}
                                <span className="truncate">{channel.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              }

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
                </Tooltip>
              )
            })}
          </nav>

          {isAdmin && (
            <>
              <div className="my-4 mx-3 border-t border-sidebar-border" />
              <div className={cn("px-3 mb-2", isCollapsed && "hidden")}>
                <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {t("admin", language)}
                </span>
              </div>
              <nav className="space-y-1 px-3">
                {adminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  const label = t(item.labelKey, language)

                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <AnimatePresence>
                              {!isCollapsed && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                >
                                  {label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                  )
                })}
              </nav>
            </>
          )}
        </div>

        {/* Bottom items */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            const label = t(item.labelKey, language)

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
              </Tooltip>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
