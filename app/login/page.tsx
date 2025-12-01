"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Globe, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithMicrosoft, isLoading } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isEmailLogin, setIsEmailLogin] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsEmailLogin(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError(language === "ja" ? "メールアドレスまたはパスワードが正しくありません" : "Invalid email or password")
      }
    } catch {
      setError(language === "ja" ? "ログインに失敗しました" : "Login failed")
    } finally {
      setIsEmailLogin(false)
    }
  }

  const handleMicrosoftLogin = async () => {
    try {
      await loginWithMicrosoft()
      router.push("/")
    } catch {
      setError(language === "ja" ? "ログインに失敗しました" : "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
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

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4"
            >
              <span className="text-primary-foreground font-bold text-2xl">CP</span>
            </motion.div>
            <CardTitle className="text-2xl">{language === "ja" ? "会社ポータル" : "Company Portal"}</CardTitle>
            <CardDescription>
              {language === "ja" ? "アカウントにサインインしてください" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Microsoft Login */}
            <Button
              onClick={handleMicrosoftLogin}
              disabled={isLoading || isEmailLogin}
              className="w-full gap-3 bg-transparent"
              size="lg"
              variant="outline"
            >
              {isLoading && !isEmailLogin ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
              )}
              {isLoading && !isEmailLogin ? t("signingIn", language) : t("signInWithMicrosoft", language)}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("orContinueWith", language)}</span>
              </div>
            </div>

            {/* Email/Password Login */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailAddress", language)}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password", language)}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading || isEmailLogin}>
                {isEmailLogin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signingIn", language)}
                  </>
                ) : (
                  t("signIn", language)
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground pt-2">
              {language === "ja"
                ? "サインインすることで、利用規約とプライバシーポリシーに同意したことになります。"
                : "By signing in, you agree to our Terms of Service and Privacy Policy."}
            </p>

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <p className="font-medium mb-1">{language === "ja" ? "デモ用認証情報:" : "Demo credentials:"}</p>
              <p>Email: admin@company.com / Password: any</p>
              <p className="mt-1 text-[10px]">
                {language === "ja"
                  ? "※ メールに「admin」を含めると管理者権限でログインできます"
                  : "* Include 'admin' in email for admin access"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
