// src/api/chatApi.ts
import { Message } from "../pages/Index";

export const sendAndStreamMessage = (
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError: (error: string) => void
): EventSource => {
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender,
    content: msg.content,
  }));

  const eventSource = new EventSource("http://localhost:5000/api/chat");
  eventSource.onmessage = (event) => {
    if (event.data.startsWith("[ERROR]")) {
      onError(event.data);
      eventSource.close();
      return;
    }
    onChunk(event.data);
  };
  eventSource.onerror = () => {
    onError("Streaming error occurred");
    eventSource.close();
  };

  // Send messages to backend
  fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: formattedMessages }),
  }).catch((error) => onError(`Failed to send message: ${error.message}`));

  return eventSource;
};