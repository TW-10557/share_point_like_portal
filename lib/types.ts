export type Role = "admin" | "employee" | "ceo"
export type Priority = "urgent" | "important" | "event" | "deadline" | "ceo" | "general"
export type Department = "engineering" | "marketing" | "sales" | "hr" | "finance" | "operations" | "all"
export type AnnouncementStatus = "pending" | "approved" | "rejected"
export type ThemeMode = "light" | "dark" | "system"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: Department
  avatar?: string
  isAuthenticated: boolean
  phone?: string
  jobTitle?: string
  location?: string
  bio?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: ThemeMode
  language: "en" | "ja"
  emailNotifications: boolean
  pushNotifications: boolean
  showBirthday: boolean
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
  recurrencePattern?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  reminderSent: boolean
  createdBy: string
  attendees?: string[]
  color?: string
}

export interface Notification {
  id: string
  title: string
  titleJa?: string
  message: string
  messageJa?: string
  type: "announcement" | "event" | "reminder" | "system" | "teams"
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
  fromId: string
  timestamp: string
  channelName: string
  channelId: string
  teamId: string
}

export interface TeamsChannel {
  id: string
  name: string
  description: string
  teamId: string
  teamName: string
  memberCount: number
  isPrivate: boolean
  lastActivity: string
}

export interface TeamsTeam {
  id: string
  name: string
  description: string
  channels: TeamsChannel[]
  memberCount: number
  icon?: string
}

export interface Document {
  id: string
  name: string
  type: "pdf" | "doc" | "xlsx" | "pptx" | "folder" | "image"
  size?: string
  modifiedAt: string
  modifiedBy: string
  department: Department
  path: string
  isFolder: boolean
  children?: Document[]
}

export interface HelpTicket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  category: string
  createdBy: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses?: TicketResponse[]
}

export interface TicketResponse {
  id: string
  content: string
  author: string
  createdAt: string
  isStaff: boolean
}

export interface FAQ {
  id: string
  question: string
  questionJa: string
  answer: string
  answerJa: string
  category: string
}
