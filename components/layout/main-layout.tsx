"use client"

import type { ReactNode } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { BannerNotification } from "@/components/notifications/banner-notification"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-0 md:pl-[280px] transition-all duration-200">
        <BannerNotification />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
      <ChatWidget />
    </div>
  )
}
