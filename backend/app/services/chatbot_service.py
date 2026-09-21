import json
import logging
import time
import uuid
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy import select, delete, desc
from sqlalchemy.ext.asyncio import AsyncSession
from google import genai
from google.genai import types

from app.core.config import GEMINI_MODEL
from app.db.models import IELTSAdvisorConversation
from app.schemas.chatbot import ChatMessage
from app.services.llm_service import get_client
from app.services.ai_client import get_ai_response

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the Official IELTS & Study Abroad AI Advisor. Your primary purpose is to help users with:
1. IELTS Exam Preparation (Reading, Listening, Writing, Speaking strategies, band descriptors, study plans, test formats).
2. University Admissions & Study Abroad Guidance (requirements, application steps, visa processes, scholarships, country-specific guidelines).
3. English Proficiency & Score Improvement.

STRICT GUARDRAILS & BOUNDARIES:
- If a user asks a query related to IELTS, English proficiency, university admissions, study abroad, visas, scholarships, or academic guidance, provide a helpful, structured, and encouraging response.
- If a user asks an OFF-TOPIC query (e.g., coding, general trivia, recipes, sports, casual jokes, non-academic topics), you MUST decline gracefully with the following standard response or a slight variation:
"I am specifically designed to assist you with IELTS preparation, study abroad guidance, and university admissions. Please ask me any questions related to these topics!"
"""

STANDARD_REFUSAL = (
    "I am specifically designed to assist you with IELTS preparation, "
    "study abroad guidance, and university admissions. Please ask me any questions related to these topics!"
)


def _build_gemini_contents(
    history: Optional[List[ChatMessage]],
    current_message: str
) -> List[types.Content]:
    """Convert conversation history and current prompt into google-genai Content structures."""
    contents: List[types.Content] = []
    
    if history:
        # Take the most recent 12 messages for relevant context
        for msg in history[-12:]:
            role = "model" if msg.role in ("model", "assistant") else "user"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.content)]
                )
            )

    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=current_message)]
        )
    )
    return contents


def _build_openrouter_messages(
    history: Optional[List[ChatMessage]],
    current_message: str
) -> List[dict]:
    """Build messages array for OpenRouter fallback."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for msg in history[-12:]:
            role = "assistant" if msg.role in ("model", "assistant") else "user"
            messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": current_message})
    return messages


async def generate_advisor_response(
    message: str,
    history: Optional[List[ChatMessage]] = None,
) -> str:
    """Generate response using Gemini with strict IELTS & Study Abroad system instructions."""
    client = get_client()
    contents = _build_gemini_contents(history, message)
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.7,
    )

    fallback_models = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-3.1-flash-lite"]
    last_error = None

    for model_name in fallback_models:
        try:
            logger.info(f"Invoking IELTS Advisor model: {model_name}")
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=contents,
                config=config,
            )
            text = (response.text or "").strip()
            if text:
                return text
        except Exception as e:
            last_error = e
            logger.warning(f"Model {model_name} failed: {e}. Trying next fallback...")
            continue

    # Secondary fallback: OpenRouter
    try:
        logger.info("Gemini models failed. Attempting OpenRouter fallback...")
        from openai import OpenAI
        import os
        or_key = os.getenv("OPENROUTER_API_KEY")
        if or_key:
            or_client = OpenAI(
                api_key=or_key,
                base_url="https://openrouter.ai/api/v1",
                timeout=60.0,
            )
            messages = _build_openrouter_messages(history, message)
            resp = or_client.chat.completions.create(
                model="openrouter/free",
                messages=messages,
            )
            content = resp.choices[0].message.content
            if content:
                return content.strip()
    except Exception as e:
        logger.error(f"OpenRouter fallback also failed: {e}")

    if last_error:
        raise last_error
    return STANDARD_REFUSAL


