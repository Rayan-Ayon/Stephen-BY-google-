import React, { useState } from 'react';
import IELTSSpeakingExam from './enterprise/ielts/IELTSSpeakingExam';

interface SpeakUIRestoreProps {
    userEmail?: string;
}

const SpeakUIRestore: React.FC<SpeakUIRestoreProps> = ({ userEmail }) => {
    const [started, setStarted] = useState(false);

    if (!started) {
        return (
            <div className="h-[calc(100vh-32px)] bg-[#0B0C0E] flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Speak UI Restore</h1>
                    <p className="text-zinc-400 text-sm mb-8">Legacy orb/ball speaking interface</p>
                    <button
                        onClick={() => setStarted(true)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg shadow-purple-900/30"
                    >
                        Start
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-32px)] bg-[#F2F2F2] flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <IELTSSpeakingExam
                    candidateEmail={userEmail}
                    onActiveChange={() => {}}
                    exitPulse={false}
                />
            </div>
        </div>
    );
};

export default SpeakUIRestore;
