// src/api/chatApi.ts
import { Message } from "../pages/Index";

export const sendMessage = async (messages: Message[]): Promise<string> => {
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender,
    content: msg.content,
  }));

  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: formattedMessages }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content;
};