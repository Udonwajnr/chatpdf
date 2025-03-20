"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, Send, SplitSquareVertical } from "lucide-react"
import { ChatMessage } from "@/app/components/chat-message"
import { PDFViewer } from "@/app/components/pdf-viewer"

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "system",
      content: "I'm your PDF assistant. Ask me anything about your document.",
    },
    {
      id: 2,
      role: "user",
      content: "What are the main points in this document?",
    },
    {
      id: 3,
      role: "assistant",
      content:
        "The document covers three main points:\n\n1. An introduction to artificial intelligence and its applications in modern business\n\n2. Case studies of successful AI implementations across various industries\n\n3. Recommendations for organizations looking to adopt AI technologies",
    },
  ])
  const [input, setInput] = useState("")
  const [showPdfSidebar, setShowPdfSidebar] = useState(true)
  const [isMobilePdfView, setIsMobilePdfView] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "I'm analyzing your question about the document. Based on the content, I can tell you that the document discusses various approaches to implementing AI in business contexts, with particular emphasis on cost-effectiveness and scalability.",
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const togglePdfSidebar = () => {
    setShowPdfSidebar(!showPdfSidebar)
  }

  const toggleMobilePdfView = () => {
    setIsMobilePdfView(!isMobilePdfView)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium truncate">Business AI Report.pdf</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={togglePdfSidebar}>
              <SplitSquareVertical className="h-4 w-4" />
              {showPdfSidebar ? "Hide PDF" : "Show PDF"}
            </Button>
            <Button variant="outline" size="sm" className="md:hidden" onClick={toggleMobilePdfView}>
              {isMobilePdfView ? "Show Chat" : "View PDF"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile view switcher */}
        <div className={`flex flex-1 ${isMobilePdfView ? "flex-col" : "flex-col md:flex-row"}`}>
          {/* PDF Viewer (full width on mobile when active, sidebar on desktop) */}
          {(showPdfSidebar || isMobilePdfView) && (
            <div
              className={`
                ${isMobilePdfView ? "flex-1" : "hidden md:block"} 
                ${showPdfSidebar ? "md:w-1/2 lg:w-3/5" : "w-0"} 
                border-r overflow-hidden transition-all duration-300
              `}
            >
              <PDFViewer />
            </div>
          )}

          {/* Chat area (hidden on mobile when PDF view is active) */}
          {!isMobilePdfView && (
            <div className={`flex-1 flex flex-col ${showPdfSidebar ? "md:w-1/2 lg:w-2/5" : "w-full"}`}>
              <main className="flex-1 overflow-auto p-4">
                <div className="mx-auto max-w-3xl space-y-4 pb-20">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              </main>
              <div className="sticky bottom-0 border-t bg-background p-4">
                <div className="mx-auto max-w-3xl flex gap-2">
                  <Input
                    placeholder="Ask a question about your document..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

