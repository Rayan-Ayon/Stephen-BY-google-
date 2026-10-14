import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';
import {
  ChatMessage as ApiChatMessage,
  sendChatMessage,
  fetchConversations,
  fetchConversationDetails,
  deleteConversation,
} from '@/services/chatbotService';

export interface Citation {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  message_count?: number;
}

interface RayanChatContextType {
  messages: ChatMessage[];
  currentSessionId: string | null;
  sessions: ChatSession[];
  isLoading: boolean;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  startNewChat: () => void;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const RayanChatContext = createContext<RayanChatContextType | undefined>(undefined);

function extractCitations(text: string): Citation[] {
  const citations: Citation[] = [];
  const regex = /\[([^\]]+)\]\((#[^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    citations.push({
      label: match[1],
      href: match[2],
    });
  }
  return citations;
}

export const RayanChatProvider: React.FC<{ children: React.ReactNode; initialEmail?: string }> = ({
  children,
  initialEmail = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(initialEmail);

  // Sync user email from Supabase Auth if not provided
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email && isMounted && !userEmail) {
          setUserEmail(session.user.email);
        }
      } catch (err) {
        console.warn('[RAYAN_CHAT] Could not get user auth session:', err);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  // Load user conversation sessions from backend and/or Supabase
  const loadSessions = useCallback(async () => {
    let resolvedEmail = userEmail;
    if (!resolvedEmail) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        resolvedEmail = session?.user?.email || '';
      } catch (e) {
        // ignore
      }
    }

    try {
      // 1. Fetch from backend advisor conversations API
      const backendSummaries = await fetchConversations(resolvedEmail);
      if (backendSummaries && backendSummaries.length > 0) {
        setSessions(
          backendSummaries.map((s) => ({
            id: s.conversation_id,
            title: s.title || 'Conversation',
            updated_at: s.updated_at || s.created_at || new Date().toISOString(),
            message_count: s.message_count,
          }))
        );
        return;
      }
    } catch (backendErr) {
      console.warn('[RAYAN_CHAT] Backend fetchConversations notice:', backendErr);
    }

    // 2. Supabase fallback if backend table is empty or offline
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await (supabase as any)
          .from('chat_sessions')
          .select('id, title, updated_at')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false });

        if (data && data.length > 0) {
          setSessions(
            data.map((item: any) => ({
              id: item.id,
              title: item.title || 'Conversation',
              updated_at: item.updated_at,
            }))
          );
        }
      }
    } catch (supabaseErr) {
      // Table might not exist in Supabase, which is expected
    }
  }, [userEmail]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const sendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    let resolvedEmail = userEmail;
    let token: string | undefined = undefined;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) resolvedEmail = session.user.email;
      if (session?.access_token) token = session.access_token;
    } catch (e) {
      // ignore
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: timeStr,
    };

    const previousMessages = [...messages, userMsg];
    setMessages(previousMessages);
    setIsLoading(true);

    try {
      // Format history payload for backend
      const historyPayload: ApiChatMessage[] = previousMessages.map((m) => ({
        id: m.id,
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
        timestamp: m.timestamp,
      }));

      // Call canonical backend endpoint
      const res = await sendChatMessage(
        trimmed,
        currentSessionId || undefined,
        historyPayload,
        resolvedEmail
      );

      const replyContent = res.response || '';
      const citations = extractCitations(replyContent);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (res.conversation_id) {
        setCurrentSessionId(res.conversation_id);
      }
      loadSessions();
    } catch (err) {
      console.error('[RAYAN_CHAT] Send failed, attempting secondary route:', err);

      // Attempt secondary generic `/api/chat/message` fallback if available
      try {
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            session_id: currentSessionId,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const replyContent = data.reply || data.content || data.response || '';
        const citations = data.citations || extractCitations(replyContent);

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
        };

        setMessages((prev) => [...prev, aiMsg]);
        if (data.session_id) setCurrentSessionId(data.session_id);
        loadSessions();
      } catch (secondErr) {
        console.error('[RAYAN_CHAT] Secondary endpoint failed:', secondErr);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              "Sorry, I encountered an issue processing your request. Please check your connection and try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const switchSession = async (sessionId: string) => {
    if (!sessionId) return;
    setIsLoading(true);
    setCurrentSessionId(sessionId);

    try {
      // 1. First attempt to load via chatbotService
      const detail = await fetchConversationDetails(sessionId);
      if (detail && detail.messages && detail.messages.length > 0) {
        setMessages(
          detail.messages.map((m: any, idx: number) => ({
            id: m.id || `msg-${idx}-${Date.now()}`,
            role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content || '',
            timestamp: m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            citations: extractCitations(m.content || ''),
          }))
        );
        return;
      }
    } catch (err) {
      console.warn('[RAYAN_CHAT] fetchConversationDetails failed, trying Supabase fallback:', err);
    }

    // 2. Supabase fallback
    try {
      const { data } = await (supabase as any)
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            citations: extractCitations(m.content || ''),
          }))
        );
      }
    } catch (err) {
      console.warn('[RAYAN_CHAT] Supabase chat_messages fallback error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await deleteConversation(sessionId);
    } catch (err) {
      console.warn('[RAYAN_CHAT] Backend delete error:', err);
    }

    try {
      await (supabase as any).from('chat_sessions').delete().eq('id', sessionId);
    } catch (e) {
      // ignore
    }

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      startNewChat();
    }
  };

  return (
    <RayanChatContext.Provider
      value={{
        messages,
        currentSessionId,
        sessions,
        isLoading,
        isHistoryOpen,
        setIsHistoryOpen,
        sendMessage,
        startNewChat,
        switchSession,
        deleteSession,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </RayanChatContext.Provider>
  );
};

export const useRayanChat = () => {
  const ctx = useContext(RayanChatContext);
  if (!ctx) {
    throw new Error('useRayanChat must be used within a RayanChatProvider');
  }
  return ctx;
};

export default RayanChatContext;
