import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    BuildingLibraryIcon, ShieldCheckIcon, BarChartIcon,
    BookOpenIcon, LockClosedIcon, SettingsIcon,
    UsersIcon, DollarIcon, ClockIcon, TrendingUpIcon,
    ChevronDownIcon, CheckCircleIcon, CubeIcon,
    GlobeIcon, DatabaseIcon,
    MicIcon, PlayIcon, PauseIcon, RefreshIcon, StarIcon,
} from './icons';
import AICoPilotTestAuthor from './enterprise/curriculum/AICoPilotTestAuthor';
import InstituteKnowledgeBase from './enterprise/curriculum/InstituteKnowledgeBase';
import AtRiskRadar from './enterprise/org/AtRiskRadar';
import MisconceptionLog from './enterprise/org/MisconceptionLog';
import HandwrittenQueue from './enterprise/org/HandwrittenQueue';
import SpeakingAudits from './enterprise/org/SpeakingAudits';
import TeacherOverride from './enterprise/org/TeacherOverride';
import MissionBuilder from './enterprise/org/MissionBuilder';
import MockDeployment from './enterprise/org/MockDeployment';
import BatchRoster from './enterprise/org/BatchRoster';
import BrandingSettings from './enterprise/org/BrandingSettings';
import AIPromptRules from './enterprise/org/AIPromptRules';
import BillingLicenses from './enterprise/org/BillingLicenses';

// ── Types ──

interface StudentTelemetry {
    id: string;
    name: string;
    videos: { watched: number; total: number };
    exams: { done: number; total: number; avg: number; status: string };
    projects: { done: number; total: number; avg: number; status: string };
    questioning: { understanding: number; divergent: number; convergent: number; status: string };
    flashcards: { done: number; total: number; acc: number; status: string };
    quizzes: { done: number; total: number; acc: number; status: string };
    ovrScore: number;
    batch: string;
}

interface NavLeaf { label: string; key: string }

interface NavGroup {
    label: string;
    icon: React.ReactNode;
    key: string;
    subItems?: NavLeaf[];
    isLeaf?: boolean;
    leafKey?: string;
}

// ── RBAC (Role & Access Manager) ──

type RbacTier = 'super_admin' | 'instructor' | 'operator' | 'content_manager';
type SegmentKey = 'overview' | 'telemetry' | 'evaluation' | 'curriculum' | 'knowledge' | 'billing' | 'node';

interface SegPerm { read: boolean; write: boolean; ownerApproval: boolean }
interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: RbacTier;
    permissions: Record<SegmentKey, SegPerm>;
}
interface OwnerApprovalItem { id: number; label: string; ts: string }

interface EvaluationItem {
    id: string;
    candidateName: string;
    batch: string;
    module: string;
    type: 'essay' | 'speaking';
    submission: string;
    aiScores: { label: string; value: number }[];
    aiFlags: string[];
    status: 'pending' | 'approved' | 'requeued';
}

interface Toast { id: number; msg: string; }

// ── Data ──

const navGroups: NavGroup[] = [
    { label: 'Workspace Overview', icon: <BuildingLibraryIcon className="w-4 h-4" />, key: 'overview', isLeaf: true, leafKey: 'overview_main' },
    {
        label: 'Cohort Telemetry', icon: <BarChartIcon className="w-4 h-4" />, key: 'telemetry',
        subItems: [
            { label: 'At-Risk Radar & Alerts', key: 'at_risk_radar' },
            { label: 'Daily Engagements', key: 'daily_engagements' },
            { label: 'Skill Performance & Gaps', key: 'performance_analytics' },
            { label: 'Misconception Log (AI)', key: 'misconception_log' },
        ],
    },
    {
        label: 'Evaluation Studio', icon: <MicIcon className="w-4 h-4" />, key: 'evaluation',
        subItems: [
            { label: 'Handwritten Essay Queue', key: 'handwritten_queue' },
            { label: 'Speaking Audio Audits', key: 'speaking_audits' },
            { label: 'Teacher Review & Override', key: 'teacher_override' },
        ],
    },
    {
        label: 'Curriculum Assets', icon: <BookOpenIcon className="w-4 h-4" />, key: 'curriculum',
        subItems: [
            { label: 'Study Plan & Mission Builder', key: 'mission_builder' },
            { label: 'Cambridge Mock Deployment', key: 'mock_deployment' },
            { label: 'Institute Knowledge Base', key: 'vector_repos' },
            { label: '⚡ AI Co-Pilot Test Author', key: 'ai-test-author' },
        ],
    },
    {
        label: 'Identity & Seats', icon: <LockClosedIcon className="w-4 h-4" />, key: 'identity',
        subItems: [
            { label: 'Batch & Candidate Roster', key: 'batch_roster' },
            { label: 'License & AI Coin Allocation', key: 'license_seats' },
            { label: 'Role & Access Manager', key: 'role_access_manager' },
            { label: 'LMS & Portal Bridges', key: 'sso_gateways' },
        ],
    },
    {
        label: 'Node Settings', icon: <SettingsIcon className="w-4 h-4" />, key: 'settings',
        subItems: [
            { label: 'White-Label Branding', key: 'branding_settings' },
            { label: 'Custom AI Prompts & Rules', key: 'ai_prompt_rules' },
            { label: 'Billing & Licenses', key: 'billing_licenses' },
        ],
    },
];

const allowedNavKeysFor = (role: 'super_admin' | 'instructor' | 'operator'): Set<string> => {
    if (role === 'super_admin') return new Set(['overview', 'telemetry', 'evaluation', 'curriculum', 'identity', 'settings']);
    return new Set(['overview', 'telemetry', 'evaluation', 'curriculum']);
};

const students: StudentTelemetry[] = [
    { id: 'S-TB29', name: 'Ayon', batch: 'EXEC-BATCH-B', videos: { watched: 572, total: 601 }, exams: { done: 7, total: 10, avg: 6.5, status: 'Good' }, projects: { done: 2, total: 7, avg: 6.0, status: 'Fair' }, questioning: { understanding: 7, divergent: 4, convergent: 6, status: 'Fair' }, flashcards: { done: 1, total: 10, acc: 84, status: 'Fair' }, quizzes: { done: 8, total: 10, acc: 73, status: 'Good' }, ovrScore: 5.5 },
    { id: 'S-TB20', name: 'Farhan', batch: 'EXEC-BATCH-A', videos: { watched: 601, total: 601 }, exams: { done: 9, total: 10, avg: 8.2, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.5, status: 'Excellent' }, questioning: { understanding: 9, divergent: 8, convergent: 8, status: 'Excellent' }, flashcards: { done: 9, total: 10, acc: 96, status: 'Excellent' }, quizzes: { done: 10, total: 10, acc: 91, status: 'Excellent' }, ovrScore: 8.8 },
    { id: 'S-TB21', name: 'Tanvir', batch: 'EXEC-BATCH-B', videos: { watched: 489, total: 601 }, exams: { done: 6, total: 10, avg: 5.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 7.2, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 72, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 68, status: 'Fair' }, ovrScore: 6.2 },
    { id: 'S-TB22', name: 'Nafisa', batch: 'EXEC-BATCH-B', videos: { watched: 534, total: 601 }, exams: { done: 10, total: 10, avg: 9.1, status: 'Excellent' }, projects: { done: 7, total: 7, avg: 9.3, status: 'Excellent' }, questioning: { understanding: 8, divergent: 7, convergent: 9, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 93, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 88, status: 'Excellent' }, ovrScore: 9.0 },
    { id: 'S-TB23', name: 'Rahim', batch: 'EXEC-BATCH-A', videos: { watched: 412, total: 601 }, exams: { done: 5, total: 10, avg: 4.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 61, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 55, status: 'Low' }, ovrScore: 4.1 },
    { id: 'S-TB24', name: 'Jarin', batch: 'EXEC-BATCH-A', videos: { watched: 378, total: 601 }, exams: { done: 8, total: 10, avg: 7.5, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.8, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 6, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 79, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 76, status: 'Good' }, ovrScore: 6.9 },
    { id: 'S-TB25', name: 'Shakib', batch: 'EXEC-BATCH-A', videos: { watched: 301, total: 601 }, exams: { done: 4, total: 10, avg: 3.5, status: 'Low' }, projects: { done: 1, total: 7, avg: 4.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 2, total: 10, acc: 45, status: 'Low' }, quizzes: { done: 3, total: 10, acc: 42, status: 'Low' }, ovrScore: 2.8 },
    { id: 'S-TB26', name: 'Mim', batch: 'EXEC-BATCH-B', videos: { watched: 546, total: 601 }, exams: { done: 8, total: 10, avg: 7.8, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.5, status: 'Good' }, questioning: { understanding: 8, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 7, total: 10, acc: 86, status: 'Good' }, quizzes: { done: 8, total: 10, acc: 81, status: 'Good' }, ovrScore: 7.2 },
    { id: 'S-TB27', name: 'Hasan', batch: 'EXEC-BATCH-B', videos: { watched: 445, total: 601 }, exams: { done: 6, total: 10, avg: 5.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.8, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 68, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 62, status: 'Fair' }, ovrScore: 4.8 },
    { id: 'S-TB28', name: 'Nusrat', batch: 'EXEC-BATCH-B', videos: { watched: 510, total: 601 }, exams: { done: 7, total: 10, avg: 6.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.5, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 6, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 75, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 71, status: 'Good' }, ovrScore: 6.0 },
    { id: 'S-TB30', name: 'Tariq', batch: 'EXEC-BATCH-B', videos: { watched: 388, total: 601 }, exams: { done: 5, total: 10, avg: 4.8, status: 'Fair' }, projects: { done: 2, total: 7, avg: 5.0, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 58, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 59, status: 'Fair' }, ovrScore: 4.0 },
    { id: 'S-TB31', name: 'Sadia', batch: 'EXEC-BATCH-C', videos: { watched: 562, total: 601 }, exams: { done: 9, total: 10, avg: 8.5, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.2, status: 'Excellent' }, questioning: { understanding: 9, divergent: 7, convergent: 8, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 91, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 87, status: 'Excellent' }, ovrScore: 8.5 },
    { id: 'S-TB32', name: 'Zubair', batch: 'EXEC-BATCH-C', videos: { watched: 267, total: 601 }, exams: { done: 3, total: 10, avg: 3.0, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.5, status: 'Low' }, questioning: { understanding: 2, divergent: 2, convergent: 2, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 38, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 35, status: 'Low' }, ovrScore: 2.2 },
    { id: 'S-TB33', name: 'Fahim', batch: 'EXEC-BATCH-C', videos: { watched: 475, total: 601 }, exams: { done: 7, total: 10, avg: 6.2, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.8, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 4, total: 10, acc: 71, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 67, status: 'Fair' }, ovrScore: 5.8 },
    { id: 'S-TB34', name: 'Labiba', batch: 'EXEC-BATCH-C', videos: { watched: 523, total: 601 }, exams: { done: 8, total: 10, avg: 7.2, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.0, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 82, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 78, status: 'Good' }, ovrScore: 6.8 },
    { id: 'S-TB35', name: 'Imran', batch: 'EXEC-BATCH-C', videos: { watched: 341, total: 601 }, exams: { done: 4, total: 10, avg: 4.0, status: 'Fair' }, projects: { done: 2, total: 7, avg: 4.5, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 3, status: 'Fair' }, flashcards: { done: 2, total: 10, acc: 52, status: 'Fair' }, quizzes: { done: 3, total: 10, acc: 48, status: 'Low' }, ovrScore: 3.5 },
    { id: 'S-TB36', name: 'Maliha', batch: 'EXEC-BATCH-C', videos: { watched: 497, total: 601 }, exams: { done: 6, total: 10, avg: 5.5, status: 'Good' }, projects: { done: 3, total: 7, avg: 5.2, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 65, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 63, status: 'Fair' }, ovrScore: 5.0 },
    { id: 'S-TB37', name: 'Rakib', batch: 'EXEC-BATCH-C', videos: { watched: 248, total: 601 }, exams: { done: 2, total: 10, avg: 2.5, status: 'Low' }, projects: { done: 0, total: 7, avg: 0, status: 'Low' }, questioning: { understanding: 2, divergent: 1, convergent: 2, status: 'Low' }, flashcards: { done: 0, total: 10, acc: 0, status: 'Low' }, quizzes: { done: 1, total: 10, acc: 28, status: 'Low' }, ovrScore: 1.5 },
    { id: 'S-TB38', name: 'Sumaiya', batch: 'EXEC-BATCH-C', videos: { watched: 436, total: 601 }, exams: { done: 5, total: 10, avg: 5.0, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 62, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 58, status: 'Fair' }, ovrScore: 4.5 },
    { id: 'S-TB39', name: 'Arif', batch: 'EXEC-BATCH-C', videos: { watched: 320, total: 601 }, exams: { done: 4, total: 10, avg: 3.8, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 42, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 38, status: 'Low' }, ovrScore: 2.5 },
];

