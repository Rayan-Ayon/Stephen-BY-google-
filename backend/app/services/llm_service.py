import json
import logging
import os
import time
from typing import Any
from google import genai
from google.genai import types
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)

_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = GEMINI_API_KEY or os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in environment")
        _client = genai.Client(api_key=api_key)
    return _client


async def generate(
    prompt: str,
    response_mime_type: str | None = None,
    system_instruction: str | None = None,
) -> dict:
    start_time = time.time()

    fallback_models = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-3.1-flash-lite"]
    last_error = None

    for model_name in fallback_models:
        try:
            config = types.GenerateContentConfig(
                response_mime_type=response_mime_type,
                system_instruction=system_instruction,
            )

            response = await get_client().aio.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config,
            )

            duration = time.time() - start_time
            text = response.text

            logger.info(f"Generated content in {duration:.2f}s | model={model_name}")
            logger.info(f"Raw response: {text[:200]}...")

            try:
                result = json.loads(text)
            except json.JSONDecodeError:
                result = text

            return {
                "data": result,
                "model": model_name,
                "duration": duration,
            }

        except Exception as e:
            last_error = e
            logger.warning(f"Model {model_name} failed: {e}. Trying fallback...")
            continue

    duration = time.time() - start_time
    logger.error(f"LLM generation failed for all fallback models after {duration:.2f}s: {last_error}", exc_info=True)
    if last_error:
        raise last_error
    raise RuntimeError("No models succeeded")


async def generate_json(
    prompt: str,
    system_instruction: str | None = None,
) -> dict:
    """Generate structured JSON response from Gemini."""
    result = await generate(
        prompt,
        response_mime_type="application/json",
        system_instruction=system_instruction,
    )
    return result