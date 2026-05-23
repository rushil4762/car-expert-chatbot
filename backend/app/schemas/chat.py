"""Pydantic models for the chat API.

Keeping request and response shapes in a separate file makes the main FastAPI
app easier to read and keeps the data contract clear.
"""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request body for the /chat endpoint."""

    message: str = Field(..., min_length=1, description="User's car-related question")


class ChatResponse(BaseModel):
    """Response body returned by the /chat endpoint."""

    response: str = Field(..., description="Car-related chatbot reply")