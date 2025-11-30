import { type NextRequest, NextResponse } from "next/server"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Announcement, Priority, Department } from "@/lib/types"

// GET /api/announcements
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const priority = searchParams.get("priority") as Priority | null
  const department = searchParams.get("department") as Department | null
  const status = searchParams.get("status")

  let announcements = [...mockAnnouncements]

  if (priority) {
    announcements = announcements.filter((a) => a.priority === priority)
  }

  if (department && department !== "all") {
    announcements = announcements.filter((a) => a.department === department || a.department === "all")
  }

  if (status) {
    announcements = announcements.filter((a) => a.status === status)
  }

  return NextResponse.json({ announcements })
}

// POST /api/announcements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: body.title,
      titleJa: body.titleJa,
      content: body.content,
      contentJa: body.contentJa,
      priority: body.priority || "general",
      department: body.department || "all",
      status: "pending",
      author: body.author || "System",
      authorId: body.authorId || "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: body.imageUrl,
      isAiGenerated: body.isAiGenerated || false,
      aiOverridden: false,
    }

    return NextResponse.json({ announcement: newAnnouncement }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
