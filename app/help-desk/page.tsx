"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, Plus, Search, Clock, CheckCircle, AlertCircle, XCircle, Send, Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockHelpTickets } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { HelpTicket } from "@/lib/types"

const statusConfig = {
  open: { icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  "in-progress": { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  resolved: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  closed: { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
}

const priorityConfig = {
  low: { color: "bg-slate-500" },
  medium: { color: "bg-blue-500" },
  high: { color: "bg-orange-500" },
  critical: { color: "bg-red-500" },
}

export default function HelpDeskPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [tickets, setTickets] = useState<HelpTicket[]>(mockHelpTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "IT Support",
    priority: "medium" as HelpTicket["priority"],
  })
  const [replyContent, setReplyContent] = useState("")

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const ticket: HelpTicket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      category: newTicket.category,
      createdBy: user?.name || "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }

    setTickets([ticket, ...tickets])
    setNewTicket({ title: "", description: "", category: "IT Support", priority: "medium" })
    setIsCreateOpen(false)
    setIsSubmitting(false)
  }

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedTicket) return

    const updatedTicket = {
      ...selectedTicket,
      responses: [
        ...(selectedTicket.responses || []),
        {
          id: `resp-${Date.now()}`,
          content: replyContent,
          author: user?.name || "User",
          createdAt: new Date().toISOString(),
          isStaff: false,
        },
      ],
      updatedAt: new Date().toISOString(),
    }

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)))
    setSelectedTicket(updatedTicket)
    setReplyContent("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("helpDesk", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja" ? "サポートチケットを作成・管理" : "Create and manage support tickets"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "ja" ? "チケットを検索..." : "Search tickets..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("createTicket", language)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createTicket", language)}</DialogTitle>
                  <DialogDescription>
                    {language === "ja"
                      ? "サポートリクエストの詳細を入力してください"
                      : "Fill in the details for your support request"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>{t("ticketTitle", language)}</Label>
                    <Input
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder={language === "ja" ? "問題の概要" : "Brief summary of the issue"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("ticketCategory", language)}</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT Support">IT Support</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("ticketPriority", language)}</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value) =>
                          setNewTicket({ ...newTicket, priority: value as HelpTicket["priority"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t("low", language)}</SelectItem>
                          <SelectItem value="medium">{t("medium", language)}</SelectItem>
                          <SelectItem value="high">{t("high", language)}</SelectItem>
                          <SelectItem value="critical">{t("critical", language)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ticketDescription", language)}</Label>
                    <Textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder={language === "ja" ? "問題の詳細を説明してください" : "Describe your issue in detail"}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleCreateTicket}
                    disabled={isSubmitting || !newTicket.title || !newTicket.description}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === "ja" ? "送信中..." : "Submitting..."}
                      </>
                    ) : (
                      t("submit", language)
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  {t("allTickets", language)}
                </TabsTrigger>
                <TabsTrigger value="my" className="flex-1">
                  {t("myTickets", language)}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-3">
                {filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon
                  return (
                    <Card
                      key={ticket.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedTicket?.id === ticket.id && "border-primary",
                      )}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", statusConfig[ticket.status].bg)}>
                            <StatusIcon className={cn("h-4 w-4", statusConfig[ticket.status].color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{ticket.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{ticket.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className={cn("text-white text-[10px]", priorityConfig[ticket.priority].color)}
                              >
                                {t(ticket.priority, language)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
              <TabsContent value="my" className="mt-4">
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    {language === "ja" ? "あなたのチケットがここに表示されます" : "Your tickets will appear here"}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Detail */}
          <Card className="lg:col-span-2 flex flex-col h-[600px]">
            {selectedTicket ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedTicket.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {language === "ja" ? "作成者" : "Created by"} {selectedTicket.createdBy} •{" "}
                        {formatDate(selectedTicket.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn("text-white", priorityConfig[selectedTicket.priority].color)}
                      >
                        {t(selectedTicket.priority, language)}
                      </Badge>
                      <Badge variant="outline" className={statusConfig[selectedTicket.status].color}>
                        {t(selectedTicket.status === "in-progress" ? "inProgress" : selectedTicket.status, language)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Original Description */}
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm">{selectedTicket.description}</p>
                    </div>

                    {/* Responses */}
                    {selectedTicket.responses?.map((response) => (
                      <div
                        key={response.id}
                        className={cn(
                          "p-4 rounded-lg",
                          response.isStaff ? "bg-primary/5 border border-primary/20" : "bg-muted",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{response.author}</span>
                          {response.isStaff && (
                            <Badge variant="secondary" className="text-[10px]">
                              Staff
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{formatDate(response.createdAt)}</span>
                        </div>
                        <p className="text-sm">{response.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleReply()
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={language === "ja" ? "返信を入力..." : "Type your reply..."}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!replyContent.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{language === "ja" ? "チケットを選択" : "Select a ticket"}</p>
                  <p className="text-sm">
                    {language === "ja"
                      ? "左側からチケットを選択して詳細を表示"
                      : "Choose a ticket from the left to view details"}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  )
}
