
import React from 'react';
import { XIcon } from '../icons';
import { FeedConfig } from './types';

const ContentDNA: React.FC<{ feedConfig: FeedConfig; onFeedConfigChange: (config: FeedConfig) => void }> = ({ feedConfig, onFeedConfigChange }) => {
    const updateSlider = (key: keyof FeedConfig, value: number) => {
        onFeedConfigChange({ ...feedConfig, [key]: value });
    };

    return (
        <div className="max-w-2xl mx-auto py-8 pt-16 px-4 w-full h-full dark:bg-black bg-white overflow-y-auto transition-colors duration-300 dark:text-white text-black custom-scrollbar">
            <h1 className="text-2xl font-bold mb-2">Content DNA</h1>
            <p className="text-gray-500 text-sm mb-8">Control what you see and how our algorithms understand you.</p>

            {/* Algorithm Confidence Score */}
            <div className="mb-8 p-6 rounded-2xl dark:bg-[#121212] bg-gray-50 border dark:border-gray-800 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Algorithm Accuracy</h3>
                    <span className="text-green-500 font-bold">{feedConfig.education}% Match</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${feedConfig.education}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Based on your last 30 days of activity. Education slider actively re-ranks course-tagged posts higher in your feed.</p>
            </div>

            {/* Topic Bubbles */}
            <div className="mb-8">
                <h3 className="font-bold mb-4">Active Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {['AI Research', 'Quantum Computing', 'Digital Art', 'UX Design', 'Space Exploration'].map(topic => (
                        <div key={topic} className="px-3 py-1.5 rounded-full border dark:border-gray-700 border-gray-300 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                            {topic}
                            <XIcon className="w-3 h-3 text-gray-500" />
                        </div>
                    ))}
                    <button className="px-3 py-1.5 rounded-full border border-dashed dark:border-gray-600 border-gray-400 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">+ Add Topic</button>
                </div>
            </div>

            {/* Sliders */}
            <div className="mb-8 space-y-6">
                <h3 className="font-bold">Feed Composition</h3>
                <p className="text-xs text-gray-500 -mt-4 mb-4">Adjusting Education/Entertainment re-orders your home feed and recommended study groups in real-time.</p>

                <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Discovery</span>
                        <span>Familiar</span>
                    </div>
                    <input type="range" className="w-full accent-blue-500" value={feedConfig.discovery} onChange={e => updateSlider('discovery', Number(e.target.value))} />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Video</span>
                        <span>Reading</span>
                    </div>
                    <input type="range" className="w-full accent-purple-500" value={feedConfig.video} onChange={e => updateSlider('video', Number(e.target.value))} />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Education</span>
                        <span>Entertainment</span>
                    </div>
                    <input type="range" className="w-full accent-orange-500" value={feedConfig.education} onChange={e => updateSlider('education', Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Education side boosts course-tagged posts and learning-focused group chats in your feed.</span>
                    </div>
                </div>
            </div>

            {/* Value Check */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-purple-900 text-white">
                <h3 className="font-bold text-lg mb-2">Real Value Meter</h3>
                <p className="text-sm opacity-80 mb-4">You've consumed 14 hours of high-value educational content this week.</p>
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">14h</div>
                        <div className="text-xs opacity-70">Learning</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">2h</div>
                        <div className="text-xs opacity-70">Entertainment</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentDNA;
