import os
import logging
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError(
        "OPENROUTER_API_KEY is not set in environment variables. "
        "Please add OPENROUTER_API_KEY to your .env file."
    )

client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    timeout=30.0
)

FREE_ROUTER = "openrouter/free"
DEFAULT_MODEL = FREE_ROUTER

MODELS_TO_TRY = [
    "openrouter/free",
    "qwen/qwen3-coder:free",
    "google/gemma-3-27b-it:free",
    "nvidia/nemotron-3-nano-9b-v2:free",
]


def get_ai_response(
    prompt: str,
    model: str = FREE_ROUTER,
    max_retries: int = 3
) -> str:
    """Generate AI response from OpenRouter with free router and fallback."""
    last_error = None
    
    for model_to_use in MODELS_TO_TRY:
        for attempt in range(max_retries):
            try:
                logger.info(f"Calling OpenRouter with model: {model_to_use} (attempt {attempt + 1})")
                
                response = client.chat.completions.create(
                    model=model_to_use,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                content = response.choices[0].message.content
                logger.info(f"Successfully got response from {model_to_use}")
                return content
                
            except Exception as e:
                error_msg = str(e)
                
                if "404" in error_msg:
                    logger.warning(f"Model {model_to_use} not found, skipping...")
                    last_error = e
                    break
                elif "429" in error_msg or "rate" in error_msg.lower():
                    wait_time = (2 ** attempt) * 2.0
                    logger.warning(f"Rate limited on {model_to_use}, waiting {wait_time}s...")
                    time.sleep(wait_time)
                    last_error = e
                    continue
                elif "400" in error_msg and "not a valid model" in error_msg:
                    logger.warning(f"Model {model_to_use} invalid, skipping...")
                    last_error = e
                    break
                else:
                    logger.warning(f"Model {model_to_use} failed: {error_msg}")
                    last_error = e
                    break
    
    raise Exception(f"All OpenRouter models failed. Last error: {last_error}")


def get_ai_response_json(
    prompt: str,
    model: str = FREE_ROUTER,
    max_retries: int = 3
) -> dict:
    """Generate AI response and parse as JSON with lenient parsing."""
    import json
    import re
    
    text = get_ai_response(prompt, model, max_retries)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            cleaned = text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except json.JSONDecodeError:
            json_match = re.search(r'\{[\s\S]*\}', cleaned)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except:
                    pass
            logger.error(f"Failed to parse JSON. Response: {text[:200]}")
            raise Exception(f"AI response was not valid JSON")