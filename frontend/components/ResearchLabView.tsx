
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SearchIcon, AdjustIcon, ChevronLeftIcon, MicroscopeIcon, 
    FlaskIcon, BuildingLibraryIcon, MapPinIcon, CheckCircleIcon, 
    XIcon, ClipboardCheckIcon, FileTextIcon, UploadIcon 
} from './icons';

// --- Interfaces ---

interface Lab {
    id: string;
    name: string;
    university: string;
    field: string;
    location: string;
    status: 'Open' | 'Limited' | 'Closed';
    description: string;
    focusAreas: string[];
    accessTypes: string[];
    requirements: string[];
    logo: string;
}

interface Application {
    id: string;
    labName: string;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
    submittedDate: string;
}

// --- Mock Data ---

const MOCK_LABS: Lab[] = [
    {
        id: '1',
        name: 'Computer Science & AI Lab (CSAIL)',
        university: 'MIT',
        field: 'Artificial Intelligence',
        location: 'Cambridge, MA',
        status: 'Open',
        description: 'Pioneering research in AI, robotics, and systems. Join a world-class team working on the future of computing.',
        focusAreas: ['Robotics', 'Computer Vision', 'Natural Language Processing'],
        accessTypes: ['Internship', 'Project-Based'],
        requirements: ['Python Proficiency', 'Linear Algebra', 'Completed ML Course'],
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png'
    },
    {
        id: '2',
        name: 'Stanford AI Lab (SAIL)',
        university: 'Stanford University',
        field: 'Robotics & AI',
        location: 'Stanford, CA',
        status: 'Limited',
        description: 'Focusing on deep learning, computer vision, and cognitive science to build intelligent machines.',
        focusAreas: ['Deep Learning', 'Reinforcement Learning', 'Human-Computer Interaction'],
        accessTypes: ['Short-Visit', 'Internship'],
        requirements: ['Advanced Python', 'Published Paper (Preferred)', 'Strong Math Background'],
        logo: 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png'
    },
    {
        id: '3',
        name: 'Oxford Quantum Institute',
        university: 'University of Oxford',
        field: 'Physics',
        location: 'Oxford, UK',
        status: 'Open',
        description: 'Exploring the fundamental principles of quantum mechanics and their application in computing.',
        focusAreas: ['Quantum Computing', 'Quantum Cryptography', 'Particle Physics'],
        accessTypes: ['Project Collaboration'],
        requirements: ['Quantum Physics Course', 'Linear Algebra', 'Research Experience'],
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/University_of_Oxford_Logo.svg/1200px-University_of_Oxford_Logo.svg.png'
    }
];

const MOCK_APPLICATIONS: Application[] = [
    { id: 'app1', labName: 'CSAIL (MIT)', status: 'Pending', submittedDate: 'Oct 24, 2025' },
    { id: 'app2', labName: 'CERN Particle Lab', status: 'Rejected', submittedDate: 'Sep 10, 2025' },
];

// --- Views ---

