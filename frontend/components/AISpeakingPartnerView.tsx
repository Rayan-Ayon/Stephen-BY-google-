import React, { useState } from 'react';

// ── Types ──

type VoiceMode = 'realistic' | 'normal';
type Language = 'bn' | 'hi' | 'ur' | 'en';

interface Partner {
    name: string;
    initials: string;
    color: string;
    tagline: string;
    languages: string[];
}

// ── Mock Data ──

const PARTNERS: Partner[] = [
    { name: 'Mohona', initials: 'MH', color: 'bg-rose-500', tagline: 'Friendly tutor · Bengali feedback · Great for all levels', languages: ['bn', 'hi', 'ur', 'en'] },
    { name: 'James', initials: 'JA', color: 'bg-blue-500', tagline: 'British accent · Formal IELTS prep · Advanced vocabulary', languages: ['en'] },
    { name: 'Priya', initials: 'PR', color: 'bg-violet-500', tagline: 'Hindi native · Warm tone · Beginner friendly', languages: ['hi', 'en'] },
    { name: 'Alex', initials: 'AL', color: 'bg-emerald-500', tagline: 'Neutral accent · Quick feedback · All sections', languages: ['en'] },
    { name: 'Sofia', initials: 'SO', color: 'bg-amber-500', tagline: 'Spanish influence · pronunciation focus · Speaking part expert', languages: ['en'] },
    { name: 'Noah', initials: 'NO', color: 'bg-cyan-500', tagline: 'Calm pace · Urdu support · Confidence builder', languages: ['ur', 'en'] },
];

const LANGUAGE_LABELS: Record<Language, string> = {
    bn: 'বাংলা',
    hi: 'हिन्दी',
    ur: 'اردو',
    en: 'English',
};

// ── Inline SVG Icons ──

const PhoneIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
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

// ── Main Component ──

interface AISpeakingPartnerViewProps {
    userEmail?: string;
}

const AISpeakingPartnerView: React.FC<AISpeakingPartnerViewProps> = ({ userEmail }) => {
    const [voiceMode, setVoiceMode] = useState<VoiceMode>('realistic');
    const [selectedPartner, setSelectedPartner] = useState<string>('Mohona');
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('bn');
    const [scenarioOpen, setScenarioOpen] = useState(false);

    const activePartner = PARTNERS.find(p => p.name === selectedPartner) || PARTNERS[0];

    return (
        <div className="bg-gray-50 min-h-screen p-6 max-w-5xl mx-auto space-y-6">

            {/* ═══ 2.1 TOP HEADER BAR ═══ */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-500 p-3 rounded-full">
                        <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-[24px] font-bold text-gray-900">AI Speaking Partner</h1>
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Realistic Voice</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Practice with your AI speaking partner</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
            <div className="max-w-md mx-auto rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                {/* Voice Toggle */}
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
                {/* Balance Bar */}
                <div className="bg-amber-50/70 py-3 text-center border-t border-amber-100">
                    <span className="text-sm font-bold text-gray-800">🪙 10 Gold Coins</span>
                </div>
            </div>

            {/* ═══ 2.3 PARTNER SELECTION & HERO PROFILE ═══ */}
            <div className="max-w-md mx-auto rounded-3xl bg-gradient-to-b from-red-50/30 via-white to-white border border-gray-100 p-6 shadow-sm text-center space-y-6">
                {/* Section Label */}
                <p className="text-sm font-medium text-gray-700">Your Speaking Partner</p>

                {/* Avatar Selection Strip */}
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
                                selectedPartner === partner.name
                                    ? 'ring-2 ring-red-500 ring-offset-2'
                                    : ''
                            }`}>
                                {partner.initials}
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">{partner.name}</span>
                        </button>
                    ))}
                </div>

                {/* Featured Active Partner Profile */}
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
            <div className="max-w-md mx-auto space-y-4">
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
                <button className="w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-semibold shadow-md transition-colors flex items-center justify-center gap-2">
                    <PhoneIcon className="w-5 h-5" />
                    Start Session with {activePartner.name}
                </button>
            </div>

            {/* ═══ 2.5 MICROPHONE INPUT SETTINGS ═══ */}
            <div className="max-w-md mx-auto rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-2">
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
            <button
                onClick={() => setScenarioOpen(!scenarioOpen)}
                className="max-w-md mx-auto w-full rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex items-center justify-between hover:border-gray-200 transition-colors"
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

            {/* ═══ 2.7 HOW GOLD COINS WORK ═══ */}
            <div className="max-w-md mx-auto rounded-3xl bg-amber-50/50 border border-amber-200/50 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🪙</span>
                    <h3 className="text-sm font-bold text-gray-900">How Gold Coins work</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                    Pro includes 600 Gold Coins each month. Coins reset with your plan; purchased coins carry forward while Pro stays active.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-amber-200 p-3 text-center">
                        <p className="text-[11px] font-bold text-gray-700">Normal Voice</p>
                        <p className="text-sm font-bold text-amber-600 mt-1">1 coin/min</p>
                    </div>
                    <div className="bg-white rounded-xl border border-amber-200 p-3 text-center">
                        <p className="text-[11px] font-bold text-gray-700">Realistic Voice</p>
                        <p className="text-sm font-bold text-amber-600 mt-1">5 coins/min</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISpeakingPartnerView;
