import { User, Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MessageBubble({ message }) {
  const isUser = message.sender === "user"

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{isUser ? "You" : "Assistant"}</span>
          <span>{formatTime(message.timestamp)}</span>
        </div>

        <div
          className={`rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {message.content}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
