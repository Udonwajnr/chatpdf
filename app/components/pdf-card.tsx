"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Trash, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)
      // Updated to use chatId in the endpoint
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
      setIsDeleting(false)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg group relative",
        "bg-gradient-to-br from-background to-background/80 hover:from-primary/5 hover:to-background",
      )}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/30 opacity-70 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-start gap-2 text-lg">
          <div className="rounded-full bg-primary/10 p-1.5 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>

          <span className="font-medium">{pdf.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* <div className="text-muted-foreground">Pages</div>
          <div className="text-right font-medium">{pdf.pages}</div> */}
          <div className="text-muted-foreground">Uploaded</div>
          <div className="text-right font-medium">{pdf.date}</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 sm:flex-nowrap sm:justify-between">
        <Link href={`/chat/${pdf.id}`} className="w-full sm:w-auto">
          <Button size="sm" className="gap-1.5 w-full sm:w-auto bg-primary/90 hover:bg-primary">
            <MessageSquare className="h-4 w-4" /> Chat with PDF
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
            </>
          ) : (
            <>
              <Trash className="h-4 w-4" /> Delete
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

