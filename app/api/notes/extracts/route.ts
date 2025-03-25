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

    const { chatId, pageRange, options } = await req.json()

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

    // Build extraction prompt based on options
    let extractionPrompt = "I need to extract study notes from this document."

    if (options) {
      if (options.keyPoints) extractionPrompt += " Include key points and main ideas."
      if (options.definitions) extractionPrompt += " Extract important definitions and terminology."
      if (options.examples) extractionPrompt += " Include relevant examples and case studies."
      if (options.summaries) extractionPrompt += " Provide section summaries."
    }

    if (pageRange && pageRange !== "all") {
      extractionPrompt += ` Focus on pages ${pageRange}.`
    }

    // Get context from the document
    const context = await getContext(extractionPrompt, fileKey)

    // Generate notes using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that creates comprehensive study notes.
          Based on the document content provided, create:
          1. Detailed notes in Markdown format
          2. A list of key bullet points (10-15 points)
          3. A concise summary (2-3 paragraphs)
          
          Format your response as a JSON object with the following structure:
          {
            "notes": "Detailed markdown notes...",
            "bulletPoints": ["Point 1", "Point 2", ...],
            "summary": "Concise summary..."
          }
          
          Make sure the output is valid JSON.`,
        },
        {
          role: "user",
          content: `Here is the document content to create study notes from:\n\n${context}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const notesData = JSON.parse(response.choices[0].message.content || "{}")

    return NextResponse.json({
      notes: notesData.notes || "",
      bulletPoints: notesData.bulletPoints || [],
      summary: notesData.summary || "",
    })
  } catch (error) {
    console.error("Error extracting notes:", error)
    return NextResponse.json({ error: "Failed to extract notes" }, { status: 500 })
  }
}

