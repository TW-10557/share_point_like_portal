import { type NextRequest, NextResponse } from "next/server"
import { mockAnnouncements, mockEvents } from "@/lib/mock-data"

// POST /api/chatbot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, language = "en", department } = body

    const lowerMessage = message.toLowerCase()
    let response = ""

    // Simple keyword-based responses (would use AI in production)
    if (lowerMessage.includes("announcement") || lowerMessage.includes("お知らせ")) {
      const relevantAnnouncements = mockAnnouncements
        .filter((a) => !department || a.department === "all" || a.department === department)
        .slice(0, 3)

      response =
        language === "ja"
          ? `最新のお知らせは以下の通りです：\n\n${relevantAnnouncements.map((a) => `• ${a.titleJa || a.title}`).join("\n")}`
          : `Here are the latest announcements:\n\n${relevantAnnouncements.map((a) => `• ${a.title}`).join("\n")}`
    } else if (lowerMessage.includes("event") || lowerMessage.includes("イベント")) {
      const upcomingEvents = mockEvents.slice(0, 3)

      response =
        language === "ja"
          ? `今後のイベント：\n\n${upcomingEvents.map((e) => `• ${e.titleJa || e.title}`).join("\n")}`
          : `Upcoming events:\n\n${upcomingEvents.map((e) => `• ${e.title}`).join("\n")}`
    } else if (lowerMessage.includes("help") || lowerMessage.includes("ヘルプ")) {
      response =
        language === "ja"
          ? "お手伝いできることは以下の通りです：\n\n• お知らせの検索\n• イベント情報\n• 部署情報\n• 会社ポリシー"
          : "I can help you with:\n\n• Finding announcements\n• Event information\n• Department info\n• Company policies"
    } else {
      response =
        language === "ja"
          ? "ご質問ありがとうございます。お知らせ、イベント、またはヘルプについてお尋ねください。"
          : 'Thank you for your question. Please ask about announcements, events, or type "help" for more options.'
    }

    return NextResponse.json({
      response,
      suggestedActions: ["View announcements", "Check events", "Get help"],
    })
  } catch {
    return NextResponse.json({ error: "Chatbot error" }, { status: 500 })
  }
}