const engagementTabs = ['Videos', 'Flashcards', 'Quizzes', 'Exams', 'Speaking Drills'];

const licenseAudit = [
    'Farmgate Branch requested 150 additional student seats — Approved by Admin Ayon.',
    'Uttara Branch instructor pool expanded by 4 — Auto-provisioned via quota override.',
    'Monthly renewal cycle auto-invoiced — 1,420 seats synced within 12 minutes.',
    'Cambridge 18 Mock Batch license renewal — $4,200 invoiced for Q3 2026 cycle.',
];

const btnBase = 'w-full flex items-center justify-between text-xs px-3 py-1.5 rounded-md transition-all text-neutral-400 hover:text-white hover:bg-neutral-900';

// ── New subview data ──

const overviewMetrics = [
    { label: 'Total Enrolled Candidates', value: '1,420', subtext: 'Active Seats' },
    { label: 'Active Batch Band Average', value: 'Band 6.5', subtext: 'Target 7.5 // Growth +0.5' },
    { label: 'Pending Essay & Speaking Evaluations', value: '18', subtext: 'Teacher Sign-off Required' },
];

const infrastructureTasks = [
    'Writing Task 2 drops ingested — 64 essays auto-graded',
    'Speaking recordings queued — 38 candidate audio files pending',
    'Cambridge 18 Mock #3 pushed — 1,420 candidates notified',
    'AI Writing Grader processed — 84 essays flagged for review',
    'Batch Sync complete — 420 student logs reconciled',
];

const riskProfiles = [
    { rank: 1, name: 'Tanvir', id: 'EXEC-BATCH-B', hours: '489 min', deficiency: 'Writing Task 2 (GRA 5.0)', status: '[Assign Grammar Drill]' },
    { rank: 2, name: 'Rahim', id: 'EXEC-BATCH-A', hours: '412 min', deficiency: 'Listening Part 4 Spelling', status: '[Send Voice Feedback]' },
    { rank: 3, name: 'Imran', id: 'EXEC-BATCH-C', hours: '341 min', deficiency: 'Speaking Hesitation (8/min)', status: '[Schedule 1-on-1]' },
];

const skillDomains = [
    { label: 'Writing Task 2 Coherence & Cohesion', pct: 58 },
    { label: 'Reading True / False / Not Given', pct: 71 },
    { label: 'Listening Part 3 Multiple Choice', pct: 84 },
];

const courseModules = [
    { name: 'Cambridge 18 Academic Writing 1', sync: 92, seats: '1,420', route: '/ielts/writing/c18-w1', live: false },
    { name: 'Speaking Cue Card Master Drill #4', sync: 100, seats: '1,110', route: '/ielts/speaking/cue-4', live: true },
];

const identityProviders = [
    { name: 'Google Classroom LMS Bridge', accounts: '1,420', status: 'Active Synchronized Tunnel', token: '24h' },
    { name: 'Microsoft Entra ID SSO Gateway', accounts: '12', status: 'Active Synchronized Tunnel', provisioning: 'Active' },
];

const accessSegments: { key: SegmentKey; label: string }[] = [
    { key: 'overview', label: 'Workspace Overview' },
    { key: 'telemetry', label: 'Cohort Telemetry' },
    { key: 'evaluation', label: 'Evaluation Queue' },
    { key: 'curriculum', label: 'Curriculum Assets' },
    { key: 'knowledge', label: 'Knowledge Base' },
    { key: 'billing', label: 'Seat & License Billing' },
    { key: 'node', label: 'Node Settings (AI Constants)' },
];

