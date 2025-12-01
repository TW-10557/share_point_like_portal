"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Hash, Lock, MessageSquare, Search, Plus, Send } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockTeams, mockTeamsMessages } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { TeamsChannel, TeamsMessage } from "@/lib/types"

export default function TeamsPage() {
  const { language } = useLanguage()
  const [selectedChannel, setSelectedChannel] = useState<TeamsChannel | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<TeamsMessage[]>(mockTeamsMessages)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTeams = mockTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.channels.some((ch) => ch.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const channelMessages = selectedChannel ? messages.filter((m) => m.channelId === selectedChannel.id) : []

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChannel) return

    const newMessage: TeamsMessage = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      from: "You",
      fromId: "current-user",
      timestamp: new Date().toISOString(),
      channelName: selectedChannel.name,
      channelId: selectedChannel.id,
      teamId: selectedChannel.teamId,
    }

    setMessages([newMessage, ...messages])
    setMessageInput("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return language === "ja" ? "たった今" : "Just now"
    if (diffMins < 60) return `${diffMins}${language === "ja" ? "分前" : "m ago"}`
    if (diffHours < 24) return `${diffHours}${language === "ja" ? "時間前" : "h ago"}`
    return date.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US")
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t("teams", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja" ? "チームとチャンネルでコミュニケーション" : "Communicate with teams and channels"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "ja" ? "チームを検索..." : "Search teams..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {language === "ja" ? "新規チーム" : "New Team"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams & Channels List */}
          <div className="lg:col-span-1 space-y-4">
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  {t("allTeams", language)}
                </TabsTrigger>
                <TabsTrigger value="my" className="flex-1">
                  {t("myTeams", language)}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-3">
                {filteredTeams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{team.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {team.memberCount} {language === "ja" ? "メンバー" : "members"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      <div className="space-y-1">
                        {team.channels.map((channel) => (
                          <button
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                              selectedChannel?.id === channel.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                            )}
                          >
                            {channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                            <span className="flex-1 truncate">{channel.name}</span>
                            {channel.isPrivate && (
                              <Badge variant="secondary" className="text-[10px]">
                                {language === "ja" ? "非公開" : "Private"}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="my" className="mt-4">
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    {language === "ja"
                      ? "参加しているチームがここに表示されます"
                      : "Your joined teams will appear here"}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col h-[600px]">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    {selectedChannel.isPrivate ? <Lock className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                    <div>
                      <CardTitle className="text-lg">{selectedChannel.name}</CardTitle>
                      <CardDescription>{selectedChannel.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {channelMessages.length > 0 ? (
                      channelMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {message.from
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{message.from}</span>
                              <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                            </div>
                            <p className="text-sm mt-1">{message.content}</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t("noMessages", language)}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={t("typeMessage", language)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{t("selectChannel", language)}</p>
                  <p className="text-sm">
                    {language === "ja"
                      ? "左側からチャンネルを選択してください"
                      : "Choose a channel from the left to start chatting"}
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
