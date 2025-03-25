"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Flashcard } from "./flashcard-generator"

interface FlashcardDeckProps {
  flashcards: Flashcard[]
  onUpdate: (flashcards: Flashcard[]) => void
}

export function FlashcardDeck({ flashcards, onUpdate }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<Flashcard | null>(null)

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFlipped(false)
    }
  }

  const toggleFlip = () => {
    setFlipped(!flipped)
  }

  const startEditing = () => {
    setEditedCard({ ...currentCard })
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (!editedCard) return

    const updatedFlashcards = [...flashcards]
    updatedFlashcards[currentIndex] = editedCard
    onUpdate(updatedFlashcards)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditedCard(null)
  }

  const addTag = (tag: string) => {
    if (!editedCard || !tag.trim()) return

    setEditedCard({
      ...editedCard,
      tags: [...editedCard.tags, tag.trim()],
    })
  }

  const removeTag = (tagToRemove: string) => {
    if (!editedCard) return

    setEditedCard({
      ...editedCard,
      tags: editedCard.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  if (!currentCard) return null

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={startEditing}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Card
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question</label>
            <Textarea
              value={editedCard?.question || ""}
              onChange={(e) => setEditedCard({ ...editedCard!, question: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              value={editedCard?.answer || ""}
              onChange={(e) => setEditedCard({ ...editedCard!, answer: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCard?.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addTag(input.value)
                  input.value = ""
                }}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </div>
        </Card>
      ) : (
        <Card
          className={`relative h-64 cursor-pointer transition-all duration-500 ${flipped ? "bg-muted/30" : "bg-card"}`}
          onClick={toggleFlip}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6 backface-hidden">
            <div className={`transition-opacity duration-300 ${flipped ? "opacity-0" : "opacity-100"}`}>
              <h3 className="text-xl font-medium text-center">{currentCard.question}</h3>
              <p className="text-sm text-center text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
            <div className={`transition-opacity duration-300 ${flipped ? "opacity-100" : "opacity-0"}`}>
              <p className="text-lg">{currentCard.answer}</p>
              {currentCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4 justify-center">
                  {currentCard.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button variant="outline" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

