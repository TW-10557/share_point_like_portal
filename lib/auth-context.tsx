"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { User, Role, Department } from "./types"
import { useAppStore } from "./store"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithMicrosoft: () => Promise<void>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
  hasDepartment: (departments: Department[]) => boolean
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, updateUserProfile } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication state on mount
  useEffect(() => {
    if (user && user.isAuthenticated) {
      setIsAuthenticated(true)
    }
  }, [user])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simple validation (in production, this would be a real API call)
      if (email && password) {
        const newUser: User = {
          id: "1",
          name: email
            .split("@")[0]
            .replace(/\./g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          email: email,
          role: email.includes("admin") ? "admin" : email.includes("ceo") ? "ceo" : "employee",
          department: "engineering",
          avatar: "",
          isAuthenticated: true,
          jobTitle: "Team Member",
          location: "Tokyo, Japan",
          preferences: {
            theme: "system",
            language: "en",
            emailNotifications: true,
            pushNotifications: true,
            showBirthday: true,
          },
        }
        setUser(newUser)
        setIsAuthenticated(true)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    },
    [setUser],
  )

  const loginWithMicrosoft = useCallback(async () => {
    setIsLoading(true)
    // Simulate Microsoft OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockMicrosoftUser: User = {
      id: "ms-" + Date.now(),
      name: "Microsoft User",
      email: "user@company.onmicrosoft.com",
      role: "admin",
      department: "engineering",
      avatar: "",
      isAuthenticated: true,
      jobTitle: "Senior Engineer",
      location: "Tokyo, Japan",
      phone: "+81 90-1234-5678",
      bio: "Passionate about building great software.",
      preferences: {
        theme: "system",
        language: "en",
        emailNotifications: true,
        pushNotifications: true,
        showBirthday: true,
      },
    }

    setUser(mockMicrosoftUser)
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [setUser])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("sharepoint-portal-storage")
    }
  }, [setUser])

  const hasRole = useCallback(
    (roles: Role[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user],
  )

  const hasDepartment = useCallback(
    (departments: Department[]) => {
      if (!user) return false
      if (departments.includes("all")) return true
      return departments.includes(user.department)
    },
    [user],
  )

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      updateUserProfile(updates)
    },
    [updateUserProfile],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        loginWithMicrosoft,
        logout,
        hasRole,
        hasDepartment,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
