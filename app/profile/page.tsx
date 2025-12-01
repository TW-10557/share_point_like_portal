"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Save, User, Mail, Phone, MapPin, Briefcase, Building2, FileText, Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Department } from "@/lib/types"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { language } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    jobTitle: user?.jobTitle || "",
    department: user?.department || "engineering",
    location: user?.location || "",
    bio: user?.bio || "",
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateProfile({
      name: formData.name,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      department: formData.department as Department,
      location: formData.location,
      bio: formData.bio,
    })

    toast({
      title: language === "ja" ? "プロフィールを更新しました" : "Profile updated",
      description: language === "ja" ? "変更が正常に保存されました。" : "Your changes have been saved successfully.",
    })

    setIsLoading(false)
  }

  const departments: { value: Department; label: string }[] = [
    { value: "engineering", label: t("engineering", language) },
    { value: "marketing", label: t("marketing", language) },
    { value: "sales", label: t("sales", language) },
    { value: "hr", label: t("hr", language) },
    { value: "finance", label: t("finance", language) },
    { value: "operations", label: t("operations", language) },
  ]

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("profile", language)}</h1>
          <p className="text-muted-foreground">
            {language === "ja" ? "プロフィール情報を管理します" : "Manage your profile information"}
          </p>
        </div>

        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>{t("changePhoto", language)}</CardTitle>
            <CardDescription>
              {language === "ja" ? "プロフィール写真をアップロードしてください" : "Upload a profile photo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Camera className="h-4 w-4" />
                  {t("uploadPhoto", language)}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {language === "ja" ? "JPG、PNG、GIF形式。最大2MB。" : "JPG, PNG, or GIF. Max 2MB."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("personalInfo", language)}</CardTitle>
            <CardDescription>
              {language === "ja" ? "基本的な個人情報を更新します" : "Update your basic personal information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("fullName", language)}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("email", language)}
                </Label>
                <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t("phone", language)}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+81 90-1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t("location", language)}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Tokyo, Japan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {t("jobTitle", language)}
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="Senior Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t("department", language)}
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("bio", language)}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder={language === "ja" ? "自己紹介を入力..." : "Tell us about yourself..."}
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t("saveChanges", language)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}
