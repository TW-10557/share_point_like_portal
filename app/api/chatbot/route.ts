import { type NextRequest, NextResponse } from "next/server"
import { mockAnnouncements, mockEvents, mockFAQs, mockDocuments } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, language = "en", department, history = [] } = body

    const lowerMessage = message.toLowerCase()
    let response = ""

    // FAQ matching
    const matchedFAQ = mockFAQs.find((faq) => {
      const question = language === "ja" ? faq.questionJa : faq.question
      return (
        lowerMessage.includes(question.toLowerCase().slice(0, 20)) ||
        question.toLowerCase().includes(lowerMessage.slice(0, 20))
      )
    })

    if (matchedFAQ) {
      response = language === "ja" ? matchedFAQ.answerJa : matchedFAQ.answer
    }
    // Announcements query
    else if (
      lowerMessage.includes("announcement") ||
      lowerMessage.includes("news") ||
      lowerMessage.includes("お知らせ") ||
      lowerMessage.includes("ニュース")
    ) {
      const relevantAnnouncements = mockAnnouncements
        .filter(
          (a) => a.status === "approved" && (!department || a.department === "all" || a.department === department),
        )
        .slice(0, 5)

      if (relevantAnnouncements.length > 0) {
        response =
          language === "ja"
            ? `最新のお知らせは以下の通りです：\n\n${relevantAnnouncements
                .map(
                  (a, i) => `${i + 1}. **${a.titleJa || a.title}**\n   ${(a.contentJa || a.content).slice(0, 100)}...`,
                )
                .join("\n\n")}\n\n詳細は「お知らせ」ページでご確認ください。`
            : `Here are the latest announcements:\n\n${relevantAnnouncements
                .map((a, i) => `${i + 1}. **${a.title}**\n   ${a.content.slice(0, 100)}...`)
                .join("\n\n")}\n\nCheck the Announcements page for more details.`
      } else {
        response =
          language === "ja" ? "現在、新しいお知らせはありません。" : "There are no new announcements at the moment."
      }
    }
    // Events query
    else if (
      lowerMessage.includes("event") ||
      lowerMessage.includes("meeting") ||
      lowerMessage.includes("イベント") ||
      lowerMessage.includes("ミーティング") ||
      lowerMessage.includes("予定")
    ) {
      const now = new Date()
      const upcomingEvents = mockEvents.filter((e) => new Date(e.startDate) > now).slice(0, 5)

      if (upcomingEvents.length > 0) {
        response =
          language === "ja"
            ? `今後のイベント：\n\n${upcomingEvents
                .map((e, i) => {
                  const date = new Date(e.startDate).toLocaleDateString("ja-JP", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })
                  return `${i + 1}. **${e.titleJa || e.title}**\n   📅 ${date} | 📍 ${e.location}`
                })
                .join("\n\n")}\n\n詳細は「イベント」ページでご確認ください。`
            : `Upcoming events:\n\n${upcomingEvents
                .map((e, i) => {
                  const date = new Date(e.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })
                  return `${i + 1}. **${e.title}**\n   📅 ${date} | 📍 ${e.location}`
                })
                .join("\n\n")}\n\nCheck the Events page for more details.`
      } else {
        response =
          language === "ja"
            ? "現在、予定されているイベントはありません。"
            : "There are no upcoming events at the moment."
      }
    }
    // Help query
    else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("ヘルプ") ||
      lowerMessage.includes("サポート") ||
      lowerMessage.includes("困")
    ) {
      response =
        language === "ja"
          ? `お手伝いできることは以下の通りです：\n\n• 📢 **お知らせ** - 最新の会社のお知らせを確認\n• 📅 **イベント** - 今後のイベントやミーティング\n• 📁 **ドキュメント** - 会社のポリシーやファイル\n• 🎫 **ヘルプデスク** - ITサポートチケットを作成\n• 👥 **チーム** - チームやチャンネルを確認\n\n何かお探しですか？`
          : `I can help you with:\n\n• 📢 **Announcements** - Latest company updates\n• 📅 **Events** - Upcoming meetings and events\n• 📁 **Documents** - Company policies and files\n• 🎫 **Help Desk** - Create IT support tickets\n• 👥 **Teams** - View teams and channels\n\nWhat are you looking for?`
    }
    // Documents query
    else if (
      lowerMessage.includes("document") ||
      lowerMessage.includes("file") ||
      lowerMessage.includes("policy") ||
      lowerMessage.includes("ドキュメント") ||
      lowerMessage.includes("ファイル") ||
      lowerMessage.includes("ポリシー")
    ) {
      const folders = mockDocuments.filter((d) => d.isFolder)
      response =
        language === "ja"
          ? `利用可能なドキュメントフォルダ：\n\n${folders
              .map((f) => `📁 **${f.name}** - ${f.children?.length || 0} ファイル`)
              .join("\n")}\n\nドキュメントページで詳細を確認できます。`
          : `Available document folders:\n\n${folders
              .map((f) => `📁 **${f.name}** - ${f.children?.length || 0} files`)
              .join("\n")}\n\nYou can browse them on the Documents page.`
    }
    // Password/Account
    else if (
      lowerMessage.includes("password") ||
      lowerMessage.includes("reset") ||
      lowerMessage.includes("パスワード") ||
      lowerMessage.includes("リセット")
    ) {
      response =
        language === "ja"
          ? "パスワードをリセットするには：\n\n1. ヘルプデスクページにアクセス\n2. 「チケットを作成」をクリック\n3. カテゴリから「アカウント」を選択\n4. パスワードリセットをリクエスト\n\nまたは、it-support@company.com にメールでお問い合わせください。"
          : "To reset your password:\n\n1. Go to the Help Desk page\n2. Click 'Create Ticket'\n3. Select 'Account' as category\n4. Request a password reset\n\nOr email it-support@company.com directly."
    }
    // Greeting
    else if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("こんにちは") ||
      lowerMessage.includes("おはよう")
    ) {
      const hour = new Date().getHours()
      const greeting =
        hour < 12
          ? language === "ja"
            ? "おはようございます"
            : "Good morning"
          : hour < 17
            ? language === "ja"
              ? "こんにちは"
              : "Good afternoon"
            : language === "ja"
              ? "こんばんは"
              : "Good evening"

      response =
        language === "ja"
          ? `${greeting}！何かお手伝いできることはありますか？お知らせ、イベント、ドキュメントなどについてお聞きください。`
          : `${greeting}! How can I help you today? Feel free to ask about announcements, events, documents, or anything else.`
    }
    // Thank you
    else if (lowerMessage.includes("thank") || lowerMessage.includes("ありがとう") || lowerMessage.includes("感謝")) {
      response =
        language === "ja"
          ? "どういたしまして！他にご質問がありましたらお気軽にどうぞ。"
          : "You're welcome! Feel free to ask if you have any other questions."
    }
    // Default response
    else {
      response =
        language === "ja"
          ? `ご質問ありがとうございます。以下のトピックについてお手伝いできます：\n\n• お知らせや最新ニュース\n• イベントやミーティング\n• ドキュメントや会社ポリシー\n• ITサポートやヘルプデスク\n• チームやチャンネル\n\n「ヘルプ」と入力すると、詳細なオプションを表示できます。`
          : `Thank you for your question. I can help you with:\n\n• Announcements and news updates\n• Events and meetings\n• Documents and company policies\n• IT support and help desk\n• Teams and channels\n\nType "help" to see more options.`
    }

    // Add suggested actions based on response
    const suggestedActions = []
    if (response.includes("announcement") || response.includes("お知らせ")) {
      suggestedActions.push(language === "ja" ? "お知らせを見る" : "View announcements")
    }
    if (response.includes("event") || response.includes("イベント")) {
      suggestedActions.push(language === "ja" ? "イベントを確認" : "Check events")
    }
    if (response.includes("document") || response.includes("ドキュメント")) {
      suggestedActions.push(language === "ja" ? "ドキュメントを閲覧" : "Browse documents")
    }
    if (response.includes("help desk") || response.includes("ヘルプデスク")) {
      suggestedActions.push(language === "ja" ? "チケットを作成" : "Create ticket")
    }

    return NextResponse.json({
      response,
      suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "An error occurred processing your request" }, { status: 500 })
  }
}
