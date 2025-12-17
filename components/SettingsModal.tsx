
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    XIcon, UserIcon, PaletteIcon, CreditCardIcon, UsersIcon, DatabaseIcon, 
    PencilIcon, FireIcon, FileTextIcon, ChevronRightIcon, ChevronDownIcon 
} from './icons';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('Account');

    const navItems = [
        { name: 'Account', icon: UserIcon },
        { name: 'Personalization', icon: PaletteIcon },
        { name: 'Plan & Billing', icon: CreditCardIcon },
        { name: 'Members', icon: UsersIcon },
        { name: 'Data Controls', icon: DatabaseIcon },
    ];

    const PersonalizationView = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">Language</span>
                <div className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white">
                    <span className="text-sm">US GB English</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">Theme</span>
                <div className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white">
                    <span className="text-sm">Dark</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">Chat Model</span>
                <div className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white">
                    <span className="text-sm">Auto</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            </div>
        </div>
    );

    const PlanBillingView = () => (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                <div>
                    <h3 className="text-base font-bold text-white mb-1">Upgrade</h3>
                    <p className="text-sm text-gray-500">You are currently on the free plan</p>
                </div>
                <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Upgrade Plan
                </button>
            </div>
        </div>
    );

    const MembersView = () => (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto pt-10">
            <div className="mb-6 text-gray-500">
                <UsersIcon className="w-16 h-16 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Teams</h3>
            <p className="text-sm text-white font-medium mb-2">Upgrade to a team plan to share spaces and learning features.</p>
            <p className="text-xs text-gray-500 mb-8 max-w-md">
                If someone invites you to their team, you'll receive an email notification with instructions to join.
            </p>
            <button className="px-5 py-2.5 border border-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                View Team Plans
            </button>
        </div>
    );

    const DataControlsView = () => (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                <span className="text-base font-bold text-white">Delete Account</span>
                <button className="px-5 py-2 border border-red-900/50 text-red-500 text-sm font-medium rounded-lg hover:bg-red-900/20 hover:border-red-500 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-5xl h-[80vh] max-h-[700px] bg-[#0d0d0d] rounded-2xl border border-gray-800 shadow-2xl flex overflow-hidden z-10"
            >
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-800 p-6 flex flex-col shrink-0">
                    <button onClick={onClose} className="mb-8 text-gray-400 hover:text-white transition-colors self-start">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === item.name 
                                    ? 'bg-[#1f1f1f] text-white' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]/50'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#0d0d0d]">
                     {activeTab === 'Account' && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            {/* Banner */}
                            <div className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                     <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 flex items-center justify-center relative">
                                        <div className="w-8 h-8 rounded-full border border-dashed border-blue-400"></div>
                                     </div>
                                     <div>
                                         <h3 className="font-semibold text-white">Complete Profile</h3>
                                         <p className="text-xs text-blue-200">Get personalized contents</p>
                                     </div>
                                </div>
                                <button className="flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300">
                                    Complete <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm font-medium text-white">Name</span>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <span>AyonLogy</span>
                                        <PencilIcon className="w-4 h-4 cursor-pointer hover:text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm font-medium text-white">Email</span>
                                    <span className="text-gray-400">ayonburg@gmail.com</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm font-medium text-white">Date Created</span>
                                    <span className="text-gray-400 font-medium">May 15, 2025</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm font-medium text-white">Streaks</span>
                                    <div className="flex items-center space-x-2 text-orange-500 font-medium">
                                        <FireIcon className="w-4 h-4" />
                                        <span>1</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm font-medium text-white">Content Count</span>
                                    <div className="flex items-center space-x-2 text-blue-500 font-medium">
                                        <FileTextIcon className="w-4 h-4" />
                                        <span>6</span>
                                    </div>
                                </div>
                            </div>

                            {/* Referral */}
                             <div className="pt-4">
                                <h3 className="text-sm font-medium text-white mb-4">15% Off - Referral Link</h3>
                                <div className="p-4 rounded-xl bg-[#131313] border border-gray-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Invite friends, get 15% off for 1 month per referral</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                     )}
                     
                     {activeTab === 'Personalization' && <PersonalizationView />}
                     {activeTab === 'Plan & Billing' && <PlanBillingView />}
                     {activeTab === 'Members' && <MembersView />}
                     {activeTab === 'Data Controls' && <DataControlsView />}
                </div>
            </motion.div>
        </div>
    );
};

export default SettingsModal;
