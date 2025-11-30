"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Sparkles, RefreshCw, MessageSquare, Zap } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { t } from "@/lib/i18n"
import { mockTeamsMessages } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

export default function AIAutomationPage() {
  const { language } = useLanguage()
  const { hasRole } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoFetch, setAutoFetch] = useState(true)
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [autoPrioritize, setAutoPrioritize] = useState(true)
  const [generatedContent, setGeneratedContent] = useState("")

  if (!hasRole(["admin", "ceo"])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">{language === "ja" ? "アクセス権限がありません" : "Access denied"}</p>
        </div>
      </MainLayout>
    )
  }

  const handleGenerateAnnouncement = async () => {
    setIsProcessing(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGeneratedContent(
      language === "ja"
        ? "【AI生成】本日のTeamsメッセージに基づき、以下の重要なお知らせをお伝えします：\n\n1. 営業チームが四半期最大の契約を締結しました\n2. エンジニアリングのコードフリーズは明日午後5時です\n3. 新しいオフィススナックがキッチンに届きました"
        : "[AI Generated] Based on today's Teams messages, here are the key announcements:\n\n1. Sales team closed the biggest deal of the quarter\n2. Engineering code freeze is tomorrow at 5 PM\n3. New office snacks have arrived in the kitchen",
    )
    setIsProcessing(false)
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            {t("aiAutomation", language)}
          </h1>
          <p className="text-muted-foreground">
            {language === "ja"
              ? "AIを使用してお知らせを自動生成・管理"
              : "Automate announcement generation and management with AI"}
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Teams Integration
              </CardTitle>
              <CardDescription>
                {language === "ja" ? "Teamsからメッセージを自動取得" : "Auto-fetch messages from Teams"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-fetch">{language === "ja" ? "自動取得" : "Auto Fetch"}</Label>
                <Switch id="auto-fetch" checked={autoFetch} onCheckedChange={setAutoFetch} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Content Generation
              </CardTitle>
              <CardDescription>
                {language === "ja" ? "AIでお知らせを自動生成" : "Auto-generate announcements with AI"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-generate">{language === "ja" ? "自動生成" : "Auto Generate"}</Label>
                <Switch id="auto-generate" checked={autoGenerate} onCheckedChange={setAutoGenerate} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Auto Prioritization
              </CardTitle>
              <CardDescription>
                {language === "ja" ? "AIで優先度を自動設定" : "Auto-prioritize with AI rules"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-prioritize">{language === "ja" ? "自動優先度" : "Auto Prioritize"}</Label>
                <Switch id="auto-prioritize" checked={autoPrioritize} onCheckedChange={setAutoPrioritize} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {language === "ja" ? "Teamsメッセージ" : "Teams Messages"}
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                {language === "ja" ? "更新" : "Refresh"}
              </Button>
            </CardTitle>
            <CardDescription>
              {language === "ja"
                ? "Microsoft Teamsから取得した最新メッセージ"
                : "Latest messages fetched from Microsoft Teams"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTeamsMessages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg bg-secondary/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{message.from}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.channelName}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(message.timestamp).toLocaleString(language === "ja" ? "ja-JP" : "en-US")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {language === "ja" ? "AI生成" : "AI Generation"}
            </CardTitle>
            <CardDescription>
              {language === "ja" ? "Teamsメッセージからお知らせを生成" : "Generate announcements from Teams messages"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGenerateAnnouncement} disabled={isProcessing} className="gap-2">
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {language === "ja" ? "生成中..." : "Generating..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {language === "ja" ? "お知らせを生成" : "Generate Announcement"}
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={66} />
                <p className="text-sm text-muted-foreground">
                  {language === "ja" ? "AIがコンテンツを分析中..." : "AI is analyzing content..."}
                </p>
              </div>
            )}

            {generatedContent && (
              <div className="space-y-3">
                <Label>{language === "ja" ? "生成されたコンテンツ" : "Generated Content"}</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button>{language === "ja" ? "お知らせとして投稿" : "Post as Announcement"}</Button>
                  <Button variant="outline">{language === "ja" ? "編集" : "Edit"}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}
