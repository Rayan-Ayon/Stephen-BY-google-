import json
import logging
import time
from typing import Any
from google import genai
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY)


async def generate(prompt: str, response_schema: dict | None = None) -> dict:
    start_time = time.time()
    
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
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


async def generate_with_schema(
    prompt: str,
    schema: dict,
) -> dict:
    return await generate(prompt, response_schema=schema)