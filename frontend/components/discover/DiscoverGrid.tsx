
import React from 'react';
import { motion } from 'framer-motion';
import { DiscoverCard, SourceType } from './types';
import { YoutubeIcon, XLogoIcon, RedditIcon, GlobeIcon, BookOpenIcon, ShareIcon, HeartIcon, ChatIcon, DotsHorizontalIcon } from '../icons';

const sourceMeta: Record<SourceType, { label: string; icon: React.ReactNode; badgeBg: string; badgeText: string }> = {
    youtube: { label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4" />, badgeBg: 'bg-red-600/20', badgeText: 'text-red-400' },
    twitter: { label: 'X', icon: <XLogoIcon className="w-4 h-4" />, badgeBg: 'bg-slate-700/20', badgeText: 'text-slate-300' },
    reddit: { label: 'Reddit', icon: <RedditIcon className="w-4 h-4" />, badgeBg: 'bg-orange-500/20', badgeText: 'text-orange-400' },
    news: { label: 'News', icon: <GlobeIcon className="w-4 h-4" />, badgeBg: 'bg-blue-600/20', badgeText: 'text-blue-400' },
    journal: { label: 'Journal', icon: <BookOpenIcon className="w-4 h-4" />, badgeBg: 'bg-emerald-600/20', badgeText: 'text-emerald-400' },
};

const mockCards: DiscoverCard[] = [
    { id: '1', title: 'Attention Mechanisms Beyond Transformers', summary: 'New research proposes a linear-complexity attention alternative that matches full attention on long-range benchmarks.', sourceUrl: 'https://arxiv.org/abs/2401.00001', sourceType: 'journal', sourceName: 'arXiv', timestamp: '2h ago', thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', metrics: { citations: 34, likes: 89 } },
    { id: '2', title: 'Why Open-Source AI Will Outpace Big Tech', summary: 'Deep dive into how community-driven models are closing the gap with proprietary systems at a fraction of the cost.', sourceUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', sourceType: 'youtube', sourceName: 'Yannic Kilcher', timestamp: '5h ago', thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop', metrics: { likes: 1240, shares: 340 } },
    { id: '3', title: 'LeCun: "Autoregressive LLMs Are a Dead End"', summary: 'Yann LeCun argues that next-token prediction alone cannot reach human-level understanding and proposes JEPA architecture.', sourceUrl: 'https://x.com/ylecun/status/1800000000000000000', sourceType: 'twitter', sourceName: '@ylecun', timestamp: '8h ago', thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', metrics: { likes: 5400, shares: 2100 } },
    { id: '4', title: 'r/MachineLearning: Best of 2025 So Far', summary: 'Community-voted top papers, projects, and tutorials from the first half of 2025 across all ML subfields.', sourceUrl: 'https://reddit.com/r/MachineLearning', sourceType: 'reddit', sourceName: 'r/MachineLearning', timestamp: '12h ago', thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=400&h=300&fit=crop', metrics: { likes: 3200, shares: 180 } },
    { id: '5', title: 'MIT: New Algorithm Reduces AI Training Cost by 60%', summary: 'Researchers demonstrate a pruning technique that slashes compute requirements without accuracy loss across vision and language models.', sourceUrl: 'https://techreview.com/ai-training-cost', sourceType: 'news', sourceName: 'MIT Technology Review', timestamp: '1d ago', thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', metrics: { shares: 890, citations: 12 } },
    { id: '6', title: 'NeurIPS 2025: Keynote Previews Released', summary: 'Sneak peeks at this year\'s most anticipated presentations including work on scaling laws, mechanistic interpretability, and RLHF.20', sourceUrl: 'https://neurips.cc/2025', sourceType: 'journal', sourceName: 'NeurIPS', timestamp: '1d ago', thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop', metrics: { citations: 56, likes: 230 } },
    { id: '7', title: '3Blue1Brown: The Essence of Deep Learning', summary: 'Visual, intuitive walkthrough of how neural networks learn, from backpropagation to feature visualization.', sourceUrl: 'https://youtube.com/watch?v=aircAruvnKk', sourceType: 'youtube', sourceName: '3Blue1Brown', timestamp: '2d ago', thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop', metrics: { likes: 8900, shares: 1200 } },
    { id: '8', title: 'r/deeplearning: Fine-Tuning Llama 3 on Custom Data', summary: 'Step-by-step guide with code for fine-tuning Llama 3 on domain-specific datasets using LoRA and QLoRA techniques.', sourceUrl: 'https://reddit.com/r/deeplearning', sourceType: 'reddit', sourceName: 'r/deeplearning', timestamp: '2d ago', thumbnailUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=300&fit=crop', metrics: { likes: 1500, shares: 420 } },
];

const formatMetric = (n?: number): string => {
    if (!n) return '';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
};

const DiscoverGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
            {mockCards.map((card, idx) => {
                const meta = sourceMeta[card.sourceType];
                return (
                    <motion.a
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.35, ease: 'easeOut' }}
                        href={card.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-500/40 transition-all group cursor-pointer"
                    >
                        <div className="relative h-44 overflow-hidden">
                            <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-3 left-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badgeBg} ${meta.badgeText} backdrop-blur-sm`}>
                                    {meta.icon}
                                    {card.sourceName}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold dark:text-white text-black text-sm leading-snug mb-1.5 line-clamp-2">{card.title}</h3>
                            <p className="dark:text-gray-500 text-neutral-600 text-xs leading-relaxed line-clamp-2 mb-3">{card.summary}</p>
                            <div className="flex items-center justify-between text-xs dark:text-gray-600 text-neutral-500">
                                <span>{card.timestamp}</span>
                                <div className="flex items-center gap-3">
                                    {card.metrics.likes && (
                                        <span className="flex items-center gap-1"><HeartIcon className="w-3.5 h-3.5" />{formatMetric(card.metrics.likes)}</span>
                                    )}
                                    {card.metrics.shares && (
                                        <span className="flex items-center gap-1"><ShareIcon className="w-3.5 h-3.5" />{formatMetric(card.metrics.shares)}</span>
                                    )}
                                    {card.metrics.citations && (
                                        <span className="flex items-center gap-1"><ChatIcon className="w-3.5 h-3.5" />{formatMetric(card.metrics.citations)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.a>
                );
            })}
        </div>
    );
};

export default DiscoverGrid;
