import OpenAI from "openai"
import { getContext } from "@/lib/context"
import { db } from "@/lib/db"
import { chats, messages as _messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // IMPORTANT: Remove NEXT_PUBLIC_ prefix for security
})

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()

    // Validate chat existence
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const fileKey = _chats[0].fileKey
    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, fileKey)

    // Save user message to database
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    })

    const systemMessage = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is always friendly, kind, and inspiring, and it is eager to provide vivid and thoughtful responses.
      AI assistant has the sum of all knowledge and can answer nearly any question.
      AI assistant loves Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI will use the provided context and will not make up information.`,
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages.filter((msg: any) => msg.role === "user")],
      stream: true, // Enable streaming
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "" // Store full response

        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || ""
          fullResponse += text // Append chunk to full response
          controller.enqueue(encoder.encode(text))
        }

        // Save AI response to database after streaming completes
        await db.insert(_messages).values({
          chatId,
          content: fullResponse,
          role: "system", // Using "system" role for AI responses in the database
        })
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

