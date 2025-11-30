export type Language = "en" | "ja"

export const translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    announcements: "Announcements",
    events: "Events",
    departments: "Departments",
    admin: "Admin Panel",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    login: "Login",

    // Dashboard
    welcomeBack: "Welcome back",
    todayOverview: "Today's Overview",
    urgentNews: "Urgent News",
    upcomingEvents: "Upcoming Events",
    ceoUpdates: "CEO Updates",
    departmentNews: "Department News",
    recentAnnouncements: "Recent Announcements",
    viewAll: "View All",

    // Priorities
    urgent: "Urgent",
    important: "Important",
    event: "Event",
    deadline: "Deadline",
    ceo: "CEO",
    general: "General",

    // Departments
    engineering: "Engineering",
    marketing: "Marketing",
    sales: "Sales",
    hr: "Human Resources",
    finance: "Finance",
    operations: "Operations",
    allDepartments: "All Departments",

    // Admin
    createAnnouncement: "Create Announcement",
    editAnnouncement: "Edit Announcement",
    deleteAnnouncement: "Delete Announcement",
    manageEvents: "Manage Events",
    manageUsers: "Manage Users",
    aiAutomation: "AI Automation",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",

    // Chatbot
    chatbotTitle: "Company Assistant",
    askQuestion: "Ask a question...",
    chatbotWelcome: "Hello! How can I help you today?",

    // Common
    search: "Search",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    submit: "Submit",
    loading: "Loading...",
    noResults: "No results found",
    readMore: "Read More",
    postedOn: "Posted on",
    by: "by",

    // Notifications
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",

    // Auth
    signInWithMicrosoft: "Sign in with Microsoft",
    signingIn: "Signing in...",

    // Roles
    roleAdmin: "Administrator",
    roleEmployee: "Employee",
    roleCeo: "CEO",
  },
  ja: {
    // Navigation
    home: "ホーム",
    dashboard: "ダッシュボード",
    announcements: "お知らせ",
    events: "イベント",
    departments: "部署",
    admin: "管理パネル",
    settings: "設定",
    profile: "プロフィール",
    logout: "ログアウト",
    login: "ログイン",

    // Dashboard
    welcomeBack: "おかえりなさい",
    todayOverview: "今日の概要",
    urgentNews: "緊急ニュース",
    upcomingEvents: "今後のイベント",
    ceoUpdates: "CEOからの更新",
    departmentNews: "部署ニュース",
    recentAnnouncements: "最近のお知らせ",
    viewAll: "すべて見る",

    // Priorities
    urgent: "緊急",
    important: "重要",
    event: "イベント",
    deadline: "締め切り",
    ceo: "CEO",
    general: "一般",

    // Departments
    engineering: "エンジニアリング",
    marketing: "マーケティング",
    sales: "営業",
    hr: "人事",
    finance: "財務",
    operations: "運営",
    allDepartments: "全部署",

    // Admin
    createAnnouncement: "お知らせを作成",
    editAnnouncement: "お知らせを編集",
    deleteAnnouncement: "お知らせを削除",
    manageEvents: "イベント管理",
    manageUsers: "ユーザー管理",
    aiAutomation: "AI自動化",
    pending: "保留中",
    approved: "承認済み",
    rejected: "却下",

    // Chatbot
    chatbotTitle: "会社アシスタント",
    askQuestion: "質問を入力...",
    chatbotWelcome: "こんにちは！本日はどのようなご用件でしょうか？",

    // Common
    search: "検索",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    create: "作成",
    submit: "送信",
    loading: "読み込み中...",
    noResults: "結果が見つかりません",
    readMore: "続きを読む",
    postedOn: "投稿日",
    by: "投稿者",

    // Notifications
    notifications: "通知",
    markAllRead: "すべて既読にする",
    noNotifications: "新しい通知はありません",

    // Auth
    signInWithMicrosoft: "Microsoftでサインイン",
    signingIn: "サインイン中...",

    // Roles
    roleAdmin: "管理者",
    roleEmployee: "従業員",
    roleCeo: "CEO",
  },
}

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key
}
