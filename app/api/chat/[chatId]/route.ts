import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> } // ✅ Corrected params type
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { chatId } = await params // ✅ No need for await since it's not a Promise

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
    }

    // Fetch the chat document
    const chatDoc = await db
      .select({
        id: chats.id,
        pdfName: chats.pdfName,
        pdfUrl: chats.pdfUrl,
        fileKey: chats.fileKey,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(and(eq(chats.id, Number(chatId)), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json(chatDoc[0])
  } catch (error) {
    console.error("Error fetching chat:", error)
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 })
  }
}
