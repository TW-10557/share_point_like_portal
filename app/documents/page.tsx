"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Folder,
  FolderOpen,
  Download,
  Upload,
  Search,
  Grid,
  List,
  File,
  FileSpreadsheet,
  FileImage,
  Presentation,
  ChevronRight,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"
import { mockDocuments } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import type { Document } from "@/lib/types"

const getFileIcon = (type: Document["type"]) => {
  switch (type) {
    case "folder":
      return Folder
    case "pdf":
      return FileText
    case "xlsx":
      return FileSpreadsheet
    case "pptx":
      return Presentation
    case "image":
      return FileImage
    default:
      return File
  }
}

const getFileColor = (type: Document["type"]) => {
  switch (type) {
    case "folder":
      return "text-yellow-500"
    case "pdf":
      return "text-red-500"
    case "xlsx":
      return "text-green-500"
    case "pptx":
      return "text-orange-500"
    case "doc":
      return "text-blue-500"
    default:
      return "text-muted-foreground"
  }
}

export default function DocumentsPage() {
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const getCurrentDocuments = (): Document[] => {
    if (currentPath.length === 0) {
      return mockDocuments
    }

    let docs = mockDocuments
    for (const pathPart of currentPath) {
      const folder = docs.find((d) => d.name === pathPart && d.isFolder)
      if (folder?.children) {
        docs = folder.children
      }
    }
    return docs
  }

  const filteredDocuments = getCurrentDocuments().filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFolderClick = (folder: Document) => {
    if (folder.isFolder) {
      setCurrentPath([...currentPath, folder.name])
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("documents", language)}</h1>
            <p className="text-muted-foreground">
              {language === "ja" ? "会社のドキュメントとファイルを閲覧" : "Browse company documents and files"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "ja" ? "ファイルを検索..." : "Search files..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              {t("upload", language)}
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => setCurrentPath([])} className="cursor-pointer hover:text-primary">
                {t("documents", language)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentPath.map((path, index) => (
              <BreadcrumbItem key={path}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbLink
                  onClick={() => handleBreadcrumbClick(index + 1)}
                  className="cursor-pointer hover:text-primary"
                >
                  {path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Documents Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDocuments.map((doc, index) => {
              const Icon = getFileIcon(doc.type)
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                      doc.isFolder && "hover:bg-muted/50",
                    )}
                    onClick={() => doc.isFolder && handleFolderClick(doc)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        {doc.isFolder ? (
                          <FolderOpen className={cn("h-12 w-12 mx-auto", getFileColor(doc.type))} />
                        ) : (
                          <Icon className={cn("h-12 w-12 mx-auto", getFileColor(doc.type))} />
                        )}
                      </div>
                      <p className="font-medium text-sm truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.isFolder
                          ? `${doc.children?.length || 0} ${language === "ja" ? "アイテム" : "items"}`
                          : doc.size}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDocuments.map((doc, index) => {
                  const Icon = getFileIcon(doc.type)
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                        doc.isFolder && "cursor-pointer",
                      )}
                      onClick={() => doc.isFolder && handleFolderClick(doc)}
                    >
                      <Icon className={cn("h-8 w-8", getFileColor(doc.type))} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("by", language)} {doc.modifiedBy}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{formatDate(doc.modifiedAt)}</p>
                        <p>{doc.isFolder ? `${doc.children?.length || 0} items` : doc.size}</p>
                      </div>
                      {!doc.isFolder && (
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noResults", language)}</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </MainLayout>
  )
}
