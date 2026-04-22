import json
import logging
import time
from typing import Any
from google.genai import Client
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)

client = Client(api_key=GEMINI_API_KEY)


async def generate(prompt: str, response_schema: dict | None = None) -> dict:
    start_time = time.time()
    
    try:
        config = {
            "temperature": 0.7,
            "max_output_tokens": 8192,
        }
        
        if response_schema:
            config["response_mime_type"] = "application/json"
            config["response_schema"] = response_schema
        
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=config,
        )
        
        duration = time.time() - start_time
        
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError:
            result = response.text
        
        logger.info(f"Generated content in {duration:.2f}s | model={GEMINI_MODEL}")
        
        return {
            "data": result,
            "model": GEMINI_MODEL,
            "duration": duration,
        }
        
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Generation failed after {duration:.2f}s: {str(e)}")
        raise


async def generate_with_schema(
    prompt: str,
    schema: dict,
) -> dict:
    return await generate(prompt, response_schema=schema)