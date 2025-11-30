import { type NextRequest, NextResponse } from "next/server"
import type { Priority } from "@/lib/types"

// POST /api/ai/prioritize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content } = body

    // Simulate AI prioritization logic
    const text = `${title} ${content}`.toLowerCase()

    let priority: Priority = "general"
    let confidence = 0.7

    if (text.includes("urgent") || text.includes("emergency") || text.includes("緊急")) {
      priority = "urgent"
      confidence = 0.95
    } else if (text.includes("ceo") || text.includes("executive") || text.includes("社長")) {
      priority = "ceo"
      confidence = 0.9
    } else if (text.includes("deadline") || text.includes("due") || text.includes("締め切り")) {
      priority = "deadline"
      confidence = 0.85
    } else if (text.includes("important") || text.includes("重要")) {
      priority = "important"
      confidence = 0.8
    } else if (text.includes("event") || text.includes("meeting") || text.includes("イベント")) {
      priority = "event"
      confidence = 0.75
    }

    return NextResponse.json({
      priority,
      confidence,
      reasoning: `Detected keywords suggesting ${priority} priority`,
    })
  } catch {
    return NextResponse.json({ error: "Prioritization failed" }, { status: 500 })
  }
}
