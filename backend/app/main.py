"""FastAPI entry point for the Car Expert Chatbot backend.

This app exposes a health check endpoint and a chat endpoint.
The chat endpoint sends the user message directly to the LLM service and lets
the system prompt decide whether the reply should be car-related.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_cors_origins
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import generate_car_chat_response


app = FastAPI(
    title="Car Expert Chatbot API",
    version="0.1.0",
    description="Backend API for a domain-restricted car-related chatbot.",
)


# CORS is enabled now so a future frontend can call this API safely.
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return a simple status response to confirm the API is running."""
    return {
        "status": "healthy",
        "message": "Car Expert Chatbot backend is running.",
    }


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
def chat(request: ChatRequest) -> ChatResponse:
    """Return a chatbot response for the user's message.

    This route stays intentionally simple. The LLM service and its system prompt
    are responsible for greeting users and refusing unrelated questions.
    """
    response_text = generate_car_chat_response(request.message)
    return ChatResponse(response=response_text)
