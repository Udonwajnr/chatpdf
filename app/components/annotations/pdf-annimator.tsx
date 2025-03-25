"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, Highlighter, StickyNote, Save, Loader2, List } from "lucide-react"
import { toast } from "sonner"
import { type Annotation, AnnotationList } from "./annotator-list"
import { ColorPicker } from "./color-picker"

interface PDFAnnotatorProps {
  chatId: string
  pdfUrl: string
}

export function PDFAnnotator({ chatId, pdfUrl }: PDFAnnotatorProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null)
  const [annotationMode, setAnnotationMode] = useState<"highlight" | "note" | "bookmark" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [selectedColor, setSelectedColor] = useState("#FFEB3B") // Yellow default
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  // Load existing annotations
  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/annotations/${chatId}`)

        if (response.ok) {
          const data = await response.json()
          setAnnotations(data.annotations || [])
        }
      } catch (error) {
        console.error("Error loading annotations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnnotations()
  }, [chatId])

  const saveAnnotations = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/annotations/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ annotations }),
      })

      if (!response.ok) {
        throw new Error("Failed to save annotations")
      }

      toast("Annotations saved",{
        description: "Your annotations have been saved successfully",
      })
    } catch (error) {
      console.error("Error saving annotations:", error)
      toast("Save failed",{
        description: "Failed to save annotations. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    setActiveAnnotation(annotation)

    // Scroll to the annotation position in the PDF
    if (pdfContainerRef.current) {
      // This would need to be implemented based on your PDF viewer
      // For example, you might need to scroll to a specific page and position
    }
  }

  const toggleAnnotationMode = (mode: "highlight" | "note" | "bookmark" | null) => {
    setAnnotationMode(annotationMode === mode ? null : mode)
  }

  const addAnnotation = (
    type: "highlight" | "note" | "bookmark",
    pageNumber: number,
    position: { x: number; y: number },
    text?: string,
  ) => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      type,
      pageNumber,
      position,
      color: selectedColor,
      text: text || "",
      createdAt: new Date().toISOString(),
    }

    setAnnotations([...annotations, newAnnotation])
    setActiveAnnotation(newAnnotation)

    toast("Annotation added",{
      description: `Added a new ${type} annotation`,
    })
  }

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    const updatedAnnotations = annotations.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))

    setAnnotations(updatedAnnotations)

    if (activeAnnotation?.id === id) {
      setActiveAnnotation({ ...activeAnnotation, ...updates })
    }
  }

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((ann) => ann.id !== id))

    if (activeAnnotation?.id === id) {
      setActiveAnnotation(null)
    }

    toast("Annotation deleted",{
      description: "The annotation has been removed",
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-2 bg-muted/30 rounded-md">
        <div className="flex items-center gap-2">
          <Button
            variant={annotationMode === "highlight" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAnnotationMode("highlight")}
            className="gap-1"
          >
            <Highlighter className="h-4 w-4" />
            <span className="hidden sm:inline">Highlight</span>
          </Button>

          <Button
            variant={annotationMode === "note" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAnnotationMode("note")}
            className="gap-1"
          >
            <StickyNote className="h-4 w-4" />
            <span className="hidden sm:inline">Note</span>
          </Button>

          <Button
            variant={annotationMode === "bookmark" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAnnotationMode("bookmark")}
            className="gap-1"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bookmark</span>
          </Button>

          {annotationMode && <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAnnotations(!showAnnotations)} className="gap-1">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{showAnnotations ? "Hide List" : "Show List"}</span>
          </Button>

          <Button variant="default" size="sm" onClick={saveAnnotations} disabled={isSaving} className="gap-1">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        <div
          ref={pdfContainerRef}
          className={`flex-1 overflow-auto transition-all ${showAnnotations ? "md:w-2/3" : "w-full"}`}
        >
          {/* This would integrate with your existing PDF viewer component */}
          <div className="bg-muted/20 rounded-md p-4 h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              PDF Annotation functionality would integrate with your existing PDF viewer component
            </p>
          </div>
        </div>

        {showAnnotations && (
          <div className="w-full md:w-1/3 overflow-auto">
            <AnnotationList
              annotations={annotations}
              activeAnnotation={activeAnnotation}
              onAnnotationClick={handleAnnotationClick}
              onAnnotationUpdate={updateAnnotation}
              onAnnotationDelete={deleteAnnotation}
            />
          </div>
        )}
      </div>
    </div>
  )
}

