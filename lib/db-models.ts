// Database Models (PostgreSQL/MongoDB placeholders)
// These would be implemented with Prisma, Drizzle, or Mongoose in production

export interface UserModel {
  id: string
  email: string
  name: string
  role: "admin" | "employee" | "ceo"
  department: string
  avatar?: string
  azureAdId?: string // Microsoft Entra ID
  createdAt: Date
  updatedAt: Date
}

export interface AnnouncementModel {
  id: string
  title: string
  titleJa?: string
  content: string
  contentJa?: string
  priority: "urgent" | "important" | "event" | "deadline" | "ceo" | "general"
  department: string
  status: "pending" | "approved" | "rejected"
  authorId: string
  imageUrl?: string
  isAiGenerated: boolean
  aiOverridden: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EventModel {
  id: string
  title: string
  titleJa?: string
  description: string
  descriptionJa?: string
  startDate: Date
  endDate: Date
  location: string
  department: string
  priority: string
  isRecurring: boolean
  recurrencePattern?: string
  reminderSent: boolean
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface NotificationModel {
  id: string
  userId: string
  title: string
  titleJa?: string
  message: string
  messageJa?: string
  type: "announcement" | "event" | "reminder" | "system"
  isRead: boolean
  link?: string
  createdAt: Date
}

// Example Prisma Schema (for reference)
/*
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  role        Role     @default(EMPLOYEE)
  department  String
  avatar      String?
  azureAdId   String?  @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  announcements Announcement[]
  events        Event[]
  notifications Notification[]
}

model Announcement {
  id            String   @id @default(cuid())
  title         String
  titleJa       String?
  content       String
  contentJa     String?
  priority      Priority @default(GENERAL)
  department    String
  status        Status   @default(PENDING)
  authorId      String
  author        User     @relation(fields: [authorId], references: [id])
  imageUrl      String?
  isAiGenerated Boolean  @default(false)
  aiOverridden  Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  ADMIN
  EMPLOYEE
  CEO
}

enum Priority {
  URGENT
  IMPORTANT
  EVENT
  DEADLINE
  CEO
  GENERAL
}

enum Status {
  PENDING
  APPROVED
  REJECTED
}
*/
