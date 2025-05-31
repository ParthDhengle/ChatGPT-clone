import { Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function StreamingMessage() {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1 max-w-[80%] items-start">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Assistant</span>
          <span>typing...</span>
        </div>

        <div className="rounded-lg px-4 py-2 text-sm bg-muted">
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
