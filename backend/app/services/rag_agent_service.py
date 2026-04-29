import json
import logging
from typing import Any, Literal, List, Dict, Optional
from app.services.db_service import retrieve_relevant_chunks, create_video_chunks, add_transcript_chunks
from app.services.embedding_service import get_embedding
from app.services.video_service import get_youtube_transcript
from app.services.ai_client import get_ai_response, get_ai_response_json, DEFAULT_MODEL

logger = logging.getLogger(__name__)

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100
TOP_K_CHUNKS = 10


class ContextAgent:
    """Retrieves relevant context from ChromaDB for RAG."""
    
    @staticmethod
    def get_context_intent(feature_type: str) -> str:
        """Map feature type to retrieval intent."""
        intents = {
            "summary": "main concepts, key ideas, core themes, important points",
            "flashcards": "factual information, definitions, key terms, important details",
            "quiz": "testable facts, specific details, dates, numbers, definitions",
            "notes": "comprehensive topics, structured information, key concepts"
        }
        return intents.get(feature_type, "important information")
    
    @staticmethod
    def retrieve_context(video_id: str, feature_type: str, top_k: int = TOP_K_CHUNKS) -> List[Dict[str, Any]]:
        """
        Retrieve relevant chunks from ChromaDB based on feature type.
        """
        intent = ContextAgent.get_context_intent(feature_type)
        query = f"Extract {intent} from this video. Focus on actionable insights and key details."
        
        try:
            chunks = retrieve_relevant_chunks(
                query=query,
                collection_name="transcripts",
                video_id=video_id,
                top_k=top_k
            )
            
            if not chunks:
                logger.warning(f"No chunks found in ChromaDB for {video_id}, falling back to transcript")
                return []
            
            logger.info(f"Retrieved {len(chunks)} relevant chunks for {feature_type}")
            return chunks
            
        except Exception as e:
            logger.error(f"Context retrieval failed: {e}")
            return []
    
    @staticmethod
    async def ensure_chunks_indexed_async(video_id: str) -> bool:
        """
        Ensure video chunks are indexed in ChromaDB. If not, create and add them.
        Async version.
        """
        try:
            test_chunks = retrieve_relevant_chunks(
                query="test",
                collection_name="transcripts",
                video_id=video_id,
                top_k=1
            )
            
            if test_chunks:
                return True
            
            logger.info(f"No chunks found for {video_id}, indexing transcript...")
            transcript = await get_youtube_transcript(video_id)
            chunks = create_video_chunks(transcript, CHUNK_SIZE, CHUNK_OVERLAP)
            add_transcript_chunks(video_id, chunks, "transcripts")
            logger.info(f"Indexed {len(chunks)} chunks for {video_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to ensure chunks indexed: {e}")
            return False
    
    @staticmethod
    def ensure_chunks_indexed(video_id: str) -> bool:
        """
        Ensure video chunks are indexed in ChromaDB. Sync wrapper.
        """
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                logger.warning("Cannot sync index while async loop running")
                return False
            return loop.run_until_complete(ContextAgent.ensure_chunks_indexed_async(video_id))
        except:
            return False


