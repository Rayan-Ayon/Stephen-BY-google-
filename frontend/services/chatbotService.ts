export interface ChatMessage {
    id?: string;
    role: 'user' | 'model' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface ChatResponse {
    response: string;
    conversation_id: string;
    title: string;
    timestamp: string;
    is_off_topic: boolean;
}

export interface ConversationSummary {
    conversation_id: string;
    title: string;
    message_count: number;
    created_at: string;
    updated_at: string;
    last_message?: string;
}

export interface ConversationDetail {
    conversation_id: string;
    title: string;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
}

const API_BASE = '/api/chatbot';

export async function sendChatMessage(
    message: string,
    conversationId?: string,
    history?: ChatMessage[],
    userEmail?: string
): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            conversation_id: conversationId,
            history: history?.map(h => ({
                id: h.id,
                role: h.role === 'assistant' ? 'model' : h.role,
                content: h.content,
                timestamp: h.timestamp,
            })),
            user_email: userEmail || '',
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Chat error (${res.status}): ${errText}`);
    }

    return await res.json();
}

export async function fetchConversations(userEmail?: string): Promise<ConversationSummary[]> {
    const query = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
    const res = await fetch(`${API_BASE}/conversations${query}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error(`Failed to load conversations: ${res.statusText}`);
    }

    return await res.json();
}

export async function fetchConversationDetails(conversationId: string): Promise<ConversationDetail> {
    const res = await fetch(`${API_BASE}/conversations/${encodeURIComponent(conversationId)}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error(`Failed to load conversation details: ${res.statusText}`);
    }

    return await res.json();
}

export async function deleteConversation(conversationId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/conversations/${encodeURIComponent(conversationId)}`, {
        method: 'DELETE',
    });

    return res.ok;
}

export async function clearAllConversations(userEmail: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/conversations/clear?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
    });

    return res.ok;
}
