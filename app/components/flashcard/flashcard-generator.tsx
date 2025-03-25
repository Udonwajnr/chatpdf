"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Save, Trash } from "lucide-react"
import { FlashcardDeck } from "./flashcard-desk"
import { toast } from "sonner"

interface FlashcardGeneratorProps {
  chatId: string
  pdfUrl: string
}

export type Flashcard = {
  id: string
  question: string
  answer: string
  tags: string[]
}

export function FlashcardGenerator({ chatId, pdfUrl }: FlashcardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [pageRange, setPageRange] = useState("")
  const [topic, setTopic] = useState("")

  const generateFlashcards = async () => {
    if (!topic.trim()) {
      toast("Topic required",{
        description: "Please enter a topic to generate flashcards for",
      })
      return
    }

    try {
      setIsGenerating(true)

      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          topic,
          pageRange: pageRange || "all",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate flashcards")
      }

      const data = await response.json()
      setFlashcards(data.flashcards)

      toast("Flashcards generated",{
        description: `Generated ${data.flashcards.length} flashcards for ${topic}`,
      })
    } catch (error) {
      console.error("Error generating flashcards:", error)
      toast("Generation failed",{
        description: "Failed to generate flashcards. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveFlashcards = async () => {
    if (flashcards.length === 0) return

    try {
      const response = await fetch("/api/flashcards/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          flashcards,
          topic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save flashcards")
      }

      toast("Flashcards saved",{
        description: `Saved ${flashcards.length} flashcards to your collection`,
      })
    } catch (error) {
      console.error("Error saving flashcards:", error)
      toast("Save failed",{
        description: "Failed to save flashcards. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic or Concept
          </label>
          <Input
            id="topic"
            placeholder="e.g., Neural Networks, Climate Change, etc."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-32 space-y-2">
          <label htmlFor="pageRange" className="text-sm font-medium">
            Page Range
          </label>
          <Input
            id="pageRange"
            placeholder="e.g., 1-5"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
          />
        </div>
        <Button onClick={generateFlashcards} disabled={isGenerating || !topic.trim()} className="mt-2 sm:mt-0">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Generate
            </>
          )}
        </Button>
      </div>

      {flashcards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Flashcards ({flashcards.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setFlashcards([])}>
                <Trash className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button size="sm" onClick={saveFlashcards}>
                <Save className="mr-2 h-4 w-4" /> Save Deck
              </Button>
            </div>
          </div>

          <FlashcardDeck flashcards={flashcards} onUpdate={setFlashcards} />
        </div>
      )}
    </div>
  )
}

