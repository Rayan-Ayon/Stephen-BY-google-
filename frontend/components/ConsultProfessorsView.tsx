
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SearchIcon, CheckCircleIcon, StarIcon, LocationTrackerIcon, 
    ChevronDownIcon, TrophyIcon, GlobeIcon, AdjustIcon, UsersIcon,
    ArrowUpIcon, BookOpenIcon, FlaskIcon, ChevronLeftIcon, ShareIcon,
    BookmarkIcon, FileTextIcon, SparkleIcon, ClockIcon, LinkIcon,
    ShieldCheckIcon, CheckIcon, UploadIcon, XIcon, PlusIcon,
    LightningIcon, BuildingLibraryIcon, CrownIcon, RefreshIcon
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
    type: 'professor' | 'researcher' | 'industry' | 'stephian' | 'university_peer';
    stats: {
        citations?: string;
        projects?: string;
        mentored?: string;
        peerRating?: string;
        studentsHelped?: string;
        coreSystems?: string;
        publications?: string;
    };
    activeRequirement?: string;
    major?: string;
    year?: string;
    quote: string;
    tags: string[];
    credits: string;
    image: string;
}

// --- Mock Data ---
const initialExperts: Expert[] = [
    {
        id: 1,
        name: "Dr. Elena Rostova",
        role: "Senior Researcher, AI Alignment",
        institution: "DeepMind / Cambridge",
        status: "LIMITED",
        statusColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        badges: ["Verified Faculty", "Top Mentor"],
        type: 'researcher',
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
        type: 'professor',
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
        type: 'industry',
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
        type: 'professor',
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
        type: 'researcher',
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
        type: 'industry',
        stats: { citations: "1.5k", projects: "30", mentored: "90" },
        quote: "Automation is the future. Let's build systems that work for humanity.",
        tags: ["Robotics", "Control Systems", "Mechatronics"],
        credits: "400",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Fahim Ahmed",
        role: "Stephian - Level 5 Python Advanced",
        institution: "BUET",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Top Tutor"],
        type: 'stephian',
        stats: { peerRating: "98%", studentsHelped: "14" },
        activeRequirement: "Level 4 Python Course Peer Teaching Task",
        quote: "I've mentored 14 peers through advanced Python — let's debug and build together.",
        tags: ["Python", "Debugging", "OOP", "Algorithms"],
        credits: "30",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Jessica Woo",
        role: "Undergraduate, Computer Science & AI",
        institution: "Stanford University",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Dean's List"],
        type: 'university_peer',
        major: "Symbolic Systems",
        year: "Undergraduate",
        stats: {},
        quote: "I'm passionate about the intersection of language, logic, and machine learning.",
        tags: ["NLP", "Cognitive Science", "Python", "Research Methods"],
        credits: "75",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 9,
        name: "Aris Vance",
        role: "Undergraduate, Aerospace & Robotics",
        institution: "MIT",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Research Fellow"],
        type: 'university_peer',
        major: "AeroAstro",
        year: "Undergraduate",
        stats: {},
        quote: "Building drones and rovers taught me that robust systems start with clean code.",
        tags: ["Robotics", "Control Theory", "Embedded Systems", "MATLAB"],
        credits: "80",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 10,
        name: "Tanvir Rahman",
        role: "Stephian - Level 4 Full Stack",
        institution: "Stephen AIU",
        status: "ACTIVE",
        statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
        badges: ["Code Reviewer"],
        type: 'stephian',
        stats: { peerRating: "95%", studentsHelped: "8" },
        activeRequirement: "Next.js Architecture Validation Task",
        quote: "Full-stack clarity comes from teaching — I've helped 8 peers ship production code.",
        tags: ["Next.js", "TypeScript", "Prisma", "Tailwind"],
        credits: "20",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 11,
        name: "Dr. Marcus Vance",
        role: "Principal Architect, Alignment",
        institution: "OpenAI",
        status: "WAITLIST",
        statusColor: "text-gray-400 border-gray-600 bg-gray-800",
        badges: ["Industry Expert", "Core Contributor"],
        type: 'industry',
        stats: { coreSystems: "40+" },
        quote: "Reliability is not a feature — it is the foundation of deployable AI systems.",
        tags: ["System Design", "Alignment Research", "LLM Evaluation", "Infrastructure"],
        credits: "700",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 12,
        name: "Liam Gallagher",
        role: "Mechanistic Interpretability Researcher",
        institution: "ARC",
        status: "LIMITED",
        statusColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        badges: ["Rising Researcher"],
        type: 'researcher',
        stats: { publications: "15+" },
        quote: "If we can't inspect it, we can't align it. Excavating circuits one ablation at a time.",
        tags: ["Mechanistic Interpretability", "Transformer Circuits", "Sparse Autoencoders"],
        credits: "350",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&auto=format&fit=crop"
    }
];

const filters = [
    { label: "All Experts", icon: null },
    { label: "Professors", icon: <BookOpenIcon className="w-4 h-4" /> },
    { label: "Researchers", icon: <FlaskIcon className="w-4 h-4" /> },
    { label: "Industry Leaders", icon: <TrophyIcon className="w-4 h-4" /> },
    { label: "Stephians", icon: <LightningIcon className="w-4 h-4" /> },
    { label: "University Peers", icon: <BuildingLibraryIcon className="w-4 h-4" /> }
];

const filterTypeMap: Record<string, string | undefined> = {
    'Professors': 'professor',
    'Researchers': 'researcher',
    'Industry Leaders': 'industry',
    'Stephians': 'stephian',
    'University Peers': 'university_peer',
};

const defaultOnboardingData = {
    tier: '' as Expert['type'] | '',
    name: '',
    institution: '',
    role: '',
    completedLevel: '',
    activeCourseCode: '',
    teachingMandate: '',
    major: '',
    year: '',
    jobTitle: '',
    company: '',
    estimatedCitations: '',
    targetCredits: '50',
    profileLink: '',
    verificationLogs: [] as string[],
};

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

    const richData = (() => {
        if (expert.type === 'stephian') {
            return {
                bio: `${expert.name} is a ${expert.role} at ${expert.institution} with a proven peer mentorship track record. Having helped ${expert.stats.studentsHelped} fellow students with a ${expert.stats.peerRating} satisfaction rate, they specialize in breaking down complex programming concepts into digestible, actionable steps.`,
                philosophy: "Teaching is the ultimate test of understanding. I guide you through the reasoning so you can solve similar problems independently.",
                bestFor: ["Students stuck on course assignments or projects", "Peers preparing for technical interviews", "Beginners needing 1:1 code walkthroughs"],
                notFor: ["Students looking for someone to do their homework", "Long-term research supervision requests"],
                researchAreas: [expert.tags[0], expert.tags[1] || "Peer Learning", "Code Review"],
                publications: [
                    { title: `Peer Teaching Methodology in ${expert.tags[0]}`, year: "2025", venue: "Stephen AIU Journal" }
                ],
                mentorshipStyle: { structure: 60, handsOn: 80 },
                consultationOptions: [
                    { title: "1:1 Code Debugging Jam", type: "Session", duration: "30 min", price: "25 credits", desc: "Pair-debug your current assignment or project in real-time." },
                    { title: "Peer Assignment Review", type: "Review", duration: "2-3 days", price: "Earns Review Points", desc: "Asynchronous code/assignment review with structured feedback rubric." }
                ]
            };
        }
        if (expert.type === 'university_peer') {
            return {
                bio: `${expert.name} is a ${expert.year} ${expert.major} major at ${expert.institution} with deep hands-on experience in ${expert.tags[0]}. They bring fresh perspective and recent academic rigor to every session.`,
                philosophy: "Learning by building — theory matters, but real understanding comes from implementing, breaking, and fixing things yourself.",
                bestFor: ["Fellow undergraduates needing course guidance", "Students exploring research opportunities", "Project collaboration and code reviews"],
                notFor: ["PhD-level thesis supervision", "Industry career strategy for senior roles"],
                researchAreas: [expert.tags[0], expert.tags[1] || "Undergraduate Research", "Academic Projects"],
                publications: [
                    { title: `Undergraduate Research in ${expert.tags[0]}: A Practical Guide`, year: "2025", venue: "University Research Symposium" }
                ],
                mentorshipStyle: { structure: 40, handsOn: 85 },
                consultationOptions: [
                    { title: "Undergrad Major Advisory", type: "One-time", duration: "45 min", price: `${expert.credits} credits`, desc: "Guidance on course selection, internship strategy, and research lab matching." },
                    { title: "Project Code Review", type: "Session", duration: "60 min", price: `${expert.credits} credits`, desc: "Deep-dive code review with suggestions for optimization and best practices." }
                ]
            };
        }
        return {
            bio: `${expert.name} is a leading figure in ${expert.role.split(',')[1] || 'their field'}, currently serving at ${expert.institution}. With deep expertise in ${expert.tags[0]} and ${expert.tags[1]}, ${expert.name.split(' ')[0]} has made significant contributions to ${expert.type === 'industry' ? 'production systems used by millions.' : 'academic discourse and future technologies.'}`,
            philosophy: "I believe in 'First Principles' thinking. I don't just help you fix your code; I help you deconstruct the problem so you can rebuild the solution yourself.",
            bestFor: expert.type === 'industry'
                ? ["Engineers transitioning to senior roles", "Startups needing technical validation", "System design interview prep"]
                : ["PhD candidates stuck in thesis definition", "Engineers transitioning to Research Scientist roles", "Startups needing technical validation"],
            notFor: ["Students looking for basic homework help", "Those seeking quick bug fixes without understanding"],
            researchAreas: expert.tags.slice(0, 3),
            publications: [
                { title: `Advances in ${expert.tags[0]}`, year: "2024", venue: expert.type === 'industry' ? "Industry Report" : "Top Tier Conference" },
                { title: `${expert.tags[1] || expert.tags[0]} for Modern Systems`, year: "2023", venue: expert.type === 'industry' ? "Engineering Blog" : "Peer Reviewed Journal" },
                { title: `Scalable ${expert.tags[2] || expert.tags[0]}`, year: "2022", venue: "Leading Publication" }
            ],
            mentorshipStyle: { structure: 75, handsOn: 40 },
            consultationOptions: [
                { title: "Academic Consultation", type: "One-time", duration: "45 min", price: `${expert.credits} credits`, desc: "Deep dive into a specific research problem or paper review." },
                { title: "Research Supervision", type: "4-12 Weeks", duration: "Recurring", price: "Application Only", desc: "Long-term guidance for thesis, publication, or major project." },
                { title: "Career Strategy Review", type: "Session", duration: "60 min", price: `${String(Number(expert.credits) + 100)} credits`, desc: "Portfolio review and mock interview for research roles." }
            ]
        };
    })();

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

                        {expert.type === 'stephian' ? (
                            <div className="grid grid-cols-2 gap-6 p-6 bg-[#111] rounded-2xl border border-white/5">
                                <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-orange-400">{expert.stats.peerRating}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Peer Rating</div>
                                </div>
                                <div className="text-center border-l border-white/10 pl-6">
                                    <div className="text-2xl font-bold font-mono text-orange-400">{expert.stats.studentsHelped}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Students Helped</div>
                                </div>
                            </div>
                        ) : expert.type === 'university_peer' ? (
                            <div className="grid grid-cols-2 gap-6 p-6 bg-[#111] rounded-2xl border border-white/5">
                                <div className="text-center">
                                    <div className="text-lg font-bold font-mono text-blue-400">{expert.major}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Major</div>
                                </div>
                                <div className="text-center border-l border-white/10 pl-6">
                                    <div className="text-lg font-bold font-mono text-blue-400">{expert.year}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Year</div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-6 p-6 bg-[#111] rounded-2xl border border-white/5">
                                <div>
                                    <div className="text-2xl font-bold font-mono">{expert.stats.citations || expert.stats.coreSystems || expert.stats.publications || '—'}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                                        {expert.stats.coreSystems ? 'Core Systems' : expert.stats.publications ? 'Publications' : 'Citations'}
                                    </div>
                                </div>
                                <div className="border-l border-white/10 pl-6">
                                    <div className="text-2xl font-bold font-mono">{expert.stats.projects || '—'}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Projects</div>
                                </div>
                                <div className="border-l border-white/10 pl-6">
                                    <div className="text-2xl font-bold font-mono">{expert.stats.mentored || '—'}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Mentored</div>
                                </div>
                            </div>
                        )}

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
                {data.type === 'stephian' && data.activeRequirement && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-900/20 border border-orange-500/30 rounded-full text-[11px] font-bold text-orange-400">
                        <LightningIcon className="w-3 h-3 text-orange-400" />
                        {data.activeRequirement}
                    </span>
                )}
                {data.type === 'university_peer' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-full text-[11px] font-bold text-blue-400">
                        <BuildingLibraryIcon className="w-3 h-3 text-blue-400" />
                        {data.institution} &middot; {data.major} &middot; {data.year}
                    </span>
                )}
                {data.badges.map((badge, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#151515] border border-white/5 rounded-full text-[11px] font-bold text-gray-300">
                        {badge === "Verified Faculty" && <BookOpenIcon className="w-3 h-3 text-blue-400" />}
                        {badge === "Top Mentor" && <TrophyIcon className="w-3 h-3 text-yellow-500" />}
                        {badge}
                    </span>
                ))}
            </div>

            {/* Stats */}
            {data.type === 'stephian' ? (
                <div className="grid grid-cols-2 gap-2 py-4 border-y border-white/5 mb-6">
                    <div className="text-center">
                        <div className="text-white font-bold text-sm">{data.stats.peerRating}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Peer Rating</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-white font-bold text-sm">{data.stats.studentsHelped}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Helped</div>
                    </div>
                </div>
            ) : data.type === 'university_peer' ? (
                <div className="grid grid-cols-2 gap-2 py-4 border-y border-white/5 mb-6">
                    <div className="text-center">
                        <div className="text-white font-bold text-sm">{data.major}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Major</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-white font-bold text-sm">{data.year}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Year</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 mb-6">
                    <div className="text-center">
                        <div className="text-white font-bold text-sm">{data.stats.citations || data.stats.coreSystems || data.stats.publications || '—'}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">
                            {data.stats.coreSystems ? 'Systems' : data.stats.publications ? 'Publications' : 'Citations'}
                        </div>
                    </div>
                    <div className="text-center border-x border-white/5">
                        <div className="text-white font-bold text-sm">{data.stats.projects || (data.stats.coreSystems ? data.stats.coreSystems : '—')}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Projects</div>
                    </div>
                    <div className="text-center">
                        <div className="text-white font-bold text-sm">{data.stats.mentored || '—'}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Mentored</div>
                    </div>
                </div>
            )}

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

// --- Teacher Onboarding Modal ---

const TeacherOnboardingModal: React.FC<{
    step: number;
    data: typeof defaultOnboardingData;
    isProcessing: boolean;
    onSelectTier: (tier: Expert['type']) => void;
    onFieldChange: (field: string, value: string) => void;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
    onClose: () => void;
}> = ({ step, data, isProcessing, onSelectTier, onFieldChange, onNext, onBack, onSubmit, onClose }) => {
    const canProceedStep1 = data.tier !== '';
    const canProceedStep2 = data.tier === 'stephian'
        ? !!(data.name && data.completedLevel && data.activeCourseCode && data.teachingMandate)
        : data.tier === 'university_peer'
        ? !!(data.name && data.institution && data.major && data.year)
        : data.tier === 'professor' || data.tier === 'researcher' || data.tier === 'industry'
        ? !!(data.name && data.jobTitle && data.company)
        : false;

    const Step1TierSelection = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Choose Your Tier</h2>
            <p className="text-gray-500 text-sm mb-6">Select the role that best describes your teaching capacity.</p>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { tier: 'stephian' as Expert['type'], icon: <LightningIcon className="w-6 h-6" />, label: "Stephian (Peer Mentor)", desc: "Current students looking to teach peers within the Stephen ecosystem.", color: "border-orange-500/30 bg-orange-500/10 text-orange-400" },
                    { tier: 'university_peer' as Expert['type'], icon: <BuildingLibraryIcon className="w-6 h-6" />, label: "University Peer (Elite Undergrad/Grad)", desc: "Elite undergrads and grad students from partner universities.", color: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
                    { tier: 'professor' as Expert['type'], icon: <CrownIcon className="w-6 h-6" />, label: "Professor / Researcher / Industry Leader", desc: "Faculty, researchers, and corporate experts.", color: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
                ].map(option => (
                    <button
                        key={option.tier}
                        onClick={() => onSelectTier(option.tier)}
                        className={`p-5 rounded-xl border text-left transition-all flex items-start gap-4 ${
                            data.tier === option.tier
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-[#111] border-white/10 hover:border-white/30 text-gray-400'
                        }`}
                    >
                        <div className={`p-3 rounded-lg ${option.color}`}>{option.icon}</div>
                        <div>
                            <div className="font-bold text-sm mb-1">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const Step2StephianForm = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Stephian Application</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Full Name</label>
                    <input type="text" value={data.name} onChange={e => onFieldChange('name', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 text-white" placeholder="e.g., Your Name" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Current Completed Level</label>
                    <div className="flex flex-wrap gap-2">
                        {["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"].map(lvl => (
                            <button key={lvl} onClick={() => onFieldChange('completedLevel', lvl)} className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${data.completedLevel === lvl ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}>{lvl}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Active Course Code</label>
                    <input type="text" value={data.activeCourseCode} onChange={e => onFieldChange('activeCourseCode', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 text-white" placeholder="e.g., CS101" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Teaching Mandate Requirement</label>
                    <div className="flex flex-wrap gap-2">
                        {["Level 4 Python Peer Help", "Level 3 React Tutoring", "Level 2 Data Structures", "Level 5 Algorithms Mentorship"].map(m => (
                            <button key={m} onClick={() => onFieldChange('teachingMandate', m)} className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${data.teachingMandate === m ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}>{m}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const Step2UniversityForm = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">University Peer Application</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Full Name</label>
                    <input type="text" value={data.name} onChange={e => onFieldChange('name', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="e.g., Your Name" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Enrolled University</label>
                    <input type="text" value={data.institution} onChange={e => onFieldChange('institution', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="e.g., Stanford University" />
                    <p className="text-xs text-blue-400 mt-1 flex items-center gap-1"><SparkleIcon className="w-3 h-3" /> Tip: Use your .edu email for faster verification.</p>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Major</label>
                    <input type="text" value={data.major} onChange={e => onFieldChange('major', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="e.g., Symbolic Systems" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Year of Study</label>
                    <div className="flex flex-wrap gap-2">
                        {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(y => (
                            <button key={y} onClick={() => onFieldChange('year', y)} className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${data.year === y ? 'bg-blue-500 text-black border-blue-500' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}>{y}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const Step2ProfessionalForm = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Professional Application</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Full Name</label>
                    <input type="text" value={data.name} onChange={e => onFieldChange('name', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="e.g., Dr. Your Name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Current Job Title / Tenure</label>
                        <input type="text" value={data.jobTitle} onChange={e => onFieldChange('jobTitle', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="e.g., Department Head" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Institution / Company</label>
                        <input type="text" value={data.company} onChange={e => onFieldChange('company', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="e.g., Caltech" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Estimated Citation Count / Core Projects Built</label>
                    <input type="text" value={data.estimatedCitations} onChange={e => onFieldChange('estimatedCitations', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="e.g., 12k citations or 40+ systems" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Target Credit Cost per Hour</label>
                        <input type="number" value={data.targetCredits} onChange={e => onFieldChange('targetCredits', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="e.g., 450" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Google Scholar / LinkedIn URL</label>
                        <input type="url" value={data.profileLink} onChange={e => onFieldChange('profileLink', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="https://" />
                    </div>
                </div>
            </div>
        </div>
    );

    const Step3Processing = () => (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshIcon className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xl font-bold font-serif mb-2">Verifying Your Profile</h3>
                <p className="text-sm text-gray-500">Please wait while we process your application...</p>
            </div>
            <div className="w-full max-w-md space-y-3">
                {data.verificationLogs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/10 border border-emerald-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-300 font-mono">{log}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#0a0a0a] border dark:border-white/10 border-gray-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-lg font-bold text-white font-serif leading-none mb-0.5">
                            {isProcessing ? "Processing Application" : "Be a Teacher"}
                        </h3>
                        <p className="text-xs text-gray-500">Join our expert marketplace</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                {!isProcessing && (
                    <div className="w-full h-1 bg-[#1a1a1a]">
                        <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${(step / 2) * 100}%` }} />
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Step3Processing />
                            </motion.div>
                        ) : step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <Step1TierSelection />
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                {data.tier === 'stephian' ? <Step2StephianForm /> : data.tier === 'university_peer' ? <Step2UniversityForm /> : <Step2ProfessionalForm />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {!isProcessing && (
                    <div className="p-6 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={onBack} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">Back</button>
                        ) : (
                            <div></div>
                        )}
                        {step < 2 ? (
                            <button onClick={onNext} disabled={!canProceedStep1} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        ) : (
                            <button onClick={onSubmit} disabled={!canProceedStep2} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20">Submit Application</button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- Main View ---

const ConsultProfessorsView = () => {
    const [activeFilter, setActiveFilter] = useState("All Experts");
    const [selectedMentor, setSelectedMentor] = useState<Expert | null>(null);
    const [requestModalExpert, setRequestModalExpert] = useState<Expert | null>(null);
    const [experts, setExperts] = useState<Expert[]>(initialExperts);
    const [isClientOnboarding, setIsClientOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState({...defaultOnboardingData});
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredExperts = useMemo(() => {
        if (activeFilter === 'All Experts') return experts;
        const matchType = filterTypeMap[activeFilter];
        return matchType ? experts.filter(e => e.type === matchType) : experts;
    }, [activeFilter, experts]);

    const handleSelectTier = (tier: Expert['type']) => {
        setOnboardingData(prev => ({ ...prev, tier }));
    };

    const handleOnboardingFieldChange = (field: string, value: string) => {
        setOnboardingData(prev => ({ ...prev, [field]: value }));
    };

    const handleOnboardingNext = () => setOnboardingStep(2);
    const handleOnboardingBack = () => setOnboardingStep(1);

    const handleSubmitApplication = () => {
        setIsProcessing(true);
        setOnboardingStep(3);

        const logs = [
            "Analyzing academic credentials...",
            "Validating course requirements on-chain...",
            "Indexing profile to directory matrix..."
        ];

        setTimeout(() => {
            setOnboardingData(prev => ({ ...prev, verificationLogs: [logs[0]] }));
        }, 100);

        setTimeout(() => {
            setOnboardingData(prev => ({ ...prev, verificationLogs: [...prev.verificationLogs, logs[1]] }));
        }, 900);

        setTimeout(() => {
            setOnboardingData(prev => ({ ...prev, verificationLogs: [...prev.verificationLogs, logs[2]] }));
        }, 1700);

        setTimeout(() => {
            const tier = onboardingData.tier;
            const name = onboardingData.name;

            const newExpert: Expert = {
                id: Date.now(),
                name,
                role: tier === 'stephian'
                    ? `Stephian - ${onboardingData.completedLevel}`
                    : tier === 'university_peer'
                    ? `Undergraduate, ${onboardingData.major}`
                    : onboardingData.jobTitle,
                institution: tier === 'stephian' ? 'Stephen AIU' : tier === 'university_peer' ? onboardingData.institution : onboardingData.company,
                status: "ACTIVE",
                statusColor: "text-green-400 border-green-500/30 bg-green-500/10",
                badges: ["New Teacher"],
                type: tier as Expert['type'],
                stats: tier === 'stephian' ? { peerRating: "100%", studentsHelped: "0" }
                    : tier === 'professor' || tier === 'researcher' ? { citations: onboardingData.estimatedCitations || "0", projects: "0", mentored: "0" }
                    : tier === 'industry' ? { coreSystems: onboardingData.estimatedCitations || "0" }
                    : {},
                ...(tier === 'stephian' ? { activeRequirement: onboardingData.teachingMandate } : {}),
                ...(tier === 'university_peer' ? { major: onboardingData.major, year: onboardingData.year } : {}),
                quote: "I'm excited to help fellow learners!",
                tags: ["Teaching"],
                credits: onboardingData.targetCredits || "50",
                image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=200&auto=format&fit=crop"
            };

            setExperts(prev => [newExpert, ...prev]);

            const filterEntry = Object.entries(filterTypeMap).find(([, v]) => v === tier);
            if (filterEntry) setActiveFilter(filterEntry[0]);

            setIsClientOnboarding(false);
            setIsProcessing(false);
            setOnboardingStep(1);
            setOnboardingData({...defaultOnboardingData});
        }, 2600);
    };

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

                    {/* Secondary Filters + Be a Teacher */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                            <button className="flex items-center hover:text-white transition-colors">
                                Availability <ChevronDownIcon className="w-3 h-3 ml-1.5" />
                            </button>
                            <button className="flex items-center hover:text-white transition-colors">
                                Field <ChevronDownIcon className="w-3 h-3 ml-1.5" />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsClientOnboarding(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 hover:border-emerald-400 transition-all whitespace-nowrap"
                        >
                            <PlusIcon className="w-4 h-4" /> Be a Teacher
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredExperts.map((expert) => (
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

            {/* Teacher Onboarding Modal */}
            <AnimatePresence>
                {isClientOnboarding && (
                    <TeacherOnboardingModal
                        step={onboardingStep}
                        data={onboardingData}
                        isProcessing={isProcessing}
                        onSelectTier={handleSelectTier}
                        onFieldChange={handleOnboardingFieldChange}
                        onNext={handleOnboardingNext}
                        onBack={handleOnboardingBack}
                        onSubmit={handleSubmitApplication}
                        onClose={() => {
                            setIsClientOnboarding(false);
                            setIsProcessing(false);
                            setOnboardingStep(1);
                            setOnboardingData({...defaultOnboardingData});
                        }}
                    />
                )}
            </AnimatePresence>

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
