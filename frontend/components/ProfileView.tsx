import React from 'react';
import { motion } from 'framer-motion';
import {
    UserIcon, BookOpenIcon, BriefcaseIcon, VideoCameraIcon,
    ShieldCheckIcon, UsersIcon, StarIcon, CheckCircleIcon,
    ClockIcon, MapPinIcon, TrophyIcon, ClipboardIcon,
} from './icons';

// ── Mock data ──
const consultingMetrics = [
    { label: 'Communication Skill', value: 92 },
    { label: 'Conceptual Processing Depth', value: 88 },
    { label: 'Creative Ingestion & Vectoring', value: 95 },
];

const telemetryMetrics = [
    { label: 'Depth of Core Mastery', value: 89 },
    { label: 'Questioning Depth & Query Complexity', value: 94 },
    { label: 'Applied Project Foundations', value: 82 },
];

const edgramPeers = [
    { name: 'Dr. Sarah Chen', role: 'Senior AI Architect' },
    { name: 'Marcus Rivera', role: 'Robotics Lead' },
    { name: 'Priya Sharma', role: 'Computational Linguist' },
    { name: 'James Okafor', role: 'Quantum Systems Engineer' },
];

const engagements = [
    {
        span: '2024 — Present',
        title: 'Lead Research Engineer',
        org: 'BUET Advanced AI Lab',
        desc: 'Leading multimodal fusion research for real-time autonomous decision systems.',
    },
    {
        span: '2022 — 2024',
        title: 'ML Infrastructure Architect',
        org: 'Nexus Robotics (Startup)',
        desc: 'Designed end-to-end training pipelines for perception models deployed on edge hardware.',
    },
    {
        span: '2021 — 2022',
        title: 'Data Engineering Consultant',
        org: 'Enterprise AI Corp.',
        desc: 'Built large-scale ETL frameworks powering BI dashboards for Fortune 500 clients.',
    },
    {
        span: '2020 — 2021',
        title: 'Research Assistant',
        org: 'DU Advanced Research Lab',
        desc: 'Contributed to NLP benchmark datasets and published at ACL 2021.',
    },
];

const aiModules = [
    { title: 'Advanced Transformer Architectures', mastery: 91 },
    { title: 'Reinforcement Learning for Robotics', mastery: 78 },
    { title: 'Probabilistic Graphical Models', mastery: 85 },
];

const enterpriseCourses = [
    { title: 'CS229 — Machine Learning (Stanford Online)', completed: true },
    { title: '6.S191 — Introduction to Deep Learning (MIT)', completed: true },
];

const ingestedItems = [
    { icon: VideoCameraIcon, label: '12 Video Lectures — Deep Learning Specialization' },
    { icon: BookOpenIcon, label: '8 Research Papers — Attention Mechanisms & Beyond' },
    { icon: ClipboardIcon, label: 'Verified Exam Score: 94% — Linear Algebra Foundation' },
    { icon: CheckCircleIcon, label: 'Concept Summary — Graph Neural Networks (4,200 tokens)' },
];

const projects = [
    {
        title: 'Autonomous Drone Swarm Coordination',
        tag: 'Robotics',
        problem: 'Existing swarm algorithms scaled poorly beyond 10 units and lacked real-time collision avoidance in GPS-denied environments.',
        execution: [
            'Deployed a decentralized consensus protocol over ROS 2 mesh network',
            'Implemented vision-based relative localization using ORB-SLAM3',
            'Achieved 24-unit stable formation with under 50ms latency per node',
        ],
        media: ['Schematic', 'Test Run', 'Deployment'],
    },
    {
        title: 'Multi-Modal Hate Speech Classifier',
        tag: 'AI / NLP',
        problem: 'Content moderation systems failed to detect hate speech in memes combining text and imagery across low-resource languages.',
        execution: [
            'Fused CLIP visual embeddings with mBERT textual representations',
            'Curated a 50K-sample benchmark dataset spanning 12 languages',
            'Outperformed baseline by 17% F1 on the Hateful Memes challenge',
        ],
        media: ['Architecture', 'Confusion Matrix', 'Dashboard'],
    },
];

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

const MetricBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="text-emerald-400 font-mono font-semibold">{value}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
        </div>
    </div>
);