class SummaryAgent:
    """Generates context-aware summaries with timestamps."""
    
    @staticmethod
    def generate(chunks: List[Dict[str, Any]], video_id: str) -> Dict[str, Any]:
        """Generate deep-dive summary with timestamps."""
        
        if not chunks:
            raise Exception("No context available for summary generation")
        
        context_with_timestamps = []
        for chunk in chunks:
            metadata = chunk.get("metadata", {})
            chunk_index = metadata.get("chunk_index", 0)
            start_time = chunk_index * CHUNK_SIZE // 100
            minutes = start_time // 60
            seconds = start_time % 60
            
            context_with_timestamps.append({
                "text": chunk["text"],
                "timestamp": f"{minutes}:{seconds:02d}",
                "chunk_id": f"{video_id}_{chunk_index}"
            })
        
        context_text = "\n\n".join([
            f"[{c['timestamp']}] (ID: {c['chunk_id']}) {c['text']}"
            for c in context_with_timestamps
        ])
        
        prompt = f"""You are an expert content summarizer. Based on the following retrieved video segments, create a deep-dive summary.

REQUIREMENTS:
1. Create a brief overview paragraph (2-3 sentences)
2. Create 5-8 key bullet points with timestamps
3. Each bullet point should reference the timestamp from the source
4. Focus on actionable insights and core concepts

OUTPUT FORMAT (JSON):
{{
  "paragraph": "Overview here...",
  "bullets": [
    {{"text": "Key point", "timestamp": "MM:SS"}},
    ...
  ]
}}

RETRIEVED CONTEXT:
{context_text}

Generate the summary:"""

        result = get_ai_response_json(prompt)
        
        return {
            "paragraph": result.get("paragraph", ""),
            "bullets": result.get("bullets", []),
            "sources": [
                {
                    "chunk_id": c["chunk_id"], 
                    "timestamp": c["timestamp"],
                    "text": c["text"][:100] + "..."
                }
                for c in context_with_timestamps
            ]
        }


class FlashcardAgent:
    """Generates Anki-style flashcards from context."""
    
    @staticmethod
    def generate(chunks: List[Dict[str, Any]], video_id: str) -> Dict[str, Any]:
        """Generate flashcards with source references."""
        
        if not chunks:
            raise Exception("No context available for flashcard generation")
        
        context_text = "\n\n".join([
            f"Source {i+1} (chunk_{chunks[i].get('metadata', {}).get('chunk_index', i)}): {chunk['text'][:500]}"
            for i, chunk in enumerate(chunks[:5])
        ])
        
        prompt = f"""You are an expert study flashcard creator. Based on the following video segments, create 5-10 Anki-style flashcards.

REQUIREMENTS:
1. Each card must be based ONLY on the provided sources
2. Questions should test understanding, not just recall
3. Answers should be concise but complete
4. Each card must include a source_chunk_id for verification
5. Include difficulty level: easy, medium, or hard

OUTPUT FORMAT (JSON):
{{
  "flashcards": [
    {{
      "question": "Question text?",
      "answer": "Answer text",
      "difficulty": "easy|medium|hard",
      "source_chunk_id": "videoId_chunkIndex"
    }}
  ]
}}

VIDEO SEGMENTS:
{context_text}

Generate flashcards:"""

        result = get_ai_response_json(prompt)
        
        flashcards = result.get("flashcards", [])
        
        for i, card in enumerate(flashcards):
            if "source_chunk_id" not in card or not card["source_chunk_id"]:
                chunk_meta = chunks[i % len(chunks)].get("metadata", {})
                card["source_chunk_id"] = f"{video_id}_{chunk_meta.get('chunk_index', i)}"
        
        return {"flashcards": flashcards}


class QuizAgent:
    """Generates quiz questions with source references."""
    
    @staticmethod
    def generate(chunks: List[Dict[str, Any]], video_id: str) -> Dict[str, Any]:
        """Generate quiz with source references."""
        
        if not chunks:
            raise Exception("No context available for quiz generation")
        
        context_with_sources = []
        for chunk in chunks:
            metadata = chunk.get("metadata", {})
            chunk_index = metadata.get("chunk_index", 0)
            start_time = chunk_index * CHUNK_SIZE // 100
            minutes = start_time // 60
            seconds = start_time % 60
            
            context_with_sources.append({
                "text": chunk["text"][:400],
                "timestamp": f"{minutes}:{seconds:02d}",
                "chunk_id": f"{video_id}_{chunk_index}"
            })
        
        context_text = "\n\n".join([
            f"[{c['timestamp']}] (ID: {c['chunk_id']}) {c['text']}"
            for c in context_with_sources
        ])
        
        prompt = f"""You are an expert quiz creator. Based on the following video segments, create a 5-question multiple choice quiz.

REQUIREMENTS:
1. Each question must be based ONLY on the provided sources
2. Each question must have exactly 4 options
3. Correct answer should be 0, 1, 2, or 3 (index)
4. Each question must include source timestamp and chunk_id for verification
5. Distractor options should be plausible but incorrect

OUTPUT FORMAT (JSON):
{{
  "quiz": [
    {{
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "source": "MM:SS",
      "source_chunk_id": "videoId_chunkIndex"
    }}
  ]
}}

VIDEO SEGMENTS:
{context_text}

Generate the quiz:"""

        result = get_ai_response_json(prompt)
        
        quiz = result.get("quiz", [])
        
        for i, q in enumerate(quiz):
            if not q.get("source_chunk_id"):
                src = context_with_sources[i % len(context_with_sources)]
                q["source"] = src["timestamp"]
                q["source_chunk_id"] = src["chunk_id"]
        
        return {"quiz": quiz}


