"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User,
  Announcement,
  Event,
  Notification,
  TeamsTeam,
  TeamsMessage,
  Document,
  HelpTicket,
  UserPreferences,
  ThemeMode,
} from "./types"

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  updateUserProfile: (updates: Partial<User>) => void
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void

  // Theme
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void

  // Announcements
  announcements: Announcement[]
  setAnnouncements: (announcements: Announcement[]) => void
  addAnnouncement: (announcement: Announcement) => void
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void
  deleteAnnouncement: (id: string) => void

  // Events
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Teams
  teams: TeamsTeam[]
  setTeams: (teams: TeamsTeam[]) => void
  teamsMessages: TeamsMessage[]
  setTeamsMessages: (messages: TeamsMessage[]) => void
  addTeamsMessage: (message: TeamsMessage) => void

  // Documents
  documents: Document[]
  setDocuments: (documents: Document[]) => void

  // Help Tickets
  helpTickets: HelpTicket[]
  setHelpTickets: (tickets: HelpTicket[]) => void
  addHelpTicket: (ticket: HelpTicket) => void
  updateHelpTicket: (id: string, updates: Partial<HelpTicket>) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: {
    announcements: Announcement[]
    events: Event[]
    documents: Document[]
  }
  performSearch: (query: string) => void
}

const defaultUser: User = {
  id: "1",
  name: "John Smith",
  email: "john.smith@company.com",
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: defaultUser,
      setUser: (user) => set({ user }),
      updateUserProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      updateUserPreferences: (prefs) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...prefs } as UserPreferences,
              }
            : null,
        })),

      // Theme
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Announcements
      announcements: [],
      setAnnouncements: (announcements) => set({ announcements }),
      addAnnouncement: (announcement) => set((state) => ({ announcements: [announcement, ...state.announcements] })),
      updateAnnouncement: (id, updates) =>
        set((state) => ({
          announcements: state.announcements.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),

      // Events
      events: [],
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      // Notifications
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      // Teams
      teams: [],
      setTeams: (teams) => set({ teams }),
      teamsMessages: [],
      setTeamsMessages: (messages) => set({ teamsMessages: messages }),
      addTeamsMessage: (message) => set((state) => ({ teamsMessages: [message, ...state.teamsMessages] })),

      // Documents
      documents: [],
      setDocuments: (documents) => set({ documents }),

      // Help Tickets
      helpTickets: [],
      setHelpTickets: (helpTickets) => set({ helpTickets }),
      addHelpTicket: (ticket) => set((state) => ({ helpTickets: [ticket, ...state.helpTickets] })),
      updateHelpTicket: (id, updates) =>
        set((state) => ({
          helpTickets: state.helpTickets.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      // Search
      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      searchResults: { announcements: [], events: [], documents: [] },
      performSearch: (query) => {
        const state = get()
        const lowerQuery = query.toLowerCase()

        const announcements = state.announcements.filter(
          (a) => a.title.toLowerCase().includes(lowerQuery) || a.content.toLowerCase().includes(lowerQuery),
        )

        const events = state.events.filter(
          (e) => e.title.toLowerCase().includes(lowerQuery) || e.description.toLowerCase().includes(lowerQuery),
        )

        const documents = state.documents.filter((d) => d.name.toLowerCase().includes(lowerQuery))

        set({ searchResults: { announcements, events, documents }, searchQuery: query })
      },
    }),
    {
      name: "sharepoint-portal-storage",
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        notifications: state.notifications,
      }),
    },
  ),
)
