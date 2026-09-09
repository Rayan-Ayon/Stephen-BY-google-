import React, { useState, useEffect, useRef } from 'react';

// ── Types ──

type VoiceMode = 'realistic' | 'normal';
type Language = 'bn' | 'hi' | 'ur' | 'en';
type CallState = 'idle' | 'recording' | 'processing';
type EvalState = 'idle' | 'loading' | 'complete';

interface Partner {
    name: string;
    initials: string;
    color: string;
    tagline: string;
    languages: string[];
}

interface Scenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    gradient: string;
}

interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    isStreaming?: boolean;
}

interface RecordingSession {
    id: string;
    partnerName: string;
    partnerInitials: string;
    partnerColor: string;
    date: string;
    duration: string;
    elapsed: number;
    messages: ChatMessage[];
}

interface Evaluation {
    overallBand: number;
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    corrections: { said: string; try: string }[];
    pronunciationTips: string[];
    vocabularySuggestions: { word: string; alternatives: string[] }[];
}

// ── Mock Data ──

const PARTNERS: Partner[] = [
    { name: 'Mohona', initials: 'MH', color: 'bg-rose-500', tagline: 'Friendly tutor · Bengali feedback · Great for all levels', languages: ['bn', 'hi', 'ur', 'en'] },
    { name: 'James', initials: 'JA', color: 'bg-blue-500', tagline: 'Strict examiner · Simulates real IELTS test · No shortcuts', languages: ['en'] },
    { name: 'Priya', initials: 'PR', color: 'bg-violet-500', tagline: 'Casual & relaxed · Perfect for nervous beginners', languages: ['hi', 'en'] },
    { name: 'Alex', initials: 'AL', color: 'bg-orange-500', tagline: 'High-energy coach · Rapid drills · Targets Band 7+', languages: ['en'] },
    { name: 'Sofia', initials: 'SO', color: 'bg-emerald-500', tagline: 'Grammar-focused · Corrects every error precisely', languages: ['en'] },
    { name: 'Noah', initials: 'NO', color: 'bg-cyan-500', tagline: 'Part 2 & 3 specialist · Builds fluency & extended discourse', languages: ['ur', 'en'] },
];

const SCENARIOS: Scenario[] = [
    { id: 'restaurant', title: 'At the Restaurant', description: 'Order food, ask about the menu, and handle a mix-up with your order.', difficulty: 'Beginner', duration: '~5 min', gradient: 'from-orange-500 to-red-500' },
    { id: 'hotel', title: 'Hotel Check-In', description: 'Check into a hotel, ask about facilities, and deal with a room issue.', difficulty: 'Beginner', duration: '~5 min', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'directions', title: 'Asking for Directions', description: 'Navigate an unfamiliar city by asking a local for directions to a landmark.', difficulty: 'Beginner', duration: '~4 min', gradient: 'from-green-500 to-emerald-500' },
    { id: 'shopping', title: 'Shopping & Bargaining', description: 'Browse a market stall, ask about products, negotiate prices, and make a purchase.', difficulty: 'Beginner', duration: '~5 min', gradient: 'from-purple-500 to-pink-500' },
    { id: 'airport', title: 'Airport Help Desk', description: 'Handle a travel problem — a delayed flight, lost baggage, or a missed connection.', difficulty: 'Intermediate', duration: '~5 min', gradient: 'from-sky-500 to-blue-500' },
    { id: 'doctor', title: "Doctor's Appointment", description: "Describe your symptoms, answer the doctor's questions, and understand your diagnosis.", difficulty: 'Intermediate', duration: '~6 min', gradient: 'from-teal-500 to-green-500' },
    { id: 'bank', title: 'Phone Call to the Bank', description: 'Call your bank to dispute a charge, reset access, or set up a new service.', difficulty: 'Intermediate', duration: '~6 min', gradient: 'from-indigo-500 to-violet-500' },
    { id: 'university', title: 'University Office Visit', description: 'Visit the student affairs office to ask about enrollment, fees, or course changes.', difficulty: 'Intermediate', duration: '~6 min', gradient: 'from-amber-500 to-orange-500' },
    { id: 'job', title: 'Job Interview', description: 'Face a real-world English job interview for a role in your field.', difficulty: 'Advanced', duration: '~10 min', gradient: 'from-rose-500 to-pink-500' },
    { id: 'complaint', title: 'Complaining to a Manager', description: 'Make a formal complaint about a bad product or service experience, calmly and effectively.', difficulty: 'Intermediate', duration: '~7 min', gradient: 'from-red-500 to-rose-500' },
];

const LANGUAGE_LABELS: Record<Language, string> = {
    bn: 'বাংলা',
    hi: 'हिन्दी',
    ur: 'اردو',
    en: 'English',
};

// ── Mock AI Responses (Bengali+English for Mohona, English for others) ──

