import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getContext } from "@/lib/context"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId, topic, pageRange } = await req.json()

    // Verify the chat exists and belongs to the user
    const chatDoc = await db
      .select({ id: chats.id, fileKey: chats.fileKey })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const fileKey = chatDoc[0].fileKey

    // Get context from the document
    const contextPrompt = `I need to create flashcards about ${topic}. Please provide relevant information from the document.`
    const context = await getContext(contextPrompt, fileKey)

    // Generate flashcards using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates educational flashcards. 
          Create 5-10 high-quality flashcards about "${topic}" based on the provided document content.
          Each flashcard should have a question on one side and the answer on the other.
          Focus on key concepts, definitions, and important facts.
          Format your response as a JSON array of objects with the following structure:
          [
            {
              "id": "unique-id-1",
              "question": "Question text",
              "answer": "Answer text",
              "tags": ["relevant", "tags"]
            }
          ]
          Make sure the output is valid JSON.`,
        },
        {
          role: "user",
          content: `Here is the document content to create flashcards about "${topic}":\n\n${context}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const flashcardsData = JSON.parse(response.choices[0].message.content || "{}")

    return NextResponse.json({ flashcards: flashcardsData.flashcards || [] })
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}

