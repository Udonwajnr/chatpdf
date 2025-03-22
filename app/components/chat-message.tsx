import { cn } from "@/lib/utils"
import { FileText, User } from "lucide-react"

interface ChatMessageProps {
  message: {
    id: number
    role: "system" | "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">{message.content}</div>
  }

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-secondary/10 text-secondary">
          <FileText className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary/10",
        )}
      >
        {message.content.split("\n").map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

