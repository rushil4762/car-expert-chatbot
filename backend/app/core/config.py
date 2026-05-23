"""Application configuration helpers.

This module keeps environment-related logic in one place so the main FastAPI
file stays easy to read for beginners.
"""

from pathlib import Path
from typing import List
import os

from dotenv import load_dotenv


# Load variables from the local .env file if it exists.
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def get_cors_origins() -> List[str]:
    """Return the allowed CORS origins as a clean list of strings."""
    raw_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173",
    )
    origins = [origin.strip() for origin in raw_origins.split(",")]
    return [origin for origin in origins if origin]


def get_nvidia_api_key() -> str:
    """Return the NVIDIA API key from the environment, if it exists."""
    return os.getenv("NVIDIA_API_KEY", "").strip()


def get_nvidia_api_base_url() -> str:
    """Return the NVIDIA OpenAI-compatible base URL."""
    return os.getenv("NVIDIA_API_BASE_URL", "https://integrate.api.nvidia.com/v1").strip()


def get_nvidia_model() -> str:
    """Return the NVIDIA-hosted model name to use for chat completions."""
    return os.getenv("NVIDIA_MODEL", "openai/gpt-oss-20b").strip()
