"""LLM helper functions for the Car Expert Chatbot.

This module keeps the NVIDIA OpenAI-compatible client code out of the FastAPI
route so the main application file stays short and easy to understand.
"""

from fastapi import HTTPException
from openai import OpenAI

from app.core.config import get_nvidia_api_base_url, get_nvidia_api_key, get_nvidia_model


SYSTEM_PROMPT = """
You are Car Expert AI Assistant, a professional AI chatbot specialized only in car and automobile-related topics.

You can answer:
- car recommendations
- SUVs
- sedans
- hatchbacks
- EVs
- mileage
- fuel efficiency
- maintenance
- safety features
- car comparison
- budget suggestions
- driving tips

You are also allowed to:
- greet the user
- introduce yourself
- respond to simple conversational greetings like:
  - hello
  - hi
  - hey

For a simple greeting, reply in a friendly way such as:
"Hello! How can I help you with cars today?"

Do not answer automobile questions about:
- celebrity car ownership
- personal car collections
- entertainment gossip
- movie or TV vehicle appearances
- paparazzi or tabloid-style car questions

If the user asks anything unrelated to cars or automobiles, reply exactly:
"Sorry, I only answer car-related questions."

Rules:
- Keep answers short, clear, and beginner-friendly.
- Do not generate fake prices, mileage, or specifications.
- If exact information is unavailable, say:
  "Specifications may vary depending on model, variant, year, and location."
- Ask follow-up questions if budget, fuel type, or usage is unclear.
"""


def get_nvidia_client() -> OpenAI:
    """Create an OpenAI-compatible client for NVIDIA or raise a clear error."""
    api_key = get_nvidia_api_key()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="NVIDIA API key is missing. Set NVIDIA_API_KEY in your .env file.",
        )

    return OpenAI(api_key=api_key, base_url=get_nvidia_api_base_url())


def generate_car_chat_response(user_message: str) -> str:
    """Send a car-related question to NVIDIA and return the assistant reply.

    Any API or network problem is converted into a simple HTTP error so the
    frontend or API client gets a readable response.
    """
    client = get_nvidia_client()
    model_name = get_nvidia_model()

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="LLM request failed. Please try again later.",
        ) from error

    assistant_message = response.choices[0].message.content
    if not assistant_message:
        raise HTTPException(
            status_code=502,
            detail="LLM returned an empty response.",
        )

    return assistant_message.strip()