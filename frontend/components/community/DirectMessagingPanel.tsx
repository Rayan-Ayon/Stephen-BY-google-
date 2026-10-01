import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Conversation, ChatMessageItem, ProfileUser } from '@/types/community';
import { INITIAL_CONVERSATIONS } from './mockCommunityData';
import { AudioVoiceNotePlayer } from './AudioVoiceNotePlayer';
import { obsidianTokens } from './obsidianTokens';

interface DirectMessagingPanelProps {
  userEmail?: string;
  targetUser?: ProfileUser | null;
  onClearTargetUser?: () => void;
  onSelectMemberForProfile: (member: ProfileUser) => void;
}

export const DirectMessagingPanel: React.FC<DirectMessagingPanelProps> = ({
  userEmail,
  targetUser,
  onClearTargetUser,
  onSelectMemberForProfile,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessageItem[]>>({
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
        content: 'Your latest Task 1 overview shows solid growth. Review the feedback audio note.',
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
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
    'dm-ayesha': [
      {
        id: 'dm-m-3',
        conversationId: 'dm-ayesha',
        senderId: 'u-ayesha',
        senderName: 'Ayesha Rahman',
        senderUsername: 'ayesha_r',
        content: 'Sent you the Cambridge 17 vocabulary list. Let me know if you need the audio files too!',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If targetUser was passed (e.g., from global search [Send Message]), select or create DM thread
  useEffect(() => {
    if (targetUser) {
      const existing = conversations.find(
        (c) => c.recipient?.id === targetUser.id || c.recipient?.username === targetUser.username
      );
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newConvId = `dm-${targetUser.username}`;
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
        setMessagesMap((prev) => ({
          ...prev,
          [newConvId]: [
            {
              id: `msg-welcome-${Date.now()}`,
              conversationId: newConvId,
              senderId: targetUser.id,
              senderName: targetUser.fullName,
              senderUsername: targetUser.username,
              senderAvatar: targetUser.avatarUrl,
              content: `Direct message thread started with @${targetUser.username}. Send a message to connect!`,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        setActiveConvId(newConvId);
      }
    }
  }, [targetUser, conversations]);

  // Auto-scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, messagesMap]);

  // Simulate typing indicator briefly after receiving messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeConvId]);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messagesMap[activeConvId] || [];

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        const audioUrl = URL.createObjectURL(audioBlob);

        const newMsg: ChatMessageItem = {
          id: `dm-m-${Date.now()}`,
          conversationId: activeConvId,
          senderId: 'current-user-id',
          senderName: 'You',
          content: '🎙️ Voice note',
          audioUrl,
          createdAt: new Date().toISOString(),
        };

        setMessagesMap((prev) => ({
          ...prev,
          [activeConvId]: [...(prev[activeConvId] || []), newMsg],
        }));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText.trim();
    const newMsg: ChatMessageItem = {
      id: `dm-m-${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'current-user-id',
      senderName: 'You',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    // Update last message preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: newMsg, updatedAt: new Date().toISOString() }
          : c
      )
    );

    setInputText('');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.recipient?.fullName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.recipient?.username?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[580px] bg-[#0B0F17] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* ── Left Sidebar (1/3 Width): Threads List ── */}
      <aside className="w-full sm:w-80 md:w-96 border-r border-slate-800 bg-[#111827] flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>✉️</span> Direct Messages
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter chats by name or @user..."
              className="w-full bg-[#1E293B] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const recipient = conv.recipient;
            const isMentor = recipient?.isMentor;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  if (onClearTargetUser) onClearTargetUser();
                }}
                className={`p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3 ${
                  isSelected ? 'bg-slate-800/90 border-l-2 border-amber-500' : ''
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={
                      recipient?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
                    }
                    alt={conv.title || 'User'}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  {isMentor && (
                    <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#111827]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {recipient?.fullName || conv.title}
                      </span>
                      {isMentor && <span className={obsidianTokens.badgeMentor}>Mentor</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-400 font-mono mb-1">
                    @{recipient?.username || 'candidate'}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate pr-2">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conv.unreadCount && conv.unreadCount > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Right Chat Pane (2/3 Width): Active Message Feed ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F17]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={
                activeConversation.recipient?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
              }
              alt="Recipient"
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 truncate">
                  {activeConversation.recipient?.fullName || activeConversation.title}
                </h3>
                {activeConversation.recipient?.isMentor && (
                  <span className={obsidianTokens.badgeMentor}>Mentor</span>
                )}
              </div>
              <p className="text-xs text-amber-400 font-mono">
                @{activeConversation.recipient?.username || 'candidate'} •{' '}
                <span className="text-slate-400">Target Band {activeConversation.recipient?.targetBand || 7.5}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeConversation.recipient && (
              <button
                onClick={() => onSelectMemberForProfile(activeConversation.recipient!)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                View Profile
              </button>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-center py-6 border-b border-slate-800/60 mb-4">
            <p className="text-xs text-slate-500 font-mono">
              🔒 End-to-end direct message session with {activeConversation.recipient?.fullName || 'Candidate'}.
            </p>
          </div>

          {activeMessages.map((msg) => {
            const isMe = msg.senderId === 'current-user-id';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`max-w-[80%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={isMe ? obsidianTokens.chatBubbleSender : obsidianTokens.chatBubbleReceiver}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                    {msg.audioUrl && (
                      <AudioVoiceNotePlayer
                        audioUrl={msg.audioUrl}
                        senderRole={msg.senderRole}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
              <span>@{activeConversation.recipient?.username} is typing...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Composer */}
        <div className="p-3 sm:p-4 bg-[#111827] border-t border-slate-800">
          {isRecording ? (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-red-400">
                  Recording Voice Note ({recordingSeconds}s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelRecording}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={stopRecording}
                  className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-xs text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>✓</span> Send Voice Note
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={startRecording}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors"
                title="Send voice note"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message @${activeConversation.recipient?.username || 'candidate'}...`}
                className="flex-1 bg-[#1E293B] border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold flex items-center justify-center shrink-0 transition-all shadow-md active:scale-95"
              >
                <svg className="w-4 h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
