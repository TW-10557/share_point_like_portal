import { type NextRequest, NextResponse } from "next/server"
import { mockAnnouncements } from "@/lib/mock-data"

// GET /api/announcements/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const announcement = mockAnnouncements.find((a) => a.id === id)

  if (!announcement) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
  }

  return NextResponse.json({ announcement })
}

// PATCH /api/announcements/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const announcementIndex = mockAnnouncements.findIndex((a) => a.id === id)

  if (announcementIndex === -1) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
  }

  const updatedAnnouncement = {
    ...mockAnnouncements[announcementIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ announcement: updatedAnnouncement })
}

// DELETE /api/announcements/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const announcementIndex = mockAnnouncements.findIndex((a) => a.id === id)

  if (announcementIndex === -1) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
