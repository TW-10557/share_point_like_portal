"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User, Role, Department } from "./types"
import { mockUser } from "./mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  hasRole: (roles: Role[]) => boolean
  hasDepartment: (departments: Department[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser) // Start logged in for demo
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async () => {
    setIsLoading(true)
    // Simulate Microsoft Entra ID OAuth flow
    // In production, this would redirect to Azure AD login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setUser(mockUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole, hasDepartment }}>
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
