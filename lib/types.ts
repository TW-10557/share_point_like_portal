export type Role = "admin" | "employee" | "ceo"
export type Priority = "urgent" | "important" | "event" | "deadline" | "ceo" | "general"
export type Department = "engineering" | "marketing" | "sales" | "hr" | "finance" | "operations" | "all"
export type AnnouncementStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: Department
  avatar?: string
  isAuthenticated: boolean
}

export interface Announcement {
  id: string
  title: string
  titleJa?: string
  content: string
  contentJa?: string
  priority: Priority
  department: Department
  status: AnnouncementStatus
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
  imageUrl?: string
  isAiGenerated: boolean
  aiOverridden: boolean
}

export interface Event {
  id: string
  title: string
  titleJa?: string
  description: string
  descriptionJa?: string
  startDate: string
  endDate: string
  location: string
  department: Department
  priority: Priority
  isRecurring: boolean
  recurrencePattern?: string
  reminderSent: boolean
  createdBy: string
}

export interface Notification {
  id: string
  title: string
  titleJa?: string
  message: string
  messageJa?: string
  type: "announcement" | "event" | "reminder" | "system"
  isRead: boolean
  createdAt: string
  link?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface TeamsMessage {
  id: string
  content: string
  from: string
  timestamp: string
  channelName: string
}