class NotesAgent:
    """Generates structured notes from context."""
    
    @staticmethod
    def generate(chunks: List[Dict[str, Any]], video_id: str) -> Dict[str, Any]:
        """Generate structured markdown notes."""
        
        if not chunks:
            raise Exception("No context available for notes generation")
        
        context_text = "\n\n".join([
            chunk["text"] for chunk in chunks
        ])
        
        prompt = f"""You are an expert note-taker. Based on the following video segments, create comprehensive study notes in markdown format.

REQUIREMENTS:
1. Include ## Key Concepts section
2. Include ## Important Details section
3. Include ## Summary section
4. Use bullet points and structured formatting
5. Be comprehensive but concise

OUTPUT FORMAT:
Just output the markdown, no extra text.

VIDEO SEGMENTS:
{context_text}

Generate notes:"""

        notes = get_ai_response(prompt)
        
        return {"notes": notes}


def generate_context_aware(
    video_id: str,
    feature_type: Literal["summary", "flashcards", "quiz", "notes"],
    force_refresh: bool = False
) -> Dict[str, Any]:
    """
    Main entry point for context-aware generation.
    Uses multi-agent orchestration to generate RAG-based content.
    """
    logger.info(f"Generating context-aware {feature_type} for {video_id}")
    
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            raise Exception("Cannot use sync function in async context - use async version")
    except:
        pass
    
    try:
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(generate_context_aware_async(video_id, feature_type))
    except:
        return {}


def generate_context_aware(
    video_id: str,
    feature_type: Literal["summary", "flashcards", "quiz", "notes"],
    force_refresh: bool = False
) -> Dict[str, Any]:
    """
    Sync wrapper for context-aware generation.
    """
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            raise Exception("Cannot use sync function in async context")
        return loop.run_until_complete(generate_context_aware_async(video_id, feature_type, force_refresh))
    except:
        return {"error": "Failed to generate context-aware content"}


async def generate_context_aware_async(
    video_id: str,
    feature_type: Literal["summary", "flashcards", "quiz", "notes"],
    force_refresh: bool = False
) -> Dict[str, Any]:
    """
    Async version of context-aware generation.
    Uses multi-agent orchestration to generate RAG-based content.
    """
    logger.info(f"Generating context-aware {feature_type} for {video_id}")
    
    await ContextAgent.ensure_chunks_indexed_async(video_id)
    
    chunks = ContextAgent.retrieve_context(video_id, feature_type)
    
    if not chunks:
        logger.warning(f"No chunks retrieved, using transcript fallback")
        transcript = await get_youtube_transcript(video_id)
        chunks_text = create_video_chunks(transcript, CHUNK_SIZE, CHUNK_OVERLAP)
        chunks = [{"text": t, "metadata": {}} for t in chunks_text]
    
    if feature_type == "summary":
        result = SummaryAgent.generate(chunks, video_id)
    elif feature_type == "flashcards":
        result = FlashcardAgent.generate(chunks, video_id)
    elif feature_type == "quiz":
        result = QuizAgent.generate(chunks, video_id)
    elif feature_type == "notes":
        result = NotesAgent.generate(chunks, video_id)
    else:
        raise ValueError(f"Unknown feature type: {feature_type}")
    
    result["context_used"] = len(chunks)
    result["video_id"] = video_id
    
    return result