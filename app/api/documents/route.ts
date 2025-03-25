import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  try {
      const { userId } = await auth(); // Correct usage in server-side API

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch documents from the database
    const documents = await db
      .select({
        id: chats.id,
        name: chats.pdfName,
        url: chats.pdfUrl,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(chats.createdAt)
      .execute()

    // Format the documents for the frontend
    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      pages: Math.floor(Math.random() * 30) + 1, // This would come from actual metadata
      date: new Date(doc.createdAt).toLocaleDateString(),
      url: doc.url,
    }))

    return NextResponse.json({ documents: formattedDocuments })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