const MOCK_RESPONSES: Record<string, string[]> = {
    Mohona: [
        'ভাই আমার ২ইই গ্রেট, থ্যাংকস! তুমি কেমন আছো? চলো, আজকে আমরা আমাদের স্পিকিং প্র্যাকটিসটা শুরু করি।',
        'ওহ, খুব ভালো উত্তর দিচ্ছো! তুমি কি আরো বিস্তারিত বলতে পারো? Like, can you give me an example from your life?',
        'Very good! তোমার pronunciation টা অনেক ভালো হচ্ছে। But let\'s work on your fluency a bit more, ঠিক আছে?',
        'Hmm, একটু ভেবে বলো। Don\'t rush! Take your time and structure your answer properly.',
        'Wow, তুমি তো অসাধারণ! Your vocabulary is improving day by day. চলো এবার একটু harder topic নেই।',
        'Nice try! But I think you can do better. Try to use more connecting words like "furthermore", "however" — এরকম শব্দ ব্যবহার করো।',
        'Bahut accha! তুমি খুব দ্রুত শিখছো। Now tell me about a memorable journey you\'ve taken. বাংলায় বা English যেকোনো ভাষায় বলো।',
        'Excellent! তোমার response টা অনেক structured। Keep it up! Let me ask you something about the environment next.',
    ],
    James: [
        'Good morning. I\'d like to begin by asking you some questions about your hometown. Please describe it in detail.',
        'That\'s a reasonable response. However, I need you to elaborate further. Can you provide specific examples?',
        'Your grammar is acceptable, but your vocabulary range could be broader. Try using more academic terms.',
        'I see. Now let\'s move on to a more abstract topic. How do you think technology has changed education?',
        'Well articulated. Your coherence is improving. Let me challenge you with a Part 3 question now.',
        'Not bad, but watch your tense usage. You shifted from past to present inconsistently. Try again.',
        'Your fluency is commendable. Now, let\'s discuss something related to the environment. What role should governments play?',
        'Good effort. Remember, in the real exam, you have very limited time to think. Practice being more spontaneous.',
    ],
    Priya: [
        'Hey! Kaise ho? I\'m so excited to practice with you today! Don\'t worry, we\'ll go at your pace, theek hai?',
        'That was really good! You\'re doing amazing. Let me ask you something fun — what\'s your favourite hobby?',
        'Don\'t stress about mistakes, yaar! That\'s how we learn. Just relax and speak naturally.',
        'Oh wow, I love that answer! Can you tell me more? I\'m genuinely curious about your experience.',
        'You\'re getting better every time! Let\'s try a role-play now. Imagine you\'re at a restaurant. What would you order?',
        'Arrey, that\'s perfect! See, I told you — you\'re much better than you think. Let\'s keep going!',
        'Hmm, nice try! But let me correct you slightly — it\'s "I have been" not "I has been." Practice this form, theek hai?',
        'Superb! Your confidence is growing. Let me ask you about your future plans now. Take your time!',
    ],
    Alex: [
        'Alright, let\'s GO! Time to push your Band 7+ skills. First question — what makes a good leader?',
        'YES! That\'s the energy I need! But let\'s sharpen that vocabulary. Instead of "good," try "effective" or "inspiring."',
        'Quick fire round! Name three advantages of learning a second language. Go!',
        'Solid answer! Now flip it — what are the disadvantages? You have 30 seconds. Go!',
        'Love the confidence! Now let\'s work on your Part 2. I\'ll give you a cue card topic in 5 seconds...',
        'Boom! That was clean. Your fluency is on point today. Let me throw a Part 3 curveball at you.',
        'Almost perfect! Just watch your article usage — "the" vs "a" matters in the exam. Keep grinding!',
        'Incredible progress! You\'re definitely on track for Band 7+. One more question — what\'s your biggest weakness in English?',
    ],
    Sofia: [
        'Hello! Let\'s focus on precision today. I want you to speak in full, grammatically correct sentences. Ready?',
        'Good start, but I noticed a subject-verb agreement error. "He go" should be "He goes." Let\'s fix these.',
        'Your pronunciation of "thorough" needs work. It\'s /ˈθʌrə/, not /ˈtʊrə/. Practice this sound.',
        'Excellent sentence structure! Now, let me ask you to describe a process. Use sequence words like "firstly," "subsequently."',
        'I like your effort, but your tense consistency needs improvement. You switched from past to present mid-sentence.',
        'That\'s much better! Your conditional sentences are improving. "If I had known" — perfect form!',
        'One more thing — watch your preposition usage. It\'s "interested in," not "interested about." Small details matter!',
        'Well done today! Your grammar has noticeably improved. Keep practicing those complex sentence structures.',
    ],
    Noah: [
        'Salaam! Let\'s work on your extended discourse today. I want you to speak for a full 2 minutes on any topic.',
        'That\'s a good start, but try to develop your ideas more. Give reasons, examples, and personal experiences.',
        'Remember, Part 2 is about structure. Start with a direct answer, then expand with details. Let\'s try again.',
        'Your fluency is improving! Now let\'s move to Part 3. I want you to express and justify your opinion on this...',
        'Good point! But can you develop that idea further? In the exam, Examiners want to see depth of thinking.',
        'Nice! Your extended response is getting better. Let me ask a follow-up question to push you further.',
        'Almost there! Try to avoid long pauses. If you need thinking time, use fillers like "That\'s an interesting question..."',
        'Excellent session today! Your ability to sustain longer responses has improved significantly. Keep it up!',
    ],
};

const getMockResponse = (partnerName: string): string => {
    const responses = MOCK_RESPONSES[partnerName] || MOCK_RESPONSES['Mohona'];
    return responses[Math.floor(Math.random() * responses.length)];
};

// ── Pre-populated Mock Recordings ──

const MOCK_RECORDINGS: RecordingSession[] = [
    {
        id: 'rec_1',
        partnerName: 'Mohona',
        partnerInitials: 'MH',
        partnerColor: 'bg-rose-500',
        date: 'Jun 8, 2026',
        duration: '2:26',
        elapsed: 146,
        messages: [
            { id: 1, sender: 'ai', text: 'Hi there! I\'m Mohona. Friendly tutor. Let\'s begin our speaking practice. How are you today?', timestamp: '7:22:05 AM' },
            { id: 2, sender: 'user', text: 'I\'m doing well, thank you! I\'d like to practice my speaking today.', timestamp: '7:22:15 AM' },
            { id: 3, sender: 'ai', text: 'ভালো! চলো শুরু করি। Tell me about your hometown. What do you like most about it?', timestamp: '7:22:20 AM' },
            { id: 4, sender: 'user', text: 'I come from a small town called Jamalpur. It\'s known for its beautiful rivers and green landscapes.', timestamp: '7:22:35 AM' },
            { id: 5, sender: 'ai', text: 'ওহ, খুব সুন্দর! That sounds wonderful. Can you tell me more about the Jamalpur region? What makes it special?', timestamp: '7:22:42 AM' },
            { id: 6, sender: 'user', text: 'And I like about the Jamalpur region is that it has a very peaceful rural atmosphere. People are friendly.', timestamp: '7:22:55 AM' },
            { id: 7, sender: 'ai', text: 'Very good! তোমার pronunciation টা অনেক ভালো হচ্ছে। But let\'s work on your fluency a bit more, ঠিক আছে?', timestamp: '7:23:05 AM' },
            { id: 8, sender: 'user', text: 'Yes, definitely. I want to improve my fluency and also learn more vocabulary.', timestamp: '7:23:15 AM' },
        ],
    },
    {
        id: 'rec_2',
        partnerName: 'James',
        partnerInitials: 'JA',
        partnerColor: 'bg-blue-500',
        date: 'May 21, 2026',
        duration: '5:12',
        elapsed: 312,
        messages: [
            { id: 1, sender: 'ai', text: 'Good morning. I\'d like to begin by asking you some questions about your hometown. Please describe it in detail.', timestamp: '10:05:12 AM' },
            { id: 2, sender: 'user', text: 'I come from Dhaka, the capital of Bangladesh. It\'s a vibrant city with millions of people.', timestamp: '10:05:25 AM' },
            { id: 3, sender: 'ai', text: 'That\'s a reasonable response. However, I need you to elaborate further. Can you provide specific examples?', timestamp: '10:05:35 AM' },
        ],
    },
    {
        id: 'rec_3',
        partnerName: 'Priya',
        partnerInitials: 'PR',
        partnerColor: 'bg-violet-500',
        date: 'May 15, 2026',
        duration: '3:45',
        elapsed: 225,
        messages: [
            { id: 1, sender: 'ai', text: 'Hey! Kaise ho? I\'m so excited to practice with you today! Don\'t worry, we\'ll go at your pace, theek hai?', timestamp: '4:30:10 PM' },
            { id: 2, sender: 'user', text: 'Hi Priya! I\'m a bit nervous but excited to practice.', timestamp: '4:30:20 PM' },
            { id: 3, sender: 'ai', text: 'Don\'t stress about mistakes, yaar! That\'s how we learn. Just relax and speak naturally.', timestamp: '4:30:28 PM' },
        ],
    },
    {
        id: 'rec_4',
        partnerName: 'Alex',
        partnerInitials: 'AL',
        partnerColor: 'bg-orange-500',
        date: 'May 10, 2026',
        duration: '4:08',
        elapsed: 248,
        messages: [
            { id: 1, sender: 'ai', text: 'Alright, let\'s GO! Time to push your Band 7+ skills. First question — what makes a good leader?', timestamp: '2:15:05 PM' },
            { id: 2, sender: 'user', text: 'A good leader should be decisive, empathetic, and able to inspire their team.', timestamp: '2:15:18 PM' },
            { id: 3, sender: 'ai', text: 'YES! That\'s the energy I need! But let\'s sharpen that vocabulary. Instead of "good," try "effective" or "inspiring."', timestamp: '2:15:25 PM' },
        ],
    },
];