const roleMeta: Record<RbacTier, { label: string; desc: string; badge: string }> = {
    super_admin: { label: 'Super Admin', desc: 'Owner/Branch Head: Full node access, billing, model strictness, role delegation.', badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
    instructor: { label: 'Instructor', desc: 'Senior Evaluator: Telemetry, evaluation queue, voice feedback, score release.', badge: 'text-sky-300 bg-sky-500/10 border-sky-500/30' },
    operator: { label: 'Operator', desc: 'Branch Admin/Front-Desk: Enrollment, batch assignment, mock deployments (No billing/AI tweaks).', badge: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
    content_manager: { label: 'Content Manager', desc: 'Curriculum Developer: Knowledge base ingestion & course asset deployment only.', badge: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30' },
};

const defaultPermissionsFor = (role: RbacTier): Record<SegmentKey, SegPerm> => {
    const base: Record<SegmentKey, SegPerm> = {
        overview: { read: false, write: false, ownerApproval: false },
        telemetry: { read: false, write: false, ownerApproval: false },
        evaluation: { read: false, write: false, ownerApproval: false },
        curriculum: { read: false, write: false, ownerApproval: false },
        knowledge: { read: false, write: false, ownerApproval: false },
        billing: { read: false, write: false, ownerApproval: false },
        node: { read: false, write: false, ownerApproval: false },
    };
    switch (role) {
        case 'super_admin':
            (Object.keys(base) as SegmentKey[]).forEach(k => { base[k] = { read: true, write: true, ownerApproval: false }; });
            break;
        case 'instructor':
            base.overview = { read: true, write: false, ownerApproval: false };
            base.telemetry = { read: true, write: true, ownerApproval: false };
            base.evaluation = { read: true, write: true, ownerApproval: false };
            base.curriculum = { read: true, write: false, ownerApproval: false };
            base.knowledge = { read: true, write: false, ownerApproval: false };
            break;
        case 'operator':
            base.overview = { read: true, write: false, ownerApproval: false };
            base.telemetry = { read: true, write: false, ownerApproval: false };
            base.evaluation = { read: true, write: false, ownerApproval: false };
            base.curriculum = { read: true, write: true, ownerApproval: false };
            base.knowledge = { read: true, write: false, ownerApproval: false };
            break;
        case 'content_manager':
            base.overview = { read: true, write: false, ownerApproval: false };
            base.curriculum = { read: true, write: true, ownerApproval: false };
            base.knowledge = { read: true, write: true, ownerApproval: false };
            break;
    }
    return base;
};

const buildMember = (id: string, name: string, email: string, role: RbacTier): TeamMember => ({
    id, name, email, role, permissions: defaultPermissionsFor(role),
});

const seedTeamMembers: TeamMember[] = [
    buildMember('TM-01', 'Ayon', 'ayon.superadmin@gmail.com', 'super_admin'),
    buildMember('TM-02', 'Farhan', 'farhan.instructor@gmail.com', 'instructor'),
    buildMember('TM-03', 'Rahim', 'rahim.operator@gmail.com', 'operator'),
    buildMember('TM-04', 'Sadia', 'sadia.content@gmail.com', 'content_manager'),
    buildMember('TM-05', 'Jarin', 'jarin.operator@gmail.com', 'operator'),
];

const buildEval = (name: string, batch: string, module: string, type: 'essay' | 'speaking', idx: number): EvaluationItem => {
    const scores = type === 'essay'
        ? [{ label: 'TR', value: 5.5 }, { label: 'CC', value: 5.0 }, { label: 'LR', value: 5.5 }, { label: 'GRA', value: 5.0 }]
        : [{ label: 'FC', value: 5.0 }, { label: 'LR', value: 5.5 }, { label: 'P', value: 4.5 }, { label: 'G', value: 5.0 }];
    const aiFlags = type === 'essay'
        ? ['+ Adequate Task Response', '- Inadequate Paragraphing', '- Recurrent Grammar Errors']
        : ['+ Clear Pronunciation', '- Frequent Filler Words', '- Long Pauses >2.5s'];
    const submission = type === 'essay'
        ? `${name} submitted a ${module} response addressing the prompt with moderate development and noticeable grammatical inaccuracies across paragraphs.`
        : `${name} delivered a ${module} monologue with uneven fluency, several hesitations, and limited lexical range throughout.`;
    return { id: `EV-${idx.toString().padStart(2, '0')}`, candidateName: name, batch, module, type, submission, aiScores: scores, aiFlags, status: 'pending' };
};

const seedEvaluations: EvaluationItem[] = [
    ['Tanvir', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Rahim', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Imran', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Shakib', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Zubair', 'EXEC-BATCH-C', 'Speaking Part 3', 'speaking'],
    ['Rakib', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
    ['Arif', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Hasan', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Tariq', 'EXEC-BATCH-B', 'Speaking Part 3', 'speaking'],
    ['Sumaiya', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
    ['Maliha', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Ayon', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Nusrat', 'EXEC-BATCH-B', 'Speaking Part 3', 'speaking'],
    ['Farhan', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Nafisa', 'EXEC-BATCH-B', 'Speaking Part 2', 'speaking'],
    ['Jarin', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Sadia', 'EXEC-BATCH-C', 'Speaking Part 3', 'speaking'],
    ['Labiba', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
].map((spec, i) => buildEval(spec[0], spec[1], spec[2], spec[3] as 'essay' | 'speaking', i + 1));

// ── Helpers ──

const getTabMetric = (s: StudentTelemetry, tab: string): number => {
    switch (tab) {
        case 'Videos': return s.videos.watched;
        case 'Flashcards': return s.flashcards.acc;
        case 'Quizzes': return s.quizzes.acc;
        case 'Exams': return s.exams.avg;
        case 'Speaking Drills': return s.questioning.understanding + s.questioning.divergent + s.questioning.convergent;
        default: return 0;
    }
};

const getTabLabel = (s: StudentTelemetry, tab: string): string => {
    switch (tab) {
        case 'Videos': return `${s.videos.watched} / ${s.videos.total} min`;
        case 'Flashcards': return `${s.flashcards.acc}%`;
        case 'Quizzes': return `${s.quizzes.acc}%`;
        case 'Exams': return `${s.exams.avg} / 10`;
        case 'Speaking Drills': return `${s.questioning.understanding + s.questioning.divergent + s.questioning.convergent}`;
        default: return '';
    }
};

const trajectoryColor = (s: StudentTelemetry): string => {
    if (s.ovrScore >= 7) return 'text-emerald-400';
    if (s.ovrScore >= 5) return 'text-neutral-300';
    if (s.ovrScore >= 3) return 'text-amber-400';
    return 'text-red-400';
};

const trajectoryLabel = (s: StudentTelemetry): string => {
    if (s.ovrScore >= 7) return 'Excellent';
    if (s.ovrScore >= 5) return 'Good';
    if (s.ovrScore >= 3) return 'Fair';
    return 'Low';
};

// ── Module-scope UI components (props-driven) ──

let toastSeq = 0;

const ToastStack: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-80">
        {toasts.map(t => (
            <div key={t.id} className="bg-[#0a0a0a] border border-emerald-500/40 rounded-lg px-4 py-3 text-xs shadow-2xl flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                <span className="text-neutral-200">{t.msg}</span>
            </div>
        ))}
    </div>
);

const VoiceNoteSim: React.FC = () => {
    const [rec, setRec] = useState(false);
    const [done, setDone] = useState(false);
    const toggle = () => {
        if (rec) { setRec(false); setDone(true); }
        else { setRec(true); setDone(false); }
    };
    return (
        <div className="mb-4 bg-[#050505] border border-neutral-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Teacher Voice Note</p>
                <button onClick={toggle} className={`text-[10px] font-medium px-2 py-0.5 rounded border ${rec ? 'text-red-400 border-red-500/40 bg-red-500/10 animate-pulse' : 'text-neutral-400 border-neutral-800 hover:text-white'}`}>
                    {rec ? '● Recording' : done ? '↻ Re-record' : '● Record 15s'}
                </button>
            </div>
            <div className="h-8 flex items-center gap-[2px]">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={`w-1 rounded-sm ${done || rec ? 'bg-emerald-500/70' : 'bg-neutral-800'}`} style={{ height: done ? `${20 + Math.abs(Math.sin(i)) * 60}%` : '20%' }} />
                ))}
            </div>
        </div>
    );
};

const WaveformStudio: React.FC<{
    scores: { label: string; value: number }[];
    onScoreChange: (label: string, value: number) => void;
}> = ({ scores, onScoreChange }) => {
    const [speed, setSpeed] = useState(1.0);
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const bars = useMemo(() => {
        let seed = 7;
        const arr: number[] = [];
        for (let i = 0; i < 72; i++) {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            arr.push(0.15 + (seed / 2147483648) * 0.85);
        }
        return arr;
    }, []);
    const flagKind = (i: number): 'pause' | 'filler' | 'mispron' | null => {
        if (bars[i] < 0.24) return 'pause';
        if (i % 19 === 0) return 'filler';
        if (i % 29 === 0) return 'mispron';
        return null;
    };
    const flagColor = (k: string) => k === 'pause' ? 'bg-amber-400' : k === 'filler' ? 'bg-cyan-400' : 'bg-red-400';
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Speaking Waveform Review Studio</p>
                <div className="flex items-center gap-1">
                    {speeds.map(s => (
                        <button key={s} onClick={() => setSpeed(s)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${speed === s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-neutral-500 hover:text-white border border-neutral-800'}`}>
                            {s}×
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-end gap-[2px] h-24 bg-[#050505] border border-neutral-800 rounded-lg p-3 overflow-hidden">
                {bars.map((b, i) => {
                    const k = flagKind(i);
                    return (
                        <div key={i} title={k ?? ''} className={`flex-1 rounded-sm ${k ? flagColor(k) : 'bg-neutral-600'}`} style={{ height: `${b * 100}%` }} />
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 bg-amber-400 rounded-sm" />Pause &gt;2.5s</span>
                <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 bg-cyan-400 rounded-sm" />Filler Word</span>
                <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 bg-red-400 rounded-sm" />Mispronunciation</span>
            </div>
            <div className="space-y-3">
                {scores.map(sc => (
                    <div key={sc.label}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">{sc.label}</span>
                            <span className="text-white font-mono">{sc.value.toFixed(1)}</span>
                        </div>
                        <input type="range" min={0} max={9} step={0.5} value={sc.value}
                            onChange={e => onScoreChange(sc.label, parseFloat(e.target.value))}
                            className="w-full accent-emerald-500" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const EvaluationQueue: React.FC<{
    items: EvaluationItem[];
    setItems: React.Dispatch<React.SetStateAction<EvaluationItem[]>>;
    setAuditLogs: React.Dispatch<React.SetStateAction<string[]>>;
    pushToast: (m: string) => void;
}> = ({ items, setItems, setAuditLogs, pushToast }) => {
    const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? '');
    const selected = items.find(i => i.id === selectedId) ?? items[0];
    const pending = items.filter(i => i.status === 'pending');
    const [scoreDraft, setScoreDraft] = useState<{ label: string; value: number }[]>(selected?.aiScores ?? []);

    useEffect(() => {
        setScoreDraft(selected?.aiScores ?? []);
    }, [selectedId]);

    if (!selected) return <p className="text-sm text-neutral-500">No evaluations in queue.</p>;

    const onScoreChange = (label: string, value: number) => {
        setScoreDraft(prev => prev.map(s => s.label === label ? { ...s, value } : s));
    };
    const handleApprove = () => {
        setItems(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'approved', aiScores: scoreDraft } : i));
        setAuditLogs(prev => [`Teacher approved & released score for ${selected.candidateName} (${selected.batch}) — ${new Date().toLocaleTimeString()}`, ...prev]);
        pushToast(`Score released for ${selected.candidateName}`);
        const next = pending.find(p => p.id !== selected.id);
        setSelectedId(next ? next.id : selected.id);
    };
    const handleReject = () => {
        setItems(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'requeued' } : i));
        setAuditLogs(prev => [`Submission re-queued for ${selected.candidateName} (${selected.batch}) — ${new Date().toLocaleTimeString()}`, ...prev]);
        pushToast(`Submission re-queued for ${selected.candidateName}`);
        const next = pending.find(p => p.id !== selected.id);
        setSelectedId(next ? next.id : selected.id);
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-3 max-h-[70vh] overflow-y-auto">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">Pending Submissions ({pending.length})</p>
                <div className="space-y-1">
                    {pending.map(p => (
                        <button key={p.id} onClick={() => setSelectedId(p.id)}
                            className={`w-full text-left text-xs px-3 py-2 rounded-md transition-all ${selectedId === p.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900'}`}>
                            <span className="block font-medium">{p.candidateName}</span>
                            <span className="block text-[10px] text-neutral-500 font-mono">{p.batch} · {p.type === 'speaking' ? 'Speaking' : 'Essay'}</span>
                        </button>
                    ))}
                    {pending.length === 0 && <p className="text-[11px] text-neutral-600 px-1">Queue cleared.</p>}
                </div>
            </div>
            <div className="col-span-5 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">{selected.candidateName} <span className="text-neutral-500 font-mono text-xs">// {selected.batch}</span></p>
                    <span className="text-[10px] font-mono text-neutral-500">{selected.module}</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Candidate Submission</p>
                <div className="text-xs text-neutral-300 leading-relaxed bg-[#050505] border border-neutral-800 rounded-lg p-4 whitespace-pre-wrap">
                    {selected.submission}
                </div>
                {selected.type === 'speaking' && (
                    <div className="mt-4">
                        <WaveformStudio scores={scoreDraft} onScoreChange={onScoreChange} />
                    </div>
                )}
            </div>
            <div className="col-span-4 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 overflow-y-auto max-h-[70vh]">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3">AI Pre-Assessment</p>
                <div className="space-y-3 mb-4">
                    {scoreDraft.map(sc => (
                        <div key={sc.label}>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-neutral-400">{sc.label}</span>
                                <span className="text-white font-mono">{sc.value.toFixed(1)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${(sc.value / 9) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">AI Flags</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {selected.aiFlags.map((f, i) => (
                        <span key={i} className={`text-[10px] font-medium px-2 py-0.5 rounded border ${f.startsWith('+') ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-red-400 border-red-500/30 bg-red-500/5'}`}>{f}</span>
                    ))}
                </div>
                <VoiceNoteSim />
                <div className="mt-5 space-y-2">
                    <button onClick={handleReject} className="w-full text-xs font-medium py-2.5 rounded-md border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">[Reject & Re-queue]</button>
                    <button onClick={handleApprove} className="w-full text-xs font-medium py-2.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all">[Approve & Release Score]</button>
                </div>
            </div>
        </div>
    );
};

// ── Teacher Review Studio (sub-tab under Cohort Telemetry) ──

interface ReviewSubmission {
    id: string;
    candidateName: string;
    candidateId: string;
    submittedAt: string;
    targetBand: number;
    type: 'essay' | 'speaking';
    severity: 'Urgent' | 'Standard' | 'Owner Sign-off Needed';
    essayText?: string[];
    wordCount?: number;
    cueCard?: string;
    audioFlags?: { time: string; label: string }[];
    released?: boolean;
}

const RUBRIC_KEYS = [
    'Task Achievement / Response',
    'Coherence & Cohesion',
    'Lexical Resource',
    'Grammatical Range & Accuracy',
];

const seedReviewSubmissions: ReviewSubmission[] = [
    {
        id: 'rs-1',
        candidateName: 'Tanvir Hossain',
        candidateId: '#IELTS-8841',
        submittedAt: '2d ago · 14:22',
        targetBand: 7.5,
        type: 'essay',
        severity: 'Urgent',
        wordCount: 342,
        essayText: [
            'The integration of artificial intelligence into education has sparked both optimism and concern among policymakers, who now confront a pedagogical landscape that is shifting faster than any curriculum can codify.',
            'Proponents argue that adaptive learning platforms can personalise instruction at a scale previously impossible, surfacing each learner’s weak nodes long before a formal examination would expose them.',
            'However, critics warn that over-reliance on algorithmic assessment may erode the nuanced judgement of experienced educators, reducing formative feedback to a ledger of probabilities.',
            'In my view, a hybrid model — where AI handles drill-and-practice while teachers lead evaluative feedback — offers the most balanced trajectory for the sector.',
        ],
    },
    {
        id: 'rs-2',
        candidateName: 'Nafisa Rahman',
        candidateId: '#IELTS-9023',
        submittedAt: '1d ago · 09:41',
        targetBand: 7.0,
        type: 'speaking',
        severity: 'Standard',
        cueCard: 'Part 3: "How will artificial intelligence change the way young people learn in the future?"',
        audioFlags: [
            { time: '00:42', label: 'Hesitation Spike' },
            { time: '01:15', label: 'Grammar Repair' },
            { time: '02:03', label: 'Strong Lexical Range' },
        ],
    },
    {
        id: 'rs-3',
        candidateName: 'Rahim Khan',
        candidateId: '#IELTS-7712',
        submittedAt: '3d ago · 18:05',
        targetBand: 6.5,
        type: 'essay',
        severity: 'Standard',
        wordCount: 287,
        essayText: [
            'Remote work has fundamentally altered productivity patterns across multiple industries, forcing managers to reconsider what supervision even means in a distributed organisation.',
            'While some fear diminished oversight, data suggests autonomous workers often exceed prior output once the friction of commute and open-plan interruption is removed.',
            'Nevertheless, the absence of spontaneous collaboration can blunt innovation over longer horizons, a cost that quarterly metrics rarely capture.',
        ],
    },
    {
        id: 'rs-4',
        candidateName: 'Sadia Islam',
        candidateId: '#IELTS-6630',
        submittedAt: '4h ago · 11:10',
        targetBand: 8.0,
        type: 'speaking',
        severity: 'Owner Sign-off Needed',
        cueCard: 'Part 2: "Describe a technology that changed your life."',
        audioFlags: [
            { time: '00:21', label: 'Vocabulary Repetition' },
            { time: '01:48', label: 'Fluency Break' },
        ],
    },
    {
        id: 'rs-5',
        candidateName: 'Jarin Ahmed',
        candidateId: '#IELTS-7190',
        submittedAt: '5h ago · 16:33',
        targetBand: 7.0,
        type: 'essay',
        severity: 'Urgent',
        wordCount: 305,
        essayText: [
            'Climate change education is no longer a peripheral elective but a core literacy of the twenty-first century, demanded by employers and citizens alike.',
            'Schools that embed sustainability across the curriculum cultivate a generation equipped to navigate ecological uncertainty with evidence rather than anxiety.',
            'Yet pedagogy alone is insufficient without structural investment in teacher training and community partnerships that extend learning beyond the classroom wall.',
        ],
    },
];

const VoiceFeedbackRecorder: React.FC = () => {
    const [recording, setRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const clear = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
    useEffect(() => () => clear(), []);
    const startRec = () => {
        setRecorded(false); setPlaying(false); setProgress(0); setRecording(true); clear();
        timer.current = setInterval(() => {
            setProgress(p => { if (p >= 100) { setRecording(false); clear(); return 100; } return p + (100 / 30); });
        }, 1000);
    };
    const startPlay = () => {
        if (!recorded) return;
        setPlaying(true); clear();
        timer.current = setInterval(() => {
            setProgress(p => { if (p >= 100) { setPlaying(false); clear(); return 100; } return p + (100 / 30); });
        }, 1000);
    };
    const reRecord = () => { clear(); setRecording(false); setRecorded(false); setPlaying(false); setProgress(0); };
    return (
        <div className="bg-[#050505] border border-neutral-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Voice Feedback Recorder</p>
                {recorded && !recording && (
                    <div className="flex items-center gap-1">
                        <button onClick={startPlay} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"><PlayIcon className="w-3 h-3" />Playback</button>
                        <button onClick={reRecord} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"><RefreshIcon className="w-3 h-3" />Re-record</button>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={recording ? () => { setRecording(false); clear(); setRecorded(true); } : startRec}
                    className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md border transition-all ${recording ? 'text-red-400 border-red-500/40 bg-red-500/10 animate-pulse' : 'text-neutral-300 border-neutral-800 hover:text-white hover:bg-neutral-900'}`}>
                    <MicIcon className="w-3.5 h-3.5" />{recording ? '● Recording 30s' : recorded ? '↻ Record Voice Correction' : '🎤 Record Voice Correction'}
                </button>
                <div className="flex-1 h-8 flex items-center gap-[2px]">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className={`w-1 rounded-sm ${recorded || recording ? 'bg-emerald-500/70' : 'bg-neutral-800'}`} style={{ height: recorded ? `${20 + Math.abs(Math.sin(i + progress / 20)) * 60}%` : (recording && (i / 32) * 100 <= progress ? '100%' : '20%') }} />
                    ))}
                </div>
            </div>
            {(recording || playing) && (
                <div className="mt-2 text-[10px] font-mono text-emerald-400">{((progress / 100) * 30).toFixed(0)}s / 30s</div>
            )}
        </div>
    );
};

const SpeakingWaveform: React.FC<{ flags: { time: string; label: string }[] }> = ({ flags }) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const TOTAL = 180;
    const bars = useMemo(() => {
        let seed = 13; const arr: number[] = [];
        for (let i = 0; i < 90; i++) { seed = (seed * 1103515245 + 12345) % 2147483648; arr.push(0.15 + (seed / 2147483648) * 0.85); }
        return arr;
    }, []);
    const clear = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
    useEffect(() => () => clear(), []);
    const toggle = () => {
        if (playing) { setPlaying(false); clear(); return; }
        setPlaying(true); clear();
        timer.current = setInterval(() => {
            setProgress(p => { if (p >= 100) { setPlaying(false); clear(); return 100; } return p + (100 / TOTAL) * 2; });
        }, 50);
    };
    const toSec = (t: string) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
    return (
        <div className="bg-[#050505] border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Speaking Recording // Waveform Studio</p>
                <button onClick={toggle} className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border ${playing ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' : 'text-neutral-300 border-neutral-800 hover:text-white'}`}>{playing ? <><PauseIcon className="w-3 h-3" />Pause</> : <><PlayIcon className="w-3 h-3" />Play</>}</button>
            </div>
            <div className="relative">
                <div className="flex items-end gap-[2px] h-24 overflow-hidden">
                    {bars.map((b, i) => (
                        <div key={i} className={`flex-1 rounded-sm ${ (i / bars.length) * 100 <= progress ? 'bg-emerald-500/70' : 'bg-neutral-700' }`} style={{ height: `${b * 100}%` }} />
                    ))}
                </div>
                {flags.map((f, i) => {
                    const left = (toSec(f.time) / TOTAL) * 100;
                    return (
                        <div key={i} className="absolute -top-1" style={{ left: `${left}%` }}>
                            <div className="w-2 h-2 -translate-x-1/2 rounded-full bg-amber-400 ring-2 ring-amber-400/20" title={`${f.time} - ${f.label}`} />
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-amber-300 bg-[#0a0a0a] border border-amber-500/30 rounded px-1 py-0.5">{f.time} · {f.label}</div>
                        </div>
                    );
                })}
            </div>
            <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full mt-4 accent-emerald-500" />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>{Math.floor((progress / 100) * TOTAL / 60)}:{(Math.floor((progress / 100) * TOTAL) % 60).toString().padStart(2, '0')} / 3:00</span>
                <span>{progress.toFixed(0)}%</span>
            </div>
        </div>
    );
};

const TeacherReviewStudio: React.FC<{
    pushToast: (m: string) => void;
    setAuditLogs: React.Dispatch<React.SetStateAction<string[]>>;
    setOwnerApprovalQueue: React.Dispatch<React.SetStateAction<OwnerApprovalItem[]>>;
    simulatedSessionRole: 'super_admin' | 'instructor' | 'operator';
}> = ({ pushToast, setAuditLogs, setOwnerApprovalQueue, simulatedSessionRole }) => {
    const [subs, setSubs] = useState<ReviewSubmission[]>(seedReviewSubmissions);
    const [activeId, setActiveId] = useState<string>(seedReviewSubmissions[0].id);
    const [rubric, setRubric] = useState<Record<string, number>>(() => RUBRIC_KEYS.reduce((a, k) => ({ ...a, [k]: 7 }), {} as Record<string, number>));
    const [written, setWritten] = useState('');
    const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
    const forcedApproval = simulatedSessionRole === 'instructor' || defaultPermissionsFor(simulatedSessionRole)['evaluation'].ownerApproval;
    const [requireOwnerApproval, setRequireOwnerApproval] = useState(forcedApproval);

    useEffect(() => { setRequireOwnerApproval(forcedApproval); }, [forcedApproval]);
    useEffect(() => {
        setRubric(RUBRIC_KEYS.reduce((a, k) => ({ ...a, [k]: 7 }), {} as Record<string, number>));
        setWritten('');
        setHighlighted(new Set());
    }, [activeId]);

    const active = subs.find(s => s.id === activeId) ?? subs.find(s => !s.released) ?? subs[0];
    const pendingCount = subs.filter(s => !s.released).length;
    const ownerSignoffCount = subs.filter(s => s.severity === 'Owner Sign-off Needed' && !s.released).length;
    const overall = RUBRIC_KEYS.reduce((s, k) => s + rubric[k], 0) / RUBRIC_KEYS.length;
    const overallBand = Math.round(overall * 2) / 2;

    const release = () => {
        if (requireOwnerApproval) { pushToast('Owner approval required before release'); return; }
        setSubs(prev => prev.map(s => s.id === active.id ? { ...s, released: true } : s));
        pushToast(`Evaluation published for Candidate ${active.candidateId}`);
        setAuditLogs(prev => [`Released evaluation for ${active.candidateName} (${active.candidateId}) — Overall Band ${overallBand.toFixed(1)} — ${new Date().toLocaleTimeString()}`, ...prev]);
        const next = subs.find(s => !s.released && s.id !== active.id);
        if (next) setActiveId(next.id);
    };
    const routeOwner = () => {
        setOwnerApprovalQueue(prev => [...prev, { id: Date.now(), label: `Instructor graded ${active.candidateName} (${active.candidateId}) — Routed to Owner Sign-off`, ts: new Date().toLocaleTimeString() }]);
        setSubs(prev => prev.map(s => s.id === active.id ? { ...s, released: true } : s));
        setAuditLogs(prev => [`Instructor graded ${active.candidateId} — Routed to Owner Sign-off — ${new Date().toLocaleTimeString()}`, ...prev]);
        pushToast(`Routed to Owner Approval Queue for ${active.candidateName}`);
        const next = subs.find(s => !s.released && s.id !== active.id);
        if (next) setActiveId(next.id);
    };

    const sevBadge = (sev: ReviewSubmission['severity']) => sev === 'Urgent'
        ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
        : sev === 'Owner Sign-off Needed' ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
        : 'text-neutral-400 bg-neutral-500/10 border-neutral-700';

    const toggleHighlight = (i: number) => setHighlighted(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Teacher Review Studio // Writing &amp; Speaking Evaluation Hub</h2>
                <p className="text-xs text-neutral-500 mt-1 font-mono">Live Examiner Marking Node — Operational Context: IELTS Academic &amp; General Training</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Pending Submissions</p>
                    <p className="text-lg font-mono text-white">{pendingCount} <span className="text-xs text-amber-300">Essays &amp; Audio Files</span></p>
                </div>
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Average Grading Time</p>
                    <p className="text-lg font-mono text-cyan-300">4.2 <span className="text-xs text-neutral-400">Mins / Candidate</span></p>
                </div>
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Owner Approval Required</p>
                    <p className="text-lg font-mono text-rose-300">{ownerSignoffCount} <span className="text-xs text-neutral-400">Marked (Pending Sign-off)</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-base font-semibold text-white">{active.candidateName} <span className="text-neutral-500 font-mono text-xs">// {active.candidateId}</span></p>
                                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Submitted {active.submittedAt} · Target Band {active.targetBand.toFixed(1)}</p>
                            </div>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${active.type === 'essay' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'}`}>{active.type === 'essay' ? 'Writing Task 2 Essay' : 'Speaking Part 3 Recording'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-3 max-h-[60vh] overflow-y-auto">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Queue</p>
                            <div className="space-y-1">
                                {subs.filter(s => !s.released).map(s => (
                                    <button key={s.id} onClick={() => setActiveId(s.id)} className={`w-full text-left text-xs px-2 py-2 rounded-md transition-all ${activeId === s.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900'}`}>
                                        <span className="block font-medium">{s.candidateName}</span>
                                        <span className="block text-[10px] font-mono text-neutral-500">{s.candidateId} · {s.type === 'essay' ? 'Essay' : 'Speaking'}</span>
                                        <span className={`inline-block mt-1 text-[9px] font-medium px-1.5 py-0.5 rounded border ${sevBadge(s.severity)}`}>{s.severity}</span>
                                    </button>
                                ))}
                                {subs.filter(s => !s.released).length === 0 && <p className="text-[11px] text-neutral-600">Queue cleared.</p>}
                            </div>
                        </div>
                        <div className="col-span-8 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 max-h-[60vh] overflow-y-auto">
                            {active.type === 'essay' ? (
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-500">Candidate Essay</p>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${((active.wordCount ?? 0) >= 250) ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5' : 'text-red-400 border-red-500/30 bg-red-500/5'}`}>{active.wordCount} Words — {((active.wordCount ?? 0) >= 250) ? 'Target Met' : 'Below Target'}</span>
                                    </div>
                                    <div className="bg-[#050505] border border-neutral-800 rounded-lg p-4 space-y-3">
                                        {active.essayText?.map((para, i) => (
                                            <p key={i} onClick={() => toggleHighlight(i)} className={`text-xs leading-relaxed text-neutral-300 rounded px-2 py-1 cursor-pointer transition-all ${highlighted.has(i) ? 'bg-emerald-500/10 border border-emerald-500/30' : 'border border-transparent hover:border-neutral-800'}`}>
                                                <span className="text-neutral-600 font-mono mr-2">{i + 1}.</span>{para}
                                            </p>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    {active.cueCard && (
                                        <div className="bg-[#050505] border border-neutral-800 rounded-lg p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Cue Card</p>
                                            <p className="text-xs text-neutral-300">{active.cueCard}</p>
                                        </div>
                                    )}
                                    <SpeakingWaveform flags={active.audioFlags ?? []} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3">Official IELTS Rubric (Bands 1.0–9.0)</p>
                        <div className="space-y-3">
                            {RUBRIC_KEYS.map(k => (
                                <div key={k}>
                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                        <span className="text-neutral-400">{k}</span>
                                        <span className="text-emerald-300 font-mono">{rubric[k].toFixed(1)}</span>
                                    </div>
                                    <input type="range" min={1} max={9} step={0.5} value={rubric[k]} onChange={e => setRubric(prev => ({ ...prev, [k]: parseFloat(e.target.value) }))} className="w-full accent-emerald-500" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between bg-[#050505] border border-emerald-500/30 rounded-lg p-3">
                            <span className="text-[10px] uppercase tracking-wider text-emerald-400">Overall Band</span>
                            <span className="text-xl font-mono font-semibold text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Band {overallBand.toFixed(1)}</span>
                        </div>
                        <label className="mt-4 flex items-center justify-between text-[11px] cursor-pointer">
                            <span className="text-neutral-400 flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-amber-400" />Require Owner Approval ⭐</span>
                            <input type="checkbox" checked={requireOwnerApproval} disabled={forcedApproval} onChange={e => setRequireOwnerApproval(e.target.checked)} className="accent-amber-500" />
                        </label>
                    </div>

                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Written Diagnostic Remarks</p>
                        <textarea value={written} onChange={e => setWritten(e.target.value)} rows={4} placeholder="Detailed examiner diagnostic..." className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 resize-none" />
                        <div className="mt-3"><VoiceFeedbackRecorder /></div>
                    </div>

                    <div className="space-y-2">
                        <button onClick={release} disabled={requireOwnerApproval} className={`w-full text-xs font-medium py-2.5 rounded-md transition-all ${requireOwnerApproval ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'}`}>🚀 Release Results to Student</button>
                        <button onClick={routeOwner} className="w-full text-xs font-medium py-2.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all">⭐ Route to Owner Approval Queue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomeworkDispatchModal: React.FC<{
    open: boolean; student: { name: string; id: string; deficiency: string } | null;
    onClose: () => void; pushToast: (m: string) => void;
}> = ({ open, student, onClose, pushToast }) => {
    if (!open || !student) return null;
    const weakDefault = student.deficiency.includes('GRA') ? 'Grammatical Range & Accuracy'
        : student.deficiency.includes('Spelling') ? 'Listening Part 4 Spelling'
        : student.deficiency.includes('Hesitation') ? 'Speaking Fluency & Hesitation'
        : 'Coherence & Cohesion';
    const [weak, setWeak] = useState(weakDefault);
    const [target, setTarget] = useState<'individual' | 'batch'>('individual');
    const [ctype, setCtype] = useState('10-Min Micro-Drill');
    return (
        <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-white">Remedial Homework Dispatcher</h3>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white text-xs">✕ Close</button>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Target Candidate: <span className="text-white font-medium">{student.name}</span> <span className="font-mono text-neutral-500">// {student.id}</span></p>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Auto-Identified Weak Sub-Skill</p>
                        <select value={weak} onChange={e => setWeak(e.target.value)} className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none">
                            <option>{weakDefault}</option>
                            <option>Coherence & Cohesion</option>
                            <option>Lexical Resource</option>
                            <option>Pronunciation</option>
                            <option>Listening Part 4 Spelling</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Target Scope</p>
                        <div className="flex gap-2">
                            <button onClick={() => setTarget('individual')} className={`flex-1 text-xs py-2 rounded-md border ${target === 'individual' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-neutral-800 text-neutral-400'}`}>Individual ({student.name})</button>
                            <button onClick={() => setTarget('batch')} className={`flex-1 text-xs py-2 rounded-md border ${target === 'batch' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-neutral-800 text-neutral-400'}`}>Whole Batch ({student.id})</button>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Content Type</p>
                        <select value={ctype} onChange={e => setCtype(e.target.value)} className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none">
                            <option>10-Min Micro-Drill</option>
                            <option>Cue Card Audio Practice</option>
                            <option>Writing Task 2 Model Essay Analysis</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => { onClose(); pushToast('Drill successfully assigned and pushed to candidate mobile app'); }} className="mt-6 w-full text-xs font-medium py-2.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all">
                    [Push Drill to Student App]
                </button>
            </div>
        </div>
    );
};

const ReportModal: React.FC<{
    open: boolean; studentId: string | null; students: StudentTelemetry[];
    onClose: () => void; pushToast: (m: string) => void;
}> = ({ open, studentId, students, onClose, pushToast }) => {
    if (!open || !studentId) return null;
    const s = students.find(x => x.id === studentId);
    if (!s) return null;
    return (
        <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white text-black rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold tracking-tight">FARMGATE BRANCH COMMAND CENTER</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider">// IELTS AI Node</p>
                    </div>
                    <div className="text-[10px] font-bold border-2 border-green-700 text-green-700 px-2 py-1 rounded rotate-[-8deg]">VERIFIED</div>
                </div>
                <p className="text-xs font-semibold mb-3">Candidate Progress Report: {s.name} <span className="font-mono text-neutral-500">// {s.id}</span></p>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="bg-neutral-100 rounded p-2"><p className="text-[10px] uppercase text-neutral-500">Band Average</p><p className="font-bold text-lg">Band {s.ovrScore.toFixed(1)}</p></div>
                    <div className="bg-neutral-100 rounded p-2"><p className="text-[10px] uppercase text-neutral-500">Practice Velocity</p><p className="font-bold text-lg">{s.videos.watched} min/wk</p></div>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Skill Weakness Heatmap</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[{ l: 'Writing', v: s.projects.avg }, { l: 'Exams', v: s.exams.avg }, { l: 'Speaking', v: (s.questioning.understanding + s.questioning.divergent + s.questioning.convergent) }, { l: 'Quizzes', v: s.quizzes.acc }].map(x => (
                        <div key={x.l} className="bg-neutral-100 rounded p-2">
                            <div className="flex justify-between text-[10px]"><span>{x.l}</span><span className="font-mono">{x.v}</span></div>
                            <div className="w-full h-1.5 bg-neutral-300 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-600" style={{ width: `${Math.min(100, (x.v / 10) * 100)}%` }} /></div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Teacher Feedback</p>
                <p className="text-xs bg-neutral-100 rounded p-2 mb-4">{s.ovrScore >= 7 ? 'Excellent trajectory — maintain current regimen.' : s.ovrScore >= 5 ? 'Steady progress — increase Writing Task 2 output.' : 'High intervention required — daily micro-drills advised.'}</p>
                <div className="flex gap-2">
                    <button onClick={() => { onClose(); pushToast('Official PDF downloaded'); }} className="flex-1 text-xs font-medium py-2 rounded-md bg-black text-white">[Download Official PDF]</button>
                    <button onClick={() => { onClose(); pushToast('Progress report sent to parent via WhatsApp'); }} className="flex-1 text-xs font-medium py-2 rounded-md border border-black">[Send to WhatsApp / Parent]</button>
                </div>
            </div>
        </div>
    );
};

const BatchForecastWidget: React.FC = () => {
    const batches = ['EXEC-BATCH-A', 'EXEC-BATCH-B', 'EXEC-BATCH-C'];
    const data = useMemo(() => batches.map(b => {
        const members = students.filter(s => s.batch === b);
        const avg = members.reduce((a, s) => a + s.ovrScore, 0) / (members.length || 1);
        const prob = Math.max(8, Math.min(95, Math.round((avg / 7) * 100 + (members.filter(s => s.ovrScore >= 7).length / (members.length || 1)) * 15)));
        const bottleneck = avg >= 7 ? 'Lexical precision at Band 8 threshold' : avg >= 5 ? 'Coherence & Cohesion in Task 2 capping growth −0.5 Band' : 'Foundational Grammar blocking Band 5 threshold';
        return { batch: b, avg: avg.toFixed(1), prob, bottleneck };
    }), []);
    return (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">BATCH BAND 7+ PROBABILITY FORECAST ENGINE // TARGET DATE OCT 12, 2026</p>
            <div className="grid grid-cols-3 gap-4">
                {data.map(d => (
                    <div key={d.batch} className="bg-[#050505] border border-neutral-800 rounded-lg p-4">
                        <p className="text-xs font-mono text-neutral-400 mb-2">{d.batch}</p>
                        <p className="text-3xl font-semibold tracking-tight text-white mb-1">{d.prob}%</p>
                        <p className="text-[10px] text-neutral-500 mb-3">probability of Band 7.0+ by target</p>
                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-3">
                            <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${d.prob}%` }} />
                        </div>
                        <p className="text-[10px] text-amber-400 leading-relaxed">⚠ {d.bottleneck}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RoleAccessManager: React.FC<{
    pushToast: (m: string) => void;
    setAuditLogs: React.Dispatch<React.SetStateAction<string[]>>;
    setOwnerApprovalQueue: React.Dispatch<React.SetStateAction<OwnerApprovalItem[]>>;
}> = ({ pushToast, setAuditLogs, setOwnerApprovalQueue }) => {
    const [members, setMembers] = useState<TeamMember[]>(seedTeamMembers);
    const [selectedId, setSelectedId] = useState<string | null>(seedTeamMembers[0]?.id ?? null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<RbacTier>('operator');
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const selected = members.find(m => m.id === selectedId) ?? null;

    const accessibleSegments = (m: TeamMember) =>
        accessSegments.filter(s => m.permissions[s.key].read || m.permissions[s.key].write).map(s => s.label);

    const updatePermission = (memberId: string, seg: SegmentKey, field: keyof SegPerm, value: boolean) => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;
        setMembers(prev => prev.map(m => m.id === memberId
            ? { ...m, permissions: { ...m.permissions, [seg]: { ...m.permissions[seg], [field]: value } } }
            : m));
        const fieldLabel = field === 'read' ? 'Read Access' : field === 'write' ? 'Write/Edit Access' : 'Require Owner Sign-off';
        setAuditLogs(prev => [`Admin Ayon updated permissions for ${member.email} — ${fieldLabel} ${value ? 'Enabled' : 'Disabled'}`, ...prev]);
        pushToast(`Permissions updated for ${member.name}`);
        if (field === 'ownerApproval' && value) {
            setOwnerApprovalQueue(prev => [...prev, {
                id: Date.now(),
                label: `${member.name} (${roleMeta[member.role].label}) requires owner sign-off for ${accessSegments.find(s => s.key === seg)?.label}`,
                ts: new Date().toLocaleTimeString(),
            }]);
            pushToast('Owner Approval Queue entry created');
        }
    };

    const handleInvite = () => {
        const email = inviteEmail.trim();
        if (!email) { pushToast('Enter an email to invite'); return; }
        const id = `TM-${String(members.length + 1).padStart(2, '0')}`;
        setMembers(prev => [...prev, buildMember(id, email.split('@')[0], email, inviteRole)]);
        setAuditLogs(prev => [`Admin Ayon invited ${email} as ${roleMeta[inviteRole].label}`, ...prev]);
        pushToast(`Invitation sent to ${email}`);
        setInviteOpen(false);
        setInviteEmail('');
        setGeneratedLink(null);
    };

    const generateLink = () => {
        const token = 'exp_' + Math.floor(Math.random() * 1e8).toString();
        setGeneratedLink(`https://portal.farmgateielts.com/invite?token=${token}`);
    };

    const revoke = (m: TeamMember) => {
        setMembers(prev => prev.filter(x => x.id !== m.id));
        if (selectedId === m.id) setSelectedId(null);
        setAuditLogs(prev => [`Admin Ayon revoked access for ${m.email}`, ...prev]);
        pushToast(`Access revoked for ${m.name}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white mb-1">Role & Access Manager // Meta Business Suite Delegation</h2>
                    <p className="text-xs text-neutral-400">Delegate operational control to instructors, operators, and content managers without exposing billing or AI model constants.</p>
                </div>
                <button onClick={() => { setInviteOpen(true); setGeneratedLink(null); }} className="text-xs font-medium px-3 py-2 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all whitespace-nowrap">
                    [ + Invite Team Member via Email ]
                </button>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Name</th>
                            <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Email</th>
                            <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Role</th>
                            <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Accessible Segments</th>
                            <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m.id} onClick={() => setSelectedId(m.id)} className={`border-b border-neutral-800 last:border-b-0 cursor-pointer transition-all ${selectedId === m.id ? 'bg-neutral-900' : 'hover:bg-neutral-900/50'}`}>
                                <td className="px-5 py-3.5 text-white font-medium">{m.name}</td>
                                <td className="px-5 py-3.5 text-neutral-400 font-mono text-[11px]">{m.email}</td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${roleMeta[m.role].badge}`}>{roleMeta[m.role].label}</span>
                                </td>
                                <td className="px-5 py-3.5 text-neutral-300 max-w-xs">
                                    {accessibleSegments(m).length ? accessibleSegments(m).join(', ') : <span className="text-neutral-600">No segments granted</span>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedId(m.id); }} className="text-[10px] font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded px-2 py-1 transition-all">[ Edit Permissions ]</button>
                                        <button onClick={(e) => { e.stopPropagation(); revoke(m); }} className="text-[10px] font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded px-2 py-1 transition-all">[ Revoke Access ]</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">Granular Permission Matrix</p>
                            <p className="text-sm font-semibold text-white">{selected.name} <span className="text-neutral-500 font-mono text-xs">// {selected.email}</span></p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${roleMeta[selected.role].badge}`}>{roleMeta[selected.role].label}</span>
                    </div>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Segment Name</th>
                                <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500 text-center">Read Access</th>
                                <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500 text-center">Write / Edit Access</th>
                                <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500 text-center">Require Owner Approval ⭐</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessSegments.map(s => {
                                const p = selected.permissions[s.key];
                                return (
                                    <tr key={s.key} className="border-b border-neutral-800 last:border-b-0">
                                        <td className="px-4 py-3 text-neutral-200">{s.label}</td>
                                        <td className="px-4 py-3 text-center">
                                            <input type="checkbox" checked={p.read} onChange={(e) => updatePermission(selected.id, s.key, 'read', e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input type="checkbox" checked={p.write} onChange={(e) => updatePermission(selected.id, s.key, 'write', e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => updatePermission(selected.id, s.key, 'ownerApproval', !p.ownerApproval)}
                                                className={`text-base leading-none transition-transform ${p.ownerApproval ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60'}`}
                                                title="Require Owner Approval"
                                            >
                                                ⭐
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {inviteOpen && (
                <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4" onClick={() => setInviteOpen(false)}>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-semibold text-white">Invite Team Member // Gmail Dispatch</h3>
                            <button onClick={() => setInviteOpen(false)} className="text-neutral-500 hover:text-white text-xs">✕ Close</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Invite Email</p>
                                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="member@farmgateielts.com" className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none focus:border-emerald-500/40" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Assign Role</p>
                                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as RbacTier)} className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none">
                                    <option value="super_admin">Super Admin</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="operator">Operator</option>
                                    <option value="content_manager">Content Manager</option>
                                </select>
                                <p className="text-[10px] text-neutral-500 mt-2">{roleMeta[inviteRole].desc}</p>
                            </div>
                            {!generatedLink ? (
                                <button onClick={generateLink} className="w-full text-xs font-medium py-2.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all">[ Generate 24h Invite Token ]</button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-[#050505] border border-neutral-800 rounded-lg p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Secure Invite Link (24h)</p>
                                        <p className="text-[11px] font-mono text-emerald-300 break-all">{generatedLink}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { navigator.clipboard?.writeText(generatedLink); pushToast('Invite link copied'); }} className="flex-1 text-xs font-medium py-2 rounded-md border border-neutral-700 text-neutral-300 hover:text-white">[ Copy Link ]</button>
                                        <button onClick={handleInvite} className="flex-1 text-xs font-medium py-2 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25">[ Send via Gmail ]</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Component ──

const OrgSpaceView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [currentSection, setCurrentSection] = useState('overview');
    const [currentSubView, setCurrentSubView] = useState('overview_main');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [engagementTab, setEngagementTab] = useState('Videos');
    const [hoveredProfileId, setHoveredProfileId] = useState<string | null>(null);
    const [simulatedSessionRole, setSimulatedSessionRole] = useState<'super_admin' | 'instructor' | 'operator'>('super_admin');
    const [viewAsOpen, setViewAsOpen] = useState(false);
    const [pendingEvaluations, setPendingEvaluations] = useState<EvaluationItem[]>(seedEvaluations);
    const [auditLogs, setAuditLogs] = useState<string[]>(infrastructureTasks);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [dispatchModal, setDispatchModal] = useState<{ open: boolean; student: { name: string; id: string; deficiency: string } | null }>({ open: false, student: null });
    const [reportModal, setReportModal] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });
    const [ownerApprovalQueue, setOwnerApprovalQueue] = useState<OwnerApprovalItem[]>([]);

    const orgSession = useMemo(() => {
        try {
            const raw = localStorage.getItem('stephen_active_tenant_session');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, []);
    const userEmail = orgSession?.email || 'owner@farmgateielts.com';

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => getTabMetric(b, engagementTab) - getTabMetric(a, engagementTab));
    }, [engagementTab]);

    const handleNavClick = (group: NavGroup) => {
        if (group.isLeaf) {
            setCurrentSection(group.key);
            setCurrentSubView(group.leafKey ?? group.key);
            setExpandedSection(null);
        } else {
            setExpandedSection(prev => (prev === group.key ? null : group.key));
        }
    };

    const handleSubClick = (section: string, subKey: string) => {
        setCurrentSection(section);
        setCurrentSubView(subKey);
    };

    const activeSub = (key: string) =>
        currentSubView === key
            ? 'bg-neutral-800 text-white font-medium'
            : 'text-neutral-500 hover:text-white';

    const pushToast = (msg: string) => {
        const id = ++toastSeq;
        setToasts(prev => [...prev, { id, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    };

    const switchSessionRole = (r: 'super_admin' | 'instructor' | 'operator') => {
        setSimulatedSessionRole(r);
        setViewAsOpen(false);
        const roleLabel = r === 'super_admin' ? 'Owner / Super Admin' : r === 'instructor' ? 'Instructor' : 'Front-Desk Operator';
        setAuditLogs(prev => [`Session Context switched to [Simulated Role: ${roleLabel}] by Super Admin Ayon`, ...prev]);
        if (!allowedNavKeysFor(r).has(currentSection)) {
            setCurrentSection('overview');
            setCurrentSubView('overview_main');
            setExpandedSection(null);
        }
    };

    const visibleNavGroups = useMemo(() => {
        const allowed = allowedNavKeysFor(simulatedSessionRole);
        return navGroups.filter(g => allowed.has(g.key));
    }, [simulatedSessionRole]);

    const currentSectionLocked = !allowedNavKeysFor(simulatedSessionRole).has(currentSection);

    return (
        <div className="flex h-screen overflow-hidden bg-black text-neutral-100 font-sans">
            {/* ── Left Sidebar ── */}
            <aside className="w-[260px] shrink-0 border-r border-neutral-800 bg-[#050505] p-4 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
                <div>
                    <div className="mb-6 px-3">
                        <h1 className="text-sm font-semibold tracking-tight text-white">Farmgate Branch Command Center // IELTS AI Node</h1>
                        <p className="text-[10px] text-neutral-400 mt-2 leading-relaxed">Logged in as: Ayon (Owner / Super Admin) — owner@farmgateielts.com</p>
                        <div className="mt-2 flex items-center">
                            <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${simulatedSessionRole === 'super_admin' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : simulatedSessionRole === 'instructor' ? 'text-sky-300 bg-sky-500/10 border-sky-500/30' : 'text-amber-300 bg-amber-500/10 border-amber-500/30'}`}>
                                {simulatedSessionRole === 'super_admin' ? 'TENANT ADMIN (FULL ACCESS)' : simulatedSessionRole === 'instructor' ? 'INSTRUCTOR (RESTRICTED)' : 'OPERATOR (RESTRICTED)'}
                            </span>
                        </div>
                        <div className="mt-3 relative">
                            <button
                                onClick={() => setViewAsOpen(o => !o)}
                                className="w-full flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-wider px-2 py-1.5 rounded border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 transition-all"
                            >
                                <span>👁️ View As...</span>
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            {viewAsOpen && (
                                <div className="absolute left-0 right-0 mt-1 z-50 bg-[#0a0a0a] border border-neutral-800 rounded-lg p-1 shadow-2xl">
                                    <button onClick={() => switchSessionRole('super_admin')} className="w-full text-left text-[11px] px-2 py-1.5 rounded text-neutral-300 hover:bg-neutral-800">Current Session (Owner / Super Admin)</button>
                                    <button onClick={() => switchSessionRole('instructor')} className="w-full text-left text-[11px] px-2 py-1.5 rounded text-neutral-300 hover:bg-neutral-800">Simulate Invited Teacher View (rahim.instructor@gmail.com)</button>
                                    <button onClick={() => switchSessionRole('operator')} className="w-full text-left text-[11px] px-2 py-1.5 rounded text-neutral-300 hover:bg-neutral-800">Simulate Front-Desk Operator View (karim.operator@gmail.com)</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <nav className="space-y-0.5">
                        {visibleNavGroups.map(group => {
                            const isExpanded = expandedSection === group.key;
                            const isActive = currentSection === group.key;
                            return (
                                <div key={group.key}>
                                    <button
                                        onClick={() => handleNavClick(group)}
                                        className={`${btnBase} ${isActive && group.isLeaf ? 'bg-neutral-800 text-white font-medium' : ''}`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            {group.icon}
                                            {group.label}
                                        </span>
                                        {group.subItems && (
                                            <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                        )}
                                    </button>
                                    {group.subItems && isExpanded && (
                                        <div className="mt-0.5 space-y-0.5">
                                            {group.subItems.map(sub => (
                                                <button
                                                    key={sub.key}
                                                    onClick={() => handleSubClick(group.key, sub.key)}
                                                    className={`w-full flex items-center justify-between text-left text-xs pl-8 pr-3 py-1.5 rounded-md transition-all ${activeSub(sub.key)}`}
                                                >
                                                    <span>{sub.label}</span>
                                                    {sub.key === 'evaluation_queue' && (
                                                        <span className="text-[9px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                                            {pendingEvaluations.filter(e => e.status === 'pending').length} Pending
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto pt-4 border-t border-neutral-900">
                    <button
                        onClick={onExit}
                        className="w-full text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md py-2 px-3 font-medium transition-all"
                    >
                        ← Exit Operational Node
                    </button>
                </div>
            </aside>

            {/* ── Right Viewport ── */}
            <main className="flex-1 p-8 bg-neutral-950 overflow-y-auto h-screen min-h-0">
                {currentSectionLocked ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                        <div className="text-5xl mb-4 opacity-60">🔒</div>
                        <h3 className="text-xl font-semibold text-white">Access Restricted — Requires Owner Approval</h3>
                        <p className="text-sm text-neutral-400 mt-2 max-w-md">The segment "{navGroups.find(g => g.key === currentSection)?.label ?? currentSection}" is locked under your current simulated role. Request owner approval to gain access.</p>
                        <button onClick={() => pushToast('Access request sent to Owner (Ayon)')} className="mt-6 text-xs font-medium py-2.5 px-4 rounded-md border border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-all">[ Request Access from Owner ]</button>
                    </div>
                ) : (
                    <>
                {currentSubView === 'daily_engagements' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Institute Daily Engagement Matrix // Practice Time & Band Trajectory
                        </h2>

                        {/* Sub-classification tabs */}
                        <div className="flex gap-1 mb-6">
                            {engagementTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setEngagementTab(tab)}
                                    className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all ${
                                        engagementTab === tab
                                            ? 'bg-neutral-800 text-white'
                                            : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Leaderboard table */}
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Rank</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Student Identifier</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Batch ID</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Practice Time (Total / Target)</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Performance Trajectory</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStudents.map((s, i) => (
                                        <tr key={s.id} className="border-b border-neutral-800 last:border-b-0 relative">
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono">{i + 1}</td>
                                            <td
                                                className="px-5 py-3.5 text-white font-medium relative"
                                                onMouseEnter={() => setHoveredProfileId(s.id)}
                                                onMouseLeave={() => setHoveredProfileId(null)}
                                            >
                                                {s.name}
                                                {hoveredProfileId === s.id && (
                                                    <div className="absolute left-0 top-full mt-2 bg-[#0d0d0d] border border-neutral-700 shadow-2xl rounded-xl p-4 w-80 z-50 pointer-events-none">
                                                        <p className="text-xs font-semibold text-white mb-2">
                                                            Candidate Profile Matrix: {s.name} // {s.id}
                                                        </p>
                                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                                            OVR Band Score: {s.ovrScore} / 9
                                                        </p>
                                                        <div className="space-y-1.5 text-[11px]">
                                                            <p className="text-neutral-400">
                                                                Exams: {s.exams.done}/{s.exams.total} | Avg: {s.exams.avg} | {s.exams.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Assignments: {s.projects.done}/7 | Avg: {s.projects.avg} | {s.projects.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Speaking: U:{s.questioning.understanding} D:{s.questioning.divergent} C:{s.questioning.convergent} | {s.questioning.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Flashcards: {s.flashcards.done}/{s.flashcards.total} | Acc: {s.flashcards.acc}% | {s.flashcards.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Quizzes: {s.quizzes.done}/{s.quizzes.total} | Acc: {s.quizzes.acc}% | {s.quizzes.status}
                                                            </p>
                            </div>
                        </div>
                        )}
                                            </td>
                                            <td className="px-5 py-3.5 text-neutral-500 font-mono">{s.batch}</td>
                                            <td className="px-5 py-3.5 text-white font-mono">{getTabLabel(s, engagementTab)}</td>
                                            <td className={`px-5 py-3.5 font-mono ${trajectoryColor(s)}`}>Band {s.ovrScore.toFixed(1)} // {trajectoryLabel(s)}</td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => setReportModal({ open: true, studentId: s.id })}
                                                    className="text-[10px] font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded px-2 py-1 transition-all"
                                                >
                                                    [Progress Report]
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSubView === 'license_seats' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Infrastructure & Ledger Operations // License Allocation Portal
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Total Active Student Seats
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    1,420 / 2,000 Seats Used
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Instructor Accounts
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    12 Active Teachers
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Next Cycle Invoicing
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    $4,200 / Month
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                License Provisioning Audit Trail
                            </h3>
                            <div className="space-y-3">
                                {licenseAudit.map((msg, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <ClockIcon className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-neutral-400 leading-relaxed">{msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'overview_main' && (() => {
                    const submissionsList = [
                        { id: 'STU-2814', name: 'Ayon Rahman', test: 'CAMBRIDGE 18', title: 'Writing Task 2 - Education Essay', time: '4 mins ago', band: 7.0, status: 'graded' as const },
                        { id: 'STU-1903', name: 'Nusrat Jahan', test: 'CAMBRIDGE 17', title: 'Writing Task 1 - Process Diagram', time: '12 mins ago', band: 0, status: 'processing' as const },
                        { id: 'STU-2201', name: 'Tanvir Ahmed', test: 'SPEAKING PART 3', title: 'Audio Recording - Technology & Society', time: '18 mins ago', band: 5.5, status: 'flagged' as const },
                        { id: 'STU-1756', name: 'Saimon Chowdhury', test: 'CAMBRIDGE 18', title: 'Writing Task 2 - Environment Essay', time: '27 mins ago', band: 6.5, status: 'graded' as const },
                        { id: 'STU-2480', name: 'Farhan Kabir', test: 'CAMBRIDGE 16', title: 'Writing Task 1 - Bar Chart Report', time: '34 mins ago', band: 0, status: 'processing' as const },
                        { id: 'STU-2099', name: 'Mim Akter', test: 'SPEAKING PART 2', title: 'Audio Recording - Describe a Place', time: '41 mins ago', band: 7.5, status: 'graded' as const },
                    ];
                    const atRiskStudents = [
                        { name: 'Tanvir Ahmed', target: 7.0, current: 5.5, issue: 'Writing dropped -1.0 Band', action: 'Send Practice Assignment' },
                        { name: 'Nusrat Jahan', target: 6.5, current: 5.5, issue: 'Inactive for 5 days', action: 'Ping Student' },
                        { name: 'Saimon Chowdhury', target: 7.5, current: 6.0, issue: 'Speaking fluency flag', action: 'Schedule 1-on-1' },
                    ];
                    const telemetryLogs = [
                        { time: '13:54:02', tag: 'SYSTEM', msg: 'Synced 12 new submissions from Farmgate Batch' },
                        { time: '13:54:18', tag: 'AI ENGINE', msg: 'Evaluated Writing Task #8821 in 1.42s (Band 6.5)' },
                        { time: '13:55:01', tag: 'AUDIT', msg: "Teacher 'Instructor_Rafi' overridden Band score from 6.0 to 6.5 for Student #2814" },
                        { time: '13:55:12', tag: 'ALERT', msg: 'Student #1092 dropped below baseline threshold' },
                        { time: '13:55:30', tag: 'SYSTEM', msg: 'Cambridge 18 - Test 2 deployed to Batch A-2024 (48 candidates)' },
                        { time: '13:56:01', tag: 'AI ENGINE', msg: 'Speaking evaluation queued for 3 pending audio submissions' },
                    ];

                    return (
                        <div className="p-6 space-y-6 bg-[#090A0C] min-h-screen">
                            {/* ── HEADER BAR ── */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Workspace Operations & Worksheet Overview</h2>
                                    <p className="text-sm text-[#8E95A3] mt-1">Real-time cohort telemetry, live AI grading queue, and student worksheet tracking.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-[#12141A] border border-[#1F232D] rounded-lg px-3 py-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E699] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E699]"></span>
                                        </span>
                                        <span className="text-xs font-mono text-[#00E699]">IELTS AI NODE #04 ONLINE (12ms)</span>
                                    </div>
                                    <button className="bg-[#00E699] hover:bg-[#00CC8A] text-[#090A0C] text-sm font-semibold px-4 py-2 rounded-lg transition-all">
                                        + Assign Batch Worksheet
                                    </button>
                                    <button className="border border-[#1F232D] hover:border-[#2A2F3A] text-[#8E95A3] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                                        Export Cohort Analytics
                                    </button>
                                </div>
                            </div>

                            {/* ── SECTION A: TOP 4 METRIC CARDS ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#565E6D] mb-2">Active Seat Allocation</p>
                                    <p className="text-2xl font-bold font-mono text-white">184 <span className="text-sm font-normal text-[#565E6D]">/ 200</span></p>
                                    <div className="w-full h-1.5 bg-[#1A1D26] rounded-full mt-3 mb-2 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#00E699] to-[#00CC8A]" style={{ width: '92%' }} />
                                    </div>
                                    <p className="text-[11px] text-[#565E6D]">16 seats remaining in Farmgate Executive Batch</p>
                                </div>
                                <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5 relative">
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FFAB00] animate-pulse" />
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#565E6D] mb-2">Worksheet Submissions Today</p>
                                    <p className="text-2xl font-bold font-mono text-white">170 <span className="text-sm font-normal text-[#565E6D]">Total</span></p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs font-mono text-[#FFAB00]">42 Pending</span>
                                        <span className="text-xs text-[#1F232D]">|</span>
                                        <span className="text-xs font-mono text-[#00E699]">128 Auto-Graded</span>
                                    </div>
                                    <p className="text-[11px] text-[#565E6D] mt-2">+24% higher engagement vs last week</p>
                                </div>
                                <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#565E6D] mb-2">Institute Average Band</p>
                                    <p className="text-2xl font-bold font-mono text-white">6.85 <span className="text-sm font-normal text-[#565E6D]">Band</span></p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-mono font-semibold text-[#00E699]">▲ +0.35</span>
                                        <span className="text-[11px] text-[#565E6D]">Target: 7.00</span>
                                    </div>
                                    <p className="text-[11px] text-[#565E6D] mt-1">Based on 1,420 graded worksheets this month</p>
                                </div>
                                <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#565E6D] mb-2">AI Evaluation Latency</p>
                                    <p className="text-2xl font-bold font-mono text-white">1.8s <span className="text-sm font-normal text-[#565E6D]">/ Essay</span></p>
                                    <p className="text-xs font-mono text-[#00E699] mt-2">100% Accuracy Rate · 0 Queue Backlog</p>
                                    <p className="text-[11px] text-[#565E6D] mt-1">Auto-Feedback Engine operational</p>
                                </div>
                            </div>

                            {/* ── SECTION B: MAIN ASYMMETRIC GRID ── */}
                            <div className="flex gap-6">

                                {/* LEFT COLUMN (Flex-7) */}
                                <div className="flex-[7] min-w-0 space-y-6">

                                    {/* Live Worksheet Assessment Pipeline */}
                                    <div className="bg-[#12141A] border border-[#1F232D] rounded-xl overflow-hidden">
                                        <div className="p-5 pb-0">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-white">Recent Worksheet Submissions</h3>
                                                <div className="flex items-center gap-2">
                                                    {['All (170)', 'Writing Task 2', 'Speaking Audios', 'Pending Human Review (42)'].map((f, i) => (
                                                        <button key={i} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all ${i === 0 ? 'bg-[#00E699]/10 border-[#00E699]/30 text-[#00E699]' : 'border-[#1F232D] text-[#565E6D] hover:text-white hover:border-[#2A2F3A]'}`}>
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-t border-[#1F232D]">
                                                    <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-[#565E6D]">Student</th>
                                                    <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-[#565E6D]">Test / Worksheet</th>
                                                    <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-[#565E6D]">Submitted</th>
                                                    <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-[#565E6D]">Band / Status</th>
                                                    <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-[#565E6D]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {submissionsList.map((s) => (
                                                    <tr key={s.id} className="border-t border-[#1F232D] hover:bg-[#16181D] transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-7 h-7 rounded-full bg-[#1A1D26] flex items-center justify-center text-[10px] font-bold text-[#8E95A3]">{s.name.charAt(0)}</div>
                                                                <div>
                                                                    <p className="text-white font-medium">{s.name}</p>
                                                                    <p className="text-[10px] text-[#565E6D] font-mono">#{s.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#1A1D26] text-[#8E95A3] px-1.5 py-0.5 rounded">{s.test}</span>
                                                                <span className="text-[#8E95A3]">{s.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 text-[#565E6D]">{s.time}</td>
                                                        <td className="px-5 py-3">
                                                            {s.status === 'graded' && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-[#00E699]/10 text-[#00E699] border border-[#00E699]/30 px-2 py-0.5 rounded-full">
                                                                    Band {s.band.toFixed(1)}
                                                                </span>
                                                            )}
                                                            {s.status === 'processing' && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-[#FFAB00]/10 text-[#FFAB00] border border-[#FFAB00]/30 px-2 py-0.5 rounded-full">
                                                                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                                                    AI Processing...
                                                                </span>
                                                            )}
                                                            {s.status === 'flagged' && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 px-2 py-0.5 rounded-full">
                                                                    Review Flagged
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <button className="text-[10px] font-medium text-[#8E95A3] hover:text-white border border-[#1F232D] hover:border-[#2A2F3A] px-2 py-1 rounded transition-all">Review Essay</button>
                                                                <button className="text-[10px] font-medium text-[#8E95A3] hover:text-white border border-[#1F232D] hover:border-[#2A2F3A] px-2 py-1 rounded transition-all">Override</button>
                                                                <button className="text-[10px] font-medium text-[#8E95A3] hover:text-white border border-[#1F232D] hover:border-[#2A2F3A] px-2 py-1 rounded transition-all">Feedback</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Cohort Skill Accuracy & Band Distribution */}
                                    <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5">
                                        <h3 className="text-sm font-semibold text-white mb-4">Cohort Skill Accuracy & Band Distribution</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Reading', avg: 7.2, pct: 81, color: '#00E699' },
                                                { label: 'Listening', avg: 7.5, pct: 84, color: '#00E699' },
                                                { label: 'Writing', avg: 6.2, pct: 64, color: '#FFAB00' },
                                                { label: 'Speaking', avg: 6.5, pct: 68, color: '#00B8D9' },
                                            ].map((s) => (
                                                <div key={s.label} className="flex items-center gap-4">
                                                    <span className="text-xs text-[#8E95A3] w-20 shrink-0">{s.label}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[11px] text-[#565E6D]">Avg {s.avg}</span>
                                                            <span className="text-[11px] font-mono font-semibold" style={{ color: s.color }}>{s.pct}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-[#1A1D26] rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-[#1F232D] bg-[#0D0E12] rounded-lg p-3">
                                            <p className="text-xs text-[#FFAB00]">
                                                💡 <span className="font-semibold">System Recommendation:</span> Writing Task 2 Lexical Resource is the primary bottleneck for 38% of students in this cohort.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN (Flex-3) */}
                                <div className="flex-[3] min-w-0 space-y-6">

                                    {/* At-Risk Students Monitor */}
                                    <div className="bg-[#12141A] border border-[#1F232D] rounded-xl p-5">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold text-white">Students Needing Attention</h3>
                                            <p className="text-[11px] text-[#565E6D] mt-0.5">Falling below target band 6.0</p>
                                        </div>
                                        <div className="space-y-3">
                                            {atRiskStudents.map((s, i) => (
                                                <div key={i} className="bg-[#090A0C] border border-[#1F232D] rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-xs font-semibold text-white">{s.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] mb-1.5">
                                                        <span className="text-[#565E6D]">Target {s.target}</span>
                                                        <span className="text-[#565E6D]">→</span>
                                                        <span className="font-mono font-semibold text-[#FF4D4D]">Current {s.current}</span>
                                                    </div>
                                                    <p className="text-[10px] text-[#FFAB00] mb-2">{s.issue}</p>
                                                    <button className="w-full text-[10px] font-semibold bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 py-1.5 rounded transition-all">
                                                        {s.action}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Real-Time AI Node Logs */}
                                    <div className="bg-[#12141A] border border-[#1F232D] rounded-xl overflow-hidden">
                                        <div className="px-5 pt-4 pb-2">
                                            <h3 className="text-sm font-semibold text-white">Real-Time AI Node Logs</h3>
                                        </div>
                                        <div className="bg-[#0B0C0E] border-t border-[#1A1D26] font-mono text-[11px] p-3 h-48 overflow-y-auto">
                                            {telemetryLogs.map((log, i) => (
                                                <div key={i} className="flex items-start gap-2 mb-1.5">
                                                    <span className="text-[#565E6D] shrink-0">[{log.time}]</span>
                                                    <span className={`shrink-0 font-semibold ${log.tag === 'ALERT' ? 'text-[#FF4D4D]' : log.tag === 'AI ENGINE' ? 'text-[#00B8D9]' : log.tag === 'AUDIT' ? 'text-[#FFAB00]' : 'text-[#00E699]'}`}>
                                                        [{log.tag}]
                                                    </span>
                                                    <span className="text-[#8E95A3]">{log.msg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                <BatchForecastWidget />

                {currentSubView === 'performance_analytics' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Cohort Operational Engine // Cross-Segment Risk Quadrant
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mb-6">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500 mb-4">
                                RISK ISOLATION ANALYSIS (HIGH PRACTICE TIME // LOW OUTPUT YIELD)
                            </p>
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Rank</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Identifier</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">System ID</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Engagement Overhead</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Metric Deficiency</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Intervention Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskProfiles.map(r => (
                                        <tr key={r.rank} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-4 py-3 text-neutral-400 font-mono">{r.rank}</td>
                                            <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                                            <td className="px-4 py-3 text-neutral-500 font-mono">{r.id}</td>
                                            <td className="px-4 py-3 text-neutral-400">{r.hours}</td>
                                            <td className="px-4 py-3 text-amber-400">{r.deficiency}</td>
                                            <td className="px-4 py-3 font-mono text-[10px] font-semibold">
                                                <button
                                                    onClick={() => setDispatchModal({ open: true, student: { name: r.name, id: r.id, deficiency: r.deficiency } })}
                                                    className={`${r.status.includes('FLAGGED') ? 'text-amber-400' : 'text-orange-400'} border border-current rounded px-2 py-0.5 hover:bg-neutral-800 transition-all`}
                                                >
                                                    {r.status}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">BATCH SKILL DOMAIN MASTERY HEATMAP</p>
                            <div className="grid grid-cols-1 gap-4">
                                {skillDomains.map(d => (
                                    <div key={d.label} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">{d.label}</span>
                                            <span className="text-white font-mono">{d.pct}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-white" style={{ width: `${d.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <BatchForecastWidget />

                {currentSubView === 'course_deployment' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Curriculum Asset Pipeline // Active Exam & Assignment Compilations
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Course Module</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Deploy State</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Enrolled Candidates</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Module Route</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseModules.map(m => (
                                        <tr key={m.name} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-4 text-white font-medium">{m.name}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${m.live ? 'bg-emerald-400' : 'bg-neutral-600'}`} style={{ width: `${m.sync}%` }} />
                                                    </div>
                                                    <span className={`text-[10px] font-mono font-semibold ${m.live ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                                        {m.live ? 'LIVE // VERIFIED' : `${m.sync}% Syncing`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-400 font-mono">{m.seats} Candidates</td>
                                            <td className="px-5 py-4 text-neutral-500 font-mono">{m.route}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mt-6">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-5">
                                AI Evaluation Parameter Lab // Cohort Grading Directives
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                            System Pedagogical Strategy
                                        </p>
                                        <select className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full outline-none">
                                            <option className="bg-[#0a0a0a]">Strict Examiner Mode (IDP/BC Standard)</option>
                                            <option className="bg-[#0a0a0a]">Balanced Feedback</option>
                                            <option className="bg-[#0a0a0a]">Beginner Encouraging Mode</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                            AI Evaluation Strictness Margin
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-neutral-500 font-mono">0.0 (Lenient)</span>
                                            <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: '80%' }} />
                                            </div>
                                            <span className="text-[10px] text-neutral-500 font-mono">1.0 (Strict)</span>
                                            <span className="text-[11px] text-emerald-400 font-mono font-semibold ml-2">0.8</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                        Teacher Override Directive
                                    </p>
                                    <textarea
                                        readOnly
                                        className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] p-3 text-neutral-400 focus:outline-none focus:border-neutral-700 resize-none"
                                        value={`REQUIREMENT: Flag any student using generic templates in Writing Task 2. Prioritize Lexical Resource and Coherence feedback for Band 6.5 cohort.`}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 pt-5 border-t border-neutral-800">
                                <button className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 text-emerald-400 text-xs py-2 px-4 rounded font-mono transition-all duration-150">
                                    [+ Update Live Cohort System Directives]
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'vector_repos' && (
                    <InstituteKnowledgeBase />
                )}

                {currentSubView === 'sso_gateways' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Institute LMS & Portal Bridges // Identity Integration
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {identityProviders.map(p => (
                                <div key={p.name} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <GlobeIcon className="w-5 h-5 text-neutral-400" />
                                        <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                                    </div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">Linked Student Accounts</p>
                                    <p className="text-lg font-semibold text-white mb-3">{p.accounts} Linked</p>
                                    <span className="inline-flex text-[10px] font-medium text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 mb-3">
                                        {p.status}
                                    </span>
                                    <p className="text-[10px] text-neutral-500 mt-2 font-mono">
                                        {p.token ? `SAML Token Exp: ${p.token}` : `Auto-Provisioning: ${p.provisioning}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentSubView === 'node_settings' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            System Parameter Overrides // IELTS AI Evaluation Constants
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-6">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Default Evaluation Base Model</p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    Claude 3.5 Sonnet // IELTS Evaluator Pipeline
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">AI Evaluation Strictness Margin</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-neutral-500 font-mono">0.0 (Lenient)</span>
                                    <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-neutral-600" style={{ width: '80%' }} />
                                    </div>
                                    <span className="text-[10px] text-neutral-500 font-mono">1.0 (Strict)</span>
                                    <span className="text-xs text-neutral-400 font-mono whitespace-nowrap ml-2">0.8 Strictness Margin</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Teacher Override Mandate: Require manual teacher approval before students view Writing scores.</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-5 rounded-full bg-emerald-500 flex items-center p-0.5 justify-end">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">TRUE — Teacher approval required before score release</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'evaluation_queue' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Teacher Evaluation Queue // Pending Sign-off & Speaking Review
                        </h2>
                        <EvaluationQueue
                            items={pendingEvaluations}
                            setItems={setPendingEvaluations}
                            setAuditLogs={setAuditLogs}
                            pushToast={pushToast}
                        />
                    </>
                )}

                {currentSubView === 'teacher_review_studio' && (
                    <TeacherReviewStudio
                        simulatedSessionRole={simulatedSessionRole}
                        pushToast={pushToast}
                        setAuditLogs={setAuditLogs}
                        setOwnerApprovalQueue={setOwnerApprovalQueue}
                    />
                )}

                {currentSubView === 'role_access_manager' && (
                    <RoleAccessManager
                        pushToast={pushToast}
                        setAuditLogs={setAuditLogs}
                        setOwnerApprovalQueue={setOwnerApprovalQueue}
                    />
                )}

                {currentSubView === 'ai-test-author' && (
                    <AICoPilotTestAuthor />
                )}

                {currentSubView === 'at_risk_radar' && <AtRiskRadar />}
                {currentSubView === 'misconception_log' && <MisconceptionLog />}
                {currentSubView === 'handwritten_queue' && <HandwrittenQueue />}
                {currentSubView === 'speaking_audits' && <SpeakingAudits />}
                {currentSubView === 'teacher_override' && <TeacherOverride />}
                {currentSubView === 'mission_builder' && <MissionBuilder />}
                {currentSubView === 'mock_deployment' && <MockDeployment />}
                {currentSubView === 'batch_roster' && <BatchRoster />}
                {currentSubView === 'branding_settings' && <BrandingSettings />}
                {currentSubView === 'ai_prompt_rules' && <AIPromptRules />}
                {currentSubView === 'billing_licenses' && <BillingLicenses />}

                {currentSubView !== 'daily_engagements' && currentSubView !== 'license_seats'
                    && currentSubView !== 'overview_main' && currentSubView !== 'performance_analytics'
                    && currentSubView !== 'course_deployment' && currentSubView !== 'vector_repos'
                    && currentSubView !== 'ai-test-author' && currentSubView !== 'sso_gateways' && currentSubView !== 'node_settings'
                    && currentSubView !== 'evaluation_queue' && currentSubView !== 'role_access_manager'
                    && currentSubView !== 'at_risk_radar' && currentSubView !== 'misconception_log'
                    && currentSubView !== 'handwritten_queue' && currentSubView !== 'speaking_audits'
                    && currentSubView !== 'teacher_override' && currentSubView !== 'mission_builder'
                    && currentSubView !== 'mock_deployment' && currentSubView !== 'batch_roster'
                    && currentSubView !== 'branding_settings' && currentSubView !== 'ai_prompt_rules'
                    && currentSubView !== 'billing_licenses' && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-neutral-600">
                            {currentSubView.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                    </div>
                )}

                    </>
                )}

                <HomeworkDispatchModal
                    key={dispatchModal.student?.id}
                    open={dispatchModal.open}
                    student={dispatchModal.student}
                    onClose={() => setDispatchModal({ open: false, student: null })}
                    pushToast={pushToast}
                />
                <ReportModal
                    open={reportModal.open}
                    studentId={reportModal.studentId}
                    students={students}
                    onClose={() => setReportModal({ open: false, studentId: null })}
                    pushToast={pushToast}
                />
            </main>
            <ToastStack toasts={toasts} />
        </div>
    );
};

export default OrgSpaceView;
