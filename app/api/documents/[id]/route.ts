import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // Delete the document from the database
    await db
      .delete(chats)
      .where(and(eq(chats.id, Number(id)), eq(chats.userId, userId)))
      .execute()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}

