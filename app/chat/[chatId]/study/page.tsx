"use client"

import { useState, useEffect,use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, FileText } from "lucide-react"
import { FlashcardGenerator } from "@/app/components/flashcard/flashcard-generator"
import { NotesExtractor } from "@/app/components/study-notes/note-extractors"
import { ExportOptions } from "@/app/components/export/export-option"
import { toast } from "sonner"
import { PDFAnnotator } from "@/app/components/annotations/pdf-annimator"

export default function StudyPage({ params }: { params: Promise<{ chatId: string }> }) {
  const [document, setDocument] = useState<{
    id: string
    name: string
    url: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const {chatId} = use(params)

  useEffect(() => {
    const fetchDocumentInfo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/chat/${chatId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch document information")
        }

        const data = await response.json()
        setDocument({
          id: data.id,
          name: data.pdfName,
          url: data.pdfUrl,
        })
      } catch (error) {
        console.error("Error fetching document:", error)
        toast("Error",{
          description: "Failed to load document information",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentInfo()
  }, [chatId, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Document Not Found</h2>
          <p className="text-muted-foreground">
            The document you're looking for could not be found. It may have been deleted or you might not have
            permission to access it.
          </p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href={`/chat/${chatId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium truncate max-w-[200px]">{document.name}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href={`/chat/${chatId}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <BookOpen className="h-4 w-4" /> Chat View
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="notes">Study Notes</TabsTrigger>
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="flashcards" className="mt-0">
              <FlashcardGenerator chatId={chatId} pdfUrl={document.url} />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <NotesExtractor chatId={chatId} pdfUrl={document.url} />
            </TabsContent>

            <TabsContent value="annotations" className="mt-0">
              <PDFAnnotator chatId={chatId} pdfUrl={document.url} />
            </TabsContent>

            <TabsContent value="export" className="mt-0">
              <ExportOptions chatId={chatId} pdfName={document.name} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

