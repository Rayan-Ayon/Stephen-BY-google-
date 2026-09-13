import json
import logging
import time
from typing import Any
from google import genai
from google.genai import types
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY)


async def generate(
    prompt: str,
    response_schema: dict | None = None,
    response_mime_type: str | None = None,
    system_instruction: str | None = None,
) -> dict:
    start_time = time.time()

    try:
        config = types.GenerateContentConfig(
            response_mime_type=response_mime_type,
            system_instruction=system_instruction,
        )

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=config,
        )

        duration = time.time() - start_time
        text = response.text

        logger.info(f"Generated content in {duration:.2f}s | model={GEMINI_MODEL}")
        logger.info(f"Raw response: {text[:200]}...")

        try:
            result = json.loads(text)
        except json.JSONDecodeError:
            result = text

        return {
            "data": result,
            "model": GEMINI_MODEL,
            "duration": duration,
        }

    except Exception as e:
        duration = time.time() - start_time
        error_msg = str(e)
        logger.error(f"Generation failed after {duration:.2f}s: {error_msg}")
        raise Exception(f"LLM generation failed: {error_msg}")


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


async def generate_with_schema(
    prompt: str,
    schema: dict,
) -> dict:
    return await generate(prompt, response_schema=schema)
