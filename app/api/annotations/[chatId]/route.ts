import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats, annotations } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.chatId

    // Verify the chat exists and belongs to the user
    const chatDoc = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, Number(chatId)), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Get annotations for this chat
    const userAnnotations = await db
      .select()
      .from(annotations)
      .where(and(eq(annotations.chatId, chatId), eq(annotations.userId, userId)))
      .execute()

    return NextResponse.json({ annotations: userAnnotations })
  } catch (error) {
    console.error("Error fetching annotations:", error)
    return NextResponse.json({ error: "Failed to fetch annotations" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.chatId
    const { annotations: annotationsData } = await req.json()

    // Verify the chat exists and belongs to the user
    const chatDoc = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, Number(chatId)), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Delete existing annotations for this chat
    await db
      .delete(annotations)
      .where(and(eq(annotations.chatId, chatId), eq(annotations.userId, userId)))
      .execute()

    // Insert new annotations
    if (annotationsData && annotationsData.length > 0) {
      const annotationsToInsert = annotationsData.map((ann: any) => ({
        chatId,
        userId,
        type: ann.type,
        pageNumber: ann.pageNumber,
        position: ann.position,
        color: ann.color,
        text: ann.text,
      }))

      await db.insert(annotations).values(annotationsToInsert)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving annotations:", error)
    return NextResponse.json({ error: "Failed to save annotations" }, { status: 500 })
  }
}

