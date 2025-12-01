"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Bell, Globe, User, LogOut, Settings, Menu, FileText, Calendar, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function Navbar() {
  const router = useRouter()
  const { user, logout, loginWithMicrosoft, isLoading } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { notifications, markAllNotificationsRead, performSearch, searchResults, announcements, events, documents } =
    useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      performSearch(query)
    },
    [performSearch],
  )

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {/* Mobile nav content */}
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CP</span>
              </div>
              <span className="hidden md:block font-semibold text-foreground">Company Portal</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Button
              variant="outline"
              className="relative w-full justify-start text-muted-foreground bg-secondary border-0"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="truncate">{t("search", language)}</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === "en" ? "ja" : "en")}
                className="relative"
              >
                <Globe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded px-1">
                  {language.toUpperCase()}
                </span>
              </Button>
            </motion.div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>{t("notifications", language)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground"
                    onClick={markAllNotificationsRead}
                  >
                    {t("markAllRead", language)}
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                      onClick={() => notification.link && router.push(notification.link)}
                    >
                      <span className={cn("text-sm font-medium", !notification.isRead && "text-primary")}>
                        {language === "ja" ? notification.titleJa : notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {language === "ja" ? notification.messageJa : notification.message}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-4 text-center text-muted-foreground text-sm">{t("noNotifications", language)}</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      <Badge variant="secondary" className="mt-1 w-fit text-xs">
                        {t(
                          `role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` as keyof typeof import(
                            "@/lib/i18n",
                          ).translations.en,
                          language,
                        )}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    {t("profile", language)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings", language)}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout", language)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={loginWithMicrosoft} disabled={isLoading}>
                {isLoading ? t("signingIn", language) : t("login", language)}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder={t("search", language)} value={searchQuery} onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>{t("noResults", language)}</CommandEmpty>
          {searchResults.announcements.length > 0 && (
            <CommandGroup heading={t("announcements", language)}>
              {searchResults.announcements.slice(0, 3).map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    router.push("/announcements")
                    setSearchOpen(false)
                  }}
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  <span>{language === "ja" && item.titleJa ? item.titleJa : item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {searchResults.events.length > 0 && (
            <CommandGroup heading={t("events", language)}>
              {searchResults.events.slice(0, 3).map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    router.push("/events")
                    setSearchOpen(false)
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{language === "ja" && item.titleJa ? item.titleJa : item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {searchResults.documents.length > 0 && (
            <CommandGroup heading={t("documents", language)}>
              {searchResults.documents.slice(0, 3).map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    router.push("/documents")
                    setSearchOpen(false)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!searchQuery && (
            <>
              <CommandGroup heading={t("quickLinks", language)}>
                <CommandItem
                  onSelect={() => {
                    router.push("/announcements")
                    setSearchOpen(false)
                  }}
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  {t("viewAnnouncements", language)}
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push("/events")
                    setSearchOpen(false)
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("checkEvents", language)}
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push("/documents")
                    setSearchOpen(false)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("browseDocuments", language)}
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
