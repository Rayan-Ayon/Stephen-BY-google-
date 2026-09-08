import React from 'react';

interface VocabularyMockViewProps {
    userEmail?: string;
}

const VocabularyMockView: React.FC<VocabularyMockViewProps> = () => {
    return (
        <div className="h-[calc(100vh-32px)] bg-[#0B0C0E] flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Vocabulary Mock</h1>
                <p className="text-zinc-400 text-sm mb-8">Coming Soon</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Under development
                </div>
            </div>
        </div>
    );
};

export default VocabularyMockView;
