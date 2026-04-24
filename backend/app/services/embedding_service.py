import os
import logging
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SILICONFLOW_API_KEY = os.getenv("SILICONFLOW_API_KEY")
SILICONFLOW_EMBEDDING_MODEL = os.getenv("SILICONFLOW_EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-8B")

if not SILICONFLOW_API_KEY:
    raise ValueError(
        "SILICONFLOW_API_KEY is not set in environment variables. "
        "Please add SILICONFLOW_API_KEY to your .env file."
    )

client = OpenAI(
    api_key=SILICONFLOW_API_KEY,
    base_url="https://api.siliconflow.com/v1"
)


def get_embedding(text: str) -> List[float]:
    """
    Get embedding vector for a given text using SiliconFlow.
    
    Args:
        text: The text to embed
        
    Returns:
        List of floats representing the embedding vector
        
    Raises:
        Exception: If embedding generation fails
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty")
    
    try:
        logger.info(f"Generating embedding with model: {SILICONFLOW_EMBEDDING_MODEL}")
        
        response = client.embeddings.create(
            model=SILICONFLOW_EMBEDDING_MODEL,
            input=text
        )
        
        embedding = response.data[0].embedding
        logger.info(f"Generated embedding with {len(embedding)} dimensions")
        
        return embedding
        
    except Exception as e:
        logger.error(f"Embedding generation failed: {str(e)}")
        raise Exception(f"Failed to generate embedding: {str(e)}")


def get_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """
    Get embedding vectors for multiple texts in batch.
    
    Args:
        texts: List of texts to embed
        
    Returns:
        List of embedding vectors
        
    Raises:
        Exception: If any embedding generation fails
    """
    if not texts:
        return []
    
    valid_texts = [t for t in texts if t and t.strip()]
    if not valid_texts:
        raise ValueError("No valid texts to embed")
    
    try:
        logger.info(f"Generating embeddings for {len(valid_texts)} texts")
        
        response = client.embeddings.create(
            model=SILICONFLOW_EMBEDDING_MODEL,
            input=valid_texts
        )
        
        embeddings = [item.embedding for item in response.data]
        logger.info(f"Generated {len(embeddings)} embeddings")
        
        return embeddings
        
    except Exception as e:
        logger.error(f"Batch embedding generation failed: {str(e)}")
        raise Exception(f"Failed to generate embeddings: {str(e)}")