async def process_chat(
    db: AsyncSession,
    message: str,
    conversation_id: Optional[str] = None,
    history: Optional[List[ChatMessage]] = None,
    user_email: Optional[str] = "",
) -> Tuple[str, str, str, str]:
    """
    Process user message, generate advisor response, and persist into database.
    Returns: (response_text, final_conversation_id, conversation_title, timestamp_iso)
    """
    conv_id = conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.utcnow().isoformat()

    # Load or initialize conversation in DB
    query = select(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conv_id
    )
    result = await db.execute(query)
    conv_record = result.scalars().first()

    messages_list: List[dict] = []
    title = ""

    if conv_record:
        try:
            messages_list = json.loads(conv_record.messages_json or "[]")
        except Exception:
            messages_list = []
        title = conv_record.title
    else:
        # Title derived from first query
        trimmed = message.strip()
        title = trimmed[:40] + "..." if len(trimmed) > 40 else trimmed
        conv_record = IELTSAdvisorConversation(
            conversation_id=conv_id,
            user_email=user_email or "",
            title=title,
            messages_json="[]",
        )
        db.add(conv_record)

    # Reconstruct history if client didn't supply it
    if not history and messages_list:
        reconstructed: List[ChatMessage] = []
        for m in messages_list:
            reconstructed.append(
                ChatMessage(
                    id=m.get("id"),
                    role=m.get("role", "user"),
                    content=m.get("content", ""),
                    timestamp=m.get("timestamp"),
                )
            )
        history = reconstructed

    # Generate AI response
    response_text = await generate_advisor_response(message, history)

    # Append user & model messages to persistence record
    user_entry = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "role": "user",
        "content": message.strip(),
        "timestamp": now_iso,
    }
    model_entry = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "role": "model",
        "content": response_text,
        "timestamp": datetime.utcnow().isoformat(),
    }
    messages_list.append(user_entry)
    messages_list.append(model_entry)

    conv_record.messages_json = json.dumps(messages_list)
    conv_record.updated_at = datetime.utcnow()
    if user_email and not conv_record.user_email:
        conv_record.user_email = user_email

    await db.commit()
    await db.refresh(conv_record)

    return response_text, conv_id, conv_record.title, now_iso


async def get_user_conversations(
    db: AsyncSession,
    user_email: str,
) -> List[dict]:
    """Retrieve all conversations for the user sorted by updated_at descending."""
    query = (
        select(IELTSAdvisorConversation)
        .where(IELTSAdvisorConversation.user_email == user_email)
        .order_by(desc(IELTSAdvisorConversation.updated_at))
    )
    result = await db.execute(query)
    rows = result.scalars().all()

    summaries = []
    for r in rows:
        msgs = []
        try:
            msgs = json.loads(r.messages_json or "[]")
        except Exception:
            msgs = []
        last_msg = msgs[-1]["content"] if msgs else ""
        summaries.append({
            "conversation_id": r.conversation_id,
            "title": r.title,
            "message_count": len(msgs),
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "updated_at": r.updated_at.isoformat() if r.updated_at else "",
            "last_message": last_msg[:80] + "..." if len(last_msg) > 80 else last_msg,
        })
    return summaries


async def get_conversation_details(
    db: AsyncSession,
    conversation_id: str,
) -> Optional[dict]:
    """Retrieve a full conversation with all messages."""
    query = select(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conversation_id
    )
    result = await db.execute(query)
    record = result.scalars().first()
    if not record:
        return None

    msgs = []
    try:
        msgs = json.loads(record.messages_json or "[]")
    except Exception:
        msgs = []

    return {
        "conversation_id": record.conversation_id,
        "title": record.title,
        "messages": msgs,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else "",
    }


async def delete_conversation(
    db: AsyncSession,
    conversation_id: str,
) -> bool:
    """Delete a conversation by ID."""
    stmt = delete(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conversation_id
    )
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0


async def clear_all_conversations(
    db: AsyncSession,
    user_email: str,
) -> int:
    """Clear all conversations for a user."""
    stmt = delete(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.user_email == user_email
    )
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount
