
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SearchIcon, CheckCircleIcon, StarIcon, LocationTrackerIcon, 
    ChevronDownIcon, TrophyIcon, GlobeIcon, AdjustIcon, UsersIcon,
    ArrowUpIcon, BookOpenIcon, FlaskIcon, ChevronLeftIcon, ShareIcon,
    BookmarkIcon, FileTextIcon, SparkleIcon, ClockIcon, LinkIcon,
    ShieldCheckIcon, CheckIcon, UploadIcon, XIcon, PlusIcon
} from './icons';

// --- Types ---

interface Expert {
    id: number;
    name: string;
    role: string;
    institution: string;
    status: string;
    statusColor: string;
    badges: string[];
    stats: { citations: string; projects: string; mentored: string };
    quote: string;
    tags: string[];
    credits: string;
    image: string;
}

// --- Mock Data ---
const experts: Expert[] = [
    {
        id: 1,
        name: "Dr. Elena Rostova",
        role: "Senior Researcher, AI Alignment",
        institution: "DeepMind / Cambridge",
        status: "LIMITED",
        statusColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        badges: ["Verified Faculty", "Top Mentor"],
        stats: { citations: "4.2k", projects: "45", mentored: "120" },
        quote: "I prioritize rigorous mathematical grounding in neural network interpretation.",
        tags: ["Research Supervision", "PhD Guidance", "LLM Architectures"],
        credits: "500",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Prof. David Chen",
        role: "Department Head, Quantum Physics",
        institution: "Caltech",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Verified Faculty"],
        stats: { citations: "12k", projects: "80", mentored: "350" },
        quote: "Bridging the gap between theoretical physics and applicable computing models.",
        tags: ["Thesis Review", "Quantum Algorithms", "Career Strategy"],
        credits: "450",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Sarah Jenkins",
        role: "Principal Engineer",
        institution: "Anthropic",
        status: "WAITLIST",
        statusColor: "text-gray-400 border-gray-600 bg-gray-800",
        badges: ["Rising Researcher"],
        stats: { citations: "850", projects: "12", mentored: "40" },
        quote: "Building resilient systems requires understanding failure modes first.",
        tags: ["System Design", "Scalable Infra", "Startup Mentorship"],
        credits: "600",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        role: "Prof. of Medieval History",
        institution: "Oxford University",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Verified Faculty"],
        stats: { citations: "3.1k", projects: "25", mentored: "180" },
        quote: "History is not just about the past, but the patterns that shape our future.",
        tags: ["Thesis Structuring", "Archival Research", "Academic Writing"],
        credits: "300",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Emily R. Thorne",
        role: "PhD Candidate, Neuroscience",
        institution: "Stanford University",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Top Mentor"],
        stats: { citations: "420", projects: "8", mentored: "65" },
        quote: "Guiding you through the complexities of experimental design and data analysis.",
        tags: ["Neuroscience", "Data Analysis", "Experimental Design"],
        credits: "250",
        image: "https://images.unsplash.com/photo-1573166368361-3f52316a3bfb?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Hiroshi Tanaka",
        role: "Robotics Engineer",
        institution: "Kyoto University",
        status: "LIMITED",
        statusColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        badges: ["Industry Expert"],
        stats: { citations: "1.5k", projects: "30", mentored: "90" },
        quote: "Automation is the future. Let's build systems that work for humanity.",
        tags: ["Robotics", "Control Systems", "Mechatronics"],
        credits: "400",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=200&auto=format&fit=crop"
    }
];

const filters = [
    { label: "All Experts", icon: null },
    { label: "Professors", icon: <BookOpenIcon className="w-4 h-4" /> },
    { label: "Researchers", icon: <FlaskIcon className="w-4 h-4" /> },
    { label: "Industry Leaders", icon: <TrophyIcon className="w-4 h-4" /> }
];

// --- Request Consultation Flow Modal ---

