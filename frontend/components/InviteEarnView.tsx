
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from './icons';

interface InviteEarnViewProps {
    onContactUs: () => void;
}

const faqs = [
    {
        question: "How do I join the affiliate program?",
        answer: "Joining our affiliate program is simple! Sign up through Rewardful, and once approved, you'll receive all the tools you need to start promoting our services."
    },
    {
        question: "What commission do I earn as an affiliate?",
        answer: "As an affiliate, you earn a 30% commission on every successful referral. This applies to all purchases made by customers you refer."
    },
    {
        question: "How do I track my referrals and earnings?",
        answer: "Rewardful provides a comprehensive dashboard where you can track your referrals, see your earnings, and access marketing materials."
    },
    {
        question: "When do I get paid?",
        answer: "Payouts are processed monthly. You will receive your commission for the previous month at the beginning of the following month."
    },
    {
        question: "Can I use my affiliate link on social media?",
        answer: "Absolutely! You can share your affiliate link on your website, blog, social media platforms, or any other online channel where you have a presence."
    },
    {
        question: "Who can I contact for support?",
        answer: "If you need any assistance or have questions about the affiliate program, please contact our support team through Rewardful or our website."
    },
    {
        question: "Can I bid on \"Stephen AI\" or similar brand terms in paid ads?",
        answer: "No. Bidding on our brand name (\"Stephen AI\") or any related terms, spellings, or phrases in paid ads (such as Google Ads, Bing, or social platforms) is not allowed. Such activity redirects users who are already searching for us and is considered non-compliant traffic. Any conversions from these ads are ineligible for commission and may lead to account suspension or forfeiture of unpaid commissions. You’re welcome to promote us using non-branded keywords (e.g., \"AI study tools\", \"note-taking with AI\") or through content and social media."
    }
];

const InviteEarnView: React.FC<InviteEarnViewProps> = ({ onContactUs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex-1 overflow-y-auto h-full dark:bg-[#0b0b0b] bg-neutral-50 dark:text-white text-black p-8 lg:p-16">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Lora', serif" }}>
                        Earn 30% commission as an Affiliate
                    </h1>
                    <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        Become part of our affiliate program and enjoy a 30% commission on every successful referral.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                        <button className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                            Join program
                        </button>
                        <button className="px-6 py-2.5 dark:bg-[#1a1a1a] bg-neutral-200 dark:text-white text-black font-bold rounded-lg hover:opacity-80 transition-opacity">
                            View dashboard
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="w-full">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Lora', serif" }}>Affiliate Program FAQs</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Can't find the answer here? <button onClick={onContactUs} className="text-white underline hover:text-gray-300 font-medium ml-1">Contact us</button>
                        </p>
                    </div>

                    <div className="space-y-1">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b dark:border-gray-800 border-neutral-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between py-6 text-left group transition-colors"
                                >
                                    <span className="font-bold text-lg dark:text-gray-200 text-gray-800 group-hover:dark:text-white transition-colors">
                                        {faq.question}
                                    </span>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="pb-6 text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InviteEarnView;
