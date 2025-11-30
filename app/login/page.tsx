"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      await login()
      router.push("/")
    } catch {
      setError(language === "ja" ? "ログインに失敗しました" : "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ja" : "en")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "日本語" : "English"}
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-2xl">CP</span>
            </div>
            <CardTitle className="text-2xl">{language === "ja" ? "会社ポータル" : "Company Portal"}</CardTitle>
            <CardDescription>
              {language === "ja"
                ? "Microsoftアカウントでサインインしてください"
                : "Sign in with your Microsoft account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}

            <Button onClick={handleLogin} disabled={isLoading} className="w-full gap-3" size="lg">
              <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              {isLoading ? t("signingIn", language) : t("signInWithMicrosoft", language)}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {language === "ja"
                ? "サインインすることで、利用規約とプライバシーポリシーに同意したことになります。"
                : "By signing in, you agree to our Terms of Service and Privacy Policy."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
