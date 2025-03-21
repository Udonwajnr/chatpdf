"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Trash } from "lucide-react"

interface PDFCardProps {
  pdf: {
    id: string
    name: string
    pages: number
    date: string
    url?: string
  }
}

export function PDFCard({ pdf }: PDFCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${pdf.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      // Refresh the page to update the document list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting document:", error)
      alert("Failed to delete document. Please try again.")
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-start gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span className="truncate">{pdf.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Pages</div>
          <div className="text-right font-medium">{pdf.pages}</div>
          <div className="text-muted-foreground">Uploaded</div>
          <div className="text-right font-medium">{pdf.date}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/chat/${pdf.id}`}>
          <Button size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" /> Chat
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

