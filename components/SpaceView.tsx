
import React, { useState } from 'react';
import { 
    UploadIcon, LinkIcon, ClipboardIcon, MicIcon, ArrowUpIcon, 
    PlusIcon, FileTextIcon, SparkleIcon, PlusSquareIcon
} from './icons';

interface SpaceViewProps {
    space: { id: string; title: string };
}

const ActionCard = ({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) => (
    <button className="flex flex-col items-start p-4 bg-[#111] border border-gray-800 rounded-2xl hover:bg-[#161616] transition-colors text-left group w-full h-28 justify-between">
        <div className="text-gray-400 group-hover:text-white transition-colors">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
        </div>
        <div>
            <div className="font-semibold text-gray-200 group-hover:text-white text-sm mb-0.5">{label}</div>
            <div className="text-xs text-gray-500">{sub}</div>
        </div>
    </button>
);

const SpaceView: React.FC<SpaceViewProps> = ({ space }) => {
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    return (
        <div className="flex-1 h-full bg-[#0b0b0b] text-white p-8 lg:p-12 flex flex-col overflow-y-auto">
            {/* Header */}
            <div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4 group/header relative"
                onMouseEnter={() => setIsHeaderHovered(true)}
                onMouseLeave={() => setIsHeaderHovered(false)}
            >
                <div className="relative">
                    {/* Hover buttons - Fade in */}
                    <div className={`absolute -top-8 left-0 flex items-center space-x-4 transition-opacity duration-200 ${isHeaderHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button className="flex items-center space-x-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                            <PlusSquareIcon className="w-3.5 h-3.5" />
                            <span>Add icon</span>
                        </button>
                        <button className="flex items-center space-x-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                            <PlusSquareIcon className="w-3.5 h-3.5" />
                            <span>Add cover</span>
                        </button>
                    </div>

                    <h1 className="text-3xl font-medium mb-2 text-white font-sans">{space.title}</h1>
                    <p className="text-gray-500 text-sm">No description</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                        <SparkleIcon className="w-4 h-4 text-purple-400" />
                        Learn Tabs
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                        <FileTextIcon className="w-4 h-4" />
                        Create Exam
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#dadada] text-black rounded-lg text-sm font-bold hover:bg-white transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        Add Content
                    </button>
                </div>
            </div>

            {/* Center Content - Wrapped in Outer Box */}
            <div className="flex-1 flex flex-col items-center justify-center w-full -mt-10">
                <div className="w-full max-w-4xl border border-gray-800 rounded-[32px] p-8 md:p-12 bg-[#0a0a0a]">
                    <h2 className="text-4xl mb-12 font-medium text-center" style={{ fontFamily: "'Lora', serif" }}>Let's learn, Fatema</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                        <ActionCard icon={<UploadIcon />} label="Upload" sub="File, audio, video" />
                        <ActionCard icon={<LinkIcon />} label="Link" sub="YouTube, Website" />
                        <ActionCard icon={<ClipboardIcon />} label="Paste" sub="Copied Text" />
                        <ActionCard icon={<MicIcon />} label="Record" sub="Record Lecture" />
                    </div>

                    <div className="w-full relative group">
                        <input 
                            type="text" 
                            placeholder="Learn anything" 
                            className="w-full bg-[#111] border border-gray-800 rounded-2xl py-4 px-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all" 
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#222] rounded-full text-gray-400 hover:bg-[#333] hover:text-white transition-colors">
                            <ArrowUpIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceView;
