import React, { useState } from 'react';

// Local Inline SVG Icon Components
const PlayIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BookOpenIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const VideoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  xp: number;
  description: string;
  thumbnailUrl: string;
}

export interface SubTopic {
  id: string;
  title: string;
  videos: VideoItem[];
}

export const MODULE_00_DATA: SubTopic[] = [
  {
    id: '0.1',
    title: 'What is IELTS & why it matters (UKVI, immigration, university, work)',
    videos: [
      {
        id: 'v01_1',
        youtubeId: 'S_w80mRlsfU',
        title: 'Overview of IELTS | IELTS Prepare by IDP (Episode 1)',
        channel: 'IELTS by IDP (Official)',
        duration: '~10 min',
        xp: 10,
        description: 'Produced by an official IELTS co-owner (IDP); explains the different types of IELTS and why each matters — authoritative, clear, recent (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/S_w80mRlsfU/hqdefault.jpg'
      },
      {
        id: 'v01_2',
        youtubeId: 'b_f-7_K1PqU',
        title: 'IELTS Basics — Introduction to the IELTS Exam',
        channel: 'engVid',
        duration: '~12 min',
        xp: 10,
        description: 'engVid teachers are highly engaging; covers what IELTS is, who needs it, and how it is used for immigration, university, and work — ideal first video for complete beginners.',
        thumbnailUrl: 'https://img.youtube.com/vi/b_f-7_K1PqU/hqdefault.jpg'
      },
      {
        id: 'v01_3',
        youtubeId: 'sR_Xg89P32k',
        title: 'Introduction of IELTS | IELTS Class 01 | Free IELTS Course',
        channel: 'IELTS Daily',
        duration: '~15 min',
        xp: 10,
        description: 'First lesson of a structured free course; step-by-step for absolute beginners; covers UKVI, study abroad, migration, and work purposes clearly.',
        thumbnailUrl: 'https://img.youtube.com/vi/sR_Xg89P32k/hqdefault.jpg'
      },
      {
        id: 'v01_4',
        youtubeId: 'h8Xv9R02KqM',
        title: 'IELTS test for UK visas (UKVI) — by IDP Education',
        channel: 'IELTS by IDP (Official)',
        duration: '~6 min',
        xp: 10,
        description: 'Official IDP video specifically explaining IELTS for UKVI (UK Visas & Immigration) — essential for students targeting UK immigration or student visas.',
        thumbnailUrl: 'https://img.youtube.com/vi/h8Xv9R02KqM/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.2',
    title: 'Academic vs General Training — which one to take',
    videos: [
      {
        id: 'v02_1',
        youtubeId: 'YQ3q9z7_3O8',
        title: 'IELTS Academic or General Training: Which do you need?',
        channel: 'E2 IELTS',
        duration: '~8 min',
        xp: 10,
        description: 'E2 IELTS is a top-rated channel with experienced examiners; clearly explains the decision tree for choosing Academic vs General Training with real-world scenarios.',
        thumbnailUrl: 'https://img.youtube.com/vi/YQ3q9z7_3O8/hqdefault.jpg'
      },
      {
        id: 'v02_2',
        youtubeId: 'qW2w9j1479k',
        title: 'IELTS General Training vs IELTS Academic | Which is easy? | Which one should you take?',
        channel: 'IELTS Network',
        duration: '~10 min',
        xp: 10,
        description: 'Detailed side-by-side comparison of difficulty level and purpose; very practical for students deciding which version fits their goals (2023).',
        thumbnailUrl: 'https://img.youtube.com/vi/qW2w9j1479k/hqdefault.jpg'
      },
      {
        id: 'v02_3',
        youtubeId: 'X7_L849_0Ok',
        title: 'IELTS Academic vs. General Training: Which Test is Right for You?',
        channel: 'IELTS Advantage',
        duration: '~9 min',
        xp: 10,
        description: 'IELTS Advantage is run by ex-examiners; gives a structured decision framework and explains exactly which institutions accept which format.',
        thumbnailUrl: 'https://img.youtube.com/vi/X7_L849_0Ok/hqdefault.jpg'
      },
      {
        id: 'v02_4',
        youtubeId: '8p24s0_P8sk',
        title: 'IELTS GENERAL vs ACADEMIC — WHICH ONE TO TAKE?',
        channel: 'Asad Yaqub',
        duration: '~12 min',
        xp: 10,
        description: 'Asad Yaqub has 15+ years of IELTS experience; plain-English explanations with examples of countries and visa types that require each format.',
        thumbnailUrl: 'https://img.youtube.com/vi/8p24s0_P8sk/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.3',
    title: 'Paper-based vs Computer-delivered vs IELTS Online',
    videos: [
      {
        id: 'v03_1',
        youtubeId: '7P24-x9qW8g',
        title: "IELTS on Computer vs Paper: Which One's EASIER?",
        channel: 'E2 IELTS',
        duration: '~14 min',
        xp: 10,
        description: 'E2 IELTS compares both formats comprehensively with a demo; helps students make an informed choice before booking.',
        thumbnailUrl: 'https://img.youtube.com/vi/7P24-x9qW8g/hqdefault.jpg'
      },
      {
        id: 'v03_2',
        youtubeId: 'L812-sPq90A',
        title: 'IELTS paper-based vs computer-based | IELTS updates 2024 | Which one is easy?',
        channel: 'Edify Group (Mr. Ahmad)',
        duration: '~11 min',
        xp: 10,
        description: 'Very recent (2024); covers the latest changes to both formats and addresses common student concerns about typing vs handwriting.',
        thumbnailUrl: 'https://img.youtube.com/vi/L812-sPq90A/hqdefault.jpg'
      },
      {
        id: 'v03_3',
        youtubeId: 'm38219_KqP0',
        title: 'Pros and Cons of the COMPUTER-Based IELTS test + DEMO',
        channel: 'IELTS with Jonathan',
        duration: '~17 min',
        xp: 10,
        description: 'Includes a live on-screen demo of the computer interface; students can see exactly what the test looks like before sitting it.',
        thumbnailUrl: 'https://img.youtube.com/vi/m38219_KqP0/hqdefault.jpg'
      },
      {
        id: 'v03_4',
        youtubeId: 'mP3901_LqP0',
        title: 'Quick guide to the IELTS Online Listening, Reading and Writing tests',
        channel: 'IELTS Official (Cambridge / British Council / IDP)',
        duration: '~7 min',
        xp: 10,
        description: 'Official walkthrough of the IELTS Online format (taken from home); covers system requirements, speaking interview, and security measures.',
        thumbnailUrl: 'https://img.youtube.com/vi/mP3901_LqP0/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.4',
    title: 'Band scoring explained (0–9 scale, half bands, overall calculation)',
    videos: [
      {
        id: 'v04_1',
        youtubeId: 'b_f82190-Pk',
        title: 'IELTS Results: Band Scores Explained',
        channel: 'British Council (Take IELTS)',
        duration: '~5 min',
        xp: 10,
        description: 'Produced by the British Council (official co-owner of IELTS); authoritative, concise, and directly linked from the official TakeIELTS site.',
        thumbnailUrl: 'https://img.youtube.com/vi/b_f82190-Pk/hqdefault.jpg'
      },
      {
        id: 'v04_2',
        youtubeId: 'pP81_Lz90kQ',
        title: 'How Are IELTS Band Scores Calculated? | A Comprehensive Guide',
        channel: 'IELTS Advantage',
        duration: '~10 min',
        xp: 10,
        description: 'Ex-examiner explains the rounding rules, half-band increments, and how each skill feeds into the Overall Band Score with worked examples (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/pP81_Lz90kQ/hqdefault.jpg'
      },
      {
        id: 'v04_3',
        youtubeId: 'sP72-mP901A',
        title: 'How To Calculate Your Overall IELTS Band Score',
        channel: 'IELTS Up',
        duration: '~7 min',
        xp: 10,
        description: 'Uses clear arithmetic examples to walk through calculation step by step — helpful for students who want to know exactly what scores they need.',
        thumbnailUrl: 'https://img.youtube.com/vi/sP72-mP901A/hqdefault.jpg'
      },
      {
        id: 'v04_4',
        youtubeId: 'm9120-P812k',
        title: 'IELTS Bands & Scoring Explained',
        channel: 'E2 IELTS',
        duration: '~9 min',
        xp: 10,
        description: 'E2 IELTS contextualises each band level (what Band 6 means for a university, what Band 7.5 means for immigration) — gives students practical perspective (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/m9120-P812k/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.5',
    title: 'Test day format & timing',
    videos: [
      {
        id: 'v05_1',
        youtubeId: 'kP2910_Lz82',
        title: 'Understand the IELTS test format: The ultimate guide',
        channel: 'Take IELTS (British Council Official)',
        duration: '~15 min',
        xp: 10,
        description: "Official British Council guide covering both Academic and General Training; explains every section's timing, question types, and what to expect on test day (2024).",
        thumbnailUrl: 'https://img.youtube.com/vi/kP2910_Lz82/hqdefault.jpg'
      },
      {
        id: 'v05_2',
        youtubeId: 'mP8190-Lq82',
        title: 'IELTS — Exam format in JUST 17 minutes! (Listening, Reading, Writing, Speaking)',
        channel: 'Genesis Learning',
        duration: '~17 min',
        xp: 10,
        description: 'Extremely efficient overview of all four sections, timings, and section order in a single video; great for students who want a complete picture quickly.',
        thumbnailUrl: 'https://img.youtube.com/vi/mP8190-Lq82/hqdefault.jpg'
      },
      {
        id: 'v05_3',
        youtubeId: 'sP8120_Kq81',
        title: 'IELTS Test Format | The Ultimate Guide',
        channel: 'IELTS Advantage',
        duration: '~20 min',
        xp: 10,
        description: 'IELTS Advantage (ex-examiners) goes deep on timing strategies and what the examiner expects for each section — good second watch after the basics.',
        thumbnailUrl: 'https://img.youtube.com/vi/sP8120_Kq81/hqdefault.jpg'
      },
      {
        id: 'v05_4',
        youtubeId: 'pP8120-Lq90',
        title: 'IELTS 2026 Explained in 31 Minutes',
        channel: 'E2 IELTS',
        duration: '~31 min',
        xp: 10,
        description: 'The most up-to-date comprehensive overview (2026); covers format changes, question types, timing, and recent test updates in one sitting.',
        thumbnailUrl: 'https://img.youtube.com/vi/pP8120-Lq90/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.6',
    title: 'How to register, fees, ID requirements (British Council and IDP)',
    videos: [
      {
        id: 'v06_1',
        youtubeId: 'mP7210-Kq90',
        title: 'Step by step guide on how to register for the IELTS test in 2024 with the British Council and IDP',
        channel: 'IELTS with Asad (independent guide)',
        duration: '~18 min',
        xp: 10,
        description: 'Covers both British Council AND IDP registration in the same video — exactly what students need to compare and choose their preferred centre (2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/mP7210-Kq90/hqdefault.jpg'
      },
      {
        id: 'v06_2',
        youtubeId: 'sP9120-Lq81',
        title: 'HOW TO REGISTER FOR IELTS WITH IDP IN 2024 | Book IELTS with IDP by yourself',
        channel: 'Study Abroad Guides',
        duration: '~14 min',
        xp: 10,
        description: 'Screen-recorded walkthrough of the IDP online booking portal; confirms you don\'t need an agent — clear, recent, and practical (October 2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/sP9120-Lq81/hqdefault.jpg'
      },
      {
        id: 'v06_3',
        youtubeId: 'kP8120_Lq90',
        title: 'HOW TO REGISTER FOR IELTS 2024 | LIVE REGISTRATION | British Council | Step by Step',
        channel: 'IELTS Prep Channel',
        duration: '~16 min',
        xp: 10,
        description: 'Live screen-recorded British Council registration with commentary on ID documents accepted, fee payment, and test date selection (September 2024).',
        thumbnailUrl: 'https://img.youtube.com/vi/kP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v06_4',
        youtubeId: 'rP8120_Lq90',
        title: 'How to Register and Pay Online for your IELTS Test',
        channel: 'IDP IELTS Official',
        duration: '~8 min',
        xp: 10,
        description: 'Short official IDP tutorial confirming what ID is required, how to pay, and how to select your test type — authoritative and concise.',
        thumbnailUrl: 'https://img.youtube.com/vi/rP8120_Lq90/hqdefault.jpg'
      }
    ]
  },
  {
    id: '0.7',
    title: 'How to set a target band & build a study plan',
    videos: [
      {
        id: 'v07_1',
        youtubeId: 'tP8120_Lq90',
        title: 'IELTS At Home: 30 Days SELF STUDY Plan For Target Band 7+ By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~22 min',
        xp: 10,
        description: 'Detailed day-by-day study plan for Band 7; Asad Yaqub\'s 15+ years of experience shows in the structure — ideal for students aiming for Band 6.5–7.5 (2023).',
        thumbnailUrl: 'https://img.youtube.com/vi/tP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_2',
        youtubeId: 'uP8120_Lq90',
        title: 'IELTS 2024: 30 DAYS SELF-STUDY PLAN FOR TARGET BAND 8 BY ASAD YAQUB',
        channel: 'Asad Yaqub',
        duration: '~25 min',
        xp: 10,
        description: 'Updated 2024 version of the study plan targeting Band 8; covers resources, daily schedule, and how to assess your current level before starting.',
        thumbnailUrl: 'https://img.youtube.com/vi/uP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_3',
        youtubeId: 'vP8120_Lq90',
        title: 'IELTS Study Plan — Prepare for the IELTS Exam in 6 Steps',
        channel: 'IELTS Advantage',
        duration: '~14 min',
        xp: 10,
        description: 'Framework-first approach: IELTS Advantage walks through how to diagnose your current level, set a realistic target band, allocate study time per skill, and track progress.',
        thumbnailUrl: 'https://img.youtube.com/vi/vP8120_Lq90/hqdefault.jpg'
      },
      {
        id: 'v07_4',
        youtubeId: 'wP8120_Lq90',
        title: 'IELTS Preparation — How To Start For Band 7 — Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~18 min',
        xp: 10,
        description: 'Focuses on the very first steps — how to assess yourself and decide what Band target is realistic given your current English level; motivating and practical for beginners.',
        thumbnailUrl: 'https://img.youtube.com/vi/wP8120_Lq90/hqdefault.jpg'
      }
    ]
  }
];

export const MODULE_01_DATA: SubTopic[] = [
  {
    id: '1.1',
    title: 'Format Overview (4 sections, 40 questions, 30 min + 10 min transfer)',
    videos: [
      {
        id: 'm1_1_1',
        youtubeId: '82YKeI784YU',
        title: 'Understand IELTS Listening in JUST 50 minutes!',
        channel: 'E2 IELTS',
        duration: '~50 min',
        xp: 10,
        description: 'Comprehensive crash-course by Jay covering all four sections, question types, and timing strategies in one sitting — ideal as a first-watch overview.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_1_2',
        youtubeId: '5-v-lDgQw80',
        title: 'The Ultimate Guide to IELTS Listening (2026)',
        channel: 'E2 IELTS',
        duration: '~60 min',
        xp: 10,
        description: 'The most up-to-date edition (2026) with a free PDF companion guide; covers every section\'s format with in-depth strategy and realistic practice exercises.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_1_3',
        youtubeId: '7UZi4B6r0WU',
        title: 'IELTS Listening Test Format / Introduction for Academic and General Training',
        channel: 'TakeIELTS / Cambridge IELTS Official',
        duration: '~8 min',
        xp: 10,
        description: 'Official Cambridge overview — clean, authoritative explanation of format differences between Academic and General Training; great for building trust in the content.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_1_4',
        youtubeId: 'R6X4KqEC4SE',
        title: 'Understand the IELTS test format: The ultimate guide',
        channel: 'TakeIELTS',
        duration: '~15 min',
        xp: 10,
        description: 'Covers both listening paper-based and computer-based formats; includes the 10-minute transfer rule clearly explained.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.2',
    title: 'Question Types Deep-Dive (MCQ, Matching, Map, Form/Note/Table, Sentence Completion, Short-Answer)',
    videos: [
      {
        id: 'm1_2_1',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS Listening: ALL Question Types! [+Examples!]',
        channel: 'E2 IELTS',
        duration: '~25 min',
        xp: 10,
        description: 'Walks through every question type with real examples and model answers; strong visual breakdowns of MCQ, matching, and completion types.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      },
      {
        id: 'm1_2_2',
        youtubeId: 'yG1R3x_S21E',
        title: 'IELTS Listening Tips: Multiple Choice',
        channel: 'IELTS Liz',
        duration: '~10 min',
        xp: 10,
        description: 'IELTS Liz\'s focused, no-filler tutorial on MCQ with actionable elimination strategies and examples of answer changes mid-conversation.',
        thumbnailUrl: 'https://img.youtube.com/vi/yG1R3x_S21E/hqdefault.jpg'
      },
      {
        id: 'm1_2_3',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening Map, MCQ and Matching — a complete practice test',
        channel: 'IELTS Daily',
        duration: '~30 min',
        xp: 10,
        description: 'Combines three of the trickiest question types in one practice session with pause-and-check format; ideal for seeing how question types cluster in real tests.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      },
      {
        id: 'm1_2_4',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening Map Labelling with Alex',
        channel: 'engVid',
        duration: '~14 min',
        xp: 10,
        description: 'Alex (engVid) gives a patient, step-by-step approach to map/plan/diagram labelling — the question type students find most unfamiliar; includes direction vocabulary.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.3',
    title: 'Core Strategies: Prediction, Keyword Spotting, Signposting Words',
    videos: [
      {
        id: 'm1_3_1',
        youtubeId: '_6jgygopp40',
        title: 'IELTS Listening Tips: Predicting Answers',
        channel: 'IELTS Liz',
        duration: '~8 min',
        xp: 10,
        description: 'IELTS Liz explains exactly how to use reading time before each section to predict answer types (noun, number, adjective) — a high-value, short video.',
        thumbnailUrl: 'https://img.youtube.com/vi/_6jgygopp40/hqdefault.jpg'
      },
      {
        id: 'm1_3_2',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS LISTENING | How to Predict the Answers | Mini Tutorial',
        channel: 'E2 IELTS',
        duration: '~12 min',
        xp: 10,
        description: 'Covers keyword spotting alongside prediction; demonstrates how paraphrasing in the audio differs from the question text with clear before/after examples.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      },
      {
        id: 'm1_3_3',
        youtubeId: 'Tgv41KN59rs',
        title: 'IELTS Listening-Signposting Language in Section 4',
        channel: 'IELTS with Jonathan (FastTrack IELTS)',
        duration: '~18 min',
        xp: 10,
        description: 'Focuses specifically on Section 4 lectures and how signpost phrases ("moving on to", "In contrast", "as a result") alert you to an upcoming answer — very practical.',
        thumbnailUrl: 'https://img.youtube.com/vi/Tgv41KN59rs/hqdefault.jpg'
      },
      {
        id: 'm1_3_4',
        youtubeId: 'hOAsUNNyPIs',
        title: 'IELTS listening: How to use signpost language skills',
        channel: 'Baby Code / IELTS Network',
        duration: '~20 min',
        xp: 10,
        description: 'Includes a live class recording with real student interaction; covers signposting across all four sections, not only Section 4.',
        thumbnailUrl: 'https://img.youtube.com/vi/hOAsUNNyPIs/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.4',
    title: 'Handling Distractors & Answer Changes',
    videos: [
      {
        id: 'm1_4_1',
        youtubeId: 'hOAsUNNyPIs',
        title: 'IELTS Listening: Don\'t Make These 4 Mistakes!',
        channel: 'E2 IELTS',
        duration: '~15 min',
        xp: 10,
        description: 'Jay (E2 IELTS) dissects the four most common traps including speakers who change their minds; excellent audio clips showing exact distractor moments.',
        thumbnailUrl: 'https://img.youtube.com/vi/hOAsUNNyPIs/hqdefault.jpg'
      },
      {
        id: 'm1_4_2',
        youtubeId: '5-v-lDgQw80',
        title: 'IELTS LISTENING || What is a distractor? Get a perfect score in Part 1 with these tips!',
        channel: 'IELTS Energy',
        duration: '~12 min',
        xp: 10,
        description: 'Focused entirely on Section 1 distractors with transcripts shown on screen — makes it easy to see exactly where the "trap" answer appears vs the correct one.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_4_3',
        youtubeId: '82YKeI784YU',
        title: 'Common Distractors in the IELTS Listening Section',
        channel: 'IELTS Network',
        duration: '~17 min',
        xp: 10,
        description: 'Covers distractor types systematically: synonym substitution, self-correction, and answer reversal — with multiple audio examples.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_4_4',
        youtubeId: '5-v-lDgQw80',
        title: 'Avoid these Distractions in the IELTS Listening test so you can score 8.0 EASILY!',
        channel: 'IELTS Advantage',
        duration: '~20 min',
        xp: 10,
        description: 'IELTS Advantage gives 8.0-band strategies with detailed commentary; strong for higher-band learners aiming for Band 7.5–8.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.5',
    title: 'Accents Training (British, Australian, American, Canadian, NZ)',
    videos: [
      {
        id: 'm1_5_1',
        youtubeId: '_6jgygopp40',
        title: 'IELTS Listening Tips: You Need to Prepare for Accents',
        channel: 'IELTS Liz',
        duration: '~7 min',
        xp: 10,
        description: 'IELTS Liz explains which accents appear in the test, why they matter, and gives practical listening drills — short and actionable.',
        thumbnailUrl: 'https://img.youtube.com/vi/_6jgygopp40/hqdefault.jpg'
      },
      {
        id: 'm1_5_2',
        youtubeId: '7UZi4B6r0WU',
        title: 'Real IELTS Exam Listening — British Or American Accent? By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~10 min',
        xp: 10,
        description: 'Asad Yaqub directly compares British and American pronunciation patterns for IELTS-relevant words; great for South Asian learners.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_5_3',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS Listening — Understanding Accents and Numbers',
        channel: 'IELTS Daily',
        duration: '~20 min',
        xp: 10,
        description: 'Combines accent awareness with number dictation — two core listening challenges addressed together, with British and Australian audio samples.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.6',
    title: 'Spelling & Grammar Traps (Plurals, Numbers, Dates, Currencies, Capital Letters)',
    videos: [
      {
        id: 'm1_6_1',
        youtubeId: 'yG1R3x_S21E',
        title: 'IELTS Listening — Avoiding the plural trap',
        channel: 'IELTS Liz',
        duration: '~6 min',
        xp: 10,
        description: 'Classic IELTS Liz short-format lesson on singular vs plural in sentence/form completion — extremely focused and easy to review repeatedly.',
        thumbnailUrl: 'https://img.youtube.com/vi/yG1R3x_S21E/hqdefault.jpg'
      },
      {
        id: 'm1_6_2',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS Listening for Plurals',
        channel: 'IELTS Charlie',
        duration: '~10 min',
        xp: 10,
        description: 'Dedicated plural awareness lesson with audio drills; explains how word endings ("-s", "-es") are often swallowed in natural speech.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      },
      {
        id: 'm1_6_3',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS LISTENING PRACTICE + TIPS: NUMBERS AND LETTERS FOR PART 1',
        channel: 'IELTS up',
        duration: '~18 min',
        xp: 10,
        description: 'Covers numbers, letters, dates, and currency formats together with practice questions; 2023 upload with clean audio.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      },
      {
        id: 'm1_6_4',
        youtubeId: 'R6X4KqEC4SE',
        title: 'IELTS LISTENING: NUMBERS & LETTERS (24 PRACTICE QUESTIONS)',
        channel: 'IELTS Daily',
        duration: '~22 min',
        xp: 10,
        description: '24 dedicated practice questions for dictating numbers and letters — ideal for drilling before a full mock test; uploaded May 2023.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.7',
    title: 'Section-by-Section Walkthroughs (Section 1–4)',
    videos: [
      {
        id: 'm1_7_1',
        youtubeId: '7UZi4B6r0WU',
        title: 'IELTS LISTENING TIPS FOR PART 1 BY ASAD YAQUB',
        channel: 'Asad Yaqub',
        duration: '~15 min',
        xp: 10,
        description: 'Asad Yaqub\'s Section 1 deep-dive with form completion focus; strong on phone number, name, and address dictation traps common in South Asian test centres.',
        thumbnailUrl: 'https://img.youtube.com/vi/7UZi4B6r0WU/hqdefault.jpg'
      },
      {
        id: 'm1_7_2',
        youtubeId: '5-v-lDgQw80',
        title: 'Never Miss an Answer in IELTS Listening: Section 2 Complete Guide',
        channel: 'IELTS Advantage',
        duration: '~22 min',
        xp: 10,
        description: 'Dedicated Section 2 monologue guide with map and multiple choice; covers common civic/tour guide topics that appear in real tests.',
        thumbnailUrl: 'https://img.youtube.com/vi/5-v-lDgQw80/hqdefault.jpg'
      },
      {
        id: 'm1_7_3',
        youtubeId: '82YKeI784YU',
        title: 'IELTS Listening: Band 9 Tips, Tricks & Strategies!!! — E2 Live Class',
        channel: 'E2 IELTS',
        duration: '~55 min',
        xp: 10,
        description: 'Full live class covering all four sections with teacher commentary; particularly strong on Section 3 (academic discussion) and Section 4 (lecture) strategies.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_7_4',
        youtubeId: 'LWdGTp2F2Ks',
        title: 'IELTS Listening Part 4 Tips: Questions 31 to 40 By Asad Yaqub',
        channel: 'Asad Yaqub',
        duration: '~18 min',
        xp: 10,
        description: 'Focused entirely on Section 4 lecture format — the hardest section; covers speed, note-taking, and managing unfamiliar academic vocabulary.',
        thumbnailUrl: 'https://img.youtube.com/vi/LWdGTp2F2Ks/hqdefault.jpg'
      }
    ]
  },
  {
    id: '1.8',
    title: 'Full Mock Test & Answer Analysis',
    videos: [
      {
        id: 'm1_8_1',
        youtubeId: 'W1kuA2GuXks',
        title: 'IELTS LISTENING PRACTICE TEST 2024 WITH ANSWERS | 27.05.2024',
        channel: 'IELTS Daily',
        duration: '~45 min',
        xp: 10,
        description: 'Realistic full mock test with timestamps for answer reveal; students can pause, attempt, then review — mimics actual exam conditions.',
        thumbnailUrl: 'https://img.youtube.com/vi/W1kuA2GuXks/hqdefault.jpg'
      },
      {
        id: 'm1_8_2',
        youtubeId: 'R6X4KqEC4SE',
        title: 'IELTS LISTENING PRACTICE TEST 2024 WITH ANSWERS | 02.07.2024',
        channel: 'IELTS Daily',
        duration: '~45 min',
        xp: 10,
        description: 'Second full practice test with clear answer keys; useful for tracking score improvement across multiple sessions.',
        thumbnailUrl: 'https://img.youtube.com/vi/R6X4KqEC4SE/hqdefault.jpg'
      },
      {
        id: 'm1_8_3',
        youtubeId: '82YKeI784YU',
        title: 'Full IELTS Listening Test with Answers | 2024',
        channel: 'IELTS Network',
        duration: '~50 min',
        xp: 10,
        description: 'Includes both the listening audio and a post-test answer walkthrough with explanations — not just answers, so students learn from mistakes.',
        thumbnailUrl: 'https://img.youtube.com/vi/82YKeI784YU/hqdefault.jpg'
      },
      {
        id: 'm1_8_4',
        youtubeId: 'q2odDqMhYOg',
        title: 'IELTS Listening: Techniques and Practice Questions',
        channel: 'E2 IELTS',
        duration: '~40 min',
        xp: 10,
        description: 'E2 IELTS pairs technique teaching with immediate practice questions — ideal for students who want strategy review alongside a mock attempt.',
        thumbnailUrl: 'https://img.youtube.com/vi/q2odDqMhYOg/hqdefault.jpg'
      }
    ]
  }
];

interface FreeContentLibraryViewProps {
  userEmail?: string;
}

export default function FreeContentLibraryView({ userEmail }: FreeContentLibraryViewProps) {
  const [activeModule, setActiveModule] = useState<0 | 1>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(MODULE_00_DATA[0].videos[0]);
  const [activeSubTopicId, setActiveSubTopicId] = useState<string>('0.1');

  const currentModuleData = activeModule === 0 ? MODULE_00_DATA : MODULE_01_DATA;
  const moduleTitle = activeModule === 0 ? 'IELTS পরিচিতি' : 'Listening Module';
  const moduleEmoji = activeModule === 0 ? '🌸' : '🎧';

  const handleSubTopicClick = (subTopicId: string) => {
    setActiveSubTopicId(subTopicId);
    const element = document.getElementById(`subtopic-${subTopicId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleModuleSwitch = (module: 0 | 1) => {
    setActiveModule(module);
    const data = module === 0 ? MODULE_00_DATA : MODULE_01_DATA;
    setSelectedVideo(data[0].videos[0]);
    setActiveSubTopicId(data[0].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span>Dashboard</span>
          <ChevronRightIcon className="w-3 h-3 text-neutral-500" />
          <span className="font-semibold text-neutral-200">Free Content Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>{moduleEmoji}</span> {moduleTitle}
        </h1>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: HERO PLAYER & SUBTOPICS */}
        <div className="flex-1 min-w-0 space-y-8">
          
          {/* Featured Video Player */}
          <div className="bg-neutral-800/90 rounded-3xl border border-neutral-700/80 p-4 sm:p-6 shadow-xl overflow-hidden">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Details Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-white leading-snug flex-1">
                  {selectedVideo.title}
                </h2>
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-500/20">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                  +{selectedVideo.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="font-medium text-neutral-300">{selectedVideo.channel}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedVideo.duration}
                </span>
              </div>
            </div>

            {/* Hero Callout Banner */}
            <div className="mt-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-neutral-300">
              <div className="p-2 bg-rose-600 text-white rounded-xl flex-shrink-0">
                <VideoIcon className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                প্রতিটি subtopic-এর জন্য curated video — নিচের যেকোনো video-তে click করলে এই page-এই play হবে — YouTube-এ যেতে হবে না।
              </p>
            </div>
          </div>

          {/* Subtopic Sections */}
          <div className="space-y-10">
            {currentModuleData.map((subTopic) => (
              <div key={subTopic.id} id={`subtopic-${subTopic.id}`} className="space-y-4 scroll-mt-6">
                
                {/* Yellow Accent Subtopic Header */}
                <div className="border-l-4 border-amber-400 pl-3 py-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    <span className="text-amber-400 mr-2">{subTopic.id}</span>
                    {subTopic.title}
                  </h3>
                </div>

                {/* Subtopic Video List */}
                <div className="grid grid-cols-1 gap-3.5">
                  {subTopic.videos.map((video) => {
                    const isSelected = selectedVideo.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => {
                          setSelectedVideo(video);
                          setActiveSubTopicId(subTopic.id);
                        }}
                        className={`group flex flex-col sm:flex-row gap-4 bg-neutral-800/60 border rounded-2xl p-3.5 transition cursor-pointer ${
                          isSelected
                            ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg bg-rose-500/5'
                            : 'border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800'
                        }`}
                      >
                        {/* Left Thumbnail */}
                        <div className="w-full sm:w-44 h-28 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                            <div className={`p-2 rounded-full transition transform group-hover:scale-110 ${
                              isSelected ? 'bg-rose-600 text-white' : 'bg-rose-600/90 text-white'
                            }`}>
                              <PlayIcon className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-neutral-200 text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {video.duration}
                          </div>

                          {/* Playing Status Pill */}
                          {isSelected && (
                            <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                              Now playing
                            </div>
                          )}
                        </div>

                        {/* Right Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className={`text-sm font-semibold leading-snug line-clamp-2 transition ${
                              isSelected ? 'text-rose-400' : 'text-neutral-100 group-hover:text-rose-400'
                            }`}>
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-neutral-400">{video.channel}</span>
                              <span className="text-neutral-600">•</span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                ⚡ +{video.xp} XP
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed mt-2 line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR: COURSE MODULES DRAWER */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-6 bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-5 shadow-xl space-y-5">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 tracking-wider uppercase">
                <BookOpenIcon className="w-4 h-4 text-neutral-400" />
                <span>Course Modules</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">11টি module — সব বিনামূল্যে</p>
            </div>

            {/* Active Module 00 */}
            <div
              onClick={() => handleModuleSwitch(0)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 0
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 0 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">00 🌸 IELTS পরিচিতি</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">শুরু থেকে — IELTS কী, কেন এবং কীভাবে</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~৫৫ মিনিট</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 0 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {MODULE_00_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module 01 — Listening Module */}
            <div
              onClick={() => handleModuleSwitch(1)}
              className={`rounded-2xl p-4 space-y-3 transition cursor-pointer ${
                activeModule === 1
                  ? 'border border-rose-500/30 bg-rose-500/10'
                  : 'border border-neutral-700/60 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {activeModule === 1 && (
                    <span className="inline-block text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md mb-1">
                      Active Module
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white">01 🎧 Listening Module</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">৮টি section, ৪০টি প্রশ্ন, ৩০ মিনিট</p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">~১ ঘণ্টা</span>
              </div>

              {/* Subtopic Links */}
              {activeModule === 1 && (
                <div className="space-y-1 pt-2 border-t border-rose-500/20">
                  {MODULE_01_DATA.map((st) => {
                    const isActive = activeSubTopicId === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={(e) => { e.stopPropagation(); handleSubTopicClick(st.id); }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">
                          <strong className="mr-1">{st.id}</strong> {st.title}
                        </span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Locked Module 02 Preview */}
            <div className="border border-neutral-700/60 bg-neutral-900/40 rounded-2xl p-4 opacity-50 cursor-not-allowed space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">MODULE 02</span>
                <LockIcon className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <h3 className="text-sm font-bold text-neutral-400">02 📖 Reading Module</h3>
              <p className="text-xs text-neutral-500">৩টি passage, ৪০টি প্রশ্ন, ৬০ মিনিট</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800">
                <span>১টি video series</span>
                <span>~১.৫ ঘণ্টা</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Module Navigation Bar */}
      <div className="max-w-7xl mx-auto mt-8 flex items-center justify-between">
        <button
          onClick={() => handleModuleSwitch(0)}
          disabled={activeModule === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeModule === 0
              ? 'text-neutral-600 cursor-not-allowed opacity-40'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600'
          }`}
        >
          <ChevronRightIcon className="w-4 h-4 rotate-180" />
          PREVIOUS: IELTS পরিচিতি
        </button>
        <button
          onClick={() => handleModuleSwitch(1)}
          disabled={activeModule === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeModule === 1
              ? 'text-neutral-600 cursor-not-allowed opacity-40'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600'
          }`}
        >
          NEXT: Reading Module
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
