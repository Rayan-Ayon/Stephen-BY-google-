import os
import logging
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.types import Metadata
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

CHROMA_HOST = os.getenv("CHROMA_HOST")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")

if not CHROMA_HOST:
    raise ValueError(
        "CHROMA_HOST is not set in environment variables. "
        "Please add CHROMA_HOST to your .env file."
    )

_client = None


def _get_client() -> chromadb.HttpClient:
    global _client
    if _client is None:
        logger.info(f"Connecting to ChromaDB at: {CHROMA_HOST}")
        
        kwargs = {"host": CHROMA_HOST}
        if CHROMA_API_KEY:
            kwargs["headers"] = {"Authorization": f"Bearer {CHROMA_API_KEY}"}
        
        _client = chromadb.HttpClient(**kwargs)
        logger.info("Connected to ChromaDB")
    
    return _client


def get_collection(name: str) -> chromadb.Collection:
    """
    Get or create a ChromaDB collection.
    
    Args:
        name: Name of the collection
        
    Returns:
        ChromaDB Collection object
    """
    client = _get_client()
    
    try:
        collection = client.get_collection(name=name)
        logger.info(f"Retrieved collection: {name}")
    except Exception:
        collection = client.create_collection(name=name)
        logger.info(f"Created collection: {name}")
    
    return collection


def add_transcript_chunks(
    video_id: str,
    chunks: List[str],
    collection_name: str = "transcripts"
) -> Dict[str, Any]:
    """
    Add transcript chunks to ChromaDB with embeddings.
    
    Args:
        video_id: The YouTube video ID
        chunks: List of text chunks to add
        collection_name: Name of the collection
        
    Returns:
        Dict with count of added chunks
    """
    from app.services.embedding_service import get_embeddings_batch
    
    if not chunks:
        return {"added": 0, "video_id": video_id}
    
    collection = get_collection(collection_name)
    
    embeddings = get_embeddings_batch(chunks)
    
    ids = [f"{video_id}_{i}" for i in range(len(chunks))]
    metadatas = [
        {
            "video_id": video_id,
            "chunk_index": i,
            "text": chunk[:200]
        }
        for i, chunk in enumerate(chunks)
    ]
    
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=chunks
    )
    
    logger.info(f"Added {len(chunks)} chunks for video {video_id}")
    
    return {"added": len(chunks), "video_id": video_id}


def retrieve_relevant_chunks(
    query: str,
    collection_name: str = "transcripts",
    video_id: Optional[str] = None,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Retrieve relevant chunks from ChromaDB based on query.
    
    Args:
        query: The search query
        collection_name: Name of the collection
        video_id: Optional video ID to filter results
        top_k: Number of results to return
        
    Returns:
        List of relevant chunks with metadata
    """
    from app.services.embedding_service import get_embedding
    
    collection = get_collection(collection_name)
    
    query_embedding = get_embedding(query)
    
    where = {"video_id": video_id} if video_id else None
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where,
        include=["documents", "metadatas", "distances"]
    )
    
    if not results or not results.get("documents"):
        return []
    
    documents = results["documents"][0]
    metadatas = results["metadatas"][0] if results.get("metadatas") else []
    distances = results["distances"][0] if results.get("distances") else []
    
    relevant_chunks = []
    for i, doc in enumerate(documents):
        relevant_chunks.append({
            "text": doc,
            "metadata": metadatas[i] if i < len(metadatas) else {},
            "distance": distances[i] if i < len(distances) else None,
            "rank": i + 1
        })
    
    logger.info(f"Retrieved {len(relevant_chunks)} relevant chunks")
    
    return relevant_chunks


def delete_video_chunks(
    video_id: str,
    collection_name: str = "transcripts"
) -> bool:
    """
    Delete all chunks for a specific video.
    
    Args:
        video_id: The YouTube video ID
        collection_name: Name of the collection
        
    Returns:
        True if deleted successfully
    """
    collection = get_collection(collection_name)
    
    try:
        results = collection.get(where={"video_id": video_id})
        if results and results.get("ids"):
            collection.delete(ids=results["ids"])
            logger.info(f"Deleted {len(results['ids'])} chunks for video {video_id}")
            return True
    except Exception as e:
        logger.error(f"Failed to delete chunks: {e}")
    
    return False


def create_video_chunks(
    transcripts: List[Dict[str, Any]],
    chunk_size: int = 1000,
    chunk_overlap: int = 100
) -> List[str]:
    """
    Split transcripts into chunks using recursive character splitting.
    
    Args:
        transcripts: List of transcript items with 'text', 'start', 'duration'
        chunk_size: Maximum chunk size in characters
        chunk_overlap: Overlap between chunks
        
    Returns:
        List of text chunks
    """
    full_transcript = " ".join([
        item.get("text", "") for item in transcripts
    ])
    
    chunks = []
    start = 0
    transcript_len = len(full_transcript)
    
    while start < transcript_len:
        end = start + chunk_size
        
        if end >= transcript_len:
            chunks.append(full_transcript[start:])
            break
        
        search_text = full_transcript[start:end]
        
        for sep in ["\n\n", ".\n ", ".\n", "\n", ". ", ", "]:
            sep_pos = search_text.rfind(sep)
            if sep_pos > chunk_size // 2:
                end = start + sep_pos + len(sep)
                break
        
        chunk = full_transcript[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - chunk_overlap
        if start >= transcript_len:
            break
    
    logger.info(f"Created {len(chunks)} chunks from {len(transcripts)} transcript items")
    
    return chunks