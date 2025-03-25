import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { chats, annotations } from "@/lib/db/schema"
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

    const { chatId, format, options } = await req.json()

    // Verify the chat exists and belongs to the user
    const chatDoc = await db
      .select({ id: chats.id, fileKey: chats.fileKey, pdfName: chats.pdfName })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .execute()

    if (!chatDoc || chatDoc.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const fileKey = chatDoc[0].fileKey
    const pdfName = chatDoc[0].pdfName

    // Get annotations if requested
    let userAnnotations:any = []
    if (options.includeAnnotations || options.includeNotes || options.includeHighlights || options.includeBookmarks) {
      userAnnotations = await db
        .select()
        .from(annotations)
        .where(and(eq(annotations.chatId, chatId), eq(annotations.userId, userId)))
        .execute()

      // Filter annotations based on options
      if (!options.includeAnnotations) {
        if (options.includeNotes) {
          userAnnotations = userAnnotations.filter((ann:any) => ann.type === "note")
        } else if (options.includeHighlights) {
          userAnnotations = userAnnotations.filter((ann:any) => ann.type === "highlight")
        } else if (options.includeBookmarks) {
          userAnnotations = userAnnotations.filter((ann:any) => ann.type === "bookmark")
        }
      }
    }

    // Get document context for summary if requested
    let documentSummary = ""
    if (options.includeSummary) {
      const context = await getContext("Summarize this document", fileKey)

      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Create a concise summary (2-3 paragraphs) of the document content provided.",
          },
          {
            role: "user",
            content: context,
          },
        ],
      })

      documentSummary = summaryResponse.choices[0].message.content || ""
    }

    // Generate export content based on format
    let exportContent = ""
    let contentType = ""
    let fileExtension = ""

    switch (format) {
      case "markdown":
        exportContent = generateMarkdownExport(pdfName, documentSummary, userAnnotations)
        contentType = "text/markdown"
        fileExtension = "md"
        break

      case "html":
        exportContent = generateHtmlExport(pdfName, documentSummary, userAnnotations)
        contentType = "text/html"
        fileExtension = "html"
        break

      case "pdf":
        // For PDF, we'd typically generate HTML first, then convert to PDF
        // This would require a PDF generation library on the server
        // For now, we'll return HTML with instructions
        exportContent = generateHtmlExport(pdfName, documentSummary, userAnnotations)
        contentType = "text/html"
        fileExtension = "html"
        break

      case "notion":
        // For Notion integration, we'd use their API
        // For now, return a mock URL
        return NextResponse.json({
          url: "https://www.notion.so/your-exported-document",
        })

      case "google-docs":
        // For Google Docs integration, we'd use their API
        // For now, return a mock URL
        return NextResponse.json({
          url: "https://docs.google.com/document/d/your-exported-document",
        })

      default:
        return NextResponse.json({ error: "Unsupported export format" }, { status: 400 })
    }

    // Return the export content with appropriate headers
    return new NextResponse(exportContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${pdfName.replace(/\.[^/.]+$/, "")}.${fileExtension}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting document:", error)
    return NextResponse.json({ error: "Failed to export document" }, { status: 500 })
  }
}

function generateMarkdownExport(documentName: string, summary: string, annotations: any[]) {
  let markdown = `# Study Notes: ${documentName}\n\n`

  if (summary) {
    markdown += `## Summary\n\n${summary}\n\n`
  }

  if (annotations.length > 0) {
    markdown += `## Annotations\n\n`

    // Group annotations by type
    const highlights = annotations.filter((ann) => ann.type === "highlight")
    const notes = annotations.filter((ann) => ann.type === "note")
    const bookmarks = annotations.filter((ann) => ann.type === "bookmark")

    if (highlights.length > 0) {
      markdown += `### Highlights\n\n`
      highlights.forEach((highlight) => {
        markdown += `- **Page ${highlight.pageNumber}**: ${highlight.text}\n`
      })
      markdown += `\n`
    }

    if (notes.length > 0) {
      markdown += `### Notes\n\n`
      notes.forEach((note) => {
        markdown += `#### Page ${note.pageNumber}\n\n${note.text}\n\n`
      })
    }

    if (bookmarks.length > 0) {
      markdown += `### Bookmarks\n\n`
      bookmarks.forEach((bookmark) => {
        markdown += `- **Page ${bookmark.pageNumber}**: ${bookmark.text || "Bookmark"}\n`
      })
      markdown += `\n`
    }
  }

  markdown += `\n\n*Generated on ${new Date().toLocaleDateString()}*`

  return markdown
}

function generateHtmlExport(documentName: string, summary: string, annotations: any[]) {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Study Notes: ${documentName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .highlight { background-color: #fff3cd; padding: 10px; margin: 5px 0; border-left: 3px solid #ffc107; }
    .note { background-color: #e8f4f8; padding: 10px; margin: 10px 0; border-left: 3px solid #17a2b8; }
    .bookmark { background-color: #f8f9fa; padding: 10px; margin: 5px 0; border-left: 3px solid #6c757d; }
    .page-number { font-weight: bold; color: #495057; }
    footer { margin-top: 30px; font-size: 0.8em; color: #6c757d; text-align: center; }
  </style>
</head>
<body>
  <h1>Study Notes: ${documentName}</h1>
  `

  if (summary) {
    html += `
  <div class="summary">
    <h2>Summary</h2>
    <p>${summary.replace(/\n/g, "<br>")}</p>
  </div>
    `
  }

  if (annotations.length > 0) {
    html += `<h2>Annotations</h2>`

    // Group annotations by type
    const highlights = annotations.filter((ann) => ann.type === "highlight")
    const notes = annotations.filter((ann) => ann.type === "note")
    const bookmarks = annotations.filter((ann) => ann.type === "bookmark")

    if (highlights.length > 0) {
      html += `<h3>Highlights</h3>`
      highlights.forEach((highlight) => {
        html += `
    <div class="highlight">
      <span class="page-number">Page ${highlight.pageNumber}</span>
      <p>${highlight.text}</p>
    </div>
        `
      })
    }

    if (notes.length > 0) {
      html += `<h3>Notes</h3>`
      notes.forEach((note) => {
        html += `
    <div class="note">
      <span class="page-number">Page ${note.pageNumber}</span>
      <p>${note.text.replace(/\n/g, "<br>")}</p>
    </div>
        `
      })
    }

    if (bookmarks.length > 0) {
      html += `<h3>Bookmarks</h3>`
      bookmarks.forEach((bookmark) => {
        html += `
    <div class="bookmark">
      <span class="page-number">Page ${bookmark.pageNumber}</span>
      <p>${bookmark.text || "Bookmark"}</p>
    </div>
        `
      })
    }
  }

  html += `
  <footer>
    Generated on ${new Date().toLocaleDateString()}
  </footer>
</body>
</html>
  `

  return html
}

