"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Monitor, Globe, Bell, Mail, Save, Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import type { ThemeMode } from "@/lib/types"

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    pushNotifications: user?.preferences?.pushNotifications ?? true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateProfile({
      preferences: {
        ...user?.preferences,
        theme,
        language,
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        showBirthday: true,
      },
    })

    toast({
      title: language === "ja" ? "設定を保存しました" : "Settings saved",
      description:
        language === "ja" ? "変更が正常に保存されました。" : "Your preferences have been saved successfully.",
    })

    setIsLoading(false)
  }

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: t("lightMode", language), icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: t("darkMode", language), icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: t("systemTheme", language), icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("settings", language)}</h1>
          <p className="text-muted-foreground">
            {language === "ja" ? "アプリケーションの設定を管理します" : "Manage your application preferences"}
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              {t("theme", language)}
            </CardTitle>
            <CardDescription>
              {language === "ja" ? "アプリケーションの外観を選択します" : "Choose how the application looks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as ThemeMode)}
              className="grid grid-cols-3 gap-4"
            >
              {themeOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    theme === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("language", language)}
            </CardTitle>
            <CardDescription>
              {language === "ja" ? "表示言語を選択します" : "Choose your preferred language"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value as "en" | "ja")}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="en"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  language === "en" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="en" id="en" className="sr-only" />
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <p className="font-medium">English</p>
                  <p className="text-xs text-muted-foreground">United States</p>
                </div>
              </Label>
              <Label
                htmlFor="ja"
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  language === "ja" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="ja" id="ja" className="sr-only" />
                <span className="text-2xl">🇯🇵</span>
                <div>
                  <p className="font-medium">日本語</p>
                  <p className="text-xs text-muted-foreground">Japan</p>
                </div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("notifications", language)}
            </CardTitle>
            <CardDescription>
              {language === "ja" ? "通知の設定を管理します" : "Manage your notification preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    {t("emailNotifications", language)}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ja" ? "重要な更新をメールで受け取る" : "Receive important updates via email"}
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">
                    {t("pushNotifications", language)}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ja" ? "ブラウザでプッシュ通知を受け取る" : "Receive push notifications in browser"}
                  </p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t("saveChanges", language)}
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  )
}
