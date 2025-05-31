from fastapi import FastAPI , Request , HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
import asyncio
import uvicorn
import logging
from typing import List, Dict


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = Groq(api_key=GROQ_API_KEY)

# groq_messages = [{"role": "system", "content": "You are a helpful assistant."}] + groq_messages

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data  = await request.json()
        messages = data .get("messages")

        if not messages or not isinstance(messages, list):
            raise HTTPException(status_code=400, detail="Invalid or missing 'messages' in request body")

        # Transform messages to Groq-compatible format
        groq_messages: List[Dict[str, str]] = [
            {"role": "system", "content": "You are a helpful assistant."}
        ] + [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
            if msg.get("role") in ["user", "assistant"] and isinstance(msg.get("content"), str)
        ]

        async def generate_response():
            try:
                response = client.chat.completions.create(
                    model="meta-llama/llama-4-maverick-17b-128e-instruct",  # Use a valid Groq model
                    messages=groq_messages,  # Use transformed messages
                    max_tokens=1000,
                    temperature=0.7,
                    stream=True,
                )
                for chunk in response:
                    content = chunk.choices[0].delta.content
                    if content:  # Only yield non-empty content
                        yield f"data: {content}\n\n"
            except Exception as e:
                logger.error(f"Groq API error: {str(e)}")
                yield f"data: [ERROR] Failed to generate response: {str(e)}\n\n"
                   
        return StreamingResponse(generate_response(), media_type="text/event-stream")
    except Exception as e:
        logger.error(f"Request processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)


# client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# chat_history = [
#     {
#         "role": "system","content": "You are a helpful assistant."
#     },
# ]
# print("Welcome to Groq Chat!")
# while True:
#     user_input= input("You: ")
#     if user_input.lower()=='exit':
#         print("Bot : Exiting chat. Goodbye!")
#         break

#     chat_history.append({"role": "user", "content": user_input})

#     response = client.chat.completions.create(
#         model="meta-llama/llama-4-maverick-17b-128e-instruct",
#         messages=chat_history,
#         max_tokens=1000,
#         temperature=0.7,
#         stream=True,
#     )
#     print("Bot: ", end="", flush=True)
#     bot_response = ""
#     for chunks in response:
#         content=chunks.choices[0].delta.content
#         if content:
#             print(content, end="", flush=True)
#             bot_response += content
#     print()
#     chat_history.append({"role": "assistant", "content": bot_response})
    