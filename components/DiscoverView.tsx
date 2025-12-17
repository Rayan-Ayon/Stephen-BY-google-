

import React from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, DotsHorizontalIcon, PlusIcon, XIcon, CloudyIcon, SunIcon, TrendingUpIcon, TrendingDownIcon } from './icons';

const DiscoverView = () => {
    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-neutral-100 dark:text-gray-300 text-neutral-800">
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-20">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold dark:text-white text-black" style={{ fontFamily: "'Lora', serif" }}>Discover</h1>
                        <div className="flex items-center space-x-1 dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-lg p-1">
                            <button className="px-3 py-1 text-sm rounded-md dark:bg-gray-700 bg-neutral-200 dark:text-white text-black font-medium">For You</button>
                            <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-neutral-100 transition-colors">Top</button>
                            <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-neutral-100 transition-colors">Topics</button>
                        </div>
                    </div>
                     <button className="flex items-center text-sm font-semibold dark:text-gray-300 text-neutral-700 dark:hover:text-white hover:text-black dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 px-4 py-2 rounded-lg transition-colors hover:bg-neutral-50">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Share
                    </button>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Main Article */}
                    <div className="lg:col-span-2 xl:col-span-2 dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-3xl font-bold dark:text-white text-black mb-3" style={{ fontFamily: "'Lora', serif" }}>AI deepfakes flood social media after Hurricane Melissa</h2>
                        <p className="text-xs text-gray-500 mb-4">Published 2 hours ago</p>
                        <div className="w-full h-80 rounded-lg overflow-hidden mb-4">
                            <img src="https://images.unsplash.com/photo-1561553543-e4c7b6809b5a?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hurricane" className="w-full h-full object-cover"/>
                        </div>
                        <p className="dark:text-gray-400 text-neutral-600 mb-4">Fake videos of sharks in pools and destroyed airports gained millions of views, undermining safety messages as the storm killed dozens.</p>
                        <div className="flex items-center justify-between text-gray-500">
                             <div className="text-sm">... 84 sources</div>
                             <DotsHorizontalIcon className="w-5 h-5"/>
                        </div>
                    </div>
                    {/* Other articles */}
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-5 shadow-sm">
                            <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                               <img src={`https://picsum.photos/seed/${i+10}/400/300`} alt="Article" className="w-full h-full object-cover"/>
                            </div>
                            <h3 className="text-lg font-bold dark:text-white text-black mb-2" style={{ fontFamily: "'Lora', serif" }}>Nvidia CEO dines with Samsung, Hyundai chiefs</h3>
                            <p className="text-xs text-gray-500 mb-3">Published {i+3} hours ago</p>
                            <div className="flex items-center justify-between text-gray-500">
                                <div className="text-sm">... {49 - i*5} sources</div>
                                <DotsHorizontalIcon className="w-5 h-5"/>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
            
            <aside className="w-96 border-l dark:border-gray-800 border-neutral-200 p-6 pt-20 overflow-y-auto hidden lg:block shrink-0 dark:bg-black bg-neutral-50">
                <div className="bg-gradient-to-br dark:from-teal-500/20 from-teal-500/10 dark:to-green-500/20 to-green-500/10 border dark:border-teal-500/30 border-teal-500/40 rounded-xl p-5 mb-6 relative shadow-sm">
                    <button className="absolute top-3 right-3 dark:text-gray-400 text-neutral-600 dark:hover:text-white hover:text-black"><XIcon className="w-4 h-4"/></button>
                    <h3 className="font-bold dark:text-white text-black mb-2">Make it yours</h3>
                    <p className="text-sm dark:text-gray-300 text-neutral-700 mb-4">Select topics and interests to customize your Discover experience</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['Tech & Science', 'Finance', 'Arts & Culture', 'Sports', 'Entertainment'].map(topic => (
                            <button key={topic} className="text-sm dark:bg-black/20 bg-white/60 dark:hover:bg-black/40 hover:bg-white border dark:border-white/20 border-black/10 rounded-full px-3 py-1 shadow-sm transition-colors">
                                {topic}
                            </button>
                        ))}
                    </div>
                    <button className="w-full bg-teal-400 text-black font-semibold py-2 rounded-lg hover:bg-teal-300 transition-colors">Save Interests</button>
                </div>

                <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 mb-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold dark:text-white text-black text-3xl">29°c</p>
                            <p className="dark:text-gray-400 text-neutral-500">Dhaka</p>
                        </div>
                        <div className="text-right">
                           <CloudyIcon className="w-10 h-10 text-gray-400 mb-1"/>
                           <p className="text-sm text-gray-400">Cloudy</p>
                           <p className="text-xs text-gray-500">H: 32° L: 26°</p>
                        </div>
                    </div>
                    <div className="border-t dark:border-gray-800 border-neutral-200 my-4"></div>
                    <div className="flex justify-between text-center text-sm">
                        {['Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, i) => (
                             <div key={day} className="flex flex-col items-center">
                                 <span className="dark:text-gray-400 text-neutral-500">{day}</span>
                                 { i % 2 === 0 ? <SunIcon className="w-6 h-6 my-1.5 text-yellow-400"/> : <CloudyIcon className="w-6 h-6 my-1.5 text-gray-400"/>}
                                 <span className="dark:text-white text-black font-medium">{32-i}°</span>
                             </div>
                        ))}
                    </div>
                </div>

                <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 mb-6 shadow-sm">
                    <h3 className="font-bold dark:text-white text-black mb-4">Market Outlook</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                            <p className="dark:text-gray-400 text-neutral-500">S&P 500</p>
                            <p className="text-red-400 flex items-center">-0.41% <TrendingDownIcon className="w-4 h-4 ml-1"/></p>
                            <p className="dark:text-white text-black font-semibold text-lg mt-1">6,865.55</p>
                        </div>
                         <div className="text-sm">
                            <p className="dark:text-gray-400 text-neutral-500">NASDAQ</p>
                            <p className="text-green-400 flex items-center">+0.79% <TrendingUpIcon className="w-4 h-4 ml-1"/></p>
                            <p className="dark:text-white text-black font-semibold text-lg mt-1">23,770.195</p>
                        </div>
                    </div>
                </div>

                 <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold dark:text-white text-black mb-4">Trending Companies</h3>
                    <div className="space-y-4">
                         {[{name: 'Apple Inc.', ticker: 'AAPL', price: '+0.23%', color: 'green'}, {name: 'Amazon.com, Inc.', ticker: 'AMZN', price: '-1.15%', color: 'red'}, {name: 'Microsoft Corporation', ticker: 'MSFT', price: '-2.45%', color: 'red'}].map(c => (
                            <div key={c.name} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-semibold dark:text-white text-black">{c.ticker}</p>
                                    <p className="text-gray-500 text-xs">{c.name}</p>
                                </div>
                                <div className={`font-medium ${c.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>{c.price}</div>
                            </div>
                        ))}
                    </div>
                 </div>

            </aside>
        </div>
    );
};

export default DiscoverView;