const ProfileView: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black text-white p-8 space-y-6">
            {/* ── Row 1: Identity Banner ── */}
            <motion.div {...fadeUp} className="bg-gradient-to-r from-emerald-900/20 via-black to-black border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-5 mb-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-white">ayonburg@gmail.com</h1>
                            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                Lv. 7 Scholar
                            </span>
                            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                                Tier 3 Consultant
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <StarIcon className="w-4 h-4 text-amber-400" />
                                4.8 / 5.0
                            </span>
                            <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4 text-gray-400" />
                                Member since 2020
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">
                        Verified Institutional Network Spaces
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-300">
                                BUET Portal Space Access — Student Tier Verified
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-300">
                                DU Advanced Research Lab Gateway
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Row 2: Split 40/60 ── */}
            <div className="grid grid-cols-5 gap-6">
                {/* ── Left Column (40%) ── */}
                <div className="col-span-2 space-y-4">

                    {/* Card: Pedagogical Analytics */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-emerald-400" />
                            Pedagogical Analytics & Consulting Vectors
                        </h2>
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <p className="text-2xl font-bold text-emerald-400">47</p>
                                <p className="text-xs text-gray-500 mt-1">People Consulted</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <p className="text-2xl font-bold text-emerald-400">1,240</p>
                                <p className="text-xs text-gray-500 mt-1">Total Hours</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5">
                                <p className="text-2xl font-bold text-emerald-400">4.8</p>
                                <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {consultingMetrics.map(m => (
                                <MetricBar key={m.label} label={m.label} value={m.value} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Card: Competition Verification Telemetry */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <TrophyIcon className="w-4 h-4 text-emerald-400" />
                            Competition Verification Telemetry
                        </h2>
                        <div className="space-y-3">
                            {telemetryMetrics.map(m => (
                                <MetricBar key={m.label} label={m.label} value={m.value} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Card: Edgram Peer Network */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-emerald-400" />
                            Edgram Peer Network Connections
                        </h2>
                        <div className="space-y-3">
                            {edgramPeers.map((peer, i) => (
                                <div key={peer.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{peer.name}</p>
                                        <p className="text-xs text-gray-500">{peer.role}</p>
                                    </div>
                                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                        i === 0
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                            : i === 1
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                            : i === 2
                                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                    }`}>
                                        {peer.role.split(' ').pop()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Right Column (60%) ── */}
                <div className="col-span-3 space-y-4">

                    {/* Card: Professional & Academic Engagements */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <BriefcaseIcon className="w-4 h-4 text-emerald-400" />
                            Professional & Academic Engagements
                        </h2>
                        <div className="space-y-0">
                            {engagements.map((e, i) => (
                                <div key={e.title} className="relative pl-6 pb-5 last:pb-0">
                                    {i < engagements.length - 1 && (
                                        <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-emerald-500/20" />
                                    )}
                                    <div className="absolute left-0 top-2 w-[14px] h-[14px] rounded-full border-2 border-emerald-500/50 bg-black" />
                                    <p className="text-xs text-gray-500 mb-0.5">{e.span}</p>
                                    <p className="text-sm font-semibold text-white">{e.title}</p>
                                    <p className="text-xs text-gray-400 mb-1">{e.org}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card: Course Mastery & Curricular Vault */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <BookOpenIcon className="w-4 h-4 text-emerald-400" />
                            Course Mastery & Curricular Vault
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                                    AI-Generated Personalized Modules
                                </h4>
                                <div className="space-y-2">
                                    {aiModules.map(m => (
                                        <div key={m.title} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                                            <span className="text-sm text-gray-300">{m.title}</span>
                                            <span className="text-xs font-mono font-semibold text-emerald-400">{m.mastery}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                                    Enterprise Institutional Registrations
                                </h4>
                                <div className="space-y-2">
                                    {enterpriseCourses.map(c => (
                                        <div key={c.title} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                                            <span className="text-sm text-gray-300">{c.title}</span>
                                            {c.completed && (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card: Ingested Knowledge Portfolio */}
                    <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <VideoCameraIcon className="w-4 h-4 text-emerald-400" />
                            Ingested Knowledge Portfolio
                        </h2>
                        <div className="space-y-2">
                            {ingestedItems.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                                        <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="text-sm text-gray-300">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Row 3: Projects Registry ── */}
            <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <BriefcaseIcon className="w-4 h-4 text-emerald-400" />
                    Comprehensive Interactive Projects Registry
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((p, pi) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 + pi * 0.1 }}
                            className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-white">{p.title}</h3>
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                    {p.tag}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Problem Formulation Block
                                    </p>
                                    <p className="text-sm text-gray-400 italic leading-relaxed">{p.problem}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Execution Methodology Block
                                    </p>
                                    <ul className="space-y-1">
                                        {p.execution.map((step, si) => (
                                            <li key={si} className="text-sm text-gray-400 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Media grid placeholder */}
                            <div className="grid grid-cols-3 gap-2">
                                {p.media.map((label, mi) => (
                                    <div
                                        key={label}
                                        className="aspect-video rounded-lg bg-[#1a1a1a] border border-white/5 flex flex-col items-center justify-center text-center p-2 hover:border-emerald-500/20 transition-colors"
                                    >
                                        <VideoCameraIcon className="w-5 h-5 text-gray-600 mb-1" />
                                        <span className="text-[10px] text-gray-600">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileView;
