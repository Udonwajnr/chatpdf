"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bookmark, Highlighter, StickyNote, Pencil, Save, Trash2, Clock } from "lucide-react"
import { formatDistanceToNow, } from "date-fns"

export interface Annotation {
  id: string
  type: "highlight" | "note" | "bookmark"
  pageNumber: number
  position: { x: number; y: number }
  color: string
  text: string
  createdAt: string
}

interface AnnotationListProps {
  annotations: Annotation[]
  activeAnnotation: Annotation | null
  onAnnotationClick: (annotation: Annotation) => void
  onAnnotationUpdate: (id: string, updates: Partial<Annotation>) => void
  onAnnotationDelete: (id: string) => void
}

export function AnnotationList({
  annotations,
  activeAnnotation,
  onAnnotationClick,
  onAnnotationUpdate,
  onAnnotationDelete,
}: AnnotationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const startEditing = (annotation: Annotation) => {
    setEditingId(annotation.id)
    setEditText(annotation.text)
  }

  const saveEdit = () => {
    if (editingId) {
      onAnnotationUpdate(editingId, { text: editText })
      setEditingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const highlights = annotations.filter((a) => a.type === "highlight")
  const notes = annotations.filter((a) => a.type === "note")
  const bookmarks = annotations.filter((a) => a.type === "bookmark")

  const renderAnnotationIcon = (type: "highlight" | "note" | "bookmark", color?: string) => {
    const iconProps = { className: "h-4 w-4", style: { color } }

    switch (type) {
      case "highlight":
        return <Highlighter {...iconProps} />
      case "note":
        return <StickyNote {...iconProps} />
      case "bookmark":
        return <Bookmark {...iconProps} />
    }
  }

  const renderAnnotationItem = (annotation: Annotation) => {
    const isEditing = editingId === annotation.id
    const isActive = activeAnnotation?.id === annotation.id

    return (
      <Card
        key={annotation.id}
        className={`mb-3 cursor-pointer transition-all ${isActive ? "border-primary" : ""}`}
        onClick={() => onAnnotationClick(annotation)}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="mt-1">{renderAnnotationIcon(annotation.type, annotation.color)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Page {annotation.pageNumber}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(annotation.createdAt), { addSuffix: true })}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[100px] text-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="h-3 w-3 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {annotation.text || <span className="text-muted-foreground italic">No text content</span>}
                  </p>
                  <div className="flex justify-end gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(annotation)
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAnnotationDelete(annotation.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {annotations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No annotations yet. Start by highlighting text or adding notes.
            </p>
          ) : (
            annotations
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(renderAnnotationItem)
          )}
        </TabsContent>

        <TabsContent value="highlights" className="mt-4">
          {highlights.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No highlights yet.</p>
          ) : (
            highlights
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(renderAnnotationItem)
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No notes yet.</p>
          ) : (
            notes
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(renderAnnotationItem)
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-4">
          {bookmarks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No bookmarks yet.</p>
          ) : (
            bookmarks
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(renderAnnotationItem)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

