"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import type { Priority, Department, Announcement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Upload } from "lucide-react"

interface AnnouncementFormProps {
  announcement?: Announcement
  onSubmit: (data: Partial<Announcement>) => void
  onCancel: () => void
}

const priorities: Priority[] = ["urgent", "important", "event", "deadline", "ceo", "general"]
const departments: Department[] = ["all", "engineering", "marketing", "sales", "hr", "finance", "operations"]

export function AnnouncementForm({ announcement, onSubmit, onCancel }: AnnouncementFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    titleJa: announcement?.titleJa || "",
    content: announcement?.content || "",
    contentJa: announcement?.contentJa || "",
    priority: announcement?.priority || ("general" as Priority),
    department: announcement?.department || ("all" as Department),
    imageUrl: announcement?.imageUrl || "",
  })
  const [useAiGeneration, setUseAiGeneration] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAiGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFormData((prev) => ({
      ...prev,
      contentJa: prev.content ? "【AI生成】" + prev.content : prev.contentJa,
      titleJa: prev.title ? "【AI生成】" + prev.title : prev.titleJa,
    }))
    setIsGenerating(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      isAiGenerated: useAiGeneration,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{announcement ? t("editAnnouncement", language) : t("createAnnouncement", language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (English)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
              required
            />
          </div>

          {/* Japanese Title */}
          <div className="space-y-2">
            <Label htmlFor="titleJa">タイトル (日本語)</Label>
            <Input
              id="titleJa"
              value={formData.titleJa}
              onChange={(e) => setFormData((prev) => ({ ...prev, titleJa: e.target.value }))}
              placeholder="お知らせのタイトルを入力"
            />
          </div>

          {/* English Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (English)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter announcement content"
              rows={5}
              required
            />
          </div>

          {/* Japanese Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contentJa">内容 (日本語)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAiGenerate}
                disabled={isGenerating || !formData.content}
                className="gap-2 bg-transparent"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "AI Translate"}
              </Button>
            </div>
            <Textarea
              id="contentJa"
              value={formData.contentJa}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentJa: e.target.value }))}
              placeholder="お知らせの内容を入力"
              rows={5}
            />
          </div>

          {/* Priority & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(p as keyof typeof import("@/lib/i18n").translations.en, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value: Department) => setFormData((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* AI Generation Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="space-y-0.5">
              <Label>AI Content Generation</Label>
              <p className="text-sm text-muted-foreground">Use AI to generate summaries and images</p>
            </div>
            <Switch checked={useAiGeneration} onCheckedChange={setUseAiGeneration} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel", language)}
            </Button>
            <Button type="submit">{announcement ? t("save", language) : t("create", language)}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
