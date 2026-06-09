import os
import json
import logging
import random
import time
import re
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

_client: Optional[OpenAI] = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        if not OPENROUTER_API_KEY:
            raise RuntimeError("OPENROUTER_API_KEY is not set in environment variables.")
        _client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
            timeout=90.0,
        )
    return _client


FREE_ROUTER = "openrouter/free"
DEFAULT_MODEL = FREE_ROUTER

MODELS_TO_TRY = [
    "openrouter/free",
    "qwen/qwen3-coder:free",
    "google/gemma-3-27b-it:free",
    "nvidia/nemotron-3-nano-9b-v2:free",
]


def get_ai_response(prompt: str, model: str = FREE_ROUTER, max_retries: int = 3) -> str:
    """Generate AI response from OpenRouter with free router and fallback."""
    last_error = None
    client = _get_client()

    for model_to_use in MODELS_TO_TRY:
        for attempt in range(max_retries):
            try:
                logger.info(f"Calling OpenRouter with model: {model_to_use} (attempt {attempt + 1})")
                response = client.chat.completions.create(
                    model=model_to_use,
                    messages=[{"role": "user", "content": prompt}],
                    extra_headers={"HTTP-Referer": "http://localhost:5173", "X-Title": "Stephen"},
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
                    wait_time = (2**attempt) * 2.0
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


def get_ai_response_json(prompt: str, model: str = FREE_ROUTER, max_retries: int = 3) -> dict:
    """Generate AI response and parse as JSON with lenient parsing."""
    text = get_ai_response(prompt, model, max_retries)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            cleaned = text.strip()
            if cleaned.startswith("`json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("`"):
                cleaned = cleaned[3:]
            if cleaned.endswith("`"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except json.JSONDecodeError:
            json_match = re.search(r"{[\s\S]*}", cleaned)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass

            for key in ["flashcards", "quiz", "bullets"]:
                if '"' + key + '"' in cleaned:
                    last_brace = cleaned.rfind("}")
                    if last_brace > 0:
                        repaired = cleaned[: last_brace + 1] + "]}"
                        try:
                            result = json.loads(repaired)
                            logger.warning(f"Repaired truncated JSON for key '{key}' - partial results returned")
                            return result
                        except json.JSONDecodeError:
                            pass

            logger.error(f"Failed to parse JSON. Response: {text[:300]}")
            raise Exception(f"AI response was not valid JSON. First 200 chars: {text[:200]}")


def _generate_mock_quiz(count: int = 5) -> dict:
    """Returns a schema-perfect mock quiz payload when all API attempts fail."""
    topics = [
        {
            "question": "What is the primary purpose of Transformer architecture?",
            "options": ["Image classification", "Sequence transduction", "Database indexing", "Network routing"],
            "correct": 1,
            "hint": "Transformers were introduced for sequence-to-sequence tasks in 'Attention is All You Need'.",
        },
        {
            "question": "Which technique helps prevent overfitting in deep learning?",
            "options": ["Gradient descent", "Dropout regularization", "Backpropagation", "Convolution"],
            "correct": 1,
            "hint": "This technique randomly deactivates neurons during training to improve generalization.",
        },
        {
            "question": "What does the attention mechanism in Transformers allow the model to do?",
            "options": ["Process images faster", "Focus on relevant parts of the input", "Reduce memory usage", "Skip layers during training"],
            "correct": 1,
            "hint": "It lets the model weigh the importance of different input elements dynamically.",
        },
        {
            "question": "What does the learning rate control during gradient descent?",
            "options": ["Batch size", "Step size of gradient updates", "Number of layers", "Choice of activation function"],
            "correct": 1,
            "hint": "It determines how much the model weights change in response to the gradient each step.",
        },
        {
            "question": "Which loss function is standard for multi-class classification?",
            "options": ["Mean Squared Error", "Cross-Entropy Loss", "Huber Loss", "L1 Loss"],
            "correct": 1,
            "hint": "It measures the difference between predicted probability distributions and true labels.",
        },
    ]
    questions = random.sample(topics, min(count, len(topics)))
    return {
        "quiz": [
            {
                "question": q["question"],
                "options": q["options"],
                "correct": q["correct"],
                "hint": q["hint"],
                "source_chunk_id": f"mock-chunk-{i}",
            }
            for i, q in enumerate(questions)
        ]
    }


def _generate_mock_flashcards(count: int = 10) -> dict:
    """Returns schema-perfect mock flashcards when all API attempts fail."""
    pairs = [
        ("What is a Foundation Model?", "A large-scale model pre-trained on broad data then fine-tuned for specific tasks."),
        ("Define 'prompt engineering'.", "The art of crafting inputs to guide LLM outputs toward desired results."),
        ("What is RAG?", "Retrieval-Augmented Generation - combining retrieval of external docs with LLM generation."),
        ("What does 'tokenization' mean?", "Splitting raw text into discrete units (tokens) that the model processes."),
        ("Explain 'temperature' in LLMs.", "A parameter controlling output randomness; higher = more creative, lower = more deterministic."),
        ("What is a Transformer?", "A neural architecture using self-attention to process sequential data in parallel."),
        ("What is fine-tuning?", "Taking a pre-trained model and training it further on a specific dataset."),
        ("What does 'zero-shot' mean?", "The ability of a model to perform tasks it was not explicitly trained on."),
        ("What is an embedding?", "A dense vector representation of text that captures semantic meaning."),
        ("What is attention?", "A mechanism that computes weighted combinations of input elements based on relevance."),
    ]
    selected = (pairs * ((count // len(pairs)) + 1))[:count]
    return {
        "flashcards": [
            {
                "question": q,
                "answer": a,
                "difficulty": "medium",
                "source_chunk_id": f"mock-fc-{i}",
                "source_timestamp": "0:00",
            }
            for i, (q, a) in enumerate(selected)
        ]
    }
