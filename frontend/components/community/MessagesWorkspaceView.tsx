import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  CohortMetadata,
  ProfileUser,
  Conversation,
  ChatMessageItem,
} from '@/types/community';
import {
  INITIAL_COHORT_MESSAGES,
  INITIAL_CONVERSATIONS,
  INITIAL_PROFILES,
} from './mockCommunityData';
import { AudioVoiceNotePlayer } from './AudioVoiceNotePlayer';
import { obsidianTokens } from './obsidianTokens';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Mail,
  Paperclip,
  Mic,
  Send,
  CheckCircle2,
  Users,
  Image as ImageIcon,
  X,
  Radio,
  User,
  ExternalLink,
  Square,
  Sparkles,
} from 'lucide-react';

interface MessagesWorkspaceViewProps {
  cohort: CohortMetadata;
  userEmail?: string;
  initialConvId?: string;
  targetUser?: ProfileUser | null;
  onBackToHq: () => void;
  onSelectProfile: (member: ProfileUser) => void;
}

export const MessagesWorkspaceView: React.FC<MessagesWorkspaceViewProps> = ({
  cohort,
  userEmail,
  initialConvId,
  targetUser,
  onBackToHq,
  onSelectProfile,
}) => {
  // Active conversation state: default to 'conv-cohort-group' or initialConvId
  const [activeConvId, setActiveConvId] = useState<string>(
    initialConvId || 'conv-cohort-group'
  );

  // Conversations list (Cohort channel + DMs)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [searchFilter, setSearchFilter] = useState('');

  // Messages state grouped by conversationId
  const [cohortMessages, setCohortMessages] = useState<ChatMessageItem[]>(INITIAL_COHORT_MESSAGES);
  const [dmStore, setDmStore] = useState<Record<string, ChatMessageItem[]>>({
    'dm-stephen': [
      {
        id: 'dm-m-0',
        conversationId: 'dm-stephen',
        senderId: 'current-user-id',
        senderName: 'You',
        content: 'Hello Dr. Stephen, could you review my paragraph transitions in Cambridge 18 Test 2?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'dm-m-1',
        conversationId: 'dm-stephen',
        senderId: 'm1111111-1111-4111-1111-111111111111',
        senderName: 'Dr. Stephen Vance',
        senderRole: 'mentor',
        content: 'Great job on Task 2 thesis statement! Keep this academic precision.',
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ],
    'dm-ayesha': [
      {
        id: 'dm-m-3',
        conversationId: 'dm-ayesha',
        senderId: 'u-ayesha',
        senderName: 'Ayesha Rahman',
        senderUsername: 'ayesha_r',
        content: 'I uploaded my benchmark essay for Task 2. Let me know what you think!',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
    ],
    'dm-samira': [
      {
        id: 'dm-m-4',
        conversationId: 'dm-samira',
        senderId: 'u-samira',
        senderName: 'Samira Akter',
        senderUsername: 'samira_a',
        content: 'Hey, do you have notes for Part 3?',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
    'dm-tanvir': [
      {
        id: 'dm-m-2',
        conversationId: 'dm-tanvir',
        senderId: 'u-tanvir',
        senderName: 'Tanvir Hossain',
        senderUsername: 'tanvir_ielts',
        content: 'Hey, do you want to do a peer mock test on Speaking Part 2 tonight at 9 PM?',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  });

  // Composer States
  const [inputText, setInputText] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If targetUser was provided, navigate directly to or create their DM thread
  useEffect(() => {
    if (!targetUser) return;

    const existing = conversations.find(
      (c) => c.recipient?.id === targetUser.id || c.recipient?.username === targetUser.username
    );

    if (existing) {
      setActiveConvId(existing.id);
    } else {
      const newConvId = `dm-${targetUser.username || targetUser.id}`;
      const newConv: Conversation = {
        id: newConvId,
        type: 'direct_message',
        title: targetUser.fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
        recipient: targetUser,
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConvId);

      setDmStore((prev) => ({
        ...prev,
        [newConvId]: [
          {
            id: `sys-${Date.now()}`,
            conversationId: newConvId,
            senderId: 'system',
            senderName: 'Stephen System',
            content: `Encrypted direct messaging channel initialized with ${targetUser.fullName}.`,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    }
  }, [targetUser]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const isCohortActive = activeConvId === 'conv-cohort-group';
  const currentMessages = isCohortActive
    ? cohortMessages
    : dmStore[activeConvId] || [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length, activeConvId, scrollToBottom]);

  // Hydrate Supabase Realtime messages for active conversation
  useEffect(() => {
    let isSubscribed = true;

    async function loadChatMessages() {
      try {
        const { data, error } = await (supabase as any)
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', activeConvId)
          .order('created_at', { ascending: true });

        if (isSubscribed && !error && data && data.length > 0) {
          const mapped: ChatMessageItem[] = data.map((m: any) => ({
            id: m.id,
            conversationId: m.conversation_id,
            senderId: m.sender_id,
            senderName: m.sender_name || 'Candidate',
            senderUsername: m.sender_username,
            senderAvatar: m.sender_avatar,
            senderRole: m.sender_role || 'student',
            content: m.content,
            audioUrl: m.audio_url,
            mediaUrl: m.media_url,
            isPinned: Boolean(m.is_pinned),
            createdAt: m.created_at,
          }));

          if (isCohortActive) {
            setCohortMessages(mapped);
          } else {
            setDmStore((prev) => ({ ...prev, [activeConvId]: mapped }));
          }
        }
      } catch {
        // Fallback to local store
      }
    }

    loadChatMessages();

    // Subscribe to Postgres Realtime INSERT events
    const channel = (supabase as any)
      ?.channel(`chat:${activeConvId}`)
      ?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload: any) => {
          if (!isSubscribed) return;
          const newMsg: ChatMessageItem = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name || 'Candidate',
            senderUsername: payload.new.sender_username,
            senderAvatar: payload.new.sender_avatar,
            senderRole: payload.new.sender_role || 'student',
            content: payload.new.content,
            audioUrl: payload.new.audio_url,
            mediaUrl: payload.new.media_url,
            isPinned: Boolean(payload.new.is_pinned),
            createdAt: payload.new.created_at,
          };

          if (isCohortActive) {
            setCohortMessages((prev) => [...prev, newMsg]);
          } else {
            setDmStore((prev) => ({
              ...prev,
              [activeConvId]: [...(prev[activeConvId] || []), newMsg],
            }));
          }
        }
      )
      ?.subscribe();

    return () => {
      isSubscribed = false;
      if (channel) {
        (supabase as any).removeChannel(channel);
      }
    };
  }, [activeConvId, isCohortActive]);

  // Voice Note Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      // Mock recording fallback
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const stopAndSendRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    let finalAudioUrl = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        finalAudioUrl = URL.createObjectURL(audioBlob);
      }
    }

    setIsRecording(false);
    setRecordingSeconds(0);

    const newMsg: ChatMessageItem = {
      id: `voice-${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'current-user-id',
      senderName: userEmail?.split('@')[0] || 'You',
      senderUsername: userEmail?.split('@')[0] || 'candidate',
      senderRole: 'student',
      audioUrl: finalAudioUrl,
      createdAt: new Date().toISOString(),
    };

    if (isCohortActive) {
      setCohortMessages((prev) => [...prev, newMsg]);
    } else {
      setDmStore((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), newMsg],
      }));
    }

    try {
      await (supabase as any).from('chat_messages').insert([
        {
          conversation_id: activeConvId,
          sender_id: 'current-user-id',
          sender_name: userEmail?.split('@')[0] || 'You',
          sender_role: 'student',
          audio_url: finalAudioUrl,
        },
      ]);
    } catch {
      // Local state is preserved
    }
  };

  // Attachment Handler
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAttachment(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAttachmentPreview(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const removeAttachment = () => {
    setSelectedAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send Text / Image Message
  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed && !selectedAttachment) return;

    const mediaUrl = attachmentPreview || undefined;

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'current-user-id',
      senderName: userEmail?.split('@')[0] || 'You',
      senderUsername: userEmail?.split('@')[0] || 'candidate',
      senderRole: 'student',
      content: trimmed,
      mediaUrl: mediaUrl,
      createdAt: new Date().toISOString(),
    };

    if (isCohortActive) {
      setCohortMessages((prev) => [...prev, newMsg]);
    } else {
      setDmStore((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), newMsg],
      }));

      // Update last message preview in conversations list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: newMsg, updatedAt: new Date().toISOString() }
            : c
        )
      );
    }

    setInputText('');
    removeAttachment();

    try {
      await (supabase as any).from('chat_messages').insert([
        {
          conversation_id: activeConvId,
          sender_id: 'current-user-id',
          sender_name: userEmail?.split('@')[0] || 'You',
          sender_role: 'student',
          content: trimmed,
          media_url: mediaUrl,
        },
      ]);
    } catch {
      // Local state is preserved
    }
  };

  // Filtered direct message conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      c.title?.toLowerCase().includes(term) ||
      c.recipient?.fullName?.toLowerCase().includes(term) ||
      c.recipient?.username?.toLowerCase().includes(term)
    );
  });

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const activeRecipient = activeConversation?.recipient;

  return (
    <div className="h-screen w-full bg-[#0D0F12] text-slate-100 flex flex-col overflow-hidden">
      {/* ====================================================================
          TOP NAVIGATION BAR
          ==================================================================== */}
      <header className="h-16 shrink-0 bg-[#0F1115] border-b border-[#222732] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
        {/* Left: Back to Community HQ */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHq}
            className="bg-[#15181E] text-slate-200 hover:text-white border border-[#222732] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-[#1C212B] transition-all shadow-sm cursor-pointer"
            title="Return to Cohort Community Headquarters"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>Back to Community HQ</span>
          </button>

          <div className="h-5 w-px bg-[#222732] hidden sm:block" />

          {/* Center-Left: Batch identity */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Batch #08 — Messaging Center
            </h1>
          </div>
        </div>

        {/* Right: Search Filter */}
        <div className="relative w-48 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[#15181E] border border-[#222732] text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-rose-600 transition-all shadow-inner"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </header>

      {/* ====================================================================
          TWO-PANEL MESSAGING WORKSPACE BODY
          ==================================================================== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ==================================================================
            LEFT PANEL: CONVERSATION SELECTOR (1/3 Width - 350px)
            ================================================================== */}
        <aside className="w-full md:w-80 lg:w-[350px] shrink-0 bg-[#0F1115] border-r border-[#222732] flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto divide-y divide-[#222732]/40 custom-scrollbar p-3 space-y-4">
            {/* SECTION 1: 📌 PINNED CHANNELS */}
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-400/90 tracking-wider uppercase">
                <span>📌</span>
                <span>PINNED CHANNELS</span>
              </div>

              <div className="mt-1.5 space-y-1">
                <button
                  onClick={() => setActiveConvId('conv-cohort-group')}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                    isCohortActive
                      ? 'bg-[#15181E] border-l-3 border-rose-600 shadow-md text-white'
                      : 'hover:bg-[#15181E]/60 text-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        #batch-08-general
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-800/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        34
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      <span className="text-amber-400 font-semibold">Dr. Stephen:</span> @tanvir_ielts Embedding thesis statement...
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION 2: ✉️ DIRECT MESSAGES (DMs) */}
            <div className="pt-3">
              <div className="flex items-center justify-between px-3 py-1 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>DIRECT MESSAGES</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {filteredConversations.length} Active
                </span>
              </div>

              <div className="mt-1.5 space-y-1">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isSelected = activeConvId === conv.id;
                    const recipient = conv.recipient;
                    const isMentor = recipient?.isMentor || conv.id === 'dm-stephen';

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConvId(conv.id)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#15181E] border-l-3 border-rose-600 shadow-md text-white'
                            : 'hover:bg-[#15181E]/60 text-slate-300'
                        }`}
                      >
                        {/* Avatar with status indicator */}
                        <div className="relative shrink-0">
                          <img
                            src={
                              recipient?.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
                            }
                            alt={recipient?.fullName || conv.title}
                            className="w-10 h-10 rounded-full object-cover border border-[#222732]"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0F1115] ${
                              isMentor || conv.id === 'dm-ayesha'
                                ? 'bg-emerald-400'
                                : 'bg-slate-500'
                            }`}
                          />
                        </div>

                        {/* Thread metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                                {recipient?.fullName || conv.title}
                              </span>
                              {isMentor && (
                                <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0">
                                  Mentor
                                </span>
                              )}
                            </div>

                            {conv.unreadCount && conv.unreadCount > 0 ? (
                              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                                {conv.unreadCount}
                              </span>
                            ) : null}
                          </div>

                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {conv.lastMessage?.content ||
                              (conv.lastMessage?.audioUrl ? '🎙️ Voice message' : 'No messages yet')}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No conversations match "{searchFilter}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================================
            RIGHT PANEL: ACTIVE CONVERSATION PANE (2/3 Width - Remaining space)
            ================================================================== */}
        <main className="flex-1 flex flex-col h-full bg-[#0D0F12] overflow-hidden">
          {/* Active Conversation Header */}
          <div className="h-16 shrink-0 bg-[#15181E] border-b border-[#222732] px-6 flex items-center justify-between gap-4 z-10">
            {isCohortActive ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      #batch-08-general (Cohort Chat)
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      34 Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    50 Students Enrolled • Mentor: Dr. Stephen Vance (Verified)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={
                    activeRecipient?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
                  }
                  alt={activeRecipient?.fullName || activeConversation?.title}
                  className="w-10 h-10 rounded-full object-cover border border-[#222732]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {activeRecipient?.fullName || activeConversation?.title}
                    </h2>
                    {activeRecipient?.isMentor && (
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                        Mentor
                        <CheckCircle2 className="w-3 h-3 fill-emerald-400/20" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span>@{activeRecipient?.username || 'candidate'}</span>
                    <span>•</span>
                    <span className="text-amber-400">
                      Target Band {activeRecipient?.targetBand || 7.5}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Header Right Action: View Profile */}
            {!isCohortActive && activeRecipient && (
              <button
                onClick={() => onSelectProfile(activeRecipient)}
                className="px-3 py-1.5 bg-[#181C24] hover:bg-[#222732] text-slate-300 hover:text-white border border-[#222732] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>View Profile</span>
              </button>
            )}
          </div>

          {/* Real-time Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            {currentMessages.length > 0 ? (
              currentMessages.map((msg) => {
                const isSelf = msg.senderId === 'current-user-id';
                const isMentorMsg = msg.senderRole === 'mentor';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender Identity & Role Badge */}
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-bold text-slate-300">
                        {isSelf ? 'You' : msg.senderName}
                      </span>

                      {isMentorMsg && (
                        <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 font-bold text-[10px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          Mentor
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </span>
                      )}

                      {!isSelf && !isMentorMsg && (
                        <span className="bg-[#181C24] text-slate-400 border border-[#222732] text-[10px] px-1.5 py-0.2 rounded">
                          Student
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Message Bubble Container */}
                    <div
                      className={`max-w-xl sm:max-w-2xl rounded-2xl p-4 shadow-sm ${
                        isSelf
                          ? 'bg-rose-950/30 border border-rose-800/40 text-slate-100 rounded-tr-xs'
                          : 'bg-[#15181E] border border-[#222732] text-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {/* Text Content */}
                      {msg.content && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}

                      {/* Voice Note Audio Player */}
                      {msg.audioUrl && (
                        <div className="mt-2">
                          <AudioVoiceNotePlayer
                            audioUrl={msg.audioUrl}
                            senderRole={isMentorMsg ? 'mentor' : 'student'}
                            durationSeconds={28}
                          />
                        </div>
                      )}

                      {/* Media Image Attachment */}
                      {msg.mediaUrl && (
                        <div className="mt-2.5 rounded-xl overflow-hidden border border-[#222732] max-w-sm">
                          <img
                            src={msg.mediaUrl}
                            alt="Attached file"
                            className="w-full h-auto object-cover max-h-64 rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No messages in this conversation yet</p>
                <p className="text-xs text-slate-600 mt-1">
                  Start the discussion by typing a message or recording a voice note below.
                </p>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Composer Dock */}
          <div className="shrink-0 bg-[#15181E] border-t border-[#222732] p-3 sm:p-4">
            {/* Attachment Preview Bar */}
            {selectedAttachment && (
              <div className="mb-2.5 flex items-center gap-3 p-2 bg-[#181C24] border border-[#222732] rounded-xl max-w-md animate-in fade-in duration-150">
                {attachmentPreview ? (
                  <img
                    src={attachmentPreview}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-[#222732]"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400 p-1 bg-[#15181E] rounded-lg" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {selectedAttachment.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(selectedAttachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeAttachment}
                  className="p-1 hover:bg-[#222732] text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Audio Recording Active Bar */}
            {isRecording && (
              <div className="mb-2.5 flex items-center justify-between p-3 bg-red-950/40 border border-red-800/50 rounded-xl animate-pulse">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-rose-300">
                    Recording Audio Note ({recordingSeconds}s)...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelRecording}
                    className="px-3 py-1 bg-[#181C24] hover:bg-[#222732] text-slate-300 hover:text-white border border-[#222732] rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={stopAndSendRecording}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Audio</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Dock Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleAttachmentChange}
                className="hidden"
              />

              {/* [ 📎 Attachment Button ] */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-[#181C24] border border-[#222732] rounded-xl transition-all cursor-pointer shrink-0"
                title="Attach file or screenshot"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Message text input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isCohortActive
                      ? 'Message #batch-08-general...'
                      : `Message @${activeRecipient?.username || 'candidate'}...`
                  }
                  className="w-full bg-[#0D0F12] border border-[#222732] text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-600/70 focus:ring-1 focus:ring-rose-600/30 transition-all shadow-inner"
                />
              </div>

              {/* [ 🎙️ Voice Button ] */}
              <button
                type="button"
                onClick={isRecording ? cancelRecording : startRecording}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                  isRecording
                    ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                    : 'bg-[#181C24] hover:bg-[#222732] text-slate-300 border-[#222732]'
                }`}
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Voice</span>
              </button>

              {/* [ Send ▶ Button in Solid Crimson Red ] */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() && !selectedAttachment}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesWorkspaceView;
