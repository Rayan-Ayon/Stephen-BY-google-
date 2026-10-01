import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChatMessageItem, CohortMetadata, CohortMember, ProfileUser } from '@/types/community';
import { INITIAL_COHORT_MESSAGES, INITIAL_MEMBERS } from './mockCommunityData';
import { AudioVoiceNotePlayer } from './AudioVoiceNotePlayer';
import { obsidianTokens } from './obsidianTokens';

interface CohortBatchChatProps {
  cohort: CohortMetadata;
  userEmail?: string;
  onSelectMemberForProfile: (member: ProfileUser | CohortMember) => void;
  onStartDirectMessage: (member: ProfileUser | CohortMember) => void;
}

export const CohortBatchChat: React.FC<CohortBatchChatProps> = ({
  cohort,
  userEmail,
  onSelectMemberForProfile,
  onStartDirectMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>(INITIAL_COHORT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const conversationId = 'conv-cohort-group';

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Supabase Realtime Listener for cohort group chat messages
  useEffect(() => {
    let isSubscribed = true;

    async function loadChatMessages() {
      try {
        const { data, error } = await (supabase as any)
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (isSubscribed && !error && data && data.length > 0) {
          const mapped: ChatMessageItem[] = data.map((m: any) => ({
            id: m.id,
            conversationId: m.conversation_id,
            senderId: m.sender_id,
            senderName: m.sender_name || 'Cohort Student',
            senderRole: m.sender_role || 'student',
            content: m.content,
            audioUrl: m.audio_url,
            mediaUrl: m.media_url,
            isPinned: Boolean(m.is_pinned),
            createdAt: m.created_at,
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.warn('Realtime chat hydration note (using mock feed):', err);
      }
    }

    loadChatMessages();

    // Subscribe to Postgres Realtime INSERT events
    const channel = (supabase as any)
      ?.channel(`chat:${conversationId}`)
      ?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (!isSubscribed) return;
          const newMsg: ChatMessageItem = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name || 'Candidate',
            senderRole: payload.new.sender_role || 'student',
            content: payload.new.content,
            audioUrl: payload.new.audio_url,
            mediaUrl: payload.new.media_url,
            isPinned: Boolean(payload.new.is_pinned),
            createdAt: payload.new.created_at || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      ?.subscribe();

    return () => {
      isSubscribed = false;
      if (channel) (supabase as any).removeChannel(channel);
    };
  }, [conversationId]);

  // Voice Note Recording with MediaRecorder API
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        // Upload to Supabase Storage bucket 'chat-audio' or convert to Object URL
        let audioUrl = '';
        try {
          const fileName = `voice_${Date.now()}.webm`;
          const { data: uploadData, error } = await (supabase as any).storage
            .from('chat-audio')
            .upload(fileName, audioBlob, { contentType: 'audio/webm' });

          if (!error && uploadData) {
            const { data: publicUrlData } = (supabase as any).storage
              .from('chat-audio')
              .getPublicUrl(fileName);
            audioUrl = publicUrlData?.publicUrl || '';
          }
        } catch {
          // Fallback to local Blob URL
        }

        if (!audioUrl) {
          audioUrl = URL.createObjectURL(audioBlob);
        }

        // Insert new audio message
        const currentSenderName = userEmail?.split('@')[0] || 'Me';
        const newMsg: ChatMessageItem = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'current-user-id',
          senderName: currentSenderName,
          senderRole: 'student',
          content: '🎙️ Voice note message',
          audioUrl,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);

        // Attempt DB Insert
        try {
          await (supabase as any).from('chat_messages').insert({
            conversation_id: conversationId,
            sender_id: 'current-user-id',
            content: '🎙️ Voice note message',
            audio_url: audioUrl,
          });
        } catch {
          // Handled via local state
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // Attachment handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAttachment(file);
      if (file.type.startsWith('image/')) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const clearAttachment = () => {
    setSelectedAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send text message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;

    const currentSenderName = userEmail?.split('@')[0] || 'Me';
    const content = inputText.trim();
    let mediaUrl: string | undefined = undefined;

    if (selectedAttachment && attachmentPreview) {
      mediaUrl = attachmentPreview;
    }

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user-id',
      senderName: currentSenderName,
      senderRole: 'student',
      content,
      mediaUrl,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    clearAttachment();

    // Broadcast to Supabase
    try {
      await (supabase as any).from('chat_messages').insert({
        conversation_id: conversationId,
        sender_id: 'current-user-id',
        content,
        media_url: mediaUrl,
      });
    } catch {
      // Local state active
    }
  };

  const pinnedMessages = messages.filter((m) => m.isPinned);

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[580px] bg-[#0B0F17] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
      {/* ── Left / Center: Main Chat Stream ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F17]">
        {/* Pinned Directive Banner (if any) */}
        {pinnedMessages.length > 0 && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400 font-bold shrink-0">📌 Pinned Directive:</span>
              <span className="truncate">{pinnedMessages[0].content}</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-amber-400 hover:underline shrink-0 text-[11px] ml-2 font-medium"
            >
              View in Drawer →
            </button>
          </div>
        )}

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-center py-4 border-b border-slate-800/60 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Welcome to {cohort.name} Channel
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
              This is the official real-time batch channel. Voice notes, essay critiques, and daily directives are posted here.
            </p>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === 'current-user-id';
            const isMentor = msg.senderRole === 'mentor';
            const isFaculty = msg.senderRole === 'faculty';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <img
                  src={
                    msg.senderAvatar ||
                    (isMentor
                      ? cohort.mentor?.avatarUrl
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face')
                  }
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700/80 shrink-0 mt-0.5 cursor-pointer hover:border-amber-400 transition-colors"
                  onClick={() =>
                    onSelectMemberForProfile({
                      id: msg.senderId,
                      username: msg.senderUsername || msg.senderName?.toLowerCase().replace(/\s+/g, '_') || 'student',
                      fullName: msg.senderName || 'Candidate',
                      targetBand: isMentor ? 9.0 : 7.5,
                      currentBand: isMentor ? 9.0 : 7.0,
                      streakCount: 14,
                      isMentor,
                    })
                  }
                />

                {/* Message Body */}
                <div className={`max-w-[78%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    {isMentor && <span className={obsidianTokens.badgeMentor}>Mentor</span>}
                    {isFaculty && (
                      <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[10px] uppercase px-1.5 py-0.2 rounded">
                        Faculty
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={isMe ? obsidianTokens.chatBubbleSender : obsidianTokens.chatBubbleReceiver}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                    {/* Voice Note Player */}
                    {msg.audioUrl && (
                      <AudioVoiceNotePlayer
                        audioUrl={msg.audioUrl}
                        senderRole={msg.senderRole}
                      />
                    )}

                    {/* Media Image Attachment */}
                    {msg.mediaUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-700/80 max-h-60 bg-black/40">
                        <img
                          src={msg.mediaUrl}
                          alt="Attachment"
                          className="w-full h-auto object-cover max-h-56"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Composer */}
        <div className="p-3 sm:p-4 bg-[#111827] border-t border-slate-800">
          {/* Attachment Preview Chip */}
          {selectedAttachment && (
            <div className="mb-2 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-2 max-w-xs">
              {attachmentPreview ? (
                <img src={attachmentPreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
              ) : (
                <span className="text-xl">📎</span>
              )}
              <span className="text-xs text-slate-200 truncate flex-1">{selectedAttachment.name}</span>
              <button onClick={clearAttachment} className="text-slate-400 hover:text-red-400 text-xs px-1">
                ✕
              </button>
            </div>
          )}

          {isRecording ? (
            /* Live Voice Recording Bar */
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
                  <span>✓</span> Send Clip
                </button>
              </div>
            </div>
          ) : (
            /* Standard Text Composer */
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center shrink-0 transition-colors"
                title="Attach screenshot or essay file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
              </button>

              <button
                type="button"
                onClick={startRecording}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors"
                title="Record voice note"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message #batch-08 general channel..."
                className="flex-1 bg-[#1E293B] border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !selectedAttachment}
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

      {/* ── Toggle Drawer Button on small screens ── */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
        title="Toggle Drawer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={isDrawerOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
        </svg>
      </button>

      {/* ── Right Collapsible Drawer ── */}
      {isDrawerOpen && (
        <aside className="w-72 sm:w-80 border-l border-slate-800 bg-[#111827] flex flex-col shrink-0 animate-in slide-in-from-right-10 duration-150">
          {/* Live Zoom / Meeting Card */}
          <div className="p-4 border-b border-slate-800">
            <div className="bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Live Class Bridge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold text-slate-100 mb-1">Weekly Examiner Masterclass</h4>
              <p className="text-[11px] text-slate-400 mb-3">Live with Dr. Stephen Vance • Tonight at 8:00 PM</p>
              <a
                href={cohort.liveMeetingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Join Live Session
              </a>
            </div>
          </div>

          {/* Pinned Directives Section */}
          <div className="p-4 border-b border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span>📌</span> Pinned Directives
            </h4>
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-amber-400 text-[11px]">Writing Task 2 Rule:</p>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Always establish a clear position in sentence 2 of your introduction. Concession clauses must precede the main thesis.
              </p>
            </div>
          </div>

          {/* Active Members Roster (Online Now) */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Batch Roster (34 Online)
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">● LIVE</span>
            </div>

            <div className="space-y-1.5">
              {INITIAL_MEMBERS.map((mem) => (
                <div
                  key={mem.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-colors group"
                >
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                    onClick={() => onSelectMemberForProfile(mem)}
                  >
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
                        alt={mem.userName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#111827]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-amber-400 transition-colors">
                        {mem.userName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Band {mem.latestMockBand} • 🔥 {mem.streakCount}d
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartDirectMessage(mem)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 text-xs transition-all"
                    title="Send Direct Message"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.177 49.177 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