const RequestConsultationModal: React.FC<{ expert: Expert, onClose: () => void }> = ({ expert, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        goal: '',
        details: '',
        level: '',
        stage: '',
        timeline: '',
        format: '',
        acceptedExpectations: false
    });

    const totalSteps = 5;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const Step1Goal = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">What do you want help with?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Concept Clarification', 'Project Guidance', 'Research Supervision', 'Career Advice'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setFormData({...formData, goal: opt})}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            formData.goal === opt 
                            ? 'bg-blue-900/20 border-blue-500 text-blue-100' 
                            : 'bg-[#111] border-white/10 hover:border-white/30 text-gray-400'
                        }`}
                    >
                        <span className="font-bold text-sm block">{opt}</span>
                    </button>
                ))}
            </div>
            
            <div className="relative">
                <textarea 
                    placeholder="Briefly describe your specific topic or question..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">
                    <SparkleIcon className="w-3 h-3" /> Stephen: Be specific for faster acceptance.
                </div>
            </div>
        </div>
    );

    const Step2Context = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Help {expert.name.split(' ').pop()} understand your context</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Current Level</label>
                    <div className="flex flex-wrap gap-2">
                        {['Undergraduate', 'Graduate', 'PhD Candidate', 'Industry Professional'].map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setFormData({...formData, level: lvl})}
                                className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                                    formData.level === lvl 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Project Stage</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Just an idea', 'In progress', 'Stuck / Blocked', 'Near completion'].map(stg => (
                            <button
                                key={stg}
                                onClick={() => setFormData({...formData, stage: stg})}
                                className={`px-4 py-3 rounded-lg border text-left text-xs font-medium transition-all ${
                                    formData.stage === stg 
                                    ? 'bg-blue-900/20 border-blue-500 text-blue-100' 
                                    : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'
                                }`}
                            >
                                {stg}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Upload Context (Optional)</label>
                    <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 hover:border-white/40 transition-all cursor-pointer">
                        <UploadIcon className="w-6 h-6 mb-2" />
                        <span className="text-xs">Drop PDF proposal or Github link</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const Step3Format = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Select Consultation Format</h2>
            <div className="space-y-4">
                {[
                    { id: 'one-time', title: 'One-time Consultation', time: '45 mins', cost: '500 credits', desc: 'Best for specific questions or concept clarification.' },
                    { id: 'review', title: 'Project Review Session', time: '60 mins', cost: '650 credits', desc: 'Deep dive into your code, paper, or research proposal.' },
                    { id: 'long-term', title: 'Mentorship Track', time: '4 weeks', cost: '2000 credits', desc: 'Weekly syncs and async guidance for a specific goal.' },
                ].map(fmt => (
                    <button
                        key={fmt.id}
                        onClick={() => setFormData({...formData, format: fmt.id})}
                        className={`w-full p-5 rounded-xl border text-left transition-all flex justify-between items-center group ${
                            formData.format === fmt.id 
                            ? 'bg-white text-black border-white' 
                            : 'bg-[#111] border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                    >
                        <div>
                            <div className="font-bold text-base mb-1">{fmt.title}</div>
                            <div className={`text-xs ${formData.format === fmt.id ? 'text-gray-600' : 'text-gray-500'}`}>{fmt.desc}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-sm">{fmt.cost}</div>
                            <div className={`text-xs ${formData.format === fmt.id ? 'text-gray-600' : 'text-gray-500'}`}>{fmt.time}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const Step4Expectations = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Preparation & Expectations</h2>
            <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded-xl flex gap-3 mb-6">
                <AdjustIcon className="w-5 h-5 text-orange-500 shrink-0" />
                <p className="text-sm text-orange-200/80 leading-relaxed">
                    Stephen Note: {expert.name} values preparedness. Ensure your questions are specific to their field of {expert.tags[0]}.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-3 items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-white">I have reviewed {expert.name}'s profile</h4>
                        <p className="text-xs text-gray-500 mt-1">My request aligns with their research focus.</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-white">I am prepared to engage</h4>
                        <p className="text-xs text-gray-500 mt-1">I have specific materials or questions ready to discuss.</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-white">Respectful of time</h4>
                        <p className="text-xs text-gray-500 mt-1">I understand cancellations must be made 24h in advance.</p>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.acceptedExpectations ? 'bg-blue-600 border-blue-600' : 'border-gray-600 group-hover:border-gray-400'}`}>
                        {formData.acceptedExpectations && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.acceptedExpectations} 
                        onChange={(e) => setFormData({...formData, acceptedExpectations: e.target.checked})}
                    />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">I confirm I have reviewed the expectations.</span>
                </label>
            </div>
        </div>
    );

    const Step5Review = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-6">Review Request</h2>
            
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">To Mentor</h3>
                    <div className="flex items-center gap-3">
                        <img src={expert.image} className="w-8 h-8 rounded-full object-cover" alt={expert.name} />
                        <div>
                            <p className="text-sm font-bold text-white">{expert.name}</p>
                            <p className="text-xs text-gray-500">{expert.role}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Intent</h3>
                        <p className="text-sm text-white">{formData.goal}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Format</h3>
                        <p className="text-sm text-white capitalize">{formData.format.replace('-', ' ')}</p>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stephen AI Summary</h3>
                    <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg">
                        <p className="text-xs text-blue-200 leading-relaxed italic">
                            "Requesting {formData.format.replace('-', ' ')} regarding {formData.goal}. Student is at {formData.level} level, currently {formData.stage}. High relevance to your recent work in {expert.tags[0]}."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border dark:border-white/10 border-gray-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                            <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white leading-none mb-0.5">Request Consultation</h3>
                            <p className="text-xs text-gray-500">{expert.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-[#1a1a1a]">
                    <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <Step1Goal />}
                            {step === 2 && <Step2Context />}
                            {step === 3 && <Step3Format />}
                            {step === 4 && <Step4Expectations />}
                            {step === 5 && <Step5Review />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={handleBack} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}
                    
                    {step < totalSteps ? (
                        <button 
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !formData.goal) ||
                                (step === 3 && !formData.format) ||
                                (step === 4 && !formData.acceptedExpectations)
                            }
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Submit Academic Request
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- Mentor Profile Component ---

const MentorProfile: React.FC<{ expert: Expert, onClose: () => void, onRequest: () => void }> = ({ expert, onClose, onRequest }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    // Extended Mock Data for the Profile View
    const richData = {
        bio: `Dr. ${expert.name.split(' ').pop()} is a leading figure in ${expert.role.split(',')[1] || 'their field'}, currently serving at ${expert.institution}. With over a decade of experience bridging theoretical research and practical application, they have pioneered new methodologies in ${expert.tags[0]} and ${expert.tags[1]}. Their work has been cited by major tech labs including OpenAI and Google Brain. They are passionate about mentoring students who are ready to transition from academic concepts to high-impact research output.`,
        philosophy: "I believe in 'First Principles' thinking. I don't just help you fix your code or edit your paper; I help you deconstruct the problem so you can rebuild the solution yourself. My mentorship is rigorous, Socratic, and designed for those who want to publish tier-1 work.",
        bestFor: ["PhD candidates stuck in thesis definition", "Engineers transitioning to Research Scientist roles", "Startups needing technical validation"],
        notFor: ["Students looking for basic homework help", "Those seeking quick bug fixes without understanding"],
        researchAreas: ["Mechanistic Interpretability", "Reinforcement Learning from Human Feedback", "AI Safety Frameworks"],
        publications: [
            { title: "Causal Abstractions of Neural Networks", year: "2024", venue: "NeurIPS" },
            { title: "Scalable Oversight for Large Language Models", year: "2023", venue: "ICML" },
            { title: "Robustness in Multi-Agent Systems", year: "2022", venue: "JMLR" }
        ],
        mentorshipStyle: {
            structure: 75, // 0 = Exploratory, 100 = Structured
            handsOn: 40,   // 0 = Advisory, 100 = Hands-on
        },
        consultationOptions: [
            { title: "Academic Consultation", type: "One-time", duration: "45 min", price: "500 credits", desc: "Deep dive into a specific research problem or paper review." },
            { title: "Research Supervision", type: "4-12 Weeks", duration: "Recurring", price: "Application Only", desc: "Long-term guidance for thesis, publication, or major project." },
            { title: "Career Strategy Review", type: "Session", duration: "60 min", price: "600 credits", desc: "Portfolio review and mock interview for research roles." }
        ]
    };

    return (
        <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#050505] text-white overflow-y-auto custom-scrollbar"
        >
            <style>{`
                @keyframes shimmer-sweep {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                .group:hover .animate-sweep {
                    animation: shimmer-sweep 1.5s infinite linear;
                }
            `}</style>

            {/* Sticky Header Actions */}
            <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <button onClick={onClose} className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Experts
                </button>
                <div className="flex gap-3">
                    <button className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                        <ShareIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                        <BookmarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-20">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-10 py-12 items-start border-b border-white/5">
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#111]">
                            <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${expert.statusColor} bg-black/40`}>
                                    {expert.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onRequest}
                                className="group relative w-full py-4 bg-white text-black font-bold rounded-xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-[200%] group-hover:animate-sweep z-0" />
                                <span className="relative z-10 flex items-center">
                                    Request Consultation <ArrowUpIcon className="w-4 h-4 ml-2 rotate-90" />
                                </span>
                            </button>
                            <button className="w-full py-3.5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-colors">
                                View Academic CV
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 pt-2">
                        <div className="flex items-center gap-3 mb-4">
                            {expert.badges.map(b => (
                                <span key={b} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/20">
                                    <CheckCircleIcon className="w-3.5 h-3.5" /> {b}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif leading-tight">{expert.name}</h1>
                        <p className="text-xl text-gray-400 mb-6 font-light">{expert.role} at <span className="text-white font-medium">{expert.institution}</span></p>
                        
                        <div className="flex flex-wrap gap-2 mb-10">
                            {expert.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-6 p-6 bg-[#111] rounded-2xl border border-white/5">
                            <div>
                                <div className="text-2xl font-bold font-mono">{expert.stats.citations}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Citations</div>
                            </div>
                            <div className="border-l border-white/10 pl-6">
                                <div className="text-2xl font-bold font-mono">{expert.stats.projects}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Projects</div>
                            </div>
                            <div className="border-l border-white/10 pl-6">
                                <div className="text-2xl font-bold font-mono">{expert.stats.mentored}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Mentored</div>
                            </div>
                        </div>

                        {/* Stephen AI Insight Block */}
                        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-20"><SparkleIcon className="w-12 h-12 text-blue-400" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <SparkleIcon className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Stephen AI Insight</span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed italic">
                                    "Based on your recent interest in 'Transformer Architectures', {expert.name}'s work on LLM interpretability is a 94% match. Their mentorship style is rigorous, which aligns with your goal of publishing."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="sticky top-[73px] z-40 bg-[#050505]/95 backdrop-blur border-b border-white/5 mb-10 overflow-x-auto no-scrollbar">
                    <div className="flex space-x-8">
                        {['Overview', 'Research & Work', 'Mentorship Style', 'Consultation Options'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left/Center Content */}
                    <div className="lg:col-span-2 space-y-16">
                        
                        {/* Overview */}
                        <section id="Overview">
                            <h2 className="text-2xl font-bold mb-6 font-serif">About</h2>
                            <p className="text-gray-300 leading-relaxed mb-8 text-lg font-light">{richData.bio}</p>
                            
                            <h3 className="text-lg font-bold mb-4 text-white">Teaching Philosophy</h3>
                            <div className="p-6 bg-[#111] rounded-xl border-l-4 border-orange-500 mb-8">
                                <p className="text-gray-400 italic">"{richData.philosophy}"</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-4 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2" /> Best For</h4>
                                    <ul className="space-y-3">
                                        {richData.bestFor.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mr-3 mt-1.5"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-2" /> Not Ideal For</h4>
                                    <ul className="space-y-3">
                                        {richData.notFor.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-400 flex items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mr-3 mt-1.5"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Research */}
                        <section id="Research">
                            <h2 className="text-2xl font-bold mb-6 font-serif">Research & Contributions</h2>
                            
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Focus Areas</h3>
                                <div className="flex flex-wrap gap-3">
                                    {richData.researchAreas.map(area => (
                                        <div key={area} className="px-4 py-2 bg-[#111] border border-white/5 rounded-full text-sm text-gray-300">
                                            {area}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Key Publications</h3>
                            <div className="space-y-4">
                                {richData.publications.map((pub, i) => (
                                    <div key={i} className="flex items-start justify-between p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer group">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{pub.title}</h4>
                                            <p className="text-sm text-gray-500">{pub.venue} • {pub.year}</p>
                                        </div>
                                        <LinkIcon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right Sidebar (Mentorship & Options) */}
                    <div className="space-y-8">
                        {/* Mentorship Style */}
                        <div className="p-6 rounded-2xl bg-[#111] border border-white/10">
                            <h3 className="text-lg font-bold mb-6 font-serif">Mentorship Style</h3>
                            
                            <div className="space-y-6 mb-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span>Exploratory</span>
                                        <span>Structured</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-2 rounded-full relative" style={{ left: `${richData.mentorshipStyle.structure}%` }}></div>
                                        <div className="h-full bg-white/10 w-full absolute top-0 left-0"></div> 
                                        {/* Visual marker implementation simplified */}
                                        <div className="h-full bg-blue-500/50 absolute top-0 left-0" style={{ width: `${richData.mentorshipStyle.structure}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span>Advisory</span>
                                        <span>Hands-on</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                                        <div className="h-full bg-purple-500/50 absolute top-0 left-0" style={{ width: `${richData.mentorshipStyle.handsOn}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-500/20">
                                <p className="text-xs text-blue-300 font-medium text-center">"Expects students to come prepared with specific questions."</p>
                            </div>
                        </div>

                        {/* Consultation Tracks */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 font-serif">Consultation Tracks</h3>
                            <div className="space-y-4">
                                {richData.consultationOptions.map((opt, i) => (
                                    <div key={i} className="p-5 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-white/30 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{opt.type}</span>
                                            <span className="text-sm font-bold text-white">{opt.price}</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-white mb-2">{opt.title}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{opt.desc}</p>
                                        <button 
                                            onClick={onRequest}
                                            className="w-full py-2.5 rounded-lg border border-white/20 text-sm font-bold hover:bg-white hover:text-black transition-colors"
                                        >
                                            Request Track
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Expert Card (Updated with onClick) ---

const ExpertCard: React.FC<{ data: Expert, onProfileClick: () => void, onRequestClick: () => void }> = ({ data, onProfileClick, onRequestClick }) => {
    return (
        <div className="bg-[#050505] border border-white/10 rounded-[24px] p-6 flex flex-col h-full hover:border-white/20 transition-all group relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-colors">
                        <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight font-serif">{data.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{data.role}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                            <CheckCircleIcon className="w-3 h-3 text-green-500" />
                            <span>{data.institution}</span>
                        </div>
                    </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${data.statusColor}`}>
                    {data.status}
                </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
                {data.badges.map((badge, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#151515] border border-white/5 rounded-full text-[11px] font-bold text-gray-300">
                        {badge === "Verified Faculty" && <BookOpenIcon className="w-3 h-3 text-blue-400" />}
                        {badge === "Top Mentor" && <TrophyIcon className="w-3 h-3 text-yellow-500" />}
                        {badge}
                    </span>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 mb-6">
                <div className="text-center">
                    <div className="text-white font-bold text-sm">{data.stats.citations}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Citations</div>
                </div>
                <div className="text-center border-x border-white/5">
                    <div className="text-white font-bold text-sm">{data.stats.projects}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Projects</div>
                </div>
                <div className="text-center">
                    <div className="text-white font-bold text-sm">{data.stats.mentored}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Mentored</div>
                </div>
            </div>

            {/* Quote */}
            <div className="mb-6 flex-grow">
                <p className="text-sm text-gray-400 italic leading-relaxed">"{data.quote}"</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {data.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-[#111] text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 mt-auto">
                <div className="text-xs text-gray-500">
                    Credits: <span className="text-gray-300 font-bold">{data.credits}/hr</span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onProfileClick}
                        className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        Profile
                    </button>
                    <button 
                        onClick={onRequestClick}
                        className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                        Request <ArrowUpIcon className="w-3 h-3 ml-1 rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main View ---

const ConsultProfessorsView = () => {
    const [activeFilter, setActiveFilter] = useState("All Experts");
    const [selectedMentor, setSelectedMentor] = useState<Expert | null>(null);
    const [requestModalExpert, setRequestModalExpert] = useState<Expert | null>(null);

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden relative">
            {/* Top Navigation Bar */}
            <div className="shrink-0 px-8 pt-24 pb-6 border-b border-white/5 bg-black z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto w-full">
                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {filters.map((filter) => (
                            <button
                                key={filter.label}
                                onClick={() => setActiveFilter(filter.label)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                    activeFilter === filter.label 
                                    ? 'bg-white text-black' 
                                    : 'bg-[#111] text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Secondary Filters */}
                    <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                        <button className="flex items-center hover:text-white transition-colors">
                            Availability <ChevronDownIcon className="w-3 h-3 ml-1.5" />
                        </button>
                        <button className="flex items-center hover:text-white transition-colors">
                            Field <ChevronDownIcon className="w-3 h-3 ml-1.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {experts.map((expert) => (
                            <motion.div
                                key={expert.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                layout
                            >
                                <ExpertCard 
                                    data={expert} 
                                    onProfileClick={() => setSelectedMentor(expert)}
                                    onRequestClick={() => setRequestModalExpert(expert)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Full Screen Overlay for Profile */}
            <AnimatePresence>
                {selectedMentor && (
                    <MentorProfile 
                        expert={selectedMentor} 
                        onClose={() => setSelectedMentor(null)} 
                        onRequest={() => {
                            setRequestModalExpert(selectedMentor);
                            // Optional: Keep profile open behind, or close it?
                            // Closing it for cleaner focus on request modal.
                            // setSelectedMentor(null); 
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Request Consultation Modal */}
            <AnimatePresence>
                {requestModalExpert && (
                    <RequestConsultationModal 
                        expert={requestModalExpert} 
                        onClose={() => setRequestModalExpert(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ConsultProfessorsView;
