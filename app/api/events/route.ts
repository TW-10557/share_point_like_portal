import { type NextRequest, NextResponse } from "next/server"
import { mockEvents } from "@/lib/mock-data"
import type { Event, Department } from "@/lib/types"

// GET /api/events
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const department = searchParams.get("department") as Department | null
  const upcoming = searchParams.get("upcoming")

  let events = [...mockEvents]

  if (department && department !== "all") {
    events = events.filter((e) => e.department === department || e.department === "all")
  }

  if (upcoming === "true") {
    const now = new Date()
    events = events.filter((e) => new Date(e.startDate) >= now)
  }

  return NextResponse.json({ events })
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newEvent: Event = {
      id: Date.now().toString(),
      title: body.title,
      titleJa: body.titleJa,
      description: body.description,
      descriptionJa: body.descriptionJa,
      startDate: body.startDate,
      endDate: body.endDate,
      location: body.location,
      department: body.department || "all",
      priority: body.priority || "general",
      isRecurring: body.isRecurring || false,
      recurrencePattern: body.recurrencePattern,
      reminderSent: false,
      createdBy: body.createdBy || "System",
    }

    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