// ── Mock AI Evaluation ──

const MOCK_EVALUATION: Evaluation = {
    overallBand: 6.5,
    fluency: 6.5,
    lexical: 6.5,
    grammar: 6.0,
    pronunciation: 6.5,
    feedback: 'You demonstrated good fluency and natural transitions throughout the conversation. Your tone was confident and you maintained a steady rhythm. With a few refinements in grammar and vocabulary range, you could easily reach Band 7.0.',
    strengths: [
        'Used a wide range of vocabulary naturally, including idiomatic expressions',
        'Employed natural fillers like "you know" and "I mean" effectively',
        'Good use of adverbs to modify sentences and add nuance',
    ],
    improvements: [
        'Watch your pronoun usage — ensure subject-verb agreement in longer sentences',
        'Practice using infinitives correctly after certain verbs (e.g., "plan to stay" not "plan of staying")',
        'Work on wrapping up conversations smoothly with summary phrases',
    ],
    corrections: [
        { said: 'and I like about the Jamalpur region is that...', try: 'and what I like most about the Jamalpur region is that...' },
        { said: "I don't have a permanent plan of staying there...", try: "I don't have any permanent plans to stay there..." },
    ],
    pronunciationTips: [
        'Practice linking words together smoothly: "want_to" → "wanna", "going_to" → "gonna"',
        'Pay attention to word stress in multi-syllable words like "beautiful" and "important"',
        'Use contrastive stress to emphasize key points: "I said RED, not BLUE"',
    ],
    vocabularySuggestions: [
        { word: 'rural atmosphere', alternatives: ['rustic charm', 'tranquil countryside setting'] },
        { word: 'nice place', alternatives: ['charming destination', 'delightful location'] },
    ],
};

// ── Inline SVG Icons ──

const PhoneIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);

const PhoneOffIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

const ChevronLeftIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronDownIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const ChevronRightIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const ClockIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const TargetIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const MicIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

const SparklesIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
);

const PlayIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const VolumeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

const VolumeOffIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

const SpinnerIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

const XIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ChartBarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

// ── Main Component ──

interface AISpeakingPartnerViewProps {
    userEmail?: string;
}

const TOTAL_SESSION_MINUTES = 120;

// ── Extended AI Scoring Accordion Component ──────────────────────────────────

interface AIScoringAccordionProps {
    evalState: EvalState;
    evaluation: Evaluation | null;
    onEvaluate: () => void;
}

interface ScoringCriterion {
    key: string;
    label: string;
    band: number;
    subCriteria: { label: string; band: number }[];
}

const SCORING_CRITERIA: ScoringCriterion[] = [
    {
        key: 'fluency',
        label: 'Fluency and Coherence',
        band: 7.0,
        subCriteria: [
            { label: 'Relevance', band: 8.0 },
            { label: 'Logical Sequencing', band: 7.0 },
            { label: 'Topic Development', band: 7.0 },
        ],
    },
    {
        key: 'lexical',
        label: 'Lexical Resource',
        band: 6.0,
        subCriteria: [
            { label: 'Lexical Diversity', band: 6.0 },
            { label: 'Advanced Vocabulary', band: 6.0 },
            { label: 'Multi-word Expression Use', band: 7.0 },
            { label: 'Advanced Expression Level', band: 6.0 },
            { label: 'Lexical Accuracy', band: 7.0 },
        ],
    },
    {
        key: 'grammar',
        label: 'Grammatical Range and Accuracy',
        band: 7.0,
        subCriteria: [
            { label: 'Sentence Complexity', band: 7.0 },
            { label: 'Error Free Sentences', band: 7.0 },
            { label: 'Tense Accuracy', band: 7.0 },
        ],
    },
    {
        key: 'pronunciation',
        label: 'Pronunciation',
        band: 6.5,
        subCriteria: [
            { label: 'Individual Sounds', band: 6.5 },
            { label: 'Word Stress', band: 6.0 },
            { label: 'Sentence Stress & Rhythm', band: 7.0 },
            { label: 'Intonation', band: 6.5 },
        ],
    },
];

const MOCK_PROOF_QUESTIONS = [
    { q: 'Tell me about your hometown.', a: 'I come from Jamalpur, which is in the Mymensingh division. It\'s a small town near the Brahmaputra River.', rating: 5 },
    { q: 'What do you like most about living there?', a: 'I like about the Jamalpur region is that it has a very peaceful environment and people are really friendly with each other.', rating: 4 },
    { q: 'Do you plan to live there in the future?', a: 'I don\'t have a permanent plan of staying there because I want to explore other cities for better opportunities.', rating: 5 },
];