// 1. Directory View
const DirectoryView: React.FC<{ onSelectLab: (lab: Lab) => void }> = ({ onSelectLab }) => {
    return (
        <div className="p-8 pt-24 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold dark:text-white text-black mb-8" style={{ fontFamily: "'Lora', serif" }}>Partner Research Labs</h1>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-10">
                <div className="relative flex-grow max-w-md">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search labs, fields, universities..." 
                        className="w-full pl-12 pr-4 py-3 rounded-xl border dark:border-white/10 border-neutral-200 dark:bg-[#1a1a1a] bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all dark:text-white"
                    />
                </div>
                <button className="flex items-center px-6 py-3 rounded-xl border dark:border-white/10 border-neutral-200 dark:bg-[#1a1a1a] bg-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors font-medium dark:text-gray-300">
                    <AdjustIcon className="w-5 h-5 mr-2" /> Filters
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_LABS.map(lab => (
                    <div 
                        key={lab.id} 
                        className="group dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer hover:shadow-lg"
                        onClick={() => onSelectLab(lab)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center border border-neutral-100">
                                <img src={lab.logo} alt={lab.university} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                lab.status === 'Open' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                lab.status === 'Limited' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                                {lab.status}
                            </span>
                        </div>
                        
                        <h3 className="text-xl font-bold dark:text-white text-black mb-2 group-hover:text-orange-500 transition-colors">{lab.name}</h3>
                        <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">{lab.university}</p>
                        
                        <div className="space-y-2 mb-6 flex-grow">
                            <div className="flex items-center text-xs dark:text-gray-500 text-gray-500">
                                <FlaskIcon className="w-4 h-4 mr-2" /> {lab.field}
                            </div>
                            <div className="flex items-center text-xs dark:text-gray-500 text-gray-500">
                                <MapPinIcon className="w-4 h-4 mr-2" /> {lab.location}
                            </div>
                        </div>

                        <div className="pt-4 border-t dark:border-white/5 border-neutral-100">
                            <span className="text-sm font-bold text-orange-500 flex items-center">
                                View Details <ChevronLeftIcon className="w-4 h-4 ml-1 rotate-180" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 2. Lab Detail View
const LabDetailView: React.FC<{ lab: Lab, onBack: () => void, onCheckEligibility: () => void }> = ({ lab, onBack, onCheckEligibility }) => {
    return (
        <div className="p-8 pt-24 max-w-5xl mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Directory
            </button>

            <div className="dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[32px] p-8 lg:p-12 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-10 border-b dark:border-white/10 border-neutral-100 pb-10">
                    <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center border border-neutral-200 shrink-0">
                        <img src={lab.logo} alt={lab.university} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-3xl lg:text-4xl font-bold dark:text-white text-black mb-3" style={{ fontFamily: "'Lora', serif" }}>{lab.name}</h1>
                        <div className="flex items-center space-x-4 text-sm dark:text-gray-400 text-gray-600 mb-6">
                            <span className="flex items-center"><BuildingLibraryIcon className="w-4 h-4 mr-2" /> {lab.university}</span>
                            <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2" /> {lab.location}</span>
                        </div>
                        <p className="text-lg dark:text-gray-300 text-gray-700 leading-relaxed max-w-3xl">{lab.description}</p>
                    </div>
                    <div className="shrink-0">
                         <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${
                                lab.status === 'Open' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                lab.status === 'Limited' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                                {lab.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-lg font-bold dark:text-white text-black mb-4 flex items-center">
                            <MicroscopeIcon className="w-5 h-5 mr-2 text-orange-500" /> Research Focus Areas
                        </h3>
                        <ul className="space-y-3 mb-8">
                            {lab.focusAreas.map(area => (
                                <li key={area} className="flex items-center text-sm dark:text-gray-300 text-gray-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3"></div>
                                    {area}
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-bold dark:text-white text-black mb-4 flex items-center">
                            <ClipboardCheckIcon className="w-5 h-5 mr-2 text-blue-500" /> Access Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {lab.accessTypes.map(type => (
                                <span key={type} className="px-3 py-1.5 rounded-lg dark:bg-white/5 bg-neutral-100 border dark:border-white/10 border-neutral-200 text-sm font-medium dark:text-gray-300">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="dark:bg-[#111] bg-neutral-50 rounded-2xl p-8 border dark:border-white/5 border-neutral-100">
                        <h3 className="text-lg font-bold dark:text-white text-black mb-6">Application Info</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Eligibility</span>
                                <p className="text-sm dark:text-gray-300 text-gray-700">Minimum Skill Level 5 • Portfolio Required</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Timeline</span>
                                <p className="text-sm dark:text-gray-300 text-gray-700">Applications close Nov 30, 2025</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Seat Availability</span>
                                <p className="text-sm dark:text-gray-300 text-gray-700">3 Seats remaining for Summer 2026</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onCheckEligibility}
                                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Check Eligibility
                            </button>
                            <button className="w-full py-3.5 border border-gray-300 dark:border-white/20 font-bold rounded-xl dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Eligibility View
const EligibilityView: React.FC<{ lab: Lab, onProceed: () => void, onBack: () => void }> = ({ lab, onProceed, onBack }) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6 pt-24">
            <div className="w-full max-w-2xl dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[32px] p-8 lg:p-12 shadow-2xl">
                <h2 className="text-3xl font-bold dark:text-white text-black mb-2 text-center" style={{ fontFamily: "'Lora', serif" }}>Eligibility Check</h2>
                <p className="text-center dark:text-gray-400 text-gray-600 mb-10">For {lab.name}</p>

                <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between p-4 rounded-xl dark:bg-green-500/10 bg-green-50 border border-green-500/20">
                        <span className="font-medium dark:text-white text-gray-800">Skill Level 5+ in {lab.field}</span>
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl dark:bg-green-500/10 bg-green-50 border border-green-500/20">
                        <span className="font-medium dark:text-white text-gray-800">Completed Core Courses</span>
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl dark:bg-red-500/10 bg-red-50 border border-red-500/20">
                        <span className="font-medium dark:text-white text-gray-800">Project Portfolio</span>
                        <div className="flex items-center text-red-500 text-sm font-bold">
                            <XIcon className="w-5 h-5 mr-2" /> Missing
                        </div>
                    </div>
                </div>

                <div className="mb-10 text-center">
                    <p className="text-sm text-gray-500 mb-2">Suggestion</p>
                    <p className="dark:text-gray-300 text-gray-700 font-medium">Please upload a project portfolio to your profile or attach one in the application.</p>
                </div>

                <div className="flex gap-4">
                    <button onClick={onBack} className="flex-1 py-3.5 border border-gray-300 dark:border-white/20 font-bold rounded-xl dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Return
                    </button>
                    <button onClick={onProceed} className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Proceed to Application
                    </button>
                </div>
            </div>
        </div>
    );
};

// 4. Application Form
const ApplicationFormView: React.FC<{ lab: Lab, onSubmit: () => void, onBack: () => void }> = ({ lab, onSubmit, onBack }) => {
    return (
        <div className="p-8 pt-24 max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back
            </button>

            <div className="dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-[32px] p-8 lg:p-12 shadow-xl">
                <h2 className="text-3xl font-bold dark:text-white text-black mb-8" style={{ fontFamily: "'Lora', serif" }}>Submit Application</h2>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Student Name</label>
                            <input type="text" value="AyonLogy" disabled className="w-full p-4 rounded-xl border dark:border-white/10 border-neutral-200 dark:bg-[#111] bg-gray-50 dark:text-gray-400 text-gray-600 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skill Points</label>
                            <input type="text" value="850 (Level 7)" disabled className="w-full p-4 rounded-xl border dark:border-white/10 border-neutral-200 dark:bg-[#111] bg-gray-50 dark:text-gray-400 text-gray-600 cursor-not-allowed" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Motivation Statement (Optional)</label>
                        <textarea placeholder="Why do you want to join this lab?" rows={5} className="w-full p-4 rounded-xl border dark:border-white/10 border-neutral-200 dark:bg-[#111] bg-white dark:text-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Sample / Portfolio</label>
                        <div className="border-2 border-dashed dark:border-white/10 border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer dark:bg-[#111] bg-gray-50">
                            <UploadIcon className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Click to upload PDF or ZIP</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button onClick={onSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20">
                            Submit Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. Dashboard / Status View
const StudentDashboardView: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => {
    return (
        <div className="p-8 pt-24 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold dark:text-white text-black" style={{ fontFamily: "'Lora', serif" }}>Research Dashboard</h1>
                <button onClick={onBrowse} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                    Browse Partner Labs
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Applications */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold dark:text-white text-black mb-6 flex items-center">
                        <ClipboardCheckIcon className="w-5 h-5 mr-2 text-blue-500" /> My Applications
                    </h2>
                    <div className="space-y-4">
                        {MOCK_APPLICATIONS.map(app => (
                            <div key={app.id} className="flex items-center justify-between p-6 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-2xl shadow-sm">
                                <div>
                                    <h3 className="font-bold dark:text-white text-black mb-1">{app.labName}</h3>
                                    <p className="text-xs text-gray-500">Submitted: {app.submittedDate}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        app.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div>
                    <h2 className="text-lg font-bold dark:text-white text-black mb-6 flex items-center">
                        <AdjustIcon className="w-5 h-5 mr-2 text-orange-500" /> Recommended For You
                    </h2>
                    <div className="space-y-4">
                        {MOCK_LABS.slice(0, 2).map(lab => (
                            <div key={lab.id} className="p-5 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 rounded-2xl">
                                <h3 className="font-bold dark:text-white text-black text-sm mb-1">{lab.name}</h3>
                                <p className="text-xs text-gray-500 mb-3">{lab.university}</p>
                                <button onClick={onBrowse} className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">View Details</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Container ---

const ResearchLabView: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'directory' | 'detail' | 'eligibility' | 'apply'>('dashboard');
    const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

    const handleSelectLab = (lab: Lab) => {
        setSelectedLab(lab);
        setView('detail');
    };

    const handleCheckEligibility = () => {
        setView('eligibility');
    };

    const handleProceedToApply = () => {
        setView('apply');
    };

    const handleSubmitApplication = () => {
        // Logic to submit would go here
        setView('dashboard');
    };

    return (
        <div className="flex-1 overflow-y-auto h-full dark:bg-black bg-neutral-50 transition-colors duration-300">
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-full"
                >
                    {view === 'dashboard' && <StudentDashboardView onBrowse={() => setView('directory')} />}
                    {view === 'directory' && <DirectoryView onSelectLab={handleSelectLab} />}
                    {view === 'detail' && selectedLab && <LabDetailView lab={selectedLab} onBack={() => setView('directory')} onCheckEligibility={handleCheckEligibility} />}
                    {view === 'eligibility' && selectedLab && <EligibilityView lab={selectedLab} onBack={() => setView('detail')} onProceed={handleProceedToApply} />}
                    {view === 'apply' && selectedLab && <ApplicationFormView lab={selectedLab} onBack={() => setView('detail')} onSubmit={handleSubmitApplication} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ResearchLabView;
