"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, Send, SplitSquareVertical } from "lucide-react"
import { ChatMessage } from "@/app/components/chat-message"
import { PDFViewer } from "@/app/components/pdf-viewer"
import { toast } from "sonner"
interface ChatPageProps {
  params: {
    chatId: string
  }
}

interface Message {
  id: number
  role: "system" | "user" | "assistant"
  content: string
  createdAt?: Date
}

interface ChatDocument {
  id: string
  name: string
  url: string
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = params
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [showPdfSidebar, setShowPdfSidebar] = useState(true)
  const [isMobilePdfView, setIsMobilePdfView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [document, setDocument] = useState<ChatDocument | null>(null)
  const [aiMessage, setAiMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chat document and history
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setIsLoading(true)

        // Fetch chat document info
        const chatResponse = await fetch(`/api/chat/${chatId}`)

        if (!chatResponse.ok) {
          throw new Error("Failed to load chat data")
        }

        const chatData = await chatResponse.json()

        // Set document info
        setDocument({
          id: chatData.id,
          name: chatData.pdfName,
          url: chatData.pdfUrl,
        })

        // Fetch messages
        const messagesResponse = await fetch("/api/get-messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId }),
        })

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()

          if (messagesData && messagesData.length > 0) {
            // Format messages
            const formattedMessages = messagesData.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              createdAt: new Date(msg.createdAt),
            }))

            setMessages(formattedMessages)
          } else {
            // Set default welcome message if no messages exist
            setMessages([
              {
                id: 1,
                role: "system",
                content: "I'm your PDF assistant. Ask me anything about your document.",
              },
            ])
          }
        }
      } catch (error) {
        console.error("Error fetching chat data:", error)
        toast("Error",{
          description: "Failed to load chat data. Please try again.",
        })

        // Set default welcome message on error
        setMessages([
          {
            id: 1,
            role: "system",
            content: "I'm your PDF assistant. Ask me anything about your document.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    if (chatId) {
      fetchChatData()
    }
  }, [chatId, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, aiMessage])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAiMessage("")

    try {
      setIsLoading(true)

      // Prepare messages for API
      const messagesToSend = [...messages.filter((m) => m.role === "user" || m.role === "assistant"), userMessage]

      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
          chatId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("Failed to read response")
      }

      let done = false
      let accumulatedResponse = ""

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          const chunkText = decoder.decode(value)
          accumulatedResponse += chunkText
          setAiMessage(accumulatedResponse)
        }
      }

      // Add AI response to messages
      if (accumulatedResponse) {
        const aiResponseMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: accumulatedResponse,
        }

        setMessages((prev) => [...prev, aiResponseMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast("Error",{
        description: "Failed to send message. Please try again.",
      })

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "system",
          content: "Sorry, there was an error processing your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
      setAiMessage("")
    }
  }

  const togglePdfSidebar = () => {
    setShowPdfSidebar(!showPdfSidebar)
  }

  const toggleMobilePdfView = () => {
    setIsMobilePdfView(!isMobilePdfView)
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile view switcher */}
        <div className={`flex flex-1 ${isMobilePdfView ? "flex-col" : "flex-col md:flex-row"}`}>
          {/* PDF Viewer (full width on mobile when active, sidebar on desktop) */}
          {(showPdfSidebar || isMobilePdfView) && document?.url && (
            <div
              className={`
                ${isMobilePdfView ? "flex-1" : "hidden md:block"} 
                ${showPdfSidebar ? "md:w-1/2 lg:w-3/5" : "w-0"} 
                border-r overflow-hidden transition-all duration-300
              `}
            >
              <PDFViewer pdfUrl={document.url} />
            </div>
          )}

          {/* Chat area (hidden on mobile when PDF view is active) */}
          {!isMobilePdfView && (
            <div className={`flex-1 flex flex-col ${showPdfSidebar ? "md:w-1/2 lg:w-2/5" : "w-full"}`}>
              {/* Chat header */}
              <div className="sticky top-0 z-10 border-b bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                      <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium truncate max-w-[200px]">
                        {isLoading && !document ? "Loading..." : document?.name || "Document"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={togglePdfSidebar}>
                      <SplitSquareVertical className="h-4 w-4" />
                      {showPdfSidebar ? "Hide PDF" : "Show PDF"}
                    </Button>
                    <Button variant="outline" size="sm" className="md:hidden" onClick={toggleMobilePdfView}>
                      {isMobilePdfView ? "Show Chat" : "View PDF"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-auto p-4">
                <div className="mx-auto max-w-3xl space-y-4 pb-20">
                  {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    </div>
                  ) : (
                    messages.map((message) => <ChatMessage key={message.id} message={message} />)
                  )}

                  {/* Streaming AI response */}
                  {aiMessage && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-secondary/10 text-secondary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-secondary/10 p-3 text-sm">{aiMessage}</div>
                    </div>
                  )}

                  {/* Loading indicator for AI response */}
                  {isLoading && messages.length > 0 && !aiMessage && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-secondary/10 p-3 text-sm">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.2s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invisible element for scrolling to bottom */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat input */}
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
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
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