function AIScoringAccordion({ evalState, evaluation, onEvaluate }: AIScoringAccordionProps) {
    const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);
    const [expandedSubCriterion, setExpandedSubCriterion] = useState<string | null>(null);
    const [expandedProof, setExpandedProof] = useState<string | null>(null);
    const [proofFilter, setProofFilter] = useState<'ALL' | 'EXCELLENT' | 'STRONG' | 'Clear'>('ALL');

    if (evalState === 'idle') {
        return (
            <div className="text-center py-12">
                <ChartBarIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-700">Get Your AI Band Score</p>
                <p className="text-xs text-gray-400 mt-1 mb-5">Detailed breakdown of your speaking performance across all IELTS criteria.</p>
                <button onClick={onEvaluate} className="bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-600 transition-colors">
                    Generate AI Score
                </button>
            </div>
        );
    }

    if (evalState === 'loading') {
        return (
            <div className="text-center py-16">
                <SpinnerIcon className="w-10 h-10 text-indigo-500 mx-auto mb-4 animate-spin" />
                <p className="text-sm font-semibold text-gray-700">Calculating your band score...</p>
                <p className="text-xs text-gray-400 mt-1">Analyzing fluency, vocabulary, grammar, and pronunciation</p>
            </div>
        );
    }

    if (!evaluation) return null;

    const filteredProofs = MOCK_PROOF_QUESTIONS.filter(q => {
        if (proofFilter === 'ALL') return true;
        if (proofFilter === 'EXCELLENT') return q.rating === 5;
        if (proofFilter === 'STRONG') return q.rating === 4;
        return q.rating <= 3;
    });

    return (
        <div className="space-y-5">
            {/* Overall Band Summary Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Overall Band Score</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{evaluation.overallBand}</p>
                    </div>
                    <div className="bg-indigo-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                        {evaluation.overallBand}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {SCORING_CRITERIA.map(c => (
                        <span key={c.key} className="bg-white/80 border border-indigo-100 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full">
                            {c.label.split(' ').slice(0, 2).join(' ')} <span className="font-bold text-indigo-600">{c.band}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Criteria Accordion Cards */}
            {SCORING_CRITERIA.map(criterion => {
                const isExpanded = expandedCriterion === criterion.key;
                return (
                    <div key={criterion.key} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <button
                            onClick={() => { setExpandedCriterion(isExpanded ? null : criterion.key); setExpandedSubCriterion(null); setExpandedProof(null); }}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">{criterion.band}</span>
                                <span className="text-sm font-semibold text-gray-800">{criterion.label}</span>
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {isExpanded && (
                            <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                                {criterion.subCriteria.map(sub => {
                                    const subKey = `${criterion.key}-${sub.label}`;
                                    const isSubExpanded = expandedSubCriterion === subKey;
                                    return (
                                        <div key={subKey} className="border border-gray-100 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => { setExpandedSubCriterion(isSubExpanded ? null : subKey); setExpandedProof(null); }}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                                    <span className="text-xs font-medium text-gray-700">{sub.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-indigo-600">{sub.band}</span>
                                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </div>
                                            </button>

                                            {isSubExpanded && (
                                                <div className="border-t border-gray-50 px-4 py-3 bg-gray-50/50">
                                                    <button
                                                        onClick={() => setExpandedProof(expandedProof === subKey ? null : subKey)}
                                                        className="text-[11px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                                                    >
                                                        {expandedProof === subKey ? 'Hide proof' : 'Show proof'}
                                                        <svg className={`w-3 h-3 transition-transform ${expandedProof === subKey ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                    </button>

                                                    {expandedProof === subKey && (
                                                        <div className="mt-3 space-y-3">
                                                            <div className="flex items-center gap-3 text-[11px]">
                                                                <span className="font-semibold text-gray-700">Avg Rating: <span className="text-indigo-600">4.7/5</span></span>
                                                                <span className="text-gray-400">•</span>
                                                                <span className="font-semibold text-gray-700">Questions: <span className="text-indigo-600">{MOCK_PROOF_QUESTIONS.length}</span></span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                                {(['ALL', 'EXCELLENT', 'STRONG', 'Clear'] as const).map(f => (
                                                                    <button
                                                                        key={f}
                                                                        onClick={() => setProofFilter(f)}
                                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                                                                            proofFilter === f
                                                                                ? 'bg-indigo-500 text-white'
                                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        {f} ({f === 'ALL' ? MOCK_PROOF_QUESTIONS.length : MOCK_PROOF_QUESTIONS.filter(q => f === 'EXCELLENT' ? q.rating === 5 : f === 'STRONG' ? q.rating === 4 : q.rating <= 3).length})
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {filteredProofs.map((pq, i) => (
                                                                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 space-y-1.5">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Q{i + 1}</span>
                                                                            <span className="text-[10px] text-gray-400">Rating: {pq.rating}/5</span>
                                                                        </div>
                                                                        <p className="text-[11px] text-gray-500 italic">Q: {pq.q}</p>
                                                                        <p className="text-xs text-gray-700 font-medium">A: {pq.a}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const AISpeakingPartnerView: React.FC<AISpeakingPartnerViewProps> = ({ userEmail }) => {
    const [voiceMode, setVoiceMode] = useState<VoiceMode>('realistic');
    const [selectedPartner, setSelectedPartner] = useState<string>('Mohona');
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('bn');
    const [scenarioOpen, setScenarioOpen] = useState(false);

    // Live call state
    const [sessionActive, setSessionActive] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [callState, setCallState] = useState<CallState>('idle');
    const [transcript, setTranscript] = useState<ChatMessage[]>([]);
    const [sessionElapsed, setSessionElapsed] = useState(0);
    const [isPartnerSpeaking, setIsPartnerSpeaking] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
    const [speakerMuted, setSpeakerMuted] = useState(false);
    const nextMsgId = useRef(1);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Recordings & Drawer
    const [recordings, setRecordings] = useState<RecordingSession[]>(MOCK_RECORDINGS);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sessionPlayback, setSessionPlayback] = useState<RecordingSession | null>(null);

    // Playback view
    const [playbackTab, setPlaybackTab] = useState<'transcript' | 'feedback'>('transcript');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [speakerMutedPlayback, setSpeakerMutedPlayback] = useState(false);

    // AI Evaluation
    const [evalState, setEvalState] = useState<EvalState>('idle');
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

    // Live Call tab switching (Transcript / AI Feedback / AI Scoring)
    const [liveTab, setLiveTab] = useState<'transcript' | 'feedback' | 'scoring'>('transcript');
    const [showEndCallModal, setShowEndCallModal] = useState(false);
    const [pendingTab, setPendingTab] = useState<'feedback' | 'scoring' | null>(null);

    const activePartner = PARTNERS.find(p => p.name === selectedPartner) || PARTNERS[0];

    // ── Session Timer ───────────────────────────────────────────────────
    useEffect(() => {
        if (!sessionActive || callEnded) return;
        const timer = window.setInterval(() => setSessionElapsed(e => e + 1), 1000);
        return () => window.clearInterval(timer);
    }, [sessionActive, callEnded]);

    // ── Auto-scroll transcript ──────────────────────────────────────────
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    // ── Typewriter Streaming Effect ─────────────────────────────────────
    useEffect(() => {
        if (!isPartnerSpeaking || !streamingText || streamingMessageId === null) return;
        const words = streamingText.split(' ');
        let currentIndex = 0;
        const interval = window.setInterval(() => {
            currentIndex++;
            setTranscript(prev => prev.map(msg =>
                msg.id === streamingMessageId
                    ? { ...msg, text: words.slice(0, currentIndex).join(' ') }
                    : msg
            ));
            if (currentIndex >= words.length) {
                window.clearInterval(interval);
                setIsPartnerSpeaking(false);
                setTranscript(prev => prev.map(msg =>
                    msg.id === streamingMessageId ? { ...msg, isStreaming: false } : msg
                ));
            }
        }, 60);
        return () => window.clearInterval(interval);
    }, [isPartnerSpeaking, streamingText, streamingMessageId]);

    // ── Playback Timer ──────────────────────────────────────────────────
    useEffect(() => {
        if (!isPlaying || !sessionPlayback) return;
        const timer = window.setInterval(() => {
            setPlaybackTime(prev => {
                if (prev >= sessionPlayback.elapsed) {
                    setIsPlaying(false);
                    return sessionPlayback.elapsed;
                }
                return prev + 1;
            });
        }, 1000);
        return () => window.clearInterval(timer);
    }, [isPlaying, sessionPlayback]);

    // ── Helpers ─────────────────────────────────────────────────────────
    const formatSessionTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getRemainingMinutes = () => {
        const elapsedMinutes = Math.floor(sessionElapsed / 60);
        return Math.max(0, TOTAL_SESSION_MINUTES - elapsedMinutes);
    };

    const formatTimestamp = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // ── Call Handlers ───────────────────────────────────────────────────
    const handleStartSession = () => {
        setSessionActive(true);
        setCallEnded(false);
        setIsAnalyzing(false);
        setLiveTab('transcript');
        setEvalState('idle');
        setEvaluation(null);
        setSessionElapsed(0);
        setTranscript([]);
        setCallState('idle');
        nextMsgId.current = 1;

        setTimeout(() => {
            const greeting = `Hi there! I'm ${activePartner.name}. ${activePartner.tagline.split('·')[0].trim()}. Let's begin our speaking practice. How are you today?`;
            const aiMsgId = nextMsgId.current++;
            const aiMsg: ChatMessage = {
                id: aiMsgId,
                sender: 'ai',
                text: '',
                timestamp: formatTimestamp(),
                isStreaming: true,
            };
            setTranscript([aiMsg]);
            setIsPartnerSpeaking(true);
            setStreamingText(greeting);
            setStreamingMessageId(aiMsgId);
        }, 1200);
    };

    const handleTapToSpeak = () => {
        if (callState === 'idle') {
            setCallState('recording');
        } else if (callState === 'recording') {
            setCallState('processing');
            setTimeout(() => {
                const userMsg: ChatMessage = {
                    id: nextMsgId.current++,
                    sender: 'user',
                    text: 'I would like to practice my speaking skills today. Can we start with a topic?',
                    timestamp: formatTimestamp(),
                };
                setTranscript(prev => [...prev, userMsg]);
                setCallState('idle');

                setTimeout(() => {
                    const aiText = getMockResponse(activePartner.name);
                    const aiMsgId = nextMsgId.current++;
                    const aiMsg: ChatMessage = {
                        id: aiMsgId,
                        sender: 'ai',
                        text: '',
                        timestamp: formatTimestamp(),
                        isStreaming: true,
                    };
                    setTranscript(prev => [...prev, aiMsg]);
                    setIsPartnerSpeaking(true);
                    setStreamingText(aiText);
                    setStreamingMessageId(aiMsgId);
                }, 800);
            }, 1500);
        }
    };

    const handleDisconnect = () => {
        if (transcript.length > 0) {
            const session: RecordingSession = {
                id: `rec_${Date.now()}`,
                partnerName: activePartner.name,
                partnerInitials: activePartner.initials,
                partnerColor: activePartner.color,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                duration: formatSessionTime(sessionElapsed),
                elapsed: sessionElapsed,
                messages: transcript,
            };
            setRecordings(prev => [session, ...prev]);
        }
        setSessionActive(false);
        setCallEnded(false);
        setIsAnalyzing(false);
        setCallState('idle');
        setTranscript([]);
        setSessionElapsed(0);
        setIsPartnerSpeaking(false);
        setStreamingText('');
        setStreamingMessageId(null);
        setSpeakerMuted(false);
    };

    const handleEvaluate = () => {
        setEvalState('loading');
        setTimeout(() => {
            setEvaluation(MOCK_EVALUATION);
            setEvalState('complete');
        }, 2500);
    };

    const openPlayback = (rec: RecordingSession) => {
        setSessionPlayback(rec);
        setDrawerOpen(false);
        setPlaybackTab('transcript');
        setEvalState('idle');
        setEvaluation(null);
        setPlaybackTime(0);
        setIsPlaying(false);
    };

    // ── Live Tab Switching (with end-call interception) ────────────────
    const handleLiveTabClick = (targetTab: 'transcript' | 'feedback' | 'scoring') => {
        if (targetTab === 'transcript') {
            setLiveTab('transcript');
            return;
        }
        if (sessionActive && !callEnded) {
            setPendingTab(targetTab);
            setShowEndCallModal(true);
        } else {
            setLiveTab(targetTab);
            if (evalState === 'idle') {
                setEvalState('loading');
                setTimeout(() => {
                    setEvaluation(MOCK_EVALUATION);
                    setEvalState('complete');
                }, 1000);
            }
        }
    };

    const handleEndCallForTab = () => {
        if (transcript.length > 0) {
            const session: RecordingSession = {
                id: `rec_${Date.now()}`,
                partnerName: activePartner.name,
                partnerInitials: activePartner.initials,
                partnerColor: activePartner.color,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                duration: formatSessionTime(sessionElapsed),
                elapsed: sessionElapsed,
                messages: transcript,
            };
            setRecordings(prev => [session, ...prev]);
        }
        // Freeze call — keep sessionActive true so Live Call view stays mounted
        setCallEnded(true);
        setCallState('idle');
        setIsPartnerSpeaking(false);
        setStreamingText('');
        setStreamingMessageId(null);
        setSpeakerMuted(false);
        setShowEndCallModal(false);

        const target = pendingTab;
        setPendingTab(null);

        // Show analyzing loader, then switch tab
        setIsAnalyzing(true);
        setLiveTab(target || 'feedback');
        setTimeout(() => {
            setIsAnalyzing(false);
            setEvalState('loading');
            setTimeout(() => {
                setEvaluation(MOCK_EVALUATION);
                setEvalState('complete');
            }, 1200);
        }, 2000);
    };

    // ── Recordings Drawer (rendered on top of any view) ────────────────
    const renderDrawer = () => (
        <>
            {/* Backdrop */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            )}

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
                drawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <MicIcon className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Your Recordings</p>
                            <p className="text-[11px] text-gray-400">Tap a session to review it</p>
                        </div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Session List */}
                <div className="overflow-y-auto h-[calc(100%-73px)] p-4 space-y-2">
                    {recordings.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <MicIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No recordings yet</p>
                            <p className="text-xs mt-1">Complete a session to see it here</p>
                        </div>
                    ) : recordings.map(rec => (
                        <button
                            key={rec.id}
                            onClick={() => openPlayback(rec)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                        >
                            <div className={`w-10 h-10 rounded-full ${rec.partnerColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                {rec.partnerInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">Session with {rec.partnerName}</p>
                                <p className="text-[11px] text-gray-400">{rec.date} · {rec.duration} · {rec.messages.length} messages</p>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
                        </button>
                    ))}
                </div>
            </div>
        </>
    );

    // ── End Call Confirmation Modal ─────────────────────────────────────
    const renderEndCallModal = () => {
        if (!showEndCallModal) return null;
        const targetLabel = pendingTab === 'feedback' ? 'AI Feedback' : 'AI Scoring';
        return (
            <>
                <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => { setShowEndCallModal(false); setPendingTab(null); }} />
                <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-rose-100 p-2 rounded-full">
                                <PhoneOffIcon className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">End Call & View {targetLabel}?</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Your session will be saved and you'll be redirected.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowEndCallModal(false); setPendingTab(null); }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndCallForTab}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
                            >
                                End Call & View
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    // ── Render: Playback View ──────────────────────────────────────────
    if (sessionPlayback) {
        const rec = sessionPlayback;
        const playbackDuration = rec.elapsed;

        return (
            <div className="bg-gray-50 min-h-screen flex flex-col max-w-full">
                {renderDrawer()}

                {/* ═══ PLAYBACK HEADER ═══ */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 text-red-500 p-2.5 rounded-full">
                            <PhoneIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-lg font-bold text-gray-900">AI Speaking Partner</h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                                    PLAYBACK
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Session with {rec.partnerName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                            Recordings
                        </button>
                        <button
                            onClick={() => { setSessionPlayback(null); }}
                            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                </div>

                {/* ═══ PLAYBACK BODY ═══ */}
                <div className="flex-1 flex min-h-0 p-4 gap-4">
                    {/* ── Left Panel: Audio Player ── */}
                    <div className="w-[320px] shrink-0 rounded-3xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <div className={`w-24 h-24 rounded-full ${rec.partnerColor} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-200`}>
                                {rec.partnerInitials}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <span className="text-[10px] font-bold text-gray-500">RECORDED</span>
                            </div>
                        </div>

                        {/* Session Info */}
                        <p className="text-lg font-semibold text-gray-800">Session with {rec.partnerName}</p>
                        <p className="text-xs text-gray-400 mt-1">{rec.date}</p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Audio Scrubber */}
                        <div className="w-full space-y-2">
                            <div className="relative w-full h-1.5 bg-gray-100 rounded-full cursor-pointer"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const pct = (e.clientX - rect.left) / rect.width;
                                    setPlaybackTime(Math.floor(pct * playbackDuration));
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 h-full bg-rose-500 rounded-full transition-all"
                                    style={{ width: `${playbackDuration ? (playbackTime / playbackDuration) * 100 : 0}%` }}
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full shadow-sm border-2 border-white"
                                    style={{ left: `${playbackDuration ? (playbackTime / playbackDuration) * 100 : 0}%`, transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                <span>{formatSessionTime(playbackTime)}</span>
                                <span>{formatSessionTime(playbackDuration)}</span>
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={() => setSpeakerMutedPlayback(!speakerMutedPlayback)}
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
                            >
                                {speakerMutedPlayback ? <VolumeOffIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => {
                                    if (playbackTime >= playbackDuration) setPlaybackTime(0);
                                    setIsPlaying(!isPlaying);
                                }}
                                className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors"
                            >
                                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-0.5" />}
                            </button>
                            <div className="w-10 h-10" />
                        </div>
                    </div>

                    {/* ── Right Panel: Tabs & Content ── */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-100 shrink-0">
                            <button
                                onClick={() => setPlaybackTab('transcript')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                    playbackTab === 'transcript'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                💬 Transcript ({rec.messages.length})
                            </button>
                            <button
                                onClick={() => setPlaybackTab('feedback')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    playbackTab === 'feedback'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                ✨ AI Feedback
                                {evalState === 'complete' && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {playbackTab === 'transcript' && (
                                <div className="space-y-4">
                                    {rec.messages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                                msg.sender === 'user' ? 'text-gray-400' : 'text-blue-400'
                                            }`}>
                                                {msg.sender === 'user' ? 'YOU' : rec.partnerName} • {msg.timestamp}
                                            </span>
                                            <div className={`rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] ${
                                                msg.sender === 'user'
                                                    ? 'bg-rose-50/60 border border-rose-100 rounded-tr-none text-gray-800 text-right'
                                                    : 'bg-slate-50 border border-slate-100/80 rounded-tl-none text-gray-800'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {playbackTab === 'feedback' && (
                                <div className="space-y-6">
                                    {/* State 1: Pre-Evaluation */}
                                    {evalState === 'idle' && (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
                                                <SparklesIcon className="w-8 h-8 text-rose-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Evaluate with AI</h3>
                                            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                                Get detailed feedback on your fluency, grammar, vocabulary, and pronunciation from Mihu AI.
                                            </p>
                                            <button
                                                onClick={handleEvaluate}
                                                className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-md transition-colors"
                                            >
                                                Evaluate with AI
                                            </button>
                                        </div>
                                    )}

                                    {/* State 2: Loading */}
                                    {evalState === 'loading' && (
                                        <div className="text-center py-16">
                                            <div className="w-20 h-20 rounded-full bg-rose-50/50 flex items-center justify-center mx-auto mb-6 ring-4 ring-rose-100/50">
                                                <SpinnerIcon className="w-8 h-8 text-rose-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Analysing your conversation...</h3>
                                            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                                                Mihu AI is listening to your recording and preparing detailed feedback. This usually takes 15–30 seconds.
                                            </p>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* State 3: Evaluated Results */}
                                    {evalState === 'complete' && evaluation && (
                                        <>
                                            {/* Overall Band */}
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Overall Band</p>
                                                <p className="text-5xl font-bold text-gray-900 mt-2">{evaluation.overallBand}</p>
                                                <p className="text-xs text-gray-500 mt-1">out of 9.0</p>
                                            </div>

                                            {/* Sub-scores */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { label: 'Fluency & Coherence', score: evaluation.fluency },
                                                    { label: 'Lexical Resource', score: evaluation.lexical },
                                                    { label: 'Grammar & Accuracy', score: evaluation.grammar },
                                                    { label: 'Pronunciation', score: evaluation.pronunciation },
                                                ].map(item => (
                                                    <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</p>
                                                        <p className="text-xl font-bold text-gray-900 mt-1">{item.score}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Overall Feedback */}
                                            <p className="text-sm text-gray-600 leading-relaxed">{evaluation.feedback}</p>

                                            {/* Strengths */}
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
                                                <h4 className="text-sm font-bold text-emerald-700">What You Did Well</h4>
                                                {evaluation.strengths.map((s, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                        <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Improvements */}
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
                                                <h4 className="text-sm font-bold text-amber-700">Areas to Improve</h4>
                                                {evaluation.improvements.map((s, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                                                        <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Grammar Corrections */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-bold text-gray-900">From Your Conversation</h4>
                                                {evaluation.corrections.map((c, i) => (
                                                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 mt-0.5">You said:</span>
                                                            <p className="text-xs text-gray-600 line-through">{c.said}</p>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-[10px] font-bold text-emerald-500 uppercase shrink-0 mt-0.5">Try:</span>
                                                            <p className="text-xs text-emerald-700 font-medium">{c.try}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pronunciation Tips */}
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 space-y-2">
                                                <h4 className="text-sm font-bold text-purple-700">Pronunciation Tips</h4>
                                                {evaluation.pronunciationTips.map((tip, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <span className="text-purple-500 mt-0.5 shrink-0">🎙</span>
                                                        <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Vocabulary Suggestions */}
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                                                <h4 className="text-sm font-bold text-blue-700">Vocabulary to Try</h4>
                                                {evaluation.vocabularySuggestions.map((v, i) => (
                                                    <div key={i} className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-gray-500 line-through">{v.word}</span>
                                                        <span className="text-xs text-gray-400">→</span>
                                                        {v.alternatives.map((alt, j) => (
                                                            <span key={j} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{alt}</span>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: Live Call View ──────────────────────────────────────────
    if (sessionActive) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col max-w-full">
                {renderDrawer()}
                {renderEndCallModal()}

                {/* ═══ CALL HEADER ═══ */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 text-red-500 p-2.5 rounded-full">
                            <PhoneIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-lg font-bold text-gray-900">AI Speaking Partner</h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 uppercase tracking-wider">
                                    LIVE
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Talking with {activePartner.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            ⏱ {getRemainingMinutes()} min left / {TOTAL_SESSION_MINUTES} min
                        </span>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                            Recordings
                        </button>
                        <button
                            onClick={handleDisconnect}
                            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                </div>

                {/* ═══ CALL BODY ═══ */}
                <div className="flex-1 flex min-h-0 p-4 gap-4">
                    {/* ── Left Panel: Partner Status ── */}
                    <div className="w-[320px] md:w-[380px] shrink-0 rounded-3xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center relative">
                        <div className="relative mb-4">
                            <div className={`w-24 h-24 rounded-full ${activePartner.color} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-red-500/30`}>
                                {activePartner.initials}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600">LIVE</span>
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-gray-800">
                            {callEnded
                                ? 'Call Ended'
                                : isPartnerSpeaking
                                ? `${activePartner.name} is speaking...`
                                : callState === 'recording'
                                ? 'Listening to you...'
                                : `${activePartner.name} is listening...`}
                        </p>
                        <p className="text-2xl text-gray-500 font-medium tracking-wider mt-2 font-mono">
                            {formatSessionTime(sessionElapsed)}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-rose-500 h-6 mt-3">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-150 ${
                                        !callEnded && (isPartnerSpeaking || callState === 'recording')
                                            ? 'bg-rose-500 animate-pulse'
                                            : callEnded
                                            ? 'bg-gray-300'
                                            : 'bg-gray-200'
                                    }`}
                                    style={{
                                        height: !callEnded && (isPartnerSpeaking || callState === 'recording')
                                            ? `${8 + Math.random() * 16}px`
                                            : '4px',
                                        animationDelay: `${i * 0.05}s`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex-1" />
                        {!callEnded ? (
                            <div className="flex items-center gap-4 mt-6">
                                <button
                                    onClick={() => setSpeakerMuted(!speakerMuted)}
                                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
                                >
                                    {speakerMuted ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeIcon className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleDisconnect}
                                    className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors"
                                >
                                    <PhoneOffIcon className="w-6 h-6" />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
                                    <MicIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-full">
                                    Duration: {formatSessionTime(sessionElapsed)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Center Panel: Transcript + Mic Control ── */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => handleLiveTabClick('transcript')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        liveTab === 'transcript'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${liveTab === 'transcript' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                    Transcript
                                </button>
                                <button
                                    onClick={() => handleLiveTabClick('feedback')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        liveTab === 'feedback'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                    AI Feedback
                                </button>
                                <button
                                    onClick={() => handleLiveTabClick('scoring')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        liveTab === 'scoring'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <ChartBarIcon className="w-3.5 h-3.5" />
                                    AI Scoring
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">{transcript.length} messages</span>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">You</span>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{activePartner.name}</span>
                            </div>
                        </div>

                        {/* ── Analyzing Loading Overlay ── */}
                        {isAnalyzing && (
                            <div className="flex-1 flex items-center justify-center p-6">
                                <div className="text-center space-y-4">
                                    <div className="relative w-16 h-16 mx-auto">
                                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ChartBarIcon className="w-6 h-6 text-indigo-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Analyzing conversation & generating AI evaluation...</p>
                                        <p className="text-xs text-gray-400 mt-1">Evaluating Fluency, Lexical Resource, Grammar, and Pronunciation</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab Content ── */}
                        {!isAnalyzing && liveTab === 'transcript' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {transcript.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                                msg.sender === 'user' ? 'text-gray-400' : 'text-blue-400'
                                            }`}>
                                                {msg.sender === 'user' ? 'YOU' : activePartner.name} • {msg.timestamp}
                                            </span>
                                            <div className={`rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] ${
                                                msg.sender === 'user'
                                                    ? 'bg-rose-50/60 border border-rose-100 rounded-tr-none text-gray-800 text-right'
                                                    : 'bg-slate-50 border border-slate-100/80 rounded-tl-none text-gray-800'
                                            }`}>
                                                {msg.text}
                                                {msg.isStreaming && (
                                                    <span className="inline-block w-0.5 h-4 bg-gray-800 ml-0.5 animate-pulse align-text-bottom" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={transcriptEndRef} />
                                </div>
                                <div className="px-6 py-4 border-t border-gray-100 flex justify-center shrink-0">
                                    {callState === 'idle' && (
                                        <button
                                            onClick={handleTapToSpeak}
                                            className="bg-slate-900 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
                                        >
                                            <MicIcon className="w-5 h-5" />
                                            Tap to Speak
                                        </button>
                                    )}
                                    {callState === 'recording' && (
                                        <button
                                            onClick={handleTapToSpeak}
                                            className="bg-rose-500 text-white font-medium px-6 py-3 rounded-full shadow-lg animate-pulse flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                                            Recording... Tap to Stop
                                        </button>
                                    )}
                                    {callState === 'processing' && (
                                        <div className="bg-gray-100 text-gray-500 font-medium px-6 py-3 rounded-full border border-gray-200 flex items-center gap-2 pointer-events-none">
                                            <SpinnerIcon className="w-4 h-4" />
                                            Transcribing audio...
                                        </div>
                                    )}
                                    {callEnded && (
                                        <div className="bg-gray-100 text-gray-500 font-medium px-6 py-3 rounded-full border border-gray-200 flex items-center gap-2">
                                            <span className="text-xs">Call ended — switch to AI Feedback or AI Scoring for analysis</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {!isAnalyzing && liveTab === 'feedback' && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                {evalState === 'idle' && (
                                    <div className="text-center py-12">
                                        <SparklesIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                        <p className="text-sm font-semibold text-gray-700">Get AI Feedback on Your Session</p>
                                        <p className="text-xs text-gray-400 mt-1 mb-5">Our AI will analyze your conversation and provide detailed feedback.</p>
                                        <button
                                            onClick={() => { setEvalState('loading'); setTimeout(() => { setEvaluation(MOCK_EVALUATION); setEvalState('complete'); }, 2500); }}
                                            className="bg-amber-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-amber-600 transition-colors"
                                        >
                                            Evaluate with AI
                                        </button>
                                    </div>
                                )}
                                {evalState === 'loading' && (
                                    <div className="text-center py-16">
                                        <SpinnerIcon className="w-10 h-10 text-amber-500 mx-auto mb-4 animate-spin" />
                                        <p className="text-sm font-semibold text-gray-700">Analyzing your conversation...</p>
                                        <p className="text-xs text-gray-400 mt-1">This usually takes a few seconds</p>
                                    </div>
                                )}
                                {evalState === 'complete' && evaluation && (
                                    <>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Overall Band</p>
                                            <p className="text-5xl font-bold text-gray-900 mt-2">{evaluation.overallBand}</p>
                                            <p className="text-xs text-gray-500 mt-1">out of 9.0</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Fluency & Coherence', score: evaluation.fluency },
                                                { label: 'Lexical Resource', score: evaluation.lexical },
                                                { label: 'Grammar & Accuracy', score: evaluation.grammar },
                                                { label: 'Pronunciation', score: evaluation.pronunciation },
                                            ].map(item => (
                                                <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</p>
                                                    <p className="text-xl font-bold text-gray-900 mt-1">{item.score}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{evaluation.feedback}</p>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-sm font-bold text-emerald-700">What You Did Well</h4>
                                            {evaluation.strengths.map((s, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-sm font-bold text-amber-700">Areas to Improve</h4>
                                            {evaluation.improvements.map((s, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                                                    <p className="text-xs text-gray-700 leading-relaxed">{s}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-gray-900">From Your Conversation</h4>
                                            {evaluation.corrections.map((c, i) => (
                                                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 mt-0.5">You said:</span>
                                                        <p className="text-xs text-gray-600 line-through">{c.said}</p>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-[10px] font-bold text-emerald-500 uppercase shrink-0 mt-0.5">Try:</span>
                                                        <p className="text-xs text-emerald-700 font-medium">{c.try}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 space-y-2">
                                            <h4 className="text-sm font-bold text-purple-700">Pronunciation Tips</h4>
                                            {evaluation.pronunciationTips.map((tip, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <span className="text-purple-500 mt-0.5 shrink-0">🎙</span>
                                                    <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                                            <h4 className="text-sm font-bold text-blue-700">Vocabulary to Try</h4>
                                            {evaluation.vocabularySuggestions.map((v, i) => (
                                                <div key={i} className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-gray-500 line-through">{v.word}</span>
                                                    <span className="text-xs text-gray-400">→</span>
                                                    {v.alternatives.map((alt, j) => (
                                                        <span key={j} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{alt}</span>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {!isAnalyzing && liveTab === 'scoring' && (
                            <div className="flex-1 overflow-y-auto p-6">
                                <AIScoringAccordion evalState={evalState} evaluation={evaluation} onEvaluate={() => { setEvalState('loading'); setTimeout(() => { setEvaluation(MOCK_EVALUATION); setEvalState('complete'); }, 2500); }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: Main Persona Selection View ─────────────────────────────
    return (
        <div className="bg-gray-50 min-h-screen p-6 max-w-5xl mx-auto space-y-6">
            {renderDrawer()}

            {/* ═══ 2.1 TOP HEADER BAR ═══ */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-500 p-3 rounded-full">
                        <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-[24px] font-bold text-gray-900">AI Speaking Partner</h1>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                voiceMode === 'realistic'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                                {voiceMode === 'realistic' ? 'Realistic Voice' : 'Normal Voice'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Practice with your AI speaking partner</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        Recordings
                    </button>
                    <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                        <ChevronLeftIcon className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </div>

            {/* ═══ 2.2 VOICE QUALITY & COIN BALANCE SELECTOR ═══ */}
            <div className="max-w-5xl w-full rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex">
                    <button
                        onClick={() => setVoiceMode('realistic')}
                        className={`flex-1 p-4 flex items-center justify-between transition-all ${
                            voiceMode === 'realistic'
                                ? 'bg-slate-950 text-white'
                                : 'bg-gray-50 text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                voiceMode === 'realistic' ? 'border-white' : 'border-gray-400'
                            }`}>
                                {voiceMode === 'realistic' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-semibold">Realistic Voice</span>
                        </div>
                        <span className="text-[11px] font-bold opacity-80">🟡 5/min</span>
                    </button>
                    <button
                        onClick={() => setVoiceMode('normal')}
                        className={`flex-1 p-4 flex items-center justify-between transition-all ${
                            voiceMode === 'normal'
                                ? 'bg-slate-950 text-white'
                                : 'bg-gray-50 text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                voiceMode === 'normal' ? 'border-white' : 'border-gray-400'
                            }`}>
                                {voiceMode === 'normal' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-semibold">Normal Voice</span>
                            <span className="bg-white/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Beta</span>
                        </div>
                        <span className="text-[11px] font-bold opacity-80">🟡 1/min</span>
                    </button>
                </div>
                <div className="bg-amber-50/70 py-3 text-center border-t border-amber-100">
                    <span className="text-sm font-bold text-gray-800">🪙 10 Gold Coins</span>
                </div>
            </div>

            {/* ═══ 2.3 PARTNER SELECTION & HERO PROFILE ═══ */}
            <div className="max-w-5xl w-full rounded-3xl bg-gradient-to-b from-red-50/30 via-white to-white border border-gray-100 p-6 shadow-sm text-center space-y-6">
                <p className="text-sm font-medium text-gray-700">Your Speaking Partner</p>
                <div className="flex items-center justify-center gap-3">
                    {PARTNERS.map((partner) => (
                        <button
                            key={partner.name}
                            onClick={() => {
                                setSelectedPartner(partner.name);
                                setSelectedLanguage(partner.languages[0] as Language);
                            }}
                            className={`relative flex flex-col items-center gap-1.5 transition-all ${
                                selectedPartner === partner.name ? 'scale-105' : 'opacity-70 hover:opacity-100'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full ${partner.color} flex items-center justify-center text-white text-[11px] font-bold ${
                                selectedPartner === partner.name ? 'ring-2 ring-red-500 ring-offset-2' : ''
                            }`}>
                                {partner.initials}
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">{partner.name}</span>
                        </button>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="relative inline-block">
                        <div className={`w-24 h-24 rounded-full ${activePartner.color} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-red-500/30`}>
                            {activePartner.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600">LIVE</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[28px] font-bold text-gray-900">{activePartner.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{activePartner.tagline}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Online & Ready
                        </span>
                        <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition-colors">
                            <PlayIcon className="w-3 h-3" />
                            Hear Voice
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ 2.4 LANGUAGE SELECTION & SESSION CTA ═══ */}
            <div className="max-w-5xl w-full space-y-4">
                <p className="text-sm font-medium text-gray-500 text-center">{activePartner.name} speaks</p>
                <div className="flex items-center justify-center gap-2.5">
                    {activePartner.languages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang as Language)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedLanguage === lang
                                    ? 'bg-slate-950 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {LANGUAGE_LABELS[lang as Language]}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleStartSession}
                    className="w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                    <PhoneIcon className="w-5 h-5" />
                    Start Session with {activePartner.name}
                </button>
            </div>

            {/* ═══ 2.5 MICROPHONE INPUT SETTINGS ═══ */}
            <div className="max-w-5xl w-full rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                    <MicIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Microphone</span>
                </div>
                <div className="relative">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300">
                        <option>Microphone (2- USB Audio Device) (1b3f:2008)</option>
                        <option>Default Microphone</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
                    🔴 Test mic
                </button>
            </div>

            {/* ═══ 2.6 SCENARIO SELECTOR ═══ */}
            <div className="max-w-5xl w-full mx-auto space-y-3 transition-all duration-200">
                <button
                    onClick={() => setScenarioOpen(!scenarioOpen)}
                    className="w-full rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex items-center justify-between hover:border-gray-200 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                            <TargetIcon className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-700">Choose a Scenario</p>
                            <p className="text-[11px] text-gray-400">Optional — start free practice without one</p>
                        </div>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${scenarioOpen ? 'rotate-180' : ''}`} />
                </button>

                {scenarioOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-3">
                        {SCENARIOS.map((scenario) => {
                            const diffColor = scenario.difficulty === 'Beginner'
                                ? 'bg-emerald-100 text-emerald-700'
                                : scenario.difficulty === 'Intermediate'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700';
                            return (
                                <button
                                    key={scenario.id}
                                    className="group rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.gradient} flex items-center justify-center`}>
                                            <TargetIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2">{scenario.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{scenario.description}</p>
                                    <div className="flex items-center gap-1.5 mt-3 text-gray-400">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium">{scenario.duration}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ═══ 2.7 HOW GOLD COINS WORK ═══ */}
            <div className="max-w-5xl w-full mx-auto rounded-2xl bg-amber-950/20 border border-amber-500/30 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🪙</span>
                    <h3 className="text-sm font-bold text-white">How Gold Coins work</h3>
                </div>
                <p className="text-xs text-amber-200/60 leading-relaxed">
                    Pro includes 600 Gold Coins each month. Coins reset with your plan; purchased coins carry forward while Pro stays active.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-950/40 rounded-xl border border-amber-500/20 p-3 text-center">
                        <p className="text-[11px] font-bold text-amber-200/80">Normal Voice</p>
                        <p className="text-sm font-bold text-amber-400 mt-1">1 coin/min</p>
                    </div>
                    <div className="bg-amber-950/40 rounded-xl border border-amber-500/20 p-3 text-center">
                        <p className="text-[11px] font-bold text-amber-200/80">Realistic Voice</p>
                        <p className="text-sm font-bold text-amber-400 mt-1">5 coins/min</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISpeakingPartnerView;
