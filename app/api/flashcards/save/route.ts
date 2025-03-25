import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats, flashcards } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId, flashcards: flashcardsData, topic } = await req.json()

    // Verify the chat exists and belongs to the user
    const chatDoc = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Save flashcards to the database
    const flashcardsToInsert = flashcardsData.map((card: any) => ({
      chatId,
      userId,
      question: card.question,
      answer: card.answer,
      tags: card.tags,
      topic,
    }))

    await db.insert(flashcards).values(flashcardsToInsert)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving flashcards:", error)
    return NextResponse.json({ error: "Failed to save flashcards" }, { status: 500 })
  }
}

