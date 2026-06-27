
import { ProjectCard } from './types';

export const seedProjects: ProjectCard[] = [
    {
        id: 'p1',
        title: 'Neural Network Router Optimization',
        description:
            'Designing an intelligent routing protocol using reinforcement learning to optimize packet forwarding across dynamic network topologies with minimal latency.',
        status: 'incomplete',
        type: 'course',
        category: 'Chats',
        timestamp: '2h ago',
        meta: { courseName: 'Advanced Neural Networks', moduleNo: 'M4', projectNo: 'P3', completionRate: 34, architecturalScore: 72 },
    },
    {
        id: 'p2',
        title: 'Distributed Cache Layer',
        description:
            'Building a Redis-based distributed caching system with consistent hashing, replication, and failure detection for high-throughput microservices architecture.',
        status: 'incomplete',
        type: 'outer',
        category: 'Debates',
        timestamp: '1d ago',
        meta: { completionRate: 28, architecturalScore: 65 },
    },
    {
        id: 'p3',
        title: 'Quantized LLM Evaluation Sandbox',
        description:
            'Completed evaluation framework for comparing FP16, INT8, and INT4 quantized variants of Llama 3 across reasoning, coding, and factual recall benchmarks.',
        status: 'complete',
        type: 'course',
        category: 'Q&A',
        timestamp: '3d ago',
        meta: { courseName: 'LLM Architecture & Deployment', moduleNo: 'M7', projectNo: 'P1', completionRate: 100, architecturalScore: 94 },
    },
    {
        id: 'p4',
        title: 'Autonomous Drone Nav-Mesh',
        description:
            'Implemented a real-time navigation mesh generation system for autonomous drone flight using sensor fusion, SLAM, and A* pathfinding with dynamic obstacle avoidance.',
        status: 'complete',
        type: 'outer',
        category: 'Presentation',
        timestamp: '1w ago',
        meta: { completionRate: 100, architecturalScore: 88 },
    },
];

export const courseOptions = [
    'Advanced Neural Networks',
    'LLM Architecture & Deployment',
    'Distributed Systems Engineering',
    'Computer Vision & Perception',
    'Reinforcement Learning',
    'Natural Language Processing',
];

export const moduleOptions = [
    'M1 — Foundations',
    'M2 — Core Algorithms',
    'M3 — Applied Techniques',
    'M4 — Advanced Topics',
    'M5 — Capstone Integration',
    'M6 — Research Frontiers',
    'M7 — Deployment & Production',
];

export const categoryOptions = [
    'Chats',
    'Recalls',
    'Debates',
    'Presentation',
    'Q&A',
    'Instant describe',
] as const;